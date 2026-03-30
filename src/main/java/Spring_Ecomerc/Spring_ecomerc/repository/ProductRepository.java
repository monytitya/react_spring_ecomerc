// package Spring_Ecomerc.Spring_ecomerc.repository;

// import Spring_Ecomerc.Spring_ecomerc.entity.Product;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
// import java.util.List;

// @Repository
// public interface ProductRepository extends JpaRepository<Product, Integer> {
//     List<Product> findByCatId(Integer catId);

//     List<Product> findByPCatId(Integer pCatId);

//     List<Product> findByManufacturerId(Integer manufacturerId);

//     List<Product> findByProductLabel(String label);

//     List<Product> findByStatus(String status);

//     List<Product> findByProductTitleContainingIgnoreCase(String keyword);

//     long countByCatId(Integer catId);

//     long countByManufacturerId(Integer manufacturerId);
// }
package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // ត្រឹមត្រូវតាម Standard
    List<Product> findByCatId(Integer catId);

    // ប្តូរមកប្រើ @Query ដើម្បីដោះស្រាយបញ្ហាអក្សរ P និង C ធំនៅជាប់គ្នា (Fix error
    // មុននេះ)
    @Query("SELECT p FROM Product p WHERE p.pCatId = :pCatId")
    List<Product> findByPCatId(@Param("pCatId") Integer pCatId);

    // ត្រឹមត្រូវតាម Standard
    List<Product> findByManufacturerId(Integer manufacturerId);

    // ត្រឹមត្រូវតាម Standard
    List<Product> findByProductLabel(String label);

    // ត្រឹមត្រូវតាម Standard
    List<Product> findByStatus(String status);

    // ត្រឹមត្រូវតាម Standard
    List<Product> findByProductTitleContainingIgnoreCase(String keyword);

    // ត្រឹមត្រូវតាម Standard
    long countByCatId(Integer catId);

    // ត្រឹមត្រូវតាម Standard
    long countByManufacturerId(Integer manufacturerId);
}