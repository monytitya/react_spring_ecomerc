package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_id")
    private Integer catId;

    @Column(name = "cat_title", columnDefinition = "TEXT", nullable = false)
    private String catTitle;

    @Column(name = "cat_top", columnDefinition = "TEXT")
    private String catTop;

    @Column(name = "cat_image", columnDefinition = "TEXT")
    private String catImage;
}
