package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByOrderId(Long orderId);
}
