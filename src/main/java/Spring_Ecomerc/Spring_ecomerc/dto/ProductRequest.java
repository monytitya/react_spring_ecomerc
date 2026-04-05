package Spring_Ecomerc.Spring_ecomerc.dto;

import Spring_Ecomerc.Spring_ecomerc.entity.Product;
import lombok.Data;

@Data
public class ProductRequest {
    private Product product;
    private String img;

}
