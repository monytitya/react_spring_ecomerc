package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistModel {
    private Integer wishlistId;
    private Integer customerId;
    private Integer productId;
    private String productTitle;
    private String productImg;
    private Integer productPrice;
    private String productLabel;
}
