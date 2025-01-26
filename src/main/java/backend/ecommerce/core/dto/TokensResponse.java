package backend.ecommerce.core.dto;

public record TokensResponse(
        String accessToken,
        String refreshToken,
        long refreshTokenExpiresInSecond
) {
}
