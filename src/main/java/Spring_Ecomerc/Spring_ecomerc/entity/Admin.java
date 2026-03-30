package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Integer adminId;

    @Column(name = "admin_name", nullable = false)
    private String adminName;

    @Column(name = "admin_email", nullable = false, unique = true)
    private String adminEmail;

    @Column(name = "admin_pass", nullable = false)
    private String adminPass;

    @Column(name = "admin_image", columnDefinition = "TEXT")
    private String adminImage;

    @Column(name = "admin_contact")
    private String adminContact;

    @Column(name = "admin_country", columnDefinition = "TEXT")
    private String adminCountry;

    @Column(name = "admin_job")
    private String adminJob;

    @Column(name = "admin_about", columnDefinition = "TEXT")
    private String adminAbout;
}
