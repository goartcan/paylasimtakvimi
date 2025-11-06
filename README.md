# Paylaşım Takvimi

Takımın sosyal medya ve içerik planlarını ortak bir takvimde takip etmesi için hazırlanmış web uygulaması.  
Ön yüz tarayıcıda çalışan tek sayfalık bir arayüz (`index.html`), arka plan servisleri ise Node.js/Express ile yazılmıştır (`server/` klasörü).

## 1. Hızlı Başlangıç (Yerel)

```bash
# 1) Depoyu klonla
git clone <repo-url>
cd paylasimtakvimi

# 2) Ortam değişkenlerini hazırla
cp .env.example .env
# .env içindeki değerleri ihtiyacına göre düzenle

# 3) Backend bağımlılıklarını yükle
cd server
npm install

# 4) Backend'i çalıştır
npm start   # varsayılan olarak http://localhost:4000
```

Ön yüz için ekstra derleme gerekmiyor; `index.html` dosyasını tarayıcıda açman yeterli.  
Yerelde test ederken `index.html` içindeki `API_BASE` sabiti varsayılan `http://localhost:4000` değerini kullanır.

## 2. Ortam Değişkenleri

Aşağıdaki değerleri `.env` dosyanda tanımlayabilirsin:

| Değişken       | Açıklama                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------- |
| `PORT`         | Express sunucusunun dinleyeceği port. Varsayılan `4000`.                                  |
| `JWT_SECRET`   | Oturum token'larının imzalanması için gizli anahtar. Üretimde rastgele, uzun bir değer olmalı. |
| `ADMIN_EMAILS` | Virgül ile ayrılmış admin email listesi. Bu email'ler kayıt olduğunda otomatik onaylanır. |
| `DATABASE_FILE`| SQLite dosyasının tam ya da göreli yolu. Verilmezse sistemin geçici klasöründe saklanır.  |

> **Not:** Üretimde kalıcı depolama için `DATABASE_FILE` ayarlaman önerilir (ör. `storage/calendar.db`).

## 3. Proje Yapısı

```
paylasimtakvimi/
├── index.html        # Tek sayfalık arayüz ve tüm istemci mantığı
├── goart-logo.png
└── server/
    ├── server.js     # Express uygulaması ve HTTP sunucusu
    ├── db.js         # SQLite bağlantısı, tablo başlangıçları
    ├── middleware/   # Kimlik doğrulama (requireAuth, requireAdmin)
    ├── routes/       # auth, calendar, import, users API uçları
    └── package.json  # Backend bağımlılıkları ve npm scriptleri
```

## 4. Canlıya Alma Yol Haritası

1. **Yapılandırma**  
   - `.env` dosyasını üretim değerleri ile doldur (özellikle `JWT_SECRET`, `ADMIN_EMAILS`, `DATABASE_FILE`).  
   - Admin kullanıcıları önceden belirleyip parolalarını paylaş.

2. **Backend Dağıtımı**  
   - Node.js destekli bir platform seç (Render, Railway, Fly.io, DigitalOcean App Platform vb.).  
   - `server` klasörünü deploy et, `.env` değerlerini platformda tanımla.  
   - Kalıcı dosya depolaması gerekir; SQLite kullanıyorsan `DATABASE_FILE` yolu için volume/persistent disk ayarla ya da yönetilen bir PostgreSQL servis planla.  
   - CORS’a izin verilmesi gereken alan adlarını belirt (`app.use(cors())` varsayılan olarak açık).

3. **Frontend Yayını**  
   - Basit senaryo: `index.html` ve varlıkları statik hosting'e koy (Netlify, Vercel, GitHub Pages).  
   - Yayınladığın ortam için `index.html` içindeki `API_BASE` sabitini backend URL’sine güncelle; otomatikleştirmek istersen build adımında ortam değişkeni kullan.

4. **Alan Adı & SSL**  
   - Şirket alan adında alt alan (örn. `takvim.sirket.com`) belirle ve frontend hosting’e yönlendir.  
  - Backend için de HTTPS destekli bir alan adı kullan; gerekirse ters proxy (Cloudflare, Nginx) kur.

5. **CI/CD & Test**  
   - GitHub Actions vb. ile `server` ve frontend için ayrı deploy iş akışları oluştur.  
   - Excel içe aktarma, admin sıfırlama, giriş akışı için manuel test senaryolarını dökümante et.  
   - Gerektiğinde otomatik testler (ör. Jest ile API testleri) ekle.

6. **Ekip Onboarding**  
   - Kullanıcı rolleri, giriş, Excel yükleme, sıfırlama süreci için kısa bir “kullanıcı kılavuzu” oluştur.  
   - Günlük/haftalık rapor formatını (“Yapılanlar, Sorunlar, Kararlar, Açık Sorular, Testler, Nasıl yönlendirildim, Sonraki adımlar”) ekibin erişebileceği şekilde paylaş.

## 5. Yararlı NPM Komutları

`server` klasöründe:

- `npm start` – Express sunucusunu çalıştırır.  
- `npm run dev` – (Varsa) Nodemon ile geliştirme modunda çalıştırır.  
- `npm install --production` – Üretim dağıtımı için yalnızca runtime bağımlılıklarını kurar.

## 6. Sorular / Destek

Takıldığın adım olursa kodun yanına açıklama satırları bırakabilir veya README’de ek notlar açabilirsin. Live ortama geçmeden önce, özellikle veri saklama (SQLite path) ve admin parolalarının güvenliğini iki kez kontrol etmeyi unutma.  

Hazırlık planının sonraki adımlarını birlikte yürütmek istersen haber ver.
