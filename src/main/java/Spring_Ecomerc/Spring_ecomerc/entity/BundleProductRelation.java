package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bundle_product_relation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BundleProductRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rel_id")
    private Integer relId;

    @Column(name = "rel_title", nullable = false)
    private String relTitle;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "bundle_id")
    private Integer bundleId;
}
