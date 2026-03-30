package Spring_Ecomerc.Spring_ecomerc.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class CustomerRegisterRequest {
    @NotBlank
    private String customerName;
    @NotBlank @Email
    private String customerEmail;
    @NotBlank @Size(min = 6)
    private String customerPass;
    private String customerCountry;
    private String customerCity;
    private String customerContact;
    private String customerAddress;
}
