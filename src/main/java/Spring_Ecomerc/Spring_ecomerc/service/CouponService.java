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
        return couponRepository.save(coupon);
    }

    public void deleteCoupon(Integer id) {
        couponRepository.deleteById(id);
    }
}
