package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Product;
import Spring_Ecomerc.Spring_ecomerc.model.ProductModel;
import Spring_Ecomerc.Spring_ecomerc.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductModel>> create(
            @RequestPart("product") Product product,
            @RequestPart(value = "img1", required = false) MultipartFile img1,
            @RequestPart(value = "img2", required = false) MultipartFile img2,
            @RequestPart(value = "img3", required = false) MultipartFile img3) throws IOException {
        return ResponseEntity.ok(ApiResponse.success("Product created", productService.createProduct(product, img1, img2, img3)));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductModel>> update(
            @PathVariable Integer id,
            @RequestPart("product") Product product,
            @RequestPart(value = "img1", required = false) MultipartFile img1,
            @RequestPart(value = "img2", required = false) MultipartFile img2,
            @RequestPart(value = "img3", required = false) MultipartFile img3) throws IOException {
        ProductModel updated = productService.updateProduct(id, product, img1, img2, img3);
        return ResponseEntity.ok(ApiResponse.success("Product updated", updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }
}
