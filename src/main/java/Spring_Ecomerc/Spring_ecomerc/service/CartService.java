package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.entity.Cart;
import Spring_Ecomerc.Spring_ecomerc.model.CartModel;
import Spring_Ecomerc.Spring_ecomerc.repository.CartRepository;
import Spring_Ecomerc.Spring_ecomerc.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public List<CartModel> getCartByIp(String ipAddress) {
        return cartRepository.findByIpAdd(ipAddress).stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public CartModel addToCart(Cart cart) {
        return cartRepository.findByProductIdAndIpAdd(cart.getProductId(), cart.getIpAdd())
                .map(existing -> {
                    existing.setQty(existing.getQty() + cart.getQty());
                    return mapToModel(cartRepository.save(existing));
                })
                .orElseGet(() -> mapToModel(cartRepository.save(cart)));
    }

    public CartModel updateQuantity(Integer productId, Integer qty, String ipAddress) {
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

        productRepository.findById(cart.getProductId()).ifPresent(p -> {
            model.setProductTitle(p.getProductTitle());
            model.setProductImg(p.getProductImg());
            Integer price = (p.getProductPrice() != null && p.getProductPrice() > 0)
                    ? p.getProductPrice()
                    : (p.getProductPspPrice() != null ? p.getProductPspPrice() : 0);
            model.setProductPrice(price);
            model.setSubtotal(price * (cart.getQty() != null ? cart.getQty() : 1));
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
