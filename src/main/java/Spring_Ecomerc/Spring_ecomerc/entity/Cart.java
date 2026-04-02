package Spring_Ecomerc.Spring_ecomerc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart")
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

    // Getters and Setters
    public Integer getPId() { return pId; }
    public void setPId(Integer pId) { this.pId = pId; }

    public String getIpAdd() { return ipAdd; }
    public void setIpAdd(String ipAdd) { this.ipAdd = ipAdd; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }

    public String getPPrice() { return pPrice; }
    public void setPPrice(String pPrice) { this.pPrice = pPrice; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}
