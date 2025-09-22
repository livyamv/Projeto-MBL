import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://10.89.240.68:3000/projeto_final",
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

/* ROTAS DE USUÁRIO */
api.postCadastro = (usuario) => api.post("/user", usuario);
api.postLogin = (usuario) => api.post("/login", usuario);
api.getUsuarioById = (id) => api.get(`/user/${id}`);
api.getAllUsers = () => api.get("/user");
api.updateUser = (dadosUsuario) => api.put("/user", dadosUsuario);
api.deleteUser = (id) => api.delete(`/user/${id}`);
// Atualizar usuário com imagem (FormData)
api.updateUserWithImage = (formData) =>
  api.put("/user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* ROTAS DE ESTABELECIMENTOS */
api.getEstabelecimentos = (params) => api.get("/buscar", { params });
api.getEstabelecimentoPorId = (id) => api.get(`/buscar/${id}`);

/* ROTAS DE AVALIAÇÕES */
api.createAvaliacao = (avaliacao) => api.post("/avaliacao", avaliacao); // <- singular
api.getAvaliacoes = (google_place_id) =>
  api.get(`/avaliacoes/${google_place_id}`);
api.updateAvaliacao = (avaliacao) => api.put("/avaliacao", avaliacao);
api.deleteAvaliacao = (id_avaliacao) => api.delete(`/${id_avaliacao}`); // <- igual backend

/* ROTAS DE FAVORITOS */
api.addFavorito = (favorito) => api.post("/favoritos", favorito);
api.getFavoritos = () => api.get("/favoritos");
api.removeFavorito = (id_favorito) => api.delete(`/favoritos/${id_favorito}`);

export default api;
