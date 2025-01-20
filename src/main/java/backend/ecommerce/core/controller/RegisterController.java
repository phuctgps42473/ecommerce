package backend.ecommerce.core.controller;

import backend.ecommerce.core.dto.RegisterFormDTO;
import backend.ecommerce.core.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api")
public class RegisterController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public RegisterController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("register")
    public ResponseEntity<Map<String, String>> registerAccount(@RequestBody RegisterFormDTO registerForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "An account has been created with the provided email, please login instead"));
        }

        if (userService.userWithEmailExists(registerForm.email())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "An account has been created with the provided email, please login instead"));
        }

        String passwordHash = this.passwordEncoder.encode(registerForm.password());

        this.userService.registerUser(new RegisterFormDTO(registerForm.email(), passwordHash));

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
