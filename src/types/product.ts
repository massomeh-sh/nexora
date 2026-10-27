export interface ReviewType {
    authorName: string;
    comment: string;
    createdAt: string;
    rating: number;
    dislikesCount: number;
    likesCount: number;
    updatedAt: string;
    _id: string;
    userReaction: string;
}

export interface Category {
    created_at: string;
    image: string;
    name: string;
    parent: string;
    slug: string;
    updatedAt: string;
    _id: string;
}


export interface ProductVariant {
    colorHex: string;
    colorName: string;
    images: string[];
    stock: number;
    _id: string;
}

export interface Product {
    _id: string;
    name: string;
    brand: string;
    category: Category;
    discountPercent: number;
    discountPrice: number;
    description: string;
    shortDescription: string;
    images: string[];
    numReviews: number;
    reviews: ReviewType[];
    price: number;
    rating: number;
    stock: number;
    inStock: boolean;
    unit: string;
    quantity: number;
    createdAt: string;
    variants: ProductVariant[];
    selectedVariantId: string;
}


export interface GetDealProductsResponse {
    success: boolean;
    data: Product[];
    count: number;
}


export interface ProductInfo {
    name: string;
    value: string | number | boolean;
}

export interface ProductFeature {
    id: string;
    title: string;
}


export interface ReactData {
    likesCount: number;
    dislikesCount: number;
    userReaction: "like" | "dislike";
}


export interface GetProductByIdResponse {
    success: boolean;
    data: Product;
}


export interface BreadCrumbPath {
    name: string;
    slug: string;
}

export interface GetAllProductsResponse {
    success: boolean;
    data: Product[];
    categoryPath: BreadCrumbPath[];
    page: number;
    pages: number;
    total: number;
    isFallback: boolean;
}

export interface ReactToProductCommentProps {
    id: string;
    reviewId: string;
    type: "like" | "dislike";
}

export interface ReactToCommentResponse {
    success: boolean;
    data: ReactData;
}

export type ReactTypes = "like" | "dislike";
export type ReviewSortType = "top" | "oldest" | "newest";

export interface ReviewSortOption {
    id: number;
    title: string;
    target: ReviewSortType;
}


export interface ProductsQuery {
    keyword: string;
    minPrice: string;
    maxPrice: string;
    rating: string;
    category: string;
    page: string;
    sort: string;
    limit: string;
}


export interface CategoriesData {
    name: string;
    parent: string | null;
    slug: string;
    _id: string;
}

export interface GetCategoriesResponse {
    success: boolean;
    data: CategoriesData[];
    count: number;
}

export interface CreateProductReviewProps {
    productId: string;
    rating: number;
    comment: string;
    isAnonymous: boolean;
}


export interface CreateProductReviewResponse {
    success: boolean;
    message: string;
}