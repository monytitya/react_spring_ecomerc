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

    @ManyToOne
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "invoice_no")
    private Long invoiceNo;

    @ManyToOne
    @JoinColumn(name = "product_id", insertable = false, updatable = false)
    private Product product;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "size", columnDefinition = "TEXT")
    private String size;

    @Column(name = "order_status", columnDefinition = "TEXT")
    private String orderStatus;
}
