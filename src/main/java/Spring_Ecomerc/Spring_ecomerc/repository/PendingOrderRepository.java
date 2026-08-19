package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.PendingOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PendingOrderRepository extends JpaRepository<PendingOrder, Integer> {
    List<PendingOrder> findByCustomerId(Integer customerId);
    List<PendingOrder> findByInvoiceNo(Long invoiceNo);
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "delete from pending_orders where cast(product_id as text) = cast(:productId as text)", nativeQuery = true)
    int deleteByProductId(@Param("productId") Integer productId);
}
