package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.dto.BakongWebhookRequest;
import Spring_Ecomerc.Spring_ecomerc.dto.PaymentCreateRequest;
import Spring_Ecomerc.Spring_ecomerc.dto.PaymentResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Payment;
import Spring_Ecomerc.Spring_ecomerc.entity.PaymentStatus;
import Spring_Ecomerc.Spring_ecomerc.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final TelegramService telegramService;
    private final KHQRService khqrService;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentCreateRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new RuntimeException("Invalid payment amount");
        }

        // Check for existing pending payment for this order
        return paymentRepository.findAll().stream()
                .filter(p -> p.getOrderId().equals(request.getOrderId()) && p.getStatus() == PaymentStatus.PENDING)
                .findFirst()
                .map(this::getPaymentResponseWithQR)
                .orElseGet(() -> {
                    String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                    
                    Payment payment = Payment.builder()
                            .orderId(request.getOrderId())
                            .transactionId(transactionId)
                            .amount(request.getAmount())
                            .currency(request.getCurrency())
                            .status(PaymentStatus.PENDING)
                            .createdAt(LocalDateTime.now())
                            .build();

                    payment = paymentRepository.save(payment);
                    return getPaymentResponseWithQR(payment);
                });
    }

    @Override
    public PaymentResponse getPaymentStatus(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found with transaction ID: " + transactionId));
        
        return getPaymentResponseWithQR(payment);
    }

    private PaymentResponse getPaymentResponseWithQR(Payment payment) {
        PaymentResponse response = mapToResponse(payment);
        if (payment.getStatus() == PaymentStatus.PENDING) {
            try {
                String qrString = khqrService.generateKHQRString(
                        "dev_bakong@abc", // Mock Merchant ID
                        "Blueberry Store",
                        String.format("%.2f", payment.getAmount()),
                        payment.getCurrency(),
                        String.valueOf(payment.getOrderId())
                );
                response.setQrString(qrString);
                response.setQrImage(khqrService.generateQRCodeBase64(qrString));
            } catch (Exception e) {
                // Log error
            }
        }
        return response;
    }

    @Override
    @Transactional
    public PaymentResponse processWebhook(BakongWebhookRequest request) {
        Payment payment = paymentRepository.findByTransactionId(request.getTransactionId())
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + request.getTransactionId()));

        if (payment.getStatus() == PaymentStatus.PENDING) {
            payment.setStatus(PaymentStatus.PAID);
            paymentRepository.save(payment);

            // Notify via Telegram
            telegramService.sendPaymentNotification(
                    String.valueOf(payment.getOrderId()),
                    payment.getAmount(),
                    "Bakong KHQR"
            );
        }

        return mapToResponse(payment);
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .orderId(p.getOrderId())
                .transactionId(p.getTransactionId())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
