package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.Manufacturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Integer> {
    List<Manufacturer> findByManufacturerTop(String top);
}
