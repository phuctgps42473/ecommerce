package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_addresses")
@Setter
@Getter
@NoArgsConstructor
public class Address extends DomainObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "province")
    private String province;

    @Column(name = "district")
    private String district;

    @Column(name = "ward")
    private String ward;

    @Column(name = "specific_address")
    private String specificAddress;
}
