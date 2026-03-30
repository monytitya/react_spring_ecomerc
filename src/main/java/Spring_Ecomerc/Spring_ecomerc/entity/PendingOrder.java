package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pending_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "invoice_no")
    private Long invoiceNo;

    @Column(name = "product_id", columnDefinition = "TEXT")
    private String productId;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "size", columnDefinition = "TEXT")
    private String size;

    @Column(name = "order_status", columnDefinition = "TEXT")
    private String orderStatus;
}
