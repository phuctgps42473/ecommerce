package backend.ecommerce.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "product_variant_medias")
public class ProductVariantMedia extends DomainObject {
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", length = 30)
    private MediaType mediaType;

    @Column(name = "media_url", length = 255)
    private String mediaUrl;

    @Column(name = "is_hidden")
    private boolean isHidden = false;

    @CreationTimestamp
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    public enum MediaType {
        IMAGE, VIDEO, AUDIO
    }
}
