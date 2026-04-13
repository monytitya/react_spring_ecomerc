package Spring_Ecomerc.Spring_ecomerc.dto;

import lombok.Data;

@Data
public class BakongWebhookRequest {
    private String transactionId;
    private Double amount;
    private String hash; // Optional: for security verification logic
}
