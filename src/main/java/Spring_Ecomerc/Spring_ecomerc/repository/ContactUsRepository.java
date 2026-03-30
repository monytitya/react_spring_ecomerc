package Spring_Ecomerc.Spring_ecomerc.repository;

import Spring_Ecomerc.Spring_ecomerc.entity.ContactUs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactUsRepository extends JpaRepository<ContactUs, Integer> {
}
