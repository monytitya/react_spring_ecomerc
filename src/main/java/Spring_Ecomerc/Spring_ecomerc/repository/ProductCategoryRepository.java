package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {

    @Query("SELECT pc FROM ProductCategory pc WHERE pc.pCatTop = :pCatTop")
    List<ProductCategory> findByPCatTop(@Param("pCatTop") String pCatTop);
}