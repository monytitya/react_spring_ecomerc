package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.dto.PaymentCreateRequest;
import Spring_Ecomerc.Spring_ecomerc.dto.PaymentResponse;
import Spring_Ecomerc.Spring_ecomerc.dto.BakongWebhookRequest;
import java.util.List;

public interface PaymentService {
    PaymentResponse createPayment(PaymentCreateRequest request);
    PaymentResponse getPaymentStatus(String transactionId);
    PaymentResponse processWebhook(BakongWebhookRequest request);
    List<PaymentResponse> getAllPayments();
}
