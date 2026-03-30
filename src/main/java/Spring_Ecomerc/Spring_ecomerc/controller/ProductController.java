package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.model.ProductModel;
import Spring_Ecomerc.Spring_ecomerc.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductModel>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "productId") String sortBy) {
        return ResponseEntity.ok(ApiResponse.success(productService.getAllProducts(page, size, sortBy)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductModel>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    @GetMapping("/category/{catId}")
    public ResponseEntity<ApiResponse<List<ProductModel>>> getByCategory(@PathVariable Integer catId) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductsByCategory(catId)));
    }

    @GetMapping("/subcategory/{pCatId}")
    public ResponseEntity<ApiResponse<List<ProductModel>>> getBySubCategory(@PathVariable Integer pCatId) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductsBySubCategory(pCatId)));
    }

    @GetMapping("/manufacturer/{manufacturerId}")
    public ResponseEntity<ApiResponse<List<ProductModel>>> getByManufacturer(@PathVariable Integer manufacturerId) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductsByManufacturer(manufacturerId)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductModel>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success(productService.getFeaturedProducts()));
    }

    @GetMapping("/label/{label}")
    public ResponseEntity<ApiResponse<List<ProductModel>>> getByLabel(@PathVariable String label) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductsByLabel(label)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductModel>>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(productService.searchProducts(keyword)));
    }
}
