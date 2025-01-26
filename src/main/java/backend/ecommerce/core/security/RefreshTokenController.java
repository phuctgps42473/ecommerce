package backend.ecommerce.core.security;

import backend.ecommerce.core.dto.TokensResponse;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@RestController
public class RefreshTokenController {
    private final DomainUserDetailsService userDetailsService;
    private final JWTProvider jwtProvider;

    public RefreshTokenController(JWTProvider jwtProvider, DomainUserDetailsService userDetailsService) {
        this.jwtProvider = jwtProvider;
        this.userDetailsService = userDetailsService;
    }

    @GetMapping("/api/refresh-token")
    public ResponseEntity<Object> handleRefreshToken(@RequestHeader("X-Refresh-Token") String refreshToken) {
        try {
            Claims claims = this.jwtProvider.parseClaims(refreshToken, TokenType.REFRESH_TOKEN);

            Date iat = claims.getIssuedAt();
            Date exp = claims.getExpiration();

            long diff = exp.getTime() - iat.getTime();
            long seconds = TimeUnit.SECONDS.convert(diff, TimeUnit.MILLISECONDS);

            boolean rememberMe = seconds > jwtProvider.REFRESH_TOKEN_EXPIRES_IN_SECONDS + 10000; // Hard code for fun

            String email = claims.getSubject();
            UserDetails principal = this.userDetailsService.loadUserByUsername(email);
            Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

            String newAccessToken = this.jwtProvider.createAccessToken(authentication);
            String newRefreshToken = this.jwtProvider.createRefreshToken(authentication, rememberMe);

            return ResponseEntity.ok(new TokensResponse(newAccessToken, newRefreshToken, rememberMe ? jwtProvider.REFRESH_TOKEN_EXPIRES_IN_SECONDS_FOR_REMEMBER_ME : jwtProvider.REFRESH_TOKEN_EXPIRES_IN_SECONDS));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


}
