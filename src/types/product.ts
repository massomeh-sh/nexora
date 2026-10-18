export interface Category {
    _id: string;
    name: string;
    slug: string;
}

export interface ReviewType {
    comment: string;
    createdAt: string;
    name: string;
    rating: number;
    dislikesCount: number;
    likesCount: number;
    updatedAt: string;
    user: string;
    _id: string;
    userReaction: string;
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

export interface GetAllProductsResponse {
    success: boolean;
    data: Product[];
    pages: number;
    total: number;
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
