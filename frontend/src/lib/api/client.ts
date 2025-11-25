import axios from "axios";

// localStorage'dan token'ı okuyan yardımcı fonksiyon
function getStoredToken(): string | null {
  return localStorage.getItem("pt_token");
}

// Ortak Axios instance - tüm API istekleri bu client üzerinden yapılacak
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000, // 15 saniye timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Her istekten önce token'ı header'a ekliyoruz
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    // Token varsa Authorization header'ını ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => {
    // İstek oluşturulurken hata olursa logla ve fırlat
    console.error("[apiClient] İstek oluşturma hatası:", error);
    return Promise.reject(error);
  }
);

// Her yanıtta hata kontrolü yapıyoruz
apiClient.interceptors.response.use(
  (response) => {
    // Başarılı yanıtları olduğu gibi döndür
    return response;
  },
  (error: unknown) => {
    // Hata durumunda logla ve fırlat (çağıran yer yakalayabilsin)
    console.error("[apiClient] API yanıt hatası:", error);
    return Promise.reject(error);
  }
);

export default apiClient;

// TEST ADIMLARI:
// 1) Projeyi `npm run dev` ile çalıştır → Terminalde hata olmamalı.
// 2) Login sürecinde Network tab'ında yapılan isteklerde `Authorization: Bearer ...` header'ı görünüyor mu? (pt_token varsa)
// 3) pt_token'ı localStorage'dan silip sayfayı yenile → Yeni isteklerde Authorization header'ı gönderilmemeli.
// 4) DevTools Console'da kırmızı hata olmamalı.

