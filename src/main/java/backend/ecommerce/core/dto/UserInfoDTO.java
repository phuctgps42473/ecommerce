package backend.ecommerce.core.dto;

public record UserInfoDTO(
        String fullname,
        String email,
        String phoneNumber,
        String imageUrl
) {
}
