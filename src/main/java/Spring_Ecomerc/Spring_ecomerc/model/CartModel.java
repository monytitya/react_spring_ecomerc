package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartModel {
    private Integer pId;
    private String productTitle;
    private String productImg;
    private Double productPrice;
    private Integer qty;
    private String size;
    private String ipAdd;
    private Double subtotal;
}
