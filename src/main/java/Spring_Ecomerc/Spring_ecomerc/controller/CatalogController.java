package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.*;
import Spring_Ecomerc.Spring_ecomerc.model.*;
import Spring_Ecomerc.Spring_ecomerc.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CatalogController {

    private final CategoryRepository categoryRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final ProductRepository productRepository;

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
}
