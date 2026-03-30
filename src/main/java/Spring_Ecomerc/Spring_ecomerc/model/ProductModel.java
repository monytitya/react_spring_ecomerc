package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductModel {
    private Integer productId;
    private String productTitle;
    private String productUrl;
    private String productImg1;
    private String productImg2;
    private String productImg3;
    private Integer productPrice;
    private Integer productPspPrice;
    private String productDesc;
    private String productFeatures;
    private String productVideo;
    private String productKeywords;
    private String productLabel;
    private String status;
    private Integer catId;
    private String catTitle;
    private Integer pCatId;
    private String pCatTitle;
    private Integer manufacturerId;
    private String manufacturerTitle;
}
