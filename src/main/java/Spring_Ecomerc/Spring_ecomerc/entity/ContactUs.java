package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contact_us")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactUs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    private Integer contactId;

    @Column(name = "contact_email", columnDefinition = "TEXT")
    private String contactEmail;

    @Column(name = "contact_heading", columnDefinition = "TEXT")
    private String contactHeading;

    @Column(name = "contact_desc", columnDefinition = "TEXT")
    private String contactDesc;
}
