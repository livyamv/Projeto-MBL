import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://10.89.240.68:3000/projeto_final",
  headers: { accept: "application/json" },
});

// Interceptor para enviar o token JWT em todas as requisições
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

<<<<<<< HEAD
/* ========================= ROTAS DE USUÁRIO ========================= */
=======
/* ROTAS DE USUÁRIO */
>>>>>>> 367a0a56777f8a194259779357d9d6e76cd32132
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

<<<<<<< HEAD
/* ===================== ROTAS DE ESTABELECIMENTOS ===================== */
api.getEstabelecimentos = (params) => api.get("/buscar", { params });
api.getEstabelecimentoPorId = (id) => api.get(`/buscar/${id}`);

/* ======================== ROTAS DE AVALIAÇÕES ======================== */
// Criar avaliação (usuário logado)
api.createAvaliacao = (avaliacao) => api.post("/avaliacao", avaliacao);

// Listar avaliações por local (sem autenticação)
api.getAvaliacoesPorLocal = (google_place_id) =>
  api.get(`/avaliacoes/${google_place_id}`);

// Listar avaliações do usuário logado (rota protegida)
api.getAvaliacoesUsuario = () => api.get("/avaliacao");

// Atualizar avaliação
api.updateAvaliacao = (avaliacao) => api.put("/avaliacao", avaliacao);

// Deletar avaliação
api.deleteAvaliacao = (id_avaliacao) => api.delete(`/avaliacao/${id_avaliacao}`);

/* ========================= ROTAS DE FAVORITOS ========================= */
api.addFavorito = (favorito) => api.post("/favoritos", favorito);
=======
/* ROTAS DE ESTABELECIMENTOS */
api.getEstabelecimentos = (params) => api.get("/buscar", { params });
api.getEstabelecimentoPorId = (id) => api.get(`/buscar/${id}`);

/* ROTAS DE AVALIAÇÕES */
api.createAvaliacao = (avaliacao) => api.post("/avaliacao", avaliacao);
api.getAvaliacoes = (google_place_id) =>
  api.get(`/avaliacoes/${google_place_id}`);
api.updateAvaliacao = (avaliacao) => api.put("/avaliacao", avaliacao);
api.deleteAvaliacao = (id_avaliacao) => api.delete(`/avaliacao/${id_avaliacao}`);

/* ROTAS DE FAVORITOS */
// Adicionar favorito
api.addFavorito = (favorito) => api.post("/favoritos", favorito);

// Remover favorito
>>>>>>> 367a0a56777f8a194259779357d9d6e76cd32132
api.removeFavorito = (id_favorito) => api.delete(`/favoritos/${id_favorito}`);

api.getFavoritos = async () => {
  const userId = await SecureStore.getItemAsync("userId");
  const response = await api.get(`/favoritos/${userId}`);
  return response.data.favoritos;
};

<<<<<<< HEAD
=======

>>>>>>> 367a0a56777f8a194259779357d9d6e76cd32132
export default api;
