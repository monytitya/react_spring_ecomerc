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
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse loginAdmin(LoginRequest request) {
        Admin admin = adminRepository.findByAdminEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), admin.getAdminPass())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateTokenFromEmail(admin.getAdminEmail(), "ADMIN");
        return new AuthResponse(token, "ADMIN", admin.getAdminEmail(), admin.getAdminName(), admin.getAdminId(), admin.getAdminImage());
    }

    public AuthResponse loginCustomer(LoginRequest request) {
        Customer customer = customerRepository.findByCustomerEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Customer not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), customer.getCustomerPass())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateTokenFromEmail(customer.getCustomerEmail(), "CUSTOMER");
        return new AuthResponse(token, "CUSTOMER", customer.getCustomerEmail(), customer.getCustomerName(),
                customer.getCustomerId(), customer.getCustomerImage());
    }

    public AuthResponse registerCustomer(CustomerRegisterRequest request) {
        if (customerRepository.existsByCustomerEmail(request.getCustomerEmail())) {
            throw new RuntimeException("Email already exists: " + request.getCustomerEmail());
        }

        Customer customer = new Customer();
        customer.setCustomerName(request.getCustomerName());
        customer.setCustomerEmail(request.getCustomerEmail());
        customer.setCustomerPass(passwordEncoder.encode(request.getCustomerPass()));
        customer.setCustomerCountry(request.getCustomerCountry());
        customer.setCustomerCity(request.getCustomerCity());
        customer.setCustomerContact(request.getCustomerContact());
        customer.setCustomerAddress(request.getCustomerAddress());

        Customer savedCustomer = customerRepository.save(customer);
        String token = jwtTokenProvider.generateTokenFromEmail(savedCustomer.getCustomerEmail(), "CUSTOMER");

        return new AuthResponse(token, "CUSTOMER", savedCustomer.getCustomerEmail(), savedCustomer.getCustomerName(),
                savedCustomer.getCustomerId(), savedCustomer.getCustomerImage());
    }

    public void resetPassword(PasswordResetRequest request) {
        // Try searching in Admin first
        var adminOpt = adminRepository.findByAdminEmail(request.getEmail());
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            admin.setAdminPass(passwordEncoder.encode(request.getNewPassword()));
            adminRepository.save(admin);
            return;
        }

        // Try searching in Customer
        var customerOpt = customerRepository.findByCustomerEmail(request.getEmail());
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            customer.setCustomerPass(passwordEncoder.encode(request.getNewPassword()));
            customerRepository.save(customer);
            return;
        }

        throw new RuntimeException("No user found with email: " + request.getEmail());
    }
}
