import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

// ✅ This is the correct way to export it as the default
export default apiClient;