import axios from "axios";

const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";


export const getAllServices = async () => {
  try {
    const res = await axios.get(`${Backend_URL}/api/services/all`);

    return res.data || []; // returns array of services
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};


export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${Backend_URL}/api/products/all`);

    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array instead of throwing to prevent component crash
    return [];
  }
};

