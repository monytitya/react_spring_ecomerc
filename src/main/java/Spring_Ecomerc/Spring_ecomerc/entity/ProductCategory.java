package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_cat_id")
    private Integer pCatId;

    @Column(name = "p_cat_title", columnDefinition = "TEXT", nullable = false)
    private String pCatTitle;

    @Column(name = "p_cat_top", columnDefinition = "TEXT")
    private String pCatTop;

    @Column(name = "p_cat_image", columnDefinition = "TEXT")
    private String pCatImage;
}
