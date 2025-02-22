package backend.ecommerce.core.exception;

public class InvalidQuantityException extends RuntimeException {
    public static final String DEFAULT_MESSAGE = "Invalid quantity";

    public InvalidQuantityException() {
        super(DEFAULT_MESSAGE);
    }

    public InvalidQuantityException(String message) {
        super(message);
    }
}
