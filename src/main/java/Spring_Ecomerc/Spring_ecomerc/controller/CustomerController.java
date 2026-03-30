package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Customer;
import Spring_Ecomerc.Spring_ecomerc.entity.Payment;
import Spring_Ecomerc.Spring_ecomerc.repository.CustomerRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomer(@PathVariable Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setCustomerPass(null); // never expose password
        return ResponseEntity.ok(ApiResponse.success(customer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(
            @PathVariable Integer id,
            @RequestBody Customer updated) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        customer.setCustomerName(updated.getCustomerName());
        customer.setCustomerContact(updated.getCustomerContact());
        customer.setCustomerAddress(updated.getCustomerAddress());
        customer.setCustomerCity(updated.getCustomerCity());
        customer.setCustomerCountry(updated.getCustomerCountry());
        return ResponseEntity.ok(ApiResponse.success("Profile updated", customerRepository.save(customer)));
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) throws IOException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        String uploadDir = "uploads/customers";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        customer.setCustomerImage(filename);
        customerRepository.save(customer);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded", filename));
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        customers.forEach(c -> c.setCustomerPass(null));
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    // Payments
    @GetMapping("/payments/{invoiceNo}")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByInvoice(@PathVariable Long invoiceNo) {
        return ResponseEntity.ok(ApiResponse.success(paymentRepository.findByInvoiceNo(invoiceNo)));
    }

    @PostMapping("/payments")
    public ResponseEntity<ApiResponse<Payment>> addPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(ApiResponse.success("Payment recorded", paymentRepository.save(payment)));
    }
}
