package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Product;
import Spring_Ecomerc.Spring_ecomerc.model.ProductModel;
import Spring_Ecomerc.Spring_ecomerc.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminProductController {

    private final ProductService productService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @PostMapping(value = "/products", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @io.swagger.v3.oas.annotations.Operation(summary = "Create product with real files")
    public ResponseEntity<ApiResponse<ProductModel>> create(
            @RequestPart("product") String productString,
            @RequestPart(value = "img", required = false) MultipartFile img,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Product product = objectMapper.readValue(productString, Product.class);
            ProductModel created = productService.createProduct(product, img, file);
            return ResponseEntity.ok(ApiResponse.success("Product created via Multipart (Files)", created));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to parse product data: " + e.getMessage()));
        }
    }

    @PostMapping("/products/json")
    public ResponseEntity<ApiResponse<ProductModel>> createJson(
            @RequestBody Spring_Ecomerc.Spring_ecomerc.dto.ProductRequest request) {
        try {
            ProductModel created = productService.createProductBase64(request.getProduct(), request.getImg(),
                    request.getFile());
            return ResponseEntity.ok(ApiResponse.success("Product created via JSON (Base64)", created));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create product: " + e.getMessage()));
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductModel>> update(
            @PathVariable Integer id,
            @RequestPart("product") String productString,
            @RequestPart(value = "img", required = false) MultipartFile img,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Product product = objectMapper.readValue(productString, Product.class);
            ProductModel updated = productService.updateProduct(id, product, img, file);
            return ResponseEntity.ok(ApiResponse.success("Product updated", updated));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update product: " + e.getMessage()));
        }
    }

    @DeleteMapping("/products/{id}")

    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to delete product: " + e.getMessage()));
        }
    }
}
