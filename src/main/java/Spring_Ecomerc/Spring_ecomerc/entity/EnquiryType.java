package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "enquiry_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnquiryType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enquiry_id")
    private Integer enquiryId;

    @Column(name = "enquiry_title", nullable = false)
    private String enquiryTitle;
}
