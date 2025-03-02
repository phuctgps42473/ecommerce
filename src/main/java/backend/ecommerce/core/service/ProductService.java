package backend.ecommerce.core.service;

import backend.ecommerce.core.domain.*;
import backend.ecommerce.core.exception.ResourceNotFoundException;
import backend.ecommerce.core.repository.ProductRepository;
import backend.ecommerce.core.repository.PromotionRepository;
import backend.ecommerce.sale.PreviewProductDTO;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final PromotionRepository promotionRepository;

    public ProductService(ProductRepository productRepository, PromotionRepository promotionRepository) {
        this.productRepository = productRepository;
        this.promotionRepository = promotionRepository;
    }

    /// return the on sale with largest promotion
    public Page<PreviewProductDTO> getOnSaleProducts(Pageable pageable) {
        Page<Product> list = this.productRepository.findAllHavePromotions(pageable);
        return list.map(p -> {
            Promotion pm = p
                    .getPromotionProductList()
                    .stream().map(PromotionProduct::getPromotion)
                    .max(Comparator.comparingDouble(Promotion::getPromotionValue)).orElse(null);
            Double price = p.getProductVariantList().stream().min(Comparator.comparingDouble(ProductVariant::getPrice)).orElseThrow(() -> new RuntimeException("NO PRICE???")).getPrice();
            return new PreviewProductDTO(p.getId(), p.getSlug(), p.getProductName(), p.getProductProfileImage(), price, pm);
        });
    }

    public Page<PreviewProductDTO> getHotProducts(Pageable pageable) {
        LocalDateTime last30Days = LocalDate.now().minusDays(30).atStartOfDay();
        Page<Product> list = this.productRepository.findAllByMostOrdered(last30Days, pageable);
        return list.map(p -> {
            Promotion pm = p
                    .getPromotionProductList()
                    .stream().map(PromotionProduct::getPromotion)
                    .max(Comparator.comparingDouble(Promotion::getPromotionValue)).orElse(null);
            Double price = p.getProductVariantList().stream().min(Comparator.comparingDouble(ProductVariant::getPrice)).orElseThrow(() -> new RuntimeException("NO PRICE???")).getPrice();
            return new PreviewProductDTO(p.getId(), p.getSlug(), p.getProductName(), p.getProductProfileImage(), price, pm);
        });
    }


    public Page<PreviewProductDTO> getNewArrivals(Pageable pageable) {
        LocalDate last15days = LocalDate.now().minusDays(15);
        Page<Product> list = this.productRepository.findAllAddedAfter(last15days, pageable);
        return list.map(p -> {
            Promotion pm = p
                    .getPromotionProductList()
                    .stream().map(PromotionProduct::getPromotion)
                    .max(Comparator.comparingDouble(Promotion::getPromotionValue)).orElse(null);
            Double price = p.getProductVariantList().stream().min(Comparator.comparingDouble(ProductVariant::getPrice)).orElseThrow(() -> new RuntimeException("NO PRICE???")).getPrice();
            return new PreviewProductDTO(p.getId(), p.getSlug(), p.getProductName(), p.getProductProfileImage(), price, pm);
        });
    }

    public Page<PreviewProductDTO> getProductsByCategorySlug(String categorySlug, Pageable pageable) {
        Page<Product> list = this.productRepository.findAllByCategorySlug(categorySlug, pageable);
        return list.map(p -> {
            Promotion pm = p
                    .getPromotionProductList()
                    .stream().map(PromotionProduct::getPromotion)
                    .max(Comparator.comparingDouble(Promotion::getPromotionValue)).orElse(null);
            Double price = p.getProductVariantList().stream().min(Comparator.comparingDouble(ProductVariant::getPrice)).orElseThrow(() -> new RuntimeException("NO PRICE???")).getPrice();
            return new PreviewProductDTO(p.getId(), p.getSlug(), p.getProductName(), p.getProductProfileImage(), price, pm);
        });
    }

    public Page<PreviewProductDTO> getProductsFromTheSameBrandAsProductId(String brand, Long productId, Pageable pageable) {
        Page<Product> list = this.productRepository.findAllByBrandExceptProductId(brand, productId, pageable);
        return list.map(p -> {
            Promotion pm = p
                    .getPromotionProductList()
                    .stream().map(PromotionProduct::getPromotion)
                    .max(Comparator.comparingDouble(Promotion::getPromotionValue)).orElse(null);
            Double price = p.getProductVariantList().stream().min(Comparator.comparingDouble(ProductVariant::getPrice)).orElseThrow(() -> new RuntimeException("NO PRICE???")).getPrice();
            return new PreviewProductDTO(p.getId(), p.getSlug(), p.getProductName(), p.getProductProfileImage(), price, pm);
        });

    }

    public Product getProductBySlug(String slug) {
        return this.productRepository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("No Product found with slug: " + slug));
    }
}



