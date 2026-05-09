package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.dto.BakongWebhookRequest;
import Spring_Ecomerc.Spring_ecomerc.dto.PaymentCreateRequest;
import Spring_Ecomerc.Spring_ecomerc.dto.PaymentResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Payment;
import Spring_Ecomerc.Spring_ecomerc.entity.PaymentStatus;
import Spring_Ecomerc.Spring_ecomerc.repository.CustomerOrderRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.PaymentRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.PendingOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final CustomerOrderRepository customerOrderRepository;
    private final PendingOrderRepository pendingOrderRepository;

    @Value("${payment.khqr.merchant-id}")
    private String merchantId;

    @Value("${payment.khqr.merchant-name}")
    private String merchantName;

    @Value("${payment.khqr.merchant-city}")
    private String merchantCity;

    @Value("${khqr.api.token:}")
    private String bakongToken;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentCreateRequest request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new RuntimeException("Invalid payment amount");
        }

        // Check for existing pending payment for this order
        return paymentRepository.findByOrderId(request.getOrderId()).stream()
                .filter(p -> p.getStatus() == PaymentStatus.PENDING)
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
                        merchantId,
                        merchantName,
                        merchantCity,
                        String.format("%.2f", payment.getAmount()),
                        payment.getCurrency(),
                        String.valueOf(payment.getOrderId())
                );
                
                if (payment.getMd5() == null) {
                    payment.setMd5(org.apache.commons.codec.digest.DigestUtils.md5Hex(qrString));
                    paymentRepository.save(payment);
                }

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

            // Update CustomerOrder Status
            customerOrderRepository.findById(payment.getOrderId().intValue()).ifPresent(order -> {
                order.setOrderStatus("Complete");
                customerOrderRepository.save(order);
            });

            // Update PendingOrder Status (if applicable)
            pendingOrderRepository.findByInvoiceNo(
                customerOrderRepository.findById(payment.getOrderId().intValue())
                    .map(o -> o.getInvoiceNo()).orElse(0L)
            ).forEach(po -> {
                po.setOrderStatus("Paid");
                pendingOrderRepository.save(po);
            });

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

    @org.springframework.scheduling.annotation.Scheduled(fixedDelay = 5000)
    public void checkPaymentStatusFromBakong() {
        if (bakongToken == null || bakongToken.isEmpty()) return;
        
        java.util.List<Payment> pendingPayments = paymentRepository.findByStatus(PaymentStatus.PENDING).stream()
                .filter(p -> p.getMd5() != null && !p.getMd5().isEmpty())
                .collect(Collectors.toList());

        if (pendingPayments.isEmpty()) return;

        org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
        String url = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setBearerAuth(bakongToken);
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        for (Payment payment : pendingPayments) {
            try {
                java.util.Map<String, String> body = new java.util.HashMap<>();
                body.put("md5", payment.getMd5());
                org.springframework.http.HttpEntity<java.util.Map<String, String>> request = new org.springframework.http.HttpEntity<>(body, headers);
                
                org.springframework.http.ResponseEntity<java.util.Map> response = restTemplate.postForEntity(url, request, java.util.Map.class);
                
                if (response.getBody() != null && response.getBody().get("responseCode") != null) {
                    int responseCode = Integer.parseInt(response.getBody().get("responseCode").toString());
                    if (responseCode == 0) { // Success
                        payment.setStatus(PaymentStatus.PAID);
                        paymentRepository.save(payment);

                        customerOrderRepository.findById(payment.getOrderId().intValue()).ifPresent(order -> {
                            order.setOrderStatus("Complete");
                            customerOrderRepository.save(order);
                        });

                        pendingOrderRepository.findByInvoiceNo(
                            customerOrderRepository.findById(payment.getOrderId().intValue())
                                .map(o -> o.getInvoiceNo()).orElse(0L)
                        ).forEach(po -> {
                            po.setOrderStatus("Paid");
                            pendingOrderRepository.save(po);
                        });

                        telegramService.sendPaymentNotification(
                                String.valueOf(payment.getOrderId()),
                                payment.getAmount(),
                                "Bakong API (Auto Polled)"
                        );
                    }
                }
            } catch (Exception e) {
                // Silently ignore to continue polling other pending payments
            }
        }
    }
}

