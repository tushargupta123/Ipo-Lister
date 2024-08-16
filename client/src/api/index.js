import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://ipo-lister-server.vercel.app/api",
    headers: {
        withCredentials: true,
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}}`
    }
});