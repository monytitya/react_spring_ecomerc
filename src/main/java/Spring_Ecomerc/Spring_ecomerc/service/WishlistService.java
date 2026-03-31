package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.entity.Wishlist;
import Spring_Ecomerc.Spring_ecomerc.model.WishlistModel;
import Spring_Ecomerc.Spring_ecomerc.repository.ProductRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public List<WishlistModel> getWishlistByCustomer(Integer customerId) {
        return wishlistRepository.findByCustomerId(customerId).stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public WishlistModel addToWishlist(Integer customerId, Integer productId) {
        var existing = wishlistRepository.findByCustomerIdAndProductId(customerId, productId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return null; // Signals 'removed'
        }
        Wishlist wishlist = Wishlist.builder()
                .customerId(customerId)
                .productId(productId)
                .build();
        return mapToModel(wishlistRepository.save(wishlist));
    }

    private WishlistModel mapToModel(Wishlist wishlist) {
        WishlistModel model = new WishlistModel();
        model.setWishlistId(wishlist.getWishlistId());
        model.setCustomerId(wishlist.getCustomerId());
        model.setProductId(wishlist.getProductId());
        
        productRepository.findById(wishlist.getProductId()).ifPresent(p -> {
            model.setProductTitle(p.getProductTitle());
            model.setProductImg1(p.getProductImg1());
            model.setProductPrice(p.getProductPrice());
            model.setProductLabel(p.getProductLabel());
        });
        
        return model;
    }

    @Transactional
    public void removeFromWishlist(Integer customerId, Integer productId) {
        wishlistRepository.deleteByCustomerIdAndProductId(customerId, productId);
    }
}

