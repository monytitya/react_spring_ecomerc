package Spring_Ecomerc.Spring_ecomerc.dto;

import lombok.Data;

@Data
public class PaymentCreateRequest {
    private Long orderId;
    private Double amount;
    private String currency;
}
