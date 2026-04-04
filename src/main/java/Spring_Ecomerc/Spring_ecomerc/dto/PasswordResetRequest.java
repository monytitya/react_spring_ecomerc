package Spring_Ecomerc.Spring_ecomerc.dto;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String email;
    private String newPassword;
}
