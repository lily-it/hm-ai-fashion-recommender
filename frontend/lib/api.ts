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
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

// EXPLORE PAGE SEARCH + FILTERS (✅ FIXED HERE)
export const fetchProducts = async ({
  search,
  category,
  minPrice, // Frontend se camelCase aa raha hai
  maxPrice, // Frontend se camelCase aa raha hai
  min_price, // Legacy support (agar kahin aur se snake_case aaye)
  max_price, // Legacy support
}: any) => {
  try {
    const res = await axios.get(`${API_URL}/products`, {
      params: {
        search,
        category,
        // Backend expects snake_case (min_price), so we map it here
        min_price: minPrice ?? min_price, 
        max_price: maxPrice ?? max_price, 
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error filtered products:", error);
    return [];
  }
};

// ---------------------------------------------
// WISHLIST
// ---------------------------------------------
export const addToWishlist = async (userEmail: string, articleId: string) => {
  try {
    return await axios.post(`${API_URL}/wishlist/add`, {
      user_email: userEmail,   
      article_id: articleId    
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

export const getWishlist = async (userEmail: string) => {
  try {
    const res = await axios.get(`${API_URL}/wishlist/${userEmail}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};

// ---------------------------------------------
// 4. AUTHENTICATION
// ---------------------------------------------

export const registerUser = async (userData: any) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/signup`, userData);
    return res.data;
  } catch (error: any) {
    console.error("Signup Error:", error.response?.data || error.message);
    throw error.response?.data?.detail || "Signup failed";
  }
};

export const loginUser = async (userData: any) => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/login`, userData);
    
    if (res.data.access_token) {
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_id", res.data.user_id);
      
      if (res.data.email) {
        localStorage.setItem("user_email", res.data.email);
      }
    }
    return res.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error.response?.data?.detail || "Login failed";
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_email");
  window.location.href = "/login";
};

// ---------------------------------------------
// 5. USER TRACKING
// ---------------------------------------------
export const trackUserInteraction = async (
  userId: string, 
  articleId: string, 
  type: 'view' | 'add_to_cart' | 'purchase'
) => {
  if (!userId) return; 

  try {
    await axios.post(`${API_URL}/track`, {
      user_id: userId,
      article_id: articleId,
      interaction_type: type
    });
    console.log(`📡 Tracked: ${type} on ${articleId}`);
  } catch (error) {
    console.error("Tracking failed:", error);
  }
};
export const fetchSplitRecommendations = async (articleId: string) => {
  try {
    // Yeh backend ke naye endpoint ko call karega jo humne pichle step mein banaya tha
    const res = await axios.get(`${API_URL}/recommendations/split/${articleId}`);
    return res.data; 
  } catch (error) {
    console.error("Error fetching split recommendations:", error);
    return null; // Null return karenge taaki page.tsx fallback handle kare
  }
};
// frontend/lib/api.ts

// ... (Existing imports) ...

// --- PERMANENT BAG FUNCTIONS ---

// frontend/lib/api.ts

// ... (Existing imports) ...

// --- PERMANENT BAG FUNCTIONS ---

export const addToBagDB = async (userEmail: string, articleId: string, size: string) => {
  try {
    await axios.post(`${API_URL}/bag/add`, {
      user_email: userEmail,
      article_id: articleId,
      size: size
    });
    console.log("✅ Added to DB Bag");
  } catch (error) {
    console.error("Error adding to bag DB:", error);
  }
};

export const fetchBagDB = async (userEmail: string) => {
  try {
    const res = await axios.get(`${API_URL}/bag/${userEmail}`);
    return res.data; // Returns list of products with size
  } catch (error) {
    console.error("Error fetching bag:", error);
    return [];
  }
};

// Alias for consistency with some imports
export const fetchFilteredProducts = fetchProducts;