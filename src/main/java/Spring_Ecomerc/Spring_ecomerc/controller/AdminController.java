package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Admin;
import Spring_Ecomerc.Spring_ecomerc.repository.AdminRepository;
import Spring_Ecomerc.Spring_ecomerc.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository adminRepository;
    private final FileService fileService;

    @GetMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<Admin>> getProfile(@PathVariable Integer id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setAdminPass(null);
        return ResponseEntity.ok(ApiResponse.success(admin));
    }

    @PostMapping(value = "/profile/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> updateProfileImage(
            @PathVariable Integer id,
            @RequestPart("file") MultipartFile file) throws IOException {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        String filename = fileService.uploadFile(file, "admins");
        admin.setAdminImage(filename);
        adminRepository.save(admin);
        return ResponseEntity.ok(ApiResponse.success("Admin Image uploaded", filename));
    }
}
