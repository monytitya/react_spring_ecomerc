package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "transaction_id", unique = true)
    private String transactionId;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "currency")
    private String currency; // "USD" or "KHR"

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
