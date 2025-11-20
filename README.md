# 📅 Paylaşım Takvimi

> **Takımınızın sosyal medya ve içerik planlarını tek bir takvimde yönetin!**

Modern, kullanıcı dostu bir web tabanlı içerik takvimi uygulaması. Ekip üyeleri kendi paylaşımlarını planlayabilir, görevler atayabilir ve tüm takım aktivitelerini tek bir yerden takip edebilir.

---

## 🤖 AI-First Geliştirme

> **⚡ Bu proje tamamen AI-first metodolojisi ile geliştiriliyor!**  
> Tüm kod değişiklikleri, özellik geliştirmeleri ve bug fix'ler **Cursor AI + Claude Sonnet 4.5** (duruma göre Claude Sonnet Thinking) ile yapılıyor. Geleneksel kodlama süreçleri yerine AI-destekli pair programming yaklaşımı kullanılıyor.

---

## 🚀 Özellikler

- ✅ **Aylık Takvim Görünümü** - Tüm paylaşımları bir bakışta görün
- ✅ **Kullanıcı Rolleri** - Admin, Moderator ve Normal kullanıcı yetkileri
- ✅ **Excel Import/Export** - Toplu veri aktarımı
- ✅ **Gerçek Zamanlı Güncelleme** - Anlık takvim senkronizasyonu
- ✅ **Responsive Tasarım** - Mobil, tablet ve masaüstü uyumlu
- ✅ **Dark/Light Mode** - Göz dostu tema desteği
- ✅ **Offline Storage** - LocalStorage ile çevrimdışı çalışma

---

## 🛠️ Kullanılan Teknolojiler

### Frontend (İstemci Tarafı)
- **HTML5** - Semantic markup
- **CSS3** - Modern styling, Flexbox & Grid
- **Vanilla JavaScript** (ES6+) - Framework'siz, saf JavaScript
- **LocalStorage API** - Tarayıcı tabanlı veri saklama
- **Fetch API** - Backend iletişimi

### Backend (Sunucu Tarafı)
- **Node.js** (v20+)
- **Express.js** - RESTful API
- **SQLite** (better-sqlite3) - Veritabanı
- **JWT** - Kimlik doğrulama
- **bcrypt** - Şifre hashleme

### Geliştirme Araçları
- **Cursor AI** - AI-powered code editor
- **Claude Sonnet 4.5** - AI pair programming assistant
- **Git** - Version control

---

## 📦 Kurulum ve Çalıştırma

### Ön Gereksinimler
- Node.js v20 veya üzeri
- Modern bir web tarayıcı (Chrome, Firefox, Safari, Edge)
- Live Server eklentisi (opsiyonel, geliştirme için)

### Backend Kurulumu

```bash
# 1. Proje dizinine gidin
cd paylasimtakvimi

# 2. Backend klasörüne gidin
cd server

# 3. Bağımlılıkları yükleyin
npm install

# 4. Ortam değişkenlerini ayarlayın
# .env dosyası oluşturun ve gerekli değerleri girin
# (PORT, JWT_SECRET, ADMIN_EMAILS, DATABASE_FILE)

# 5. Sunucuyu başlatın
npm start
# Varsayılan olarak http://localhost:4000 adresinde çalışır
```

### Frontend Çalıştırma

**Seçenek 1: Live Server ile (Önerilen)**
1. VS Code'da Live Server eklentisini yükleyin
2. `index.html` dosyasına sağ tıklayın
3. "Open with Live Server" seçeneğini tıklayın
4. Tarayıcıda otomatik olarak açılır (genellikle `http://127.0.0.1:5500`)

**Seçenek 2: Doğrudan Tarayıcıda**
1. `index.html` dosyasını çift tıklayarak tarayıcıda açın
2. ⚠️ Not: Bu yöntemde bazı özellikler (CORS, LocalStorage) sınırlı çalışabilir

**Seçenek 3: Python HTTP Server**
```bash
# Proje kök dizininde
python3 -m http.server 8000
# http://localhost:8000 adresinden erişin
```

---

## 📁 Proje Yapısı

