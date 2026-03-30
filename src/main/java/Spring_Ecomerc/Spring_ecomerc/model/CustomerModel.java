package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerModel {
    private Integer customerId;
    private String customerName;
    private String customerEmail;
    private String customerCountry;
    private String customerCity;
    private String customerContact;
    private String customerAddress;
    private String customerImage;
}
