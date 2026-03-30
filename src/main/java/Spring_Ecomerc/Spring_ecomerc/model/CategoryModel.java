package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryModel {
    private Integer catId;
    private String catTitle;
    private String catTop;
    private String catImage;
    private Long productCount;
}
