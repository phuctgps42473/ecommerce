package backend.ecommerce.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ProductCategoryDTO(Long id, @Size(max = 100) String name, @Size(max = 500) String description) {
}
