package backend.ecommerce.core.controller;

import backend.ecommerce.core.dto.LoginFormDTO;
import backend.ecommerce.core.security.JWTCookieService;
import backend.ecommerce.core.security.JWTProvider;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("api")
public class AuthenticateController {
    private static final Logger log = LoggerFactory.getLogger(AuthenticateController.class);

    private final AuthenticationManager authenticationManager;
    private final JWTCookieService jwtCookieService;
    private final JWTProvider jwtProvider;

    public AuthenticateController(AuthenticationConfiguration authenticationConfiguration, JWTCookieService jwtCookieService, JWTProvider jwtProvider) throws Exception {
        this.authenticationManager = authenticationConfiguration.getAuthenticationManager();
        this.jwtCookieService = jwtCookieService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("authenticate")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginFormDTO loginForm, BindingResult bindingResult, HttpServletResponse res) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginForm.email(), loginForm.password());

        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            ResponseCookie responseCookie = jwtCookieService.buildLoginJwtCookie(loginForm.rememberMe());
            res.setHeader(HttpHeaders.COOKIE, responseCookie.toString());
            return ResponseEntity.ok(Map.of("access_token", jwtProvider.createAccessToken(authentication)));
        } catch (BadCredentialsException ex) {
            log.warn("Error during authenticate for email {}", loginForm.email(), ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
