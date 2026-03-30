package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false, unique = true)
    private String customerEmail;

    @Column(name = "customer_pass", nullable = false)
    private String customerPass;

    @Column(name = "customer_country", columnDefinition = "TEXT")
    private String customerCountry;

    @Column(name = "customer_city", columnDefinition = "TEXT")
    private String customerCity;

    @Column(name = "customer_contact")
    private String customerContact;

    @Column(name = "customer_address", columnDefinition = "TEXT")
    private String customerAddress;

    @Column(name = "customer_image", columnDefinition = "TEXT")
    private String customerImage;

    @Column(name = "customer_ip")
    private String customerIp;

    @Column(name = "customer_confirm_code", columnDefinition = "TEXT")
    private String customerConfirmCode;
}
