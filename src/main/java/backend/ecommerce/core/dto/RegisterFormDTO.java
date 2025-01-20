package backend.ecommerce.core.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterFormDTO(@Email String email, @NotBlank String password) {
}
