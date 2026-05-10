package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Cart;
import Spring_Ecomerc.Spring_ecomerc.model.CartModel;
import Spring_Ecomerc.Spring_ecomerc.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartModel>>> getCart(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCartByIp(request.getRemoteAddr())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartModel>> addToCart(@RequestBody Cart cart, HttpServletRequest request) {
        cart.setIpAdd(request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success("Added to cart", cartService.addToCart(cart)));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<CartModel>> updateQty(@PathVariable Integer productId, @RequestParam Integer qty, HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cartService.updateQuantity(productId, qty, request.getRemoteAddr())));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(@PathVariable Integer productId, HttpServletRequest request) {
        cartService.removeFromCart(productId, request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success("Removed from cart", null));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(HttpServletRequest request) {
        cartService.clearCart(request.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}

