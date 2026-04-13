package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.dto.PaymentResponse;
import Spring_Ecomerc.Spring_ecomerc.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getAllPayments()));
    }
}
