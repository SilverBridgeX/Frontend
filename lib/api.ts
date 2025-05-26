// lib/api.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://15.165.15.178', 
  timeout: 10000,
});

export default instance;
