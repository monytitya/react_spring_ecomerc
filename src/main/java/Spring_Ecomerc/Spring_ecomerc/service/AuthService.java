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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse loginAdmin(LoginRequest request) {
        Admin admin = adminRepository.findByAdminEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getAdminPass())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateTokenFromEmail(admin.getAdminEmail(), "ADMIN");
        return new AuthResponse(token, "ADMIN", admin.getAdminEmail(), admin.getAdminName(), admin.getAdminId(), admin.getAdminImage());
    }

    public AuthResponse loginCustomer(LoginRequest request) {
        Customer customer = customerRepository.findByCustomerEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getCustomerPass())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateTokenFromEmail(customer.getCustomerEmail(), "CUSTOMER");
        return new AuthResponse(token, "CUSTOMER", customer.getCustomerEmail(), customer.getCustomerName(), customer.getCustomerId(), customer.getCustomerImage());
    }

    public AuthResponse registerCustomer(CustomerRegisterRequest request) {
        if (customerRepository.existsByCustomerEmail(request.getCustomerEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Customer customer = Customer.builder()
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPass(passwordEncoder.encode(request.getCustomerPass()))
                .customerCountry(request.getCustomerCountry())
                .customerCity(request.getCustomerCity())
                .customerContact(request.getCustomerContact())
                .customerAddress(request.getCustomerAddress())
                .build();

        customer = customerRepository.save(customer);

        String token = jwtTokenProvider.generateTokenFromEmail(customer.getCustomerEmail(), "CUSTOMER");
        return new AuthResponse(token, "CUSTOMER", customer.getCustomerEmail(), customer.getCustomerName(), customer.getCustomerId(), customer.getCustomerImage());
    }

    public void resetPassword(PasswordResetRequest request) {
        Optional<Customer> customerOpt = customerRepository.findByCustomerEmail(request.getEmail());
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setCustomerPass(passwordEncoder.encode(request.getNewPassword()));
            customerRepository.save(customer);
            return;
        }

        Optional<Admin> adminOpt = adminRepository.findByAdminEmail(request.getEmail());
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            admin.setAdminPass(passwordEncoder.encode(request.getNewPassword()));
            adminRepository.save(admin);
            return;
        }

        throw new RuntimeException("User not found with this email");
    }

    public AuthResponse loginWithOAuth2Code(OAuth2CodeRequest request) {
        // This is a placeholder for OAuth2 login implementation
        throw new UnsupportedOperationException("OAuth2 login is not implemented yet");
    }
}