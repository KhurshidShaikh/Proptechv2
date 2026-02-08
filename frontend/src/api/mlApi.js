import axios from "axios";

const mlApi = axios.create({
    baseURL: import.meta.env.VITE_ML_API_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Predict property price and get market comparison
 * @param {string} region - Property region/city
 * @param {number} bhk - Number of bedrooms
 * @param {number} userPrice - User's asking price (in Lakhs)
 */
export const predictPrice = async (region, bhk, userPrice) => {
    try {
        const response = await mlApi.post("/predict_price", {
            region,
            bhk,
            user_price: userPrice,
        });
        return response.data;
    } catch (error) {
        console.error("Price prediction error:", error);
        throw error;
    }
};

/**
 * Get property recommendations based on searched regions
 * @param {string[]} searchedRegions - Array of region names
 */
export const getRecommendations = async (searchedRegions) => {
    try {
        const response = await mlApi.post("/recommend_properties", {
            searched_regions: searchedRegions,
        });
        return response.data;
    } catch (error) {
        console.error("Recommendations error:", error);
        throw error;
    }
};

export default mlApi;
