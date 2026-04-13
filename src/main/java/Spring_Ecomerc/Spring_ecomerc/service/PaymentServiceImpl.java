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

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentCreateRequest request) {
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
        
        PaymentResponse response = mapToResponse(payment);
        response.setQrString(generateMockKHQR(payment));
        return response;
    }

    @Override
    public PaymentResponse getPaymentStatus(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found with transaction ID: " + transactionId));
        
        PaymentResponse response = mapToResponse(payment);
        if (payment.getStatus() == PaymentStatus.PENDING) {
            response.setQrString(generateMockKHQR(payment));
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

    private String generateMockKHQR(Payment p) {
        // Tag-Length-Value (TLV) construction for EMVCo / KHQR
        StringBuilder qr = new StringBuilder();
        qr.append("000201"); // Payload Format Indicator
        qr.append("010212"); // Point of Initiation: Dynamic
        
        // Tag 30: Merchant Account Information
        String merchantAccount = "0016dev_bakong@abc" + "0108" + p.getTransactionId() + "0211DEVBKKHPXXX";
        qr.append("30").append(String.format("%02d", merchantAccount.length())).append(merchantAccount);
        
        qr.append("52040000"); // Merchant Category Code
        qr.append("5303").append(p.getCurrency().equalsIgnoreCase("USD") ? "840" : "116");
        
        String amtStr = String.format("%.2f", p.getAmount());
        qr.append("54").append(String.format("%02d", amtStr.length())).append(amtStr);
        
        qr.append("5802KH");   // Country Code
        qr.append("5915Blueberry Store"); // Merchant Name
        qr.append("6010Phnom Penh");     // Merchant City
        
        String bill = String.valueOf(p.getOrderId());
        qr.append("62").append(String.format("%02d", bill.length() + 4)).append("01").append(String.format("%02d", bill.length())).append(bill);
        
        qr.append("6304ABCD"); // Dummy CRC

        return qr.toString();
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
