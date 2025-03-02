package backend.ecommerce.core.controller;

import backend.ecommerce.core.dto.ApiResponse;
import backend.ecommerce.core.dto.UserInfoDTO;
import backend.ecommerce.core.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserInfoDTO>> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(
                new ApiResponse<>(
                        ApiResponse.ResponseStatus.success,
                        200,
                        this.userService.getUserInfoDTOByEmail(email)
                )
        );
    }

}
