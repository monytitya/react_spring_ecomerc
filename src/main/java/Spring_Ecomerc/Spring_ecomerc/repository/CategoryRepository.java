package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByCatTop(String catTop);
}
