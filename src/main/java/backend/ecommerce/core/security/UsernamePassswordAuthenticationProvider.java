package backend.ecommerce.core.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UsernamePassswordAuthenticationProvider implements AuthenticationProvider {

    private final DomainUserDetailsService domainUserDetailsService;
    private final PasswordEncoder passwordEncoder;

    public UsernamePassswordAuthenticationProvider(DomainUserDetailsService domainUserDetailsService, PasswordEncoder passwordEncoder) {
        this.domainUserDetailsService = domainUserDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        UserDetails userDetails = domainUserDetailsService.loadUserByUsername(username);
        log.info("User details: {}", userDetails);

        String rawPassword = authentication.getCredentials().toString();

        if (passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
            return new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
        } else {
            throw new AuthenticationServiceException("Password does not match");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.isAssignableFrom(UsernamePasswordAuthenticationToken.class);
    }
}
