package Spring_Ecomerc.Spring_ecomerc.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class PlaceOrderRequest {
    @NotNull
    private Integer customerId;
    @NotNull
    private Integer productId;
    @NotNull
    private Integer qty;
    @NotBlank
    private String size;
    @NotNull
    private Integer dueAmount;
    private String paymentMode;
}
