package backend.ecommerce.core.service;

import backend.ecommerce.core.User;
import backend.ecommerce.core.dto.RegisterFormDTO;
import backend.ecommerce.core.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean userWithEmailExists(String email) {

        return this.userRepository.existsByEmail(email);
    }

    public void registerUser(RegisterFormDTO registerForm) {
        User user = new User(registerForm.email(), registerForm.password());
        this.userRepository.save(user);
    }
}
