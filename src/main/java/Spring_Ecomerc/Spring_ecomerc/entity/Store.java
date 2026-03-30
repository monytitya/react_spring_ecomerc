package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "store")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_id")
    private Integer storeId;

    @Column(name = "store_title", nullable = false)
    private String storeTitle;

    @Column(name = "store_image")
    private String storeImage;

    @Column(name = "store_desc", columnDefinition = "TEXT")
    private String storeDesc;

    @Column(name = "store_button")
    private String storeButton;

    @Column(name = "store_url")
    private String storeUrl;
}
