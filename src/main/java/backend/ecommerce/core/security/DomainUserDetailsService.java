package backend.ecommerce.core.security;

import backend.ecommerce.core.User;
import backend.ecommerce.core.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DomainUserDetailsService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);
    private final UserRepository userRepository;

    public DomainUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Email does not exist."));

        if (user.getIsDeleted()) {
            throw new UsernameNotFoundException("Email does not exist.");
        }

        if (!user.getEmailVerified()) {
            log.warn("Email {} was not verified", email);
            throw new UsernameNotFoundException("Email was not verified.");
        }

        SimpleGrantedAuthority simpleGrantedAuthority = new SimpleGrantedAuthority(user.getUserRole().name());

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), List.of(simpleGrantedAuthority));
    }
}
