package backend.ecommerce.sale;

import backend.ecommerce.core.domain.Promotion;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PreviewProductDTO {
    @JsonIgnore
    private Long id;

    private String slug;
    private String name;
    private String image;
    private Double price;

    @JsonIgnoreProperties({"id", "promotionProductList"})
    private Promotion promotion;

    public PreviewProductDTO(Long id, String slug, String name, String image, Double price, Promotion promotion) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.image = image;
        this.price = price;
        this.promotion = promotion;
    }

}
