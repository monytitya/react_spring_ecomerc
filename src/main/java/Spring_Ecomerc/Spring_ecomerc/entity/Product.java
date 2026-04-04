package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "p_cat_id")
    private Integer pCatId;

    @Column(name = "cat_id")
    private Integer catId;

    @Column(name = "manufacturer_id")
    private Integer manufacturerId;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "product_title", columnDefinition = "TEXT", nullable = false)
    private String productTitle;

    @Column(name = "product_url", columnDefinition = "TEXT")
    private String productUrl;

    @Column(name = "product_img", columnDefinition = "TEXT")
    private String productImg;

    @Column(name = "product_file", columnDefinition = "TEXT")
    private String productFile;


    @Column(name = "product_price")
    private Integer productPrice;

    @Column(name = "product_psp_price")
    private Integer productPspPrice;

    @Column(name = "product_desc", columnDefinition = "TEXT")
    private String productDesc;

    @Column(name = "product_features", columnDefinition = "TEXT")
    private String productFeatures;

    @Column(name = "product_video", columnDefinition = "TEXT")
    private String productVideo;

    @Column(name = "product_keywords", columnDefinition = "TEXT")
    private String productKeywords;

    @Column(name = "product_label", columnDefinition = "TEXT")
    private String productLabel;

    @Column(name = "status")
    private String status;

}
