package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @Column(name = "p_id")
    private Integer pId;

    @Column(name = "ip_add", nullable = false)
    private String ipAdd;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "p_price")
    private String pPrice;

    @Column(name = "size", columnDefinition = "TEXT")
    private String size;
}
