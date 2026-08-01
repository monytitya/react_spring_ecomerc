package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.dto.*;
import Spring_Ecomerc.Spring_ecomerc.entity.Admin;
import Spring_Ecomerc.Spring_ecomerc.entity.Customer;
import Spring_Ecomerc.Spring_ecomerc.repository.AdminRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.CustomerRepository;
import Spring_Ecomerc.Spring_ecomerc.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.google.client-id:dummy-google-client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:dummy-google-client-secret}")
    private String googleClientSecret;

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
        if (googleClientId == null || googleClientId.startsWith("dummy")) {
            throw new RuntimeException("Google OAuth2 Client ID is not configured. Please set GOOGLE_CLIENT_ID in your environment.");
        }

        String redirectUri = request.getRedirectUri();
        if (redirectUri == null || redirectUri.trim().isEmpty()) {
            redirectUri = "http://localhost:5173/oauth2/callback";
        }

        // 1. Exchange code for Google Access Token
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("code", request.getCode());
        body.add("client_id", googleClientId);
        body.add("client_secret", googleClientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(body, headers);

        ResponseEntity<Map> tokenResponse;
        try {
            tokenResponse = restTemplate.postForEntity(
                    "https://oauth2.googleapis.com/token",
                    tokenRequest,
                    Map.class
            );
        } catch (Exception e) {
            throw new RuntimeException("OAuth2 token exchange failed: " + e.getMessage(), e);
        }

        if (!tokenResponse.getStatusCode().is2xxSuccessful() || tokenResponse.getBody() == null) {
            throw new RuntimeException("Failed to exchange code with Google");
        }

        String accessToken = (String) tokenResponse.getBody().get("access_token");
        if (accessToken == null) {
            throw new RuntimeException("Access token not returned by Google");
        }

        // 2. Fetch User Profile from Google UserInfo endpoint
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(accessToken);
        HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);

        ResponseEntity<Map> userResponse;
        try {
            userResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    userRequest,
                    Map.class
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch Google user info: " + e.getMessage(), e);
        }

        if (!userResponse.getStatusCode().is2xxSuccessful() || userResponse.getBody() == null) {
            throw new RuntimeException("Failed to fetch user profile from Google");
        }

        Map<String, Object> userInfo = userResponse.getBody();
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");
        String picture = (String) userInfo.get("picture");

        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Google account did not return an email address");
        }

        // 3. Find or register Customer in DB
        Customer customer = customerRepository.findByCustomerEmail(email).orElseGet(() -> {
            Customer newCustomer = Customer.builder()
                    .customerName(name != null && !name.trim().isEmpty() ? name : email.split("@")[0])
                    .customerEmail(email)
                    .customerPass(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .customerImage(picture)
                    .build();
            return customerRepository.save(newCustomer);
        });

        if (picture != null && (customer.getCustomerImage() == null || customer.getCustomerImage().isEmpty())) {
            customer.setCustomerImage(picture);
            customer = customerRepository.save(customer);
        }

        // 4. Issue JWT Token
        String token = jwtTokenProvider.generateTokenFromEmail(customer.getCustomerEmail(), "CUSTOMER");
        return new AuthResponse(token, "CUSTOMER", customer.getCustomerEmail(), customer.getCustomerName(), customer.getCustomerId(), customer.getCustomerImage());
    }
}