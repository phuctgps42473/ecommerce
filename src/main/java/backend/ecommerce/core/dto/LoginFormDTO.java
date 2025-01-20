package backend.ecommerce.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record LoginFormDTO(
        @Email
        String email,
        @NotBlank
        String password,
        boolean rememberMe
) {
}
