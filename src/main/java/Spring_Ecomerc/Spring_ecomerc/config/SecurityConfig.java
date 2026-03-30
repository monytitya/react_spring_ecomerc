package Spring_Ecomerc.Spring_ecomerc.config;

import Spring_Ecomerc.Spring_ecomerc.security.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public auth paths
                        .requestMatchers("/api/auth/**").permitAll()
                        
                        // Documentation
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        
                        // Error handling path - CRITICAL for getting real error messages instead of 403
                        .requestMatchers("/error").permitAll()
                        
                        // Public GET endpoints
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/products").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**", "/api/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product-categories/**", "/api/product-categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/manufacturers/**", "/api/manufacturers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/stores/**", "/api/stores").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cms/**", "/api/cms").permitAll()
                        
                        // Files and Static resources
                        .requestMatchers("/api/files/**").permitAll()
                        
                        // Shopping Cart - Usually public but can be restricted
                        .requestMatchers("/api/cart/**").permitAll()
                        
                        // Protected Admin routes
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        
                        // Protected Customer/Admin routes
                        .requestMatchers("/api/orders/**").hasAnyRole("CUSTOMER", "ADMIN")
                        .requestMatchers("/api/wishlist/**").hasAnyRole("CUSTOMER", "ADMIN")
                        .requestMatchers("/api/customers/**").hasAnyRole("CUSTOMER", "ADMIN")
                        
                        // Everything else
                        .anyRequest().authenticated()
                )
                // Add exception handling to clarify 401 vs 403
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"status\": 401, \"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
                        })
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Be more flexible with dev origins or use * for testing
        config.setAllowedOriginPatterns(List.of("*")); 
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
