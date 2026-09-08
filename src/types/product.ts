export interface Category {
    _id: string;
    name: string;
    slug: string;
}

export interface Product {
    _id: string;
    name: string;
    brand: string;
    category: Category;
    discountPercent: number;
    discountPrice: number;
    images: string[];
    numReviews: number;
    price: number;
    rating: number;
    stock: number;
    unit: string;
}

export interface GetDealProductsResponse {
    success: boolean;
    data: Product[];
    count: number;
}