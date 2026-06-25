import axios from "axios";

// Endereço base da Navalha API. Pode ser sobrescrito criando um arquivo
// .env com VITE_API_URL=http://seu-host:porta/api
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5089/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Anexa o token JWT (quando existir) em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("navalha_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
