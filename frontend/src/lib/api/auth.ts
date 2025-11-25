import axios from "axios";

// Ortak axios instance - tüm istekler bu baseURL'i kullanacak
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // cookie tabanlı auth düşünürsen işine yarar, şimdilik kalsın
});

// Backend: POST /auth/login
export async function loginRequest(email: string, password: string) {
  // Burada backend'e login isteği atıyoruz
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  // Backend'in döndürdüğü JSON'u aynen geri veriyoruz
  return response.data;
}