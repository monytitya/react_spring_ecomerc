package Spring_Ecomerc.Spring_ecomerc.dto;

import Spring_Ecomerc.Spring_ecomerc.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Integer id;
    private Long orderId;
    private String transactionId;
    private Double amount;
    private String currency;
    private PaymentStatus status;
    private String qrString;
    private LocalDateTime createdAt;
}
