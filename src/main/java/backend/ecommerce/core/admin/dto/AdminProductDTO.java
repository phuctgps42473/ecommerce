package backend.ecommerce.core.admin.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record AdminProductDTO(
        @Nullable
        Long productId,

        @Nullable
        Long productCategoryId,

        @Size(max = 100)
        String productName,

        @Positive
        Double costPrice,

        @NotNull
        String sku,

        @PositiveOrZero
        Integer stockQuantity,

        String description,

        Double weight
){}
