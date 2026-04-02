package Spring_Ecomerc.Spring_ecomerc.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import Spring_Ecomerc.Spring_ecomerc.entity.Manufacturer;

import java.util.List;

@Repository
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Integer> {
    List<Manufacturer> findByManufacturerTop(String top);
}
