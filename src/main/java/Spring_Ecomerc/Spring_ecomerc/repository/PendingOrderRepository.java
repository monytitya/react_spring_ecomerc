package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.PendingOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PendingOrderRepository extends JpaRepository<PendingOrder, Integer> {
    List<PendingOrder> findByCustomerId(Integer customerId);
    List<PendingOrder> findByInvoiceNo(Long invoiceNo);
}
