package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.Coupon;
import Spring_Ecomerc.Spring_ecomerc.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/validate/{code}")
    public ResponseEntity<ApiResponse<Coupon>> validate(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success(couponService.validateCoupon(code)));
    }

    @PostMapping("/apply/{code}")
    public ResponseEntity<ApiResponse<Coupon>> apply(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success("Coupon applied", couponService.applyCoupon(code)));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Coupon>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getAllCoupons()));
    }

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<Coupon>> create(@RequestBody Coupon coupon) {
        coupon.setCouponId(null);
        return ResponseEntity.ok(ApiResponse.success("Coupon created", couponService.createCoupon(coupon)));
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Coupon>> update(@PathVariable Integer id, @RequestBody Coupon coupon) {
        return ResponseEntity.ok(ApiResponse.success("Coupon updated", couponService.updateCoupon(id, coupon)));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted", null));
    }
}
