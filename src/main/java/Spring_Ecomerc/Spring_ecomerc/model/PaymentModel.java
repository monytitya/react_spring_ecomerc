package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentModel {
    private Integer paymentId;
    private Long invoiceNo;
    private Integer amount;
    private String paymentMode;
    private Long refNo;
    private Integer code;
    private String paymentDate;
}
