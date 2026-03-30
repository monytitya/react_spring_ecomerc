package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.*;
import Spring_Ecomerc.Spring_ecomerc.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.loginAdmin(request);
        return ResponseEntity.ok(ApiResponse.success("Admin login successful", response));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<ApiResponse<AuthResponse>> customerLogin(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.loginCustomer(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/customer/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody CustomerRegisterRequest request) {
        AuthResponse response = authService.registerCustomer(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }
}
