package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.*;
import Spring_Ecomerc.Spring_ecomerc.model.*;
import Spring_Ecomerc.Spring_ecomerc.repository.*;
import Spring_Ecomerc.Spring_ecomerc.service.FileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogController {

    private final CategoryRepository categoryRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final ProductRepository productRepository;
    private final FileService fileService;
    private final ObjectMapper objectMapper;

    // Categories
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryModel>>> getAllCategories() {
        List<CategoryModel> models = categoryRepository.findAll().stream()
                .map(this::mapCategoryToModel)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/categories/top")
    public ResponseEntity<ApiResponse<List<CategoryModel>>> getTopCategories() {
        List<CategoryModel> models = categoryRepository.findByCatTop("yes").stream()
                .map(this::mapCategoryToModel)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryModel>> getCategoryById(@PathVariable Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return ResponseEntity.ok(ApiResponse.success(mapCategoryToModel(category)));
    }

    // Manufacturers
    @GetMapping("/manufacturers")
    public ResponseEntity<ApiResponse<List<ManufacturerModel>>> getAllManufacturers() {
        List<ManufacturerModel> models = manufacturerRepository.findAll().stream()
                .map(this::mapManufacturerToModel1)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    @GetMapping("/manufacturers/top")
    public ResponseEntity<ApiResponse<List<ManufacturerModel>>> getTopManufacturers() {
        List<ManufacturerModel> models = manufacturerRepository.findByManufacturerTop("yes").stream()
                .map(this::mapManufacturerToModel1)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(models));
    }

    private CategoryModel mapCategoryToModel(Category c) {
        CategoryModel model = new CategoryModel();
        model.setCatId(c.getCatId());
        model.setCatTitle(c.getCatTitle());
        model.setCatTop(c.getCatTop());
        model.setCatImage(c.getCatImage());
        model.setProductCount(productRepository.countByCatId(c.getCatId()));
        return model;
    }

    private ManufacturerModel mapManufacturerToModel1(Manufacturer m) {
        ManufacturerModel model = new ManufacturerModel();
        model.setManufacturerId(m.getManufacturerId());
        model.setManufacturerTitle(m.getManufacturerTitle());
        model.setManufacturerTop(m.getManufacturerTop());
        model.setManufacturerImage(m.getManufacturerImage());
        model.setProductCount(productRepository.countByManufacturerId(m.getManufacturerId()));
        return model;
    }

    // Category CRUD
    @PostMapping(value = "/admin/categories", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CategoryModel>> createCategory(
            @RequestPart("category") String categoryString,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Category category = objectMapper.readValue(categoryString, Category.class);
            if (image != null && !image.isEmpty()) {
                String imgPath = fileService.uploadFile(image, "categories");
                category.setCatImage(imgPath);
            }
            Category saved = categoryRepository.save(category);
            return ResponseEntity.ok(ApiResponse.success(mapCategoryToModel(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create category: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/admin/categories/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CategoryModel>> updateCategory(
            @PathVariable Integer id,
            @RequestPart("category") String categoryString,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Category category = objectMapper.readValue(categoryString, Category.class);
            Category existing = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
            existing.setCatTitle(category.getCatTitle());
            existing.setCatTop(category.getCatTop());
            
            if (image != null && !image.isEmpty()) {
                String imgPath = fileService.uploadFile(image, "categories");
                existing.setCatImage(imgPath);
            } else if (category.getCatImage() != null) {
                existing.setCatImage(category.getCatImage());
            }
            
            Category saved = categoryRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.success(mapCategoryToModel(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update category: " + e.getMessage()));
        }
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // Manufacturer CRUD
    @PostMapping(value = "/admin/manufacturers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ManufacturerModel>> createManufacturer(
             @RequestPart("manufacturer") String manufacturerString,
             @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Manufacturer manufacturer = objectMapper.readValue(manufacturerString, Manufacturer.class);
            if (image != null && !image.isEmpty()) {
                String imgPath = fileService.uploadFile(image, "manufacturers");
                manufacturer.setManufacturerImage(imgPath);
            }
            Manufacturer saved = manufacturerRepository.save(manufacturer);
            return ResponseEntity.ok(ApiResponse.success(mapManufacturerToModel1(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create manufacturer: " + e.getMessage()));
        }
    }

    @PutMapping(value = "/admin/manufacturers/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ManufacturerModel>> updateManufacturer(
            @PathVariable Integer id,
            @RequestPart("manufacturer") String manufacturerString,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
             Manufacturer manufacturer = objectMapper.readValue(manufacturerString, Manufacturer.class);
             Manufacturer existing = manufacturerRepository.findById(id).orElseThrow(() -> new RuntimeException("Manufacturer not found"));
             existing.setManufacturerTitle(manufacturer.getManufacturerTitle());
             existing.setManufacturerTop(manufacturer.getManufacturerTop());
             
             if (image != null && !image.isEmpty()) {
                 String imgPath = fileService.uploadFile(image, "manufacturers");
                 existing.setManufacturerImage(imgPath);
             } else if (manufacturer.getManufacturerImage() != null) {
                 existing.setManufacturerImage(manufacturer.getManufacturerImage());
             }
             
             Manufacturer saved = manufacturerRepository.save(existing);
             return ResponseEntity.ok(ApiResponse.success(mapManufacturerToModel1(saved)));
        } catch (Exception e) {
             return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update manufacturer: " + e.getMessage()));
        }
    }

    @DeleteMapping("/admin/manufacturers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteManufacturer(@PathVariable Integer id) {
        manufacturerRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
