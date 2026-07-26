package Spring_Ecomerc.Spring_ecomerc;

import Spring_Ecomerc.Spring_ecomerc.entity.Admin;
import Spring_Ecomerc.Spring_ecomerc.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class SpringEcomercApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringEcomercApplication.class, args);
	}

	@Bean
	CommandLineRunner init(AdminRepository adminRepository,
						  Spring_Ecomerc.Spring_ecomerc.repository.CustomerRepository customerRepository,
						  PasswordEncoder passwordEncoder) {
		return args -> {
			// Seed Admin Accounts
			String[][] admins = {
				{"tityamonymac@gmail.com", "Admin User", "admin123"},
				{"lolo@gmail.com", "Lolo Admin", "admin123"},
				{"admin@mail.com", "Default Admin", "Password@123"}
			};

			for (String[] a : admins) {
				String email = a[0];
				Admin admin = adminRepository.findByAdminEmail(email).orElse(new Admin());
				admin.setAdminName(a[1]);
				admin.setAdminEmail(email);
				admin.setAdminPass(passwordEncoder.encode(a[2]));
				admin.setAdminImage("admin-default.png");
				admin.setAdminCountry("Cambodia");
				admin.setAdminJob("System Administrator");
				admin.setAdminAbout("Initial system administrator account");
				adminRepository.save(admin);
			}

			// Seed Customer Account
			String custEmail = "customer@mail.com";
			if (!customerRepository.existsByCustomerEmail(custEmail)) {
				Spring_Ecomerc.Spring_ecomerc.entity.Customer customer = new Spring_Ecomerc.Spring_ecomerc.entity.Customer();
				customer.setCustomerName("Test Customer");
				customer.setCustomerEmail(custEmail);
				customer.setCustomerPass(passwordEncoder.encode("customer123"));
				customer.setCustomerCountry("Cambodia");
				customer.setCustomerCity("Phnom Penh");
				customer.setCustomerContact("012345678");
				customer.setCustomerAddress("Phnom Penh");
				customerRepository.save(customer);
			}

			System.out.println("----------------------------------------------");
			System.out.println("TEST ADMINS READY: tityamonymac@gmail.com, lolo@gmail.com, admin@mail.com (Password: admin123)");
			System.out.println("TEST CUSTOMER READY: customer@mail.com (Password: customer123)");
			System.out.println("----------------------------------------------");
		};
	}
}
