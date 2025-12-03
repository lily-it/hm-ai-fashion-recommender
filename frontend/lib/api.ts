import axios from "axios";
import type { Product } from "@/lib/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------------------------------------
// HOMEPAGE APIS
// ---------------------------------------------
export const fetchRecommendations = async (customerId: string) => {
  const res = await axios.get(`${API_URL}/recommendations/${customerId}`);
  return res.data;
};

export const fetchTrending = async () => {
  const res = await axios.get(`${API_URL}/trending`);
  return res.data;
};

// ---------------------------------------------
// PRODUCT DETAIL PAGE APIS
// ---------------------------------------------
export const fetchProductById = async (articleId: string) => {
  const res = await axios.get(`${API_URL}/products/${articleId}`);
  return res.data;
};

// ✅ FIXED ENDPOINT HERE
export const fetchSimilarItems = async (articleId: string) => {
  const res = await axios.get(`${API_URL}/similar-items/${articleId}`);
  return res.data;
};

export const trackView = async (articleId: string) => {
  return axios.post(`${API_URL}/track-view/${articleId}`);
};

// ---------------------------------------------
// EXPLORE PAGE SEARCH + FILTERS
// ---------------------------------------------
export const fetchFilteredProducts = async ({
  search,
  category,
  minPrice,
  maxPrice,
}: any) => {
  const res = await axios.get(`${API_URL}/products`, {
    params: {
      search,
      category,
      min_price: minPrice,
      max_price: maxPrice,
    },
  });
  return res.data;
};

// ---------------------------------------------
// WISHLIST
// ---------------------------------------------
export const addToWishlist = async (customerId: string, articleId: string) => {
  return axios.post(`${API_URL}/wishlist/add/${customerId}/${articleId}`);
};

export const getWishlist = async (customerId: string) => {
  const res = await axios.get(`${API_URL}/wishlist/${customerId}`);
  return res.data;
};
