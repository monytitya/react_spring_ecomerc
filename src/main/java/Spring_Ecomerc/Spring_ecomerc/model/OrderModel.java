package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderModel {
    private Integer orderId;
    private Integer customerId;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private Double dueAmount;
    private Long invoiceNo;
    private Integer qty;
    private String size;
    private LocalDateTime orderDate;
    private String orderStatus;
    private Integer productId;
    private String productTitle;
}
