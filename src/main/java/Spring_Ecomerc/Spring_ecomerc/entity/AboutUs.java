package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "about_us")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AboutUs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "about_id")
    private Integer aboutId;

    @Column(name = "about_heading", columnDefinition = "TEXT", nullable = false)
    private String aboutHeading;

    @Column(name = "about_short_desc", columnDefinition = "TEXT")
    private String aboutShortDesc;

    @Column(name = "about_desc", columnDefinition = "TEXT")
    private String aboutDesc;
}
