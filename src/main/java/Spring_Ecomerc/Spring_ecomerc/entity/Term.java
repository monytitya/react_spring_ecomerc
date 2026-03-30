package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "terms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Term {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "term_id")
    private Integer termId;

    @Column(name = "term_title", length = 100)
    private String termTitle;

    @Column(name = "term_link", length = 100)
    private String termLink;

    @Column(name = "term_desc", columnDefinition = "TEXT")
    private String termDesc;
}
