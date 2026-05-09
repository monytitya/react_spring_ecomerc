package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByTransactionId(String transactionId);
    java.util.List<Payment> findByOrderId(Long orderId);
    java.util.List<Payment> findByStatus(Spring_Ecomerc.Spring_ecomerc.entity.PaymentStatus status);
}
