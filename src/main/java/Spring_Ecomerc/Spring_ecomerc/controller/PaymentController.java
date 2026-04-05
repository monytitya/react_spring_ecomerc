package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.model.PaymentModel;
import Spring_Ecomerc.Spring_ecomerc.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/admin/payments")
    public ResponseEntity<ApiResponse<List<PaymentModel>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getAllPayments()));
    }

    @GetMapping("/public/payments/status/{id}")
    public ResponseEntity<ApiResponse<PaymentModel>> getStatus(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentById(id)));
    }

    @PostMapping("/public/payments/simulate/{id}")
    public ResponseEntity<ApiResponse<PaymentModel>> simulatePayment(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success("Payment Received!", paymentService.updateStatus(id, "PAID")));
    }

    @GetMapping("/public/payments/qr")
    public ResponseEntity<ApiResponse<String>> getQR(@RequestParam Long invoiceNo, @RequestParam Double amount) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.generateQRData(invoiceNo, amount)));
    }
}
