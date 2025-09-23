// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api' // add '/api' if your backend has it
});

export default apiClient;
