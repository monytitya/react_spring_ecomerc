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
			String testEmail = "admin@gmail.com";
			Admin admin = adminRepository.findByAdminEmail(testEmail).orElse(new Admin());

			admin.setAdminName("Admin User");
			admin.setAdminEmail(testEmail);
			admin.setAdminPass(passwordEncoder.encode("admin123"));
			admin.setAdminImage("admin-default.png");
			admin.setAdminCountry("USA");
			admin.setAdminJob("Super Admin");
			admin.setAdminAbout("Initial system administrator");

			adminRepository.save(admin);
			System.out.println("----------------------------------------------");
			System.out.println("TEST ADMIN READY: " + testEmail + " / admin123");
			System.out.println("----------------------------------------------");
		};
	}
}
