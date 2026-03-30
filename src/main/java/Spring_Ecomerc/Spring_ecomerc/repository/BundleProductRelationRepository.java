package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.BundleProductRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BundleProductRelationRepository extends JpaRepository<BundleProductRelation, Integer> {
    List<BundleProductRelation> findByBundleId(Integer bundleId);
    List<BundleProductRelation> findByProductId(Integer productId);
}
