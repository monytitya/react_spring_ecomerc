package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "p_id")
    private Integer productId;

    @Column(name = "ip_add", nullable = false)
    private String ipAdd;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "p_price")
    private String pPrice;

    @Column(name = "size", columnDefinition = "TEXT")
    private String size;

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getIpAdd() { return ipAdd; }
    public void setIpAdd(String ipAdd) { this.ipAdd = ipAdd; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }

    public String getPPrice() { return pPrice; }
    public void setPPrice(String pPrice) { this.pPrice = pPrice; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}
