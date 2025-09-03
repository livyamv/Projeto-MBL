import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://10.89.240.68:3000/projeto_final",
  headers: { accept: "application/json" },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.postCadastro = (usuario) => api.post("/user", usuario);
api.postLogin = (usuario) => api.post("/login", usuario);
api.getbuscarEstabelecimentos = (params) =>
  api.get("/buscar", { params });



export default api;
