package backend.ecommerce.core.admin.product;

import java.util.List;

public record NewProductRequest(
        long productCategoryId,
        String productBrand,
        String totalStock,
        String productName,
        String productProfileImage,
        String description,
        String dimensionsMM,
        double weight,
        List<Long> propertyIdList,
        List<NewProductVariant> productVariantList
) {
    public record NewProductVariant(
            String name,
            String image,
            double price,
            String sku,
            String gtin,
            double stock
    ) {}
}
