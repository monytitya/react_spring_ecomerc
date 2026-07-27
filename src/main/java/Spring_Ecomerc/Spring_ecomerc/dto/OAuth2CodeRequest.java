package Spring_Ecomerc.Spring_ecomerc.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OAuth2CodeRequest {

    @NotBlank(message = "Authorization code is required")
    private String code;

    private String redirectUri;

    private String provider;
}
