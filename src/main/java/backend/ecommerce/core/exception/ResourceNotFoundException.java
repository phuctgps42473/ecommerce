package backend.ecommerce.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    private static final String DEFAULT_MESSAGE = "Cannot found the requested resources";

    public ResourceNotFoundException(String message) {
    }

    public ResourceNotFoundException() {
        super(DEFAULT_MESSAGE);
    }

    public ResourceNotFoundException(String entityName, long id) {
        super("Cannot find resource " + entityName + " with id " + id);
    }
}
