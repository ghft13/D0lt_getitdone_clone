import axios from "axios";

 const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";


export const getAllServices = async () => {
  try {
    const res = await axios.get(`${Backend_URL}/api/services/all`);
 
    return res.data; // returns array of services
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${Backend_URL}/api/products/all`);
    
  return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
