package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Admin;
import Spring_Ecomerc.Spring_ecomerc.repository.AdminRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.CustomerRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.CustomerOrderRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.PendingOrderRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.CartRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.WishlistRepository;
import Spring_Ecomerc.Spring_ecomerc.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final PendingOrderRepository pendingOrderRepository;
    private final CartRepository cartRepository;
    private final WishlistRepository wishlistRepository;
    private final FileService fileService;

    @GetMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<Admin>> getProfile(@PathVariable Integer id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setAdminPass(null);
        return ResponseEntity.ok(ApiResponse.success(admin));
    }

    @DeleteMapping("/reset-data")
    @Transactional
    public ResponseEntity<ApiResponse<String>> resetData() {
        // Clear all transactional and customer-related data
        pendingOrderRepository.deleteAllInBatch();
        customerOrderRepository.deleteAllInBatch();
        cartRepository.deleteAllInBatch();
        wishlistRepository.deleteAllInBatch();
        customerRepository.deleteAllInBatch();
        
        return ResponseEntity.ok(ApiResponse.success("Marketplace data reset successfully"));
    }

    @PostMapping(value = "/profile/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateProfileImage(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Please select a file to upload"));
        }

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        String filename = fileService.uploadFile(file, "admins");
        admin.setAdminImage(filename);
        adminRepository.save(admin);

        return ResponseEntity.ok(ApiResponse.success("Admin Image uploaded successfully", filename));
    }
}
