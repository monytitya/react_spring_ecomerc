package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.entity.Product;
import Spring_Ecomerc.Spring_ecomerc.model.ProductModel;
import Spring_Ecomerc.Spring_ecomerc.repository.CategoryRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.ManufacturerRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.ProductCategoryRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ManufacturerRepository manufacturerRepository;

    public Page<ProductModel> getAllProducts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::mapToModel);
    }

    public ProductModel getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToModel(product);
    }

    public List<ProductModel> getProductsByCategory(Integer catId) {
        return productRepository.findByCatId(catId).stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public List<ProductModel> getProductsBySubCategory(Integer pCatId) {
        return productRepository.findByPCatId(pCatId).stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public List<ProductModel> getProductsByManufacturer(Integer manufacturerId) {
        return productRepository.findByManufacturerId(manufacturerId).stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public List<ProductModel> getFeaturedProducts() {
        return productRepository.findByProductLabel("Featured").stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public List<ProductModel> getProductsByLabel(String label) {
        return productRepository.findByProductLabel(label).stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public List<ProductModel> searchProducts(String keyword) {
        return productRepository.findByProductTitleContainingIgnoreCase(keyword).stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public ProductModel createProduct(Product product, MultipartFile img1, MultipartFile img2, MultipartFile img3) throws IOException {
        product.setDate(LocalDateTime.now());
        if (img1 != null && !img1.isEmpty()) product.setProductImg1(saveFile(img1, "products"));
        if (img2 != null && !img2.isEmpty()) product.setProductImg2(saveFile(img2, "products"));
        if (img3 != null && !img3.isEmpty()) product.setProductImg3(saveFile(img3, "products"));
        return mapToModel(productRepository.save(product));
    }

    public ProductModel updateProduct(Integer id, Product updatedProduct, MultipartFile img1, MultipartFile img2, MultipartFile img3) throws IOException {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        existing.setProductTitle(updatedProduct.getProductTitle());
        existing.setProductPrice(updatedProduct.getProductPrice());
        existing.setProductPspPrice(updatedProduct.getProductPspPrice());
        existing.setProductDesc(updatedProduct.getProductDesc());
        existing.setProductFeatures(updatedProduct.getProductFeatures());
        existing.setProductLabel(updatedProduct.getProductLabel());
        existing.setProductKeywords(updatedProduct.getProductKeywords());
        existing.setCatId(updatedProduct.getCatId());
        existing.setPCatId(updatedProduct.getPCatId());
        existing.setManufacturerId(updatedProduct.getManufacturerId());
        existing.setStatus(updatedProduct.getStatus());
        existing.setDate(LocalDateTime.now());
        
        if (img1 != null && !img1.isEmpty()) existing.setProductImg1(saveFile(img1, "products"));
        if (img2 != null && !img2.isEmpty()) existing.setProductImg2(saveFile(img2, "products"));
        if (img3 != null && !img3.isEmpty()) existing.setProductImg3(saveFile(img3, "products"));
        
        return mapToModel(productRepository.save(existing));
    }

    private ProductModel mapToModel(Product product) {
        ProductModel model = new ProductModel();
        model.setProductId(product.getProductId());
        model.setProductTitle(product.getProductTitle());
        model.setProductUrl(product.getProductUrl());
        model.setProductImg1(product.getProductImg1());
        model.setProductImg2(product.getProductImg2());
        model.setProductImg3(product.getProductImg3());
        model.setProductPrice(product.getProductPrice());
        model.setProductPspPrice(product.getProductPspPrice());
        model.setProductDesc(product.getProductDesc());
        model.setProductFeatures(product.getProductFeatures());
        model.setProductVideo(product.getProductVideo());
        model.setProductKeywords(product.getProductKeywords());
        model.setProductLabel(product.getProductLabel());
        model.setStatus(product.getStatus());
        
        model.setCatId(product.getCatId());
        categoryRepository.findById(product.getCatId()).ifPresent(c -> model.setCatTitle(c.getCatTitle()));
        
        model.setPCatId(product.getPCatId());
        productCategoryRepository.findById(product.getPCatId()).ifPresent(pc -> model.setPCatTitle(pc.getPCatTitle()));
        
        model.setManufacturerId(product.getManufacturerId());
        manufacturerRepository.findById(product.getManufacturerId()).ifPresent(m -> model.setManufacturerTitle(m.getManufacturerTitle()));
        
        return model;
    }

    private String saveFile(MultipartFile file, String subDir) throws IOException {
        String uploadDir = "uploads/" + subDir;
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        return filename;
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}

