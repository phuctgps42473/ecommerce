package backend.ecommerce.core.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.Set;


@Entity
@Table(name = "users")
@Setter
@Getter
@NoArgsConstructor
public class User extends DomainObject{
    @Column(name = "fullname")
    private String fullname;

    @NotNull
    @Email
    @Size(max = 100)
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String password;

    @NotNull
    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "activation_token")
    private String activationToken;

    @Column(name = "activation_token_expiration_date")
    private LocalDate activationTokenExpirationDate;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiration_date")
    private LocalDate resetDate;

    @Size(max = 10, min = 10)
    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "user_role")
    @Enumerated(EnumType.STRING)
    private UserRole userRole = UserRole.CUSTOMER;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDate createdAt;

    @UpdateTimestamp
    @Column(name = "last_update")
    private LocalDate lastUpdate;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY,orphanRemoval = true)
    private Set<Address> addressList;


    public User(String email, String passwordHash) {
        this.setEmail(email);
        this.setPassword(passwordHash);
    }
}
