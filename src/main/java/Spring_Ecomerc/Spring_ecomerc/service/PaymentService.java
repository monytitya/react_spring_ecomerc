package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.entity.Payment;
import Spring_Ecomerc.Spring_ecomerc.model.PaymentModel;
import Spring_Ecomerc.Spring_ecomerc.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final TelegramService telegramService;

    public List<PaymentModel> getAllPayments() {
        return paymentRepository.findAll().stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public PaymentModel getPaymentById(Integer id) {
        return paymentRepository.findById(id).map(this::mapToModel).orElse(null);
    }

    public PaymentModel updateStatus(Integer id, String status) {
        Payment p = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        p.setStatus(status);
        paymentRepository.save(p);

        if ("PAID".equalsIgnoreCase(status)) {
            telegramService.sendPaymentNotification(
                    String.valueOf(p.getInvoiceNo()), 
                    p.getAmount(), 
                    p.getPaymentMode()
            );
        }
        return mapToModel(p);
    }

    public String generateQRData(Long invoiceNo, Double amount) {
        // This is a simulated QR data URL (placeholder for ABA/Wing)
        // In real life, you'd call a bank API here
        return "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY_INVOICE_" + invoiceNo + "_AMOUNT_" + amount;
    }

    private PaymentModel mapToModel(Payment p) {
        return PaymentModel.builder()
                .paymentId(p.getPaymentId())
                .invoiceNo(p.getInvoiceNo())
                .amount(p.getAmount())
                .paymentMode(p.getPaymentMode())
                .refNo(p.getRefNo())
                .code(p.getCode())
                .paymentDate(p.getPaymentDate())
                .status(p.getStatus())
                .build();
    }
}
