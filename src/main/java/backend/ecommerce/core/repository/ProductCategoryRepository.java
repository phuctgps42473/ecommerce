package backend.ecommerce.core.repository;

import backend.ecommerce.core.admin.product.CategoryForProductCreationResponse;
import backend.ecommerce.core.admin.product.CategoryResponse;
import backend.ecommerce.core.domain.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

    @Query("""
            select new backend.ecommerce.core.admin.product.CategoryForProductCreationResponse(pc.id, pc.name) from ProductCategory  pc
            """)
    List<CategoryForProductCreationResponse> findAllCategoriesForProductCreation();

    @Query("""
            select new backend.ecommerce.core.admin.product.CategoryResponse(pc.id, pc.name, pc.slug, pc.description) from ProductCategory  pc
            """)
    List<CategoryResponse> findAllCategories();
}
