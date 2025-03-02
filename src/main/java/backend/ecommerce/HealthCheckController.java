package backend.ecommerce;

import backend.ecommerce.core.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthCheckController {
    @ResponseStatus(code = HttpStatus.ACCEPTED)
    @GetMapping("/api/public/health-check")
    public ResponseEntity<ApiResponse<Object>> healthCheck() {
        return ResponseEntity.ok(new ApiResponse<>("success", 200, Map.of("Hello", "Worlds")));
    }

}
