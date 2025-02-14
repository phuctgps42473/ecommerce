package backend.ecommerce.core.security;

import backend.ecommerce.core.domain.UserRole;
import backend.ecommerce.core.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
    private final JWTProvider jwtProvider;

    public SecurityConfiguration(JWTProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOrigins(List.of("http://localhost:5173")); // Remix origin
//        config.setAllowedMethods(List.of("*"));
//        config.setAllowedHeaders(List.of("*"));
//        config.setAllowCredentials(true); // ← Crucial for cookies
//        config.setExposedHeaders(List.of("Set-Cookie", "Cookie")); // ← Expose cookies
//        return (req) -> config;
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        authorizeHttp -> {

                            authorizeHttp.requestMatchers("/api/register").permitAll();
                            authorizeHttp.requestMatchers("/api/authenticate").permitAll();
                            authorizeHttp.requestMatchers("/api/oauth/code_grant/**").permitAll();
                            authorizeHttp.requestMatchers("/api/refresh-token").permitAll();
                            authorizeHttp.requestMatchers("/login/*").permitAll();
                            authorizeHttp.requestMatchers("/api/public/**").permitAll();


                            authorizeHttp.requestMatchers("/api/admin/authenticate").permitAll();
                            authorizeHttp.requestMatchers("/api/admin/**").hasAuthority(UserRole.ADMIN.name());

                            authorizeHttp.anyRequest().authenticated();
                        }
                )
                .addFilterBefore(new JWTFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

//    @Bean
//    public UserDetailsService userDetailsService(UserRepository userRepository) {
//        return new DomainUserDetailsService(userRepository);
//    }
}
