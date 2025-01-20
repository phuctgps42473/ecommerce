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

    private final long ACCESS_TOKEN_EXPIRES_IN_SECONDS = 1800;
    private final long REFRESH_TOKEN_EXPIRES_IN_SECONDS = 86400;
    private final long REFRESH_TOKEN_EXPIRES_IN_SECONDS_FOR_REMEMBER_ME = 2592000;

    @Value("${JWT_SECRET_BASE64}")
    private String JWT_SECRET_BASE64;
    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(JWT_SECRET_BASE64.getBytes());
    }

    private boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception ex) {
            log.trace("Parse token failed", ex);
            return false;
        }
    }

    public String createAccessToken(Authentication authentication) {
        long now = (new Date()).getTime();
        Date validity = new Date(now + ACCESS_TOKEN_EXPIRES_IN_SECONDS * 1000);

        String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(authentication.getName())
                .claim("auth", authorities)
                .issuedAt(new Date())
                .signWith(key)
                .expiration(validity)
                .compact();
    }

    public String createFreshToken(Authentication authentication, boolean rememberMe) {
        long now = (new Date()).getTime();
        Date validity = new Date(now + (getRefreshTokenValidity(rememberMe)));

        String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(authentication.getName())
                .claim("auth", authorities)
                .issuedAt(new Date())
                .signWith(key)
                .expiration(validity)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);

        List<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(",")).map(SimpleGrantedAuthority::new).toList();

        User principal = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public long getRefreshTokenValidity(boolean rememberMe) {
        if (rememberMe) {
            return REFRESH_TOKEN_EXPIRES_IN_SECONDS_FOR_REMEMBER_ME * 1000;
        } else {
            return REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000;
        }
    }

}
