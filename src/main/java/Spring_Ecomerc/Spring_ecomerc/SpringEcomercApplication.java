package Spring_Ecomerc.Spring_ecomerc;

import Spring_Ecomerc.Spring_ecomerc.entity.Admin;
import Spring_Ecomerc.Spring_ecomerc.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SpringEcomercApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringEcomercApplication.class, args);
	}

	@Bean
	CommandLineRunner init(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (adminRepository.count() == 0) {
				Admin admin = Admin.builder()
						.adminName("Main Admin")
						.adminEmail("admin@gmail.com")
						.adminPass(passwordEncoder.encode("Test@123"))
						.adminImage("admin-default.png")
						.adminCountry("USA")
						.adminJob("Super Admin")
						.adminAbout("Initial system administrator")
						.build();
				adminRepository.save(admin);
				System.out.println("Default Admin created: admin@gmail.com / Test@123");
			}
		};
	}
}
