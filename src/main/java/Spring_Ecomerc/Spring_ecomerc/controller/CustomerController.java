package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Customer;
import Spring_Ecomerc.Spring_ecomerc.entity.Payment;
import Spring_Ecomerc.Spring_ecomerc.repository.CustomerRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.PaymentRepository;
import Spring_Ecomerc.Spring_ecomerc.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;
    private final FileService fileService;
    private final PasswordEncoder passwordEncoder;

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
        
        // If email is being changed, check for uniqueness
        if (updated.getCustomerEmail() != null && !updated.getCustomerEmail().equals(customer.getCustomerEmail())) {
            if (customerRepository.existsByCustomerEmail(updated.getCustomerEmail())) {
                throw new RuntimeException("Email already exists: " + updated.getCustomerEmail());
            }
            customer.setCustomerEmail(updated.getCustomerEmail());
        }

        customer.setCustomerName(updated.getCustomerName());
        customer.setCustomerContact(updated.getCustomerContact());
        customer.setCustomerAddress(updated.getCustomerAddress());
        customer.setCustomerCity(updated.getCustomerCity());
        customer.setCustomerCountry(updated.getCustomerCountry());
        return ResponseEntity.ok(ApiResponse.success("Profile updated", customerRepository.save(customer)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Integer id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found");
        }
        customerRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer deleted", null));
    }

    @PostMapping("/admin/create")
    public ResponseEntity<ApiResponse<Customer>> adminCreateCustomer(@RequestBody Customer customer) {
        if (customerRepository.existsByCustomerEmail(customer.getCustomerEmail())) {
            throw new RuntimeException("Email already exists");
        }
        // Default password for admin-created customers if not provided
        if (customer.getCustomerPass() == null || customer.getCustomerPass().isEmpty()) {
            customer.setCustomerPass(passwordEncoder.encode("123456"));
        } else {
            customer.setCustomerPass(passwordEncoder.encode(customer.getCustomerPass()));
        }
        return ResponseEntity.ok(ApiResponse.success("Customer created", customerRepository.save(customer)));
    }

    @PostMapping(value = "/{id}/image", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @PathVariable Integer id,
            @RequestPart("file") MultipartFile file) throws IOException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        String filename = fileService.uploadFile(file, "customers");
        customer.setCustomerImage(filename);
        customerRepository.save(customer);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded", filename));
    }

    @PostMapping("/{id}/image-base64")
    public ResponseEntity<ApiResponse<String>> uploadImageBase64(
            @PathVariable Integer id,
            @RequestBody java.util.Map<String, String> body) throws IOException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        String base64Data = body.get("file");
        String filename = fileService.uploadBase64(base64Data, "customers");
        customer.setCustomerImage(filename);
        customerRepository.save(customer);
        return ResponseEntity.ok(ApiResponse.success("Base64 Image uploaded", filename));
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
        return ResponseEntity.ok(ApiResponse.success(paymentRepository.findByOrderId(invoiceNo).stream().toList()));
    }

    @PostMapping("/payments")
    public ResponseEntity<ApiResponse<Payment>> addPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(ApiResponse.success("Payment recorded", paymentRepository.save(payment)));
    }
}
