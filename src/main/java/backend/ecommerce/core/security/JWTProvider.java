package backend.ecommerce.core.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JWTProvider {
    private static final Logger log = LoggerFactory.getLogger(JWTProvider.class);

    public final long ACCESS_TOKEN_EXPIRES_IN_SECONDS = 1800;
    public final long REFRESH_TOKEN_EXPIRES_IN_SECONDS = 604800;
    public final long REFRESH_TOKEN_EXPIRES_IN_SECONDS_FOR_REMEMBER_ME = 2592000;

    @Value("${jwt.access-token-secret}")
    private String accessTokenSecret;

    @Value("${jwt.refresh-token-secret}")
    private String refreshTokenSecret;

    private SecretKey accessKey, refreshKey;

    @PostConstruct
    public void init() {
        accessKey = Keys.hmacShaKeyFor(accessTokenSecret.getBytes());
        refreshKey = Keys.hmacShaKeyFor(refreshTokenSecret.getBytes());
    }

    public boolean validateRefreshToken(String refreshToken) {
        try {
            parseClaims(refreshToken, TokenType.REFRESH_TOKEN);
            return true;
        } catch (Exception ex) {
            return false;

        }
    }


    public boolean validateAccessToken(String accessToken) {
        try {
            parseClaims(accessToken,TokenType.ACCESS_TOKEN);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public String createAccessToken(Authentication authentication) {
        long now = (new Date()).getTime();
        Date validity = new Date(now + ACCESS_TOKEN_EXPIRES_IN_SECONDS * 1000);

        String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(authentication.getName())
                .claim("role", authorities)
                .issuedAt(new Date())
                .signWith(accessKey)
                .expiration(validity)
                .compact();
    }

    public String createRefreshToken(Authentication authentication, boolean rememberMe) {
        long now = (new Date()).getTime();
        Date validity = new Date(now + (getRefreshTokenValidity(rememberMe)));

        return Jwts.builder()
                .subject(authentication.getName())
                .issuedAt(new Date())
                .signWith(refreshKey)
                .expiration(validity)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        try {
            Claims claims = parseClaims(token, TokenType.ACCESS_TOKEN);
            List<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("role").toString().split(",")).map(SimpleGrantedAuthority::new).toList();

            User principal = new User(claims.getSubject(), "", authorities);

            return new UsernamePasswordAuthenticationToken(principal, token, authorities);
        } catch (Exception ex) {
            log.error("Get authentication error: ", ex);
            return null;
        }
    }

    public Claims parseClaims(String token, TokenType tokenType) {
        if (tokenType.equals(TokenType.ACCESS_TOKEN)) {
            return Jwts.parser().verifyWith(accessKey).build().parseSignedClaims(token).getPayload();
        } else {
            return Jwts.parser().verifyWith(refreshKey).build().parseSignedClaims(token).getPayload();
        }
    }

    public long getRefreshTokenValidity(boolean rememberMe) {
        if (rememberMe) {
            return REFRESH_TOKEN_EXPIRES_IN_SECONDS_FOR_REMEMBER_ME * 1000;
        } else {
            return REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000;
        }
    }

}
