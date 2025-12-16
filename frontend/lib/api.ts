import axios from "axios";

// ---------------------------------------------
// 1. DEFINE & EXPORT TYPES
// ---------------------------------------------
export interface Product {
  article_id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  score?: number;
}

// ---------------------------------------------
// 2. CONFIGURATION
// ---------------------------------------------
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------------------------------------------
// 3. API FUNCTIONS
// ---------------------------------------------

// HOMEPAGE APIS
export const fetchRecommendations = async (customerId: string) => {
  try {
    const res = await axios.get(`${API_URL}/recommendations/${customerId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

export const fetchTrending = async () => {
  try {
    const res = await axios.get(`${API_URL}/trending`);
    return res.data;
  } catch (error) {
    console.error("Error fetching trending:", error);
    return [];
  }
};

// PRODUCT DETAIL PAGE APIS
export const fetchProductById = async (articleId: string) => {
  try {
    const res = await axios.get(`${API_URL}/products/${articleId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const fetchSimilarItems = async (articleId: string) => {
  try {
    const res = await axios.get(`${API_URL}/similar-items/${articleId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching similar items:", error);
    return [];
  }
};

export const trackView = async (customerId: string, articleId: string) => {
  try {
    return await axios.post(`${API_URL}/track/view/${customerId}/${articleId}`);
  } catch (error) {
    console.error("Error tracking view:", error);
  }
};

// EXPLORE PAGE SEARCH + FILTERS
export const fetchProducts = async ({
  search,
  category,
  min_price,
  max_price,
}: any) => {
  try {
    const res = await axios.get(`${API_URL}/products`, {
      params: {
        search,
        category,
        min_price,
        max_price,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return [];
  }
};

// WISHLIST
export const addToWishlist = async (customerId: string, articleId: string) => {
  try {
     return await axios.post(`${API_URL}/wishlist/add/${customerId}/${articleId}`);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

export const getWishlist = async (customerId: string) => {
  try {
    const res = await axios.get(`${API_URL}/wishlist/${customerId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

// ✅ FIX: Export alias so 'fetchFilteredProducts' works too

export const fetchFilteredProducts = fetchProducts;
