package backend.ecommerce.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Max;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ProductCategoryDTO(@Max(50) String name, @Max(500) String description) {}
