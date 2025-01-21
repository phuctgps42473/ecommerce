package backend.ecommerce.core;

import jakarta.persistence.*;

import java.util.Objects;

@MappedSuperclass
public abstract class DomainObject {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        DomainObject domainObject = (DomainObject) obj;
        if (domainObject.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), domainObject.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }
}
