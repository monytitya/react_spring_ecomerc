package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {
    List<CustomerOrder> findByCustomerId(Integer customerId);
    long countByOrderStatus(String orderStatus);
    List<CustomerOrder> findByOrderStatus(String status);
    java.util.Optional<CustomerOrder> findByInvoiceNo(Long invoiceNo);
}
