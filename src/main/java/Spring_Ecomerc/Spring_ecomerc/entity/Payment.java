package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "invoice_no")
    private Long invoiceNo;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "payment_mode", columnDefinition = "TEXT")
    private String paymentMode;

    @Column(name = "ref_no", columnDefinition = "TEXT")
    private String refNo;

    @Column(name = "code")
    private Integer code;

    @Column(name = "payment_date", columnDefinition = "TEXT")
    private String paymentDate;
}