```
paylasimtakvimi/
│
├── index.html              # Ana uygulama dosyası (Frontend - 8800+ satır)
├── goart-logo.png          # Logo dosyası
├── README.md               # Bu dosya
├── _headers                # Netlify/Vercel header yapılandırması
│
├── docs/                   # Dokümantasyon
│   ├── DEPLOY.md          # Deployment rehberi
│   └── UI_NUMBERS.md      # UI metrikleri ve tasarım detayları
│
├── eeg-viewer/            # EEG Viewer ek modülü
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── server/                # Backend API
    ├── server.js          # Express server
    ├── db.js              # SQLite veritabanı
    ├── package.json       # Dependencies
    ├── middleware/        # Auth middleware
    │   └── auth.js
    └── routes/            # API endpoints
        ├── auth.js        # Login/Register
        ├── calendar.js    # Takvim işlemleri
        ├── import.js      # Excel import/export
        └── users.js       # Kullanıcı yönetimi
```

---

## 🎯 Kullanım

1. **İlk Giriş**: Backend başlatıldıktan sonra frontend'i açın
2. **Kayıt Olun**: Email ve şifre ile yeni kullanıcı oluşturun
3. **Admin Onayı**: Admin kullanıcı tarafından onaylanmanız gerekir
4. **Takvimi Görüntüleyin**: Ana sayfada aylık takvim görünümü açılır
5. **Paylaşım Ekleyin**: "+" butonuna tıklayarak yeni etkinlik oluşturun
6. **Excel İle Toplu Ekleme**: Admin panelinden Excel dosyası yükleyin

---

## 🔐 Kullanıcı Rolleri

| Role | Yetkiler |
|------|----------|
| **👤 Normal User** | Kendi paylaşımlarını görüntüleme/düzenleme |
| **🛡️ Moderator** | Tüm paylaşımları görüntüleme/düzenleme |
| **👑 Admin** | Tam yetki: Kullanıcı yönetimi, Excel import/export, sistem ayarları |

---

## 🧪 Test Adımları

### Manuel Test Checklist

1. **Giriş/Çıkış Testi**
   - [ ] Kayıt olma işlemi çalışıyor mu?
   - [ ] Login başarılı oluyor mu?
   - [ ] Token localStorage'a kaydediliyor mu?

2. **Takvim Görünümü**
   - [ ] Güncel ay doğru gösteriliyor mu?
   - [ ] Önceki/sonraki ay navigasyonu çalışıyor mu?
   - [ ] Paylaşımlar doğru günlerde görünüyor mu?

3. **Paylaşım İşlemleri**
   - [ ] Yeni paylaşım ekleme çalışıyor mu?
   - [ ] Mevcut paylaşım düzenleme çalışıyor mu?
   - [ ] Paylaşım silme çalışıyor mu?

4. **Excel Import/Export**
   - [ ] Excel dosyası yükleme başarılı mı?
   - [ ] Dışa aktarma doğru veri içeriyor mu?

5. **Responsive Tasarım**
   - [ ] Mobil görünüm düzgün mü?
   - [ ] Tablet görünüm çalışıyor mu?

---

## 🌐 Canlıya Alma (Deployment)

### Frontend Deployment
- **Netlify** / **Vercel** / **GitHub Pages** gibi static hosting servisleri
- `index.html` dosyası ve varlıkları yükleyin
- `API_BASE` değişkenini production backend URL'sine güncelleyin

### Backend Deployment
- **Render** / **Railway** / **Fly.io** / **DigitalOcean** gibi Node.js hosting
- Ortam değişkenlerini (`.env`) platform üzerinde ayarlayın
- SQLite için kalıcı volume/disk yapılandırması yapın
- CORS ayarlarını frontend domain'i için açın

Detaylı deployment rehberi için `docs/DEPLOY.md` dosyasına bakın.

---

## 🤝 Katkıda Bulunma

Bu proje AI-first metodolojisi ile geliştirildiği için, katkılar da benzer bir yaklaşımla yapılmalıdır:

1. Cursor AI kullanarak kod değişikliklerini yapın
2. Her değişiklikte "Demir Kurallar"a uyun (workspace rules)
3. Pull request açın ve AI ile yapılan değişiklikleri açıklayın

---

## 📝 Lisans

Bu proje özel kullanım için geliştirilmiştir.

---

## 📞 İletişim ve Destek

Sorularınız için proje sahibi ile iletişime geçin.

---

## 🎨 Tasarım Felsefesi

- **Minimalist** - Gereksiz öğeler yok, sadece ihtiyaç duyulanlar
- **Kullanıcı Odaklı** - Kolay öğrenilebilir, sezgisel arayüz
- **Performanslı** - Hızlı yükleme, düşük memory kullanımı
- **Güvenli** - XSS koruması, input validation, JWT auth

---

<div align="center">

**⚡ Powered by AI • Built with ❤️ using Vanilla JavaScript**

*Cursor AI + Claude Sonnet 4.5 ile geliştirilmiştir*

</div>
