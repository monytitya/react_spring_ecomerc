package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.entity.Cart;
import Spring_Ecomerc.Spring_ecomerc.model.CartModel;
import Spring_Ecomerc.Spring_ecomerc.repository.CartRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public List<CartModel> getCartByIp(String ipAddress) {
        return cartRepository.findByIpAdd(ipAddress).stream()
                .map(this::mapToModel)
                .toList();
    }

    @Transactional
    public CartModel addToCart(Cart cart) {
        int quantityToAdd = cart.getQty() == null ? 1 : cart.getQty();
        if (quantityToAdd < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        return cartRepository.findByProductIdAndIpAdd(cart.getProductId(), cart.getIpAdd())
                .map(existing -> {
                    int existingQuantity = existing.getQty() == null ? 0 : existing.getQty();
                    existing.setQty(existingQuantity + quantityToAdd);
                    return mapToModel(cartRepository.save(existing));
                })
                .orElseGet(() -> {
                    cart.setQty(quantityToAdd);
                    return mapToModel(cartRepository.save(cart));
                });
    }

    @Transactional
    public CartModel updateQuantity(Integer productId, Integer qty, String ipAddress) {
        if (qty == null || qty < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        Cart cart = cartRepository.findByProductIdAndIpAdd(productId, ipAddress)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cart.setQty(qty);
        return mapToModel(cartRepository.save(cart));
    }

    private CartModel mapToModel(Cart cart) {
        CartModel model = new CartModel();
        model.setPId(cart.getProductId());
        model.setQty(cart.getQty());
        model.setSize(cart.getSize());
        model.setIpAdd(cart.getIpAdd());
        productRepository.findById(cart.getProductId()).ifPresent(product -> {
            model.setProductTitle(product.getProductTitle());
            model.setProductImg(product.getProductImg());

            double price = product.getProductPrice() != null && product.getProductPrice() > 0
                    ? product.getProductPrice()
                    : product.getProductPspPrice() != null ? product.getProductPspPrice() : 0;
            int quantity = cart.getQty() == null ? 1 : cart.getQty();

            model.setProductPrice(price);
            model.setSubtotal(price * quantity);
        });

        return model;
    }
    @Transactional
    public void removeFromCart(Integer productId, String ipAddress) {
        cartRepository.deleteByProductIdAndIp(productId, ipAddress);
    }

    @Transactional
    public void clearCart(String ipAddress) {
        cartRepository.deleteByIpAdd(ipAddress);
    }
}
