package Spring_Ecomerc.Spring_ecomerc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;
    private String email;
    private String name;
    private Integer id;
    private String image;
}
