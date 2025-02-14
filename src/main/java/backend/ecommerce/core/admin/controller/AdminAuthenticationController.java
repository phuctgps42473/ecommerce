package backend.ecommerce.core.admin.controller;

import backend.ecommerce.core.domain.UserRole;
import backend.ecommerce.core.dto.LoginFormDTO;
import backend.ecommerce.core.dto.TokensResponse;
import backend.ecommerce.core.security.JWTProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminAuthenticationController {
    private static final Logger log = LoggerFactory.getLogger(AdminAuthenticationController.class);
    private final AuthenticationManager authenticationManager;
    private final JWTProvider jwtProvider;

    public AdminAuthenticationController(AuthenticationConfiguration authenticationConfiguration, JWTProvider jwtProvider) throws Exception {
        this.authenticationManager = authenticationConfiguration.getAuthenticationManager();
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/api/admin/authenticate")
    public ResponseEntity<TokensResponse> login(@RequestBody LoginFormDTO loginForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginForm.email(), loginForm.password());

        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority(UserRole.ADMIN.name()))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtProvider.createAccessToken(authentication);
            String refreshToken = jwtProvider.createRefreshToken(authentication, loginForm.rememberMe());
            long refreshTokenExpiresInSecond = jwtProvider.getRefreshTokenValidity(loginForm.rememberMe());

            return ResponseEntity.ok(new TokensResponse(accessToken, refreshToken, refreshTokenExpiresInSecond));
        } catch (BadCredentialsException ex) {
            log.warn("Error during authenticate for email {}", loginForm.email(), ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
