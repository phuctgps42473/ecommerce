package backend.ecommerce.core.security;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

@Service
public class JWTCookieService {
    private JWTProvider tokenProvider;

    public JWTCookieService(JWTProvider jwtProvider) {
        this.tokenProvider = jwtProvider;
    }

    public ResponseCookie buildLoginJwtCookie(boolean rememberMe) {
        String jwt = tokenProvider.createFreshToken(SecurityContextHolder.getContext().getAuthentication(), rememberMe);
        Duration duration = Duration.of(tokenProvider.getRefreshTokenValidity(rememberMe), ChronoUnit.MILLIS);
        return buildJWTCookie(jwt, duration);
    }

    public ResponseCookie buildLogoutJwtCookie() {
        return buildJWTCookie("", Duration.ZERO);
    }

    private ResponseCookie buildJWTCookie(String jwt, Duration duration) {
        return ResponseCookie
                .from(JWTFilter.JWT_NAME, jwt)
                .httpOnly(true)
                .sameSite("Lax")
                .path("/")
                .maxAge(duration)
                .build();
    }
}
