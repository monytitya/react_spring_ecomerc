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
    private final FileService fileService;


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

    public ProductModel createProduct(Product product, MultipartFile img) throws IOException {
        product.setProductId(null);
        product.setDate(LocalDateTime.now());
        if (img != null && !img.isEmpty()) product.setProductImg(fileService.uploadFile(img, "products"));
        return mapToModel(productRepository.save(product));
    }

    public ProductModel createProductBase64(Product product, String img) throws IOException {
        product.setProductId(null);
        product.setDate(LocalDateTime.now());
        if (img != null && !img.isEmpty()) product.setProductImg(fileService.uploadBase64(img, "products"));
        return mapToModel(productRepository.save(product));
    }


    public ProductModel updateProduct(Integer id, Product updatedProduct, MultipartFile img) throws IOException {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        copyProperties(updatedProduct, existing);
        
        if (img != null && !img.isEmpty()) existing.setProductImg(fileService.uploadFile(img, "products"));
        
        return mapToModel(productRepository.save(existing));
    }

    public ProductModel updateProductBase64(Integer id, Product updatedProduct, String img) throws IOException {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        copyProperties(updatedProduct, existing);
        
        if (img != null && !img.isEmpty()) existing.setProductImg(fileService.uploadBase64(img, "products"));
        
        return mapToModel(productRepository.save(existing));
    }


    private void copyProperties(Product from, Product to) {
        if (from.getProductTitle() != null) to.setProductTitle(from.getProductTitle());
        if (from.getProductUrl() != null) to.setProductUrl(from.getProductUrl());
        if (from.getProductPrice() != null) to.setProductPrice(from.getProductPrice());
        if (from.getProductPspPrice() != null) to.setProductPspPrice(from.getProductPspPrice());
        if (from.getProductDesc() != null) to.setProductDesc(from.getProductDesc());
        if (from.getProductFeatures() != null) to.setProductFeatures(from.getProductFeatures());
        if (from.getProductVideo() != null) to.setProductVideo(from.getProductVideo());
        if (from.getProductLabel() != null) to.setProductLabel(from.getProductLabel());
        if (from.getProductKeywords() != null) to.setProductKeywords(from.getProductKeywords());
        if (from.getCatId() != null) to.setCatId(from.getCatId());
        if (from.getPCatId() != null) to.setPCatId(from.getPCatId());
        if (from.getManufacturerId() != null) to.setManufacturerId(from.getManufacturerId());
        if (from.getStatus() != null) to.setStatus(from.getStatus());
        to.setDate(LocalDateTime.now());
    }

    private ProductModel mapToModel(Product product) {
        ProductModel model = new ProductModel();
        model.setProductId(product.getProductId());
        model.setProductTitle(product.getProductTitle());
        model.setProductUrl(product.getProductUrl());
        model.setProductImg(product.getProductImg());

        model.setProductPrice(product.getProductPrice());
        model.setProductPspPrice(product.getProductPspPrice());
        model.setProductDesc(product.getProductDesc());
        model.setProductFeatures(product.getProductFeatures());
        model.setProductVideo(product.getProductVideo());
        model.setProductKeywords(product.getProductKeywords());
        model.setProductLabel(product.getProductLabel());
        model.setStatus(product.getStatus());
        
        model.setCatId(product.getCatId());
        if (product.getCatId() != null) {
            categoryRepository.findById(product.getCatId()).ifPresent(c -> model.setCatTitle(c.getCatTitle()));
        }
        
        model.setPCatId(product.getPCatId());
        if (product.getPCatId() != null) {
            productCategoryRepository.findById(product.getPCatId()).ifPresent(pc -> model.setPCatTitle(pc.getPCatTitle()));
        }
        
        model.setManufacturerId(product.getManufacturerId());
        if (product.getManufacturerId() != null) {
            manufacturerRepository.findById(product.getManufacturerId()).ifPresent(m -> model.setManufacturerTitle(m.getManufacturerTitle()));
        }
        
        model.setDate(product.getDate());
        
        return model;
    }

    public void deleteProduct(Integer id) {


        productRepository.deleteById(id);
    }
}

