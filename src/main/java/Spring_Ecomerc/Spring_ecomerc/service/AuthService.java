package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.dto.*;
import Spring_Ecomerc.Spring_ecomerc.entity.Admin;
import Spring_Ecomerc.Spring_ecomerc.entity.Customer;
import Spring_Ecomerc.Spring_ecomerc.repository.AdminRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.CustomerRepository;
import Spring_Ecomerc.Spring_ecomerc.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse loginAdmin(LoginRequest request) {
        Admin admin = adminRepository.findByAdminEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getAdminPass())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateTokenFromEmail(admin.getAdminEmail(), "ADMIN");
        return new AuthResponse(token, "ADMIN", admin.getAdminEmail(), admin.getAdminName(), admin.getAdminId());
    }

    public AuthResponse loginCustomer(LoginRequest request) {
        Customer customer = customerRepository.findByCustomerEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getCustomerPass())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateTokenFromEmail(customer.getCustomerEmail(), "CUSTOMER");
        return new AuthResponse(token, "CUSTOMER", customer.getCustomerEmail(), customer.getCustomerName(), customer.getCustomerId());
    }

    public AuthResponse registerCustomer(CustomerRegisterRequest request) {
        if (customerRepository.existsByCustomerEmail(request.getCustomerEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Customer customer = Customer.builder()
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPass(passwordEncoder.encode(request.getCustomerPass()))
                .customerCountry(request.getCustomerCountry())
                .customerCity(request.getCustomerCity())
                .customerContact(request.getCustomerContact())
                .customerAddress(request.getCustomerAddress())
                .customerImage("default.png")
                .customerIp("0.0.0.0")
                .customerConfirmCode("")
                .build();

        customer = customerRepository.save(customer);
        String token = jwtTokenProvider.generateTokenFromEmail(customer.getCustomerEmail(), "CUSTOMER");
        return new AuthResponse(token, "CUSTOMER", customer.getCustomerEmail(), customer.getCustomerName(), customer.getCustomerId());
    }
}
