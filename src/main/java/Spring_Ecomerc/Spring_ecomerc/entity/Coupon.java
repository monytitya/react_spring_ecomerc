package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "coupon_id")
    private Integer couponId;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "coupon_title", nullable = false)
    private String couponTitle;

    @Column(name = "coupon_price", nullable = false)
    private String couponPrice;

    @Column(name = "coupon_code", nullable = false, unique = true)
    private String couponCode;

    @Column(name = "coupon_limit")
    private Integer couponLimit;

    @Column(name = "coupon_used")
    private Integer couponUsed;
}
