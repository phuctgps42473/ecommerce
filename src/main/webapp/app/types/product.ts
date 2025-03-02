import { Pageable, SortInfo } from "./common";

export type PreviewProduct = {
  slug: string;
  name: string;
  image: string | null;
  price: number;
  promotion: Promotion | null;
};

export type PageResponse<T> = {
  content: Array<T>;
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  empty: boolean;
};

export type Product = {
  id: number;
  productBrand: string;
  totalStock: number;
  productName: string;
  dimensionsMM: string;
  weight: number;
  slug: string;
  productProfileImage: string;
  description: string;
  promotionProductList: PromotionProduct[];
  productVariantList: ProductVariant[];
  productPropertyList: ProductProperty[];
};

export type PromotionProduct = {
  promotion: Promotion;
};

export type ProductProperty = {
  property: Property;
};

export type Promotion = {
  id: number,
  name: string;
  startDate: string;
  endDate: string;
  promotionType: "PERCENTAGE" | "FIXED_AMOUNT";
  promotionValue: number;
};

export type Property = {
  propertyName: string;
  propertyValue: string;
}

export type ProductVariant = {
  id: number;
  name: string;
  sku: string;
  gtin: string;
  image: string;
  price: number;
  stock: number;
};
