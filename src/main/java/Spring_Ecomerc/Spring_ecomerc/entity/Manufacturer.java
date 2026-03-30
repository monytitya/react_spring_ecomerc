package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "manufacturers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Manufacturer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manufacturer_id")
    private Integer manufacturerId;

    @Column(name = "manufacturer_title", columnDefinition = "TEXT", nullable = false)
    private String manufacturerTitle;

    @Column(name = "manufacturer_top", columnDefinition = "TEXT")
    private String manufacturerTop;

    @Column(name = "manufacturer_image", columnDefinition = "TEXT")
    private String manufacturerImage;
}
