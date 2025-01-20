package backend.ecommerce;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {
    @ResponseStatus(code = HttpStatus.ACCEPTED)
    @GetMapping("health-check")
    public void healthCheck() {
    }

}
