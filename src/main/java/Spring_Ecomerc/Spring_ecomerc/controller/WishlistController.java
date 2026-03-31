package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.model.WishlistModel;
import Spring_Ecomerc.Spring_ecomerc.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse<List<WishlistModel>>> getWishlist(@PathVariable Integer customerId) {
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getWishlistByCustomer(customerId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WishlistModel>> addToWishlist(@RequestBody java.util.Map<String, Integer> body) {
        Integer customerId = body.get("customerId");
        Integer productId = body.get("productId");
        
        if (customerId == null || productId == null) {
            throw new RuntimeException("Missing customerId or productId in request body!");
        }

        WishlistModel wishlist = wishlistService.addToWishlist(customerId, productId);
        if (wishlist == null) {
            return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", null));
        }
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist", wishlist));
    }


    @DeleteMapping("/{customerId}/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @PathVariable Integer customerId,
            @PathVariable Integer productId) {
        wishlistService.removeFromWishlist(customerId, productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", null));
    }
}
