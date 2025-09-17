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

/*ROTAS DE USUÁRIO*/
api.postCadastro = (usuario) => api.post("/user", usuario);
api.postLogin = (usuario) => api.post("/login", usuario);
api.getAllUsers = () => api.get("/user");
api.updateUser = (dadosUsuario) => api.put("/user", dadosUsuario);
api.deleteUser = (id) => api.delete(`/user/${id}`);

/*ROTAS DE ESTABELECIMENTOS*/
// Buscar lista de estabelecimentos
api.getEstabelecimentos = (params) => api.get("/buscar", { params });

// Buscar detalhes por place_id
api.getEstabelecimentoPorId = (id) => api.get(`/buscar/${id}`);

/*ROTAS DE AVALIAÇÕES*/
// Criar avaliação
api.createAvaliacao = (avaliacao) => api.post("/avaliacao", avaliacao);

// Listar avaliações por google_place_id
api.getAvaliacoes = (google_place_id) => api.get(`/${google_place_id}`);

// Atualizar avaliação
api.updateAvaliacao = (avaliacao) => api.put("/avaliacao", avaliacao);

// Deletar avaliação
api.deleteAvaliacao = (id) => api.delete(`/${id}`);

export default api;
