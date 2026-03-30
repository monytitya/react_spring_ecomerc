package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    List<Wishlist> findByCustomerId(Integer customerId);
    Optional<Wishlist> findByCustomerIdAndProductId(Integer customerId, Integer productId);
    void deleteByCustomerIdAndProductId(Integer customerId, Integer productId);
}
