import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// ✅ This is the correct way to export it as the default
export default apiClient;