package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.dto.BakongWebhookRequest;
import Spring_Ecomerc.Spring_ecomerc.dto.PaymentCreateRequest;
import Spring_Ecomerc.Spring_ecomerc.dto.PaymentResponse;
import Spring_Ecomerc.Spring_ecomerc.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BakongPaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@RequestBody PaymentCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment initiated", paymentService.createPayment(request)));
    }

    @GetMapping("/status/{transactionId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getStatus(@PathVariable String transactionId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentStatus(transactionId)));
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<PaymentResponse>> webhook(@RequestBody BakongWebhookRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Webhook received", paymentService.processWebhook(request)));
    }
}
