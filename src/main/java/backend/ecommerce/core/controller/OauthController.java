package backend.ecommerce.core.controller;

import backend.ecommerce.core.domain.User;
import backend.ecommerce.core.dto.TokensResponse;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.security.JWTProvider;
import backend.ecommerce.core.service.UserService;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;


record GoogleTokenExchangeResponse(@JsonProperty("id_token") String idToken) {
}

record CodeGrantRequestBody(String code) {
}

@Slf4j
@RestController
@RequestMapping("api/oauth/code_grant")
public class OauthController {
    private final UserService userService;
    private final JWTProvider jwtProvider;

    @Value("${google.client-id}")
    private String clientId;
    @Value("${google.client-secret}")
    private String clientSecret;
    @Value("${google.redirect-uri}")
    private String redirectUri;

    public OauthController(UserService userService, JWTProvider jwtProvider) {
        this.userService = userService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("google")
    public ResponseEntity<TokensResponse> handleGoogleCodeExchange(@RequestBody CodeGrantRequestBody reqBody, HttpServletResponse res) {
        String code = reqBody.code();

        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();


        RestTemplate template = new RestTemplate();

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("code", URLDecoder.decode(code, StandardCharsets.UTF_8));
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(params, null);

        try {
            GoogleTokenExchangeResponse idTokenResponse = template.postForObject("https://oauth2.googleapis.com/token", req, GoogleTokenExchangeResponse.class);
            if (idTokenResponse == null) {
                return ResponseEntity.badRequest().build();
            }

            Jwt jwt = jwtDecoder.decode(idTokenResponse.idToken());
            String email = jwt.getClaim("email");

            User user;
            try {
                user = this.userService.getUserByEmail(email);
            } catch (ResourceNotFoundException ex) {
                log.info("Email {} does not exists in database, create new User", email);
                String name = jwt.getClaim("name");
                String imageUrl = jwt.getClaim("picture");

                user = new User();
                user.setEmail(email);
                user.setEmailVerified(true);
                user.setFullname(name);
                user.setImageUrl(imageUrl);

                this.userService.createUser(user);
            }

            Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), null, List.of(new SimpleGrantedAuthority(user.getUserRole().name())));

            res.setContentType("application/json");
            String accessToken = this.jwtProvider.createAccessToken(authentication);
            String refreshToken = this.jwtProvider.createRefreshToken(authentication, false);

            return ResponseEntity.ok(new TokensResponse(accessToken, refreshToken, this.jwtProvider.REFRESH_TOKEN_EXPIRES_IN_SECONDS));

        } catch (RestClientException ex) {
            return ResponseEntity.badRequest().build();
        }
    }

}
