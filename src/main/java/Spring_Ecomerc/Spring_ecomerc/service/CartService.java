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
        return mapToModel(cartRepository.save(cart));
    }

    public CartModel updateQuantity(Integer pId, Integer qty) {
        Cart cart = cartRepository.findById(pId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cart.setQty(qty);
        return mapToModel(cartRepository.save(cart));
    }

    private CartModel mapToModel(Cart cart) {
        CartModel model = new CartModel();
        model.setPId(cart.getPId());
        model.setQty(cart.getQty());
        model.setSize(cart.getSize());
        model.setIpAdd(cart.getIpAdd());
        
        productRepository.findById(cart.getPId()).ifPresent(p -> {
            model.setProductTitle(p.getProductTitle());
            model.setProductImg1(p.getProductImg1());
            model.setProductPrice(p.getProductPrice());
            model.setSubtotal(p.getProductPrice() * cart.getQty());
        });
        
        return model;
    }

    @Transactional
    public void removeFromCart(Integer pId) {
        cartRepository.deleteById(pId);
    }

    @Transactional
    public void clearCart(String ipAddress) {
        cartRepository.deleteByIpAdd(ipAddress);
    }
}

