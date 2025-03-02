package backend.ecommerce.core.utils;

import io.minio.MinioClient;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MinioProvider {
    private MinioClient minioClient;

    public MinioProvider(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    public void uploadImages() {
    }
}
