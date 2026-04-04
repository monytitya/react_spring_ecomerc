package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.entity.Coupon;
import Spring_Ecomerc.Spring_ecomerc.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon validateCoupon(String code) {
        Coupon coupon = couponRepository.findByCouponCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));
        if (coupon.getCouponUsed() >= coupon.getCouponLimit()) {
            throw new RuntimeException("Coupon limit reached");
        }
        return coupon;
    }

    public Coupon applyCoupon(String code) {
        Coupon coupon = validateCoupon(code);
        coupon.setCouponUsed(coupon.getCouponUsed() + 1);
        return couponRepository.save(coupon);
    }

    public Coupon createCoupon(Coupon coupon) {
        if (couponRepository.findByCouponCode(coupon.getCouponCode()).isPresent()) {
            throw new RuntimeException("Coupon code '" + coupon.getCouponCode() + "' is already taken! Please choose a different code.");
        }
        if (coupon.getCouponUsed() == null) coupon.setCouponUsed(0);
        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(Integer id, Coupon couponDetails) {
        Coupon existing = couponRepository.findById(id).orElseThrow(() -> new RuntimeException("Coupon not found"));
        
        if (!existing.getCouponCode().equals(couponDetails.getCouponCode()) && 
            couponRepository.findByCouponCode(couponDetails.getCouponCode()).isPresent()) {
            throw new RuntimeException("Coupon code '" + couponDetails.getCouponCode() + "' is already taken!");
        }
        
        existing.setCouponTitle(couponDetails.getCouponTitle());
        existing.setCouponCode(couponDetails.getCouponCode());
        existing.setCouponPrice(couponDetails.getCouponPrice());
        existing.setCouponLimit(couponDetails.getCouponLimit());
        if(couponDetails.getProductId() != null) {
            existing.setProductId(couponDetails.getProductId());
        }
        
        return couponRepository.save(existing);
    }

    public void deleteCoupon(Integer id) {
        couponRepository.deleteById(id);
    }
}
