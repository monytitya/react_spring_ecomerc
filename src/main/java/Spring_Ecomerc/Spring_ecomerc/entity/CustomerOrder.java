package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    private Customer customer;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "due_amount")
    private Integer dueAmount;

    @Column(name = "invoice_no")
    private Long invoiceNo;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "size", columnDefinition = "TEXT")
    private String size;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "order_status", columnDefinition = "TEXT")
    private String orderStatus;
}
