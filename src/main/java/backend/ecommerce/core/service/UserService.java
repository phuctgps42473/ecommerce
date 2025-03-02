package backend.ecommerce.core.service;

import backend.ecommerce.core.domain.User;
import backend.ecommerce.core.dto.RegisterFormDTO;
import backend.ecommerce.core.dto.UserInfoDTO;
import backend.ecommerce.core.exception.ResourceNotFoundException;
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

    public User getUserByEmail(String email) {
        return this.userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("No user found for email: "+ email));
    }

    public UserInfoDTO getUserInfoDTOByEmail(String email) {
        return this.userRepository.findUserInfoDTOByEmail(email).orElseThrow(() -> new ResourceNotFoundException("No user found for email: " + email));
    }

    public void registerUser(RegisterFormDTO registerForm) {
        User user = new User(registerForm.email(), registerForm.password());
        this.userRepository.save(user);
    }

    public void createUser(User user) {
        this.userRepository.save(user);
    }

}
