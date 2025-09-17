import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://10.89.240.89:3000/projeto_final",
  headers: { accept: "application/json" },
});

// Interceptor para sempre mandar o token (se existir)
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

/*ROTAS DE USUÁRIO*/
api.postCadastro = (usuario) => api.post("/user", usuario);
api.postLogin = (usuario) => api.post("/login", usuario);
api.getAllUsers = () => api.get("/user");
api.updateUser = (dadosUsuario) => api.put("/user", dadosUsuario);
api.deleteUser = (id) => api.delete(`/user/${id}`);

/*ROTAS DE ESTABELECIMENTOS*/
api.getEstabelecimentos = (params) => api.get("/buscar", { params });
api.getEstabelecimentoPorId = (id) => api.get(`/buscar/${id}`);

/*ROTAS DE AVALIAÇÕES*/
api.createAvaliacao = (avaliacao) => api.post("/avaliacoes", avaliacao);
api.getAvaliacoes = (google_place_id) => api.get(`/avaliacoes/${google_place_id}`);
api.updateAvaliacao = (avaliacao) => api.put("/avaliacoes", avaliacao);
api.deleteAvaliacao = (id_avaliacao) => api.delete(`/avaliacoes/${id_avaliacao}`);

/*ROTAS DE FAVORITOS*/
api.addFavorito = (favorito) => api.post("/favoritos", favorito);
api.getFavoritos = () => api.get("/favoritos");
api.removeFavorito = (id_favorito) => api.delete(`/favoritos/${id_favorito}`);

export default api;
