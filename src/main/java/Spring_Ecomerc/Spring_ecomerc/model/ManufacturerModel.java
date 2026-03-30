package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManufacturerModel {
    private Integer manufacturerId;
    private String manufacturerTitle;
    private String manufacturerTop;
    private String manufacturerImage;
    private Long productCount;
}
