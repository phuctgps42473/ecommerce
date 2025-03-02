package backend.ecommerce.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private ResponseStatus status;
    private int code;
    private T data;
    private T error;

    public ApiResponse(ResponseStatus status, int code, T content) {
        this.setStatus(status);
        this.setCode(code);
        if (status.equals(ResponseStatus.success)) {
            this.setData(content);
        } else {
            this.setError(content);
        }
    }

    public ApiResponse(String status, int code, T content) {
        this.setStatus(ResponseStatus.valueOf(status));
        this.setCode(code);
        if (ResponseStatus.valueOf(status).equals(ResponseStatus.success)) {
            this.setData(content);
        } else {
            this.setError(content);
        }
    }

    public static <T> ApiResponse<T> success(int code, T content) {
        return new ApiResponse<>("success", code, content);
    }

    public static <T> ApiResponse<T> success(HttpStatus code, T content) {
        return new ApiResponse<>("success", code.value(), content);
    }

    public static <T> ApiResponse<T> success(int code) {
        return new ApiResponse<>("success", code, null);
    }

    public static <T> ApiResponse<T> success(HttpStatus code) {
        return new ApiResponse<>("success", code.value(), null);
    }

    public static <T> ApiResponse<T> error(int code, T error) {
        return new ApiResponse<>("error", code, error);
    }

    public static <T> ApiResponse<T> error(HttpStatus code, T error) {
        return new ApiResponse<>("error", code.value(), error);
    }

    public static <T> ApiResponse<T> error(int code) {
        return new ApiResponse<>("error", code, null);
    }

    public static <T> ApiResponse<T> error(HttpStatus code) {
        return new ApiResponse<>("error", code.value(), null);
    }
    public enum ResponseStatus {
        success, error
    }
}
