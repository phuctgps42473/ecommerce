package backend.ecommerce.core.repository;

import backend.ecommerce.core.admin.product.PropertyResponse;
import backend.ecommerce.core.domain.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    @Query("""
            select p from Property p
            where p.id in (:idList)
            """)
    Set<Property> findAllInIdList(@Param("idList") List<Long> idList);

    @Query("""
            select new backend.ecommerce.core.admin.product.PropertyResponse(p.id, p.productCategory.id, p.propertyName, p.propertyValue)
            from Property p
            where p.productCategory.id = :productCategoryId
            """)
    List<PropertyResponse> findAllPropertiesByProductCategoryId(@Param("productCategoryId") Long productCategoryId);
}
