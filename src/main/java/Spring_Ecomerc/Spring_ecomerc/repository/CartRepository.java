package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByIpAdd(String ipAdd);
    void deleteByIpAdd(String ipAdd);
    Optional<Cart> findByProductIdAndIpAdd(Integer productId, String ipAdd);

    @Modifying
    @Query("DELETE FROM Cart c WHERE c.productId = :productId AND c.ipAdd = :ipAdd")
    void deleteByProductIdAndIp(@Param("productId") Integer productId, @Param("ipAdd") String ipAdd);
}
