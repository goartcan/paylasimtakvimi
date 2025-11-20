# 🚀 Netlify Deployment Rehberi

## ✅ Tamamlanan Hazırlıklar

1. **netlify.toml** dosyası oluşturuldu (Netlify yapılandırması)
2. **.gitignore** dosyası güncellendi (node_modules, .env, .db dosyaları ignore edildi)
3. Tüm değişiklikler GitHub'a push edildi

## 📋 Netlify'a Deploy Adımları

### Yöntem 1: Netlify Dashboard (Önerilen - En Kolay)

1. **Netlify'a Giriş Yapın**
   - https://app.netlify.com adresine gidin
   - GitHub hesabınızla giriş yapın

2. **Yeni Site Ekleyin**
   - "Add new site" butonuna tıklayın
   - "Import an existing project" seçeneğini seçin

3. **GitHub Repository Seçin**
   - "GitHub" butonuna tıklayın
   - `goartcan/paylasimtakvimi` repository'sini seçin
   - Netlify'a repo erişim izni verin (eğer istenirse)

4. **Deploy Ayarları (Otomatik Algılanacak)**
   - **Branch to deploy:** `main`
   - **Build command:** (boş bırakın - Vanilla JS, build yok)
   - **Publish directory:** `.` (kök dizin)
   - **netlify.toml** dosyası otomatik algılanacak

5. **Deploy Başlatın**
   - "Deploy site" butonuna tıklayın
   - Netlify otomatik olarak deploy işlemini başlatacak
   - 1-2 dakika içinde siteniz yayında olacak

6. **Site URL'ini Alın**
   - Deploy tamamlandığında Netlify size rastgele bir URL verecek
   - Örnek: `https://random-name-123456.netlify.app`
   - İsterseniz özel domain ekleyebilirsiniz

---

### Yöntem 2: Netlify CLI (Terminal ile)

```bash
# 1. Netlify CLI'yi yükleyin (ilk sefer)
npm install -g netlify-cli

# 2. Netlify'a giriş yapın
netlify login

# 3. Proje dizinine gidin
cd /Users/huseyin.gul/Desktop/paylasimtakvimi

# 4. Site'i initialize edin
netlify init

# 5. GitHub repo'sunu bağlayın ve deploy edin
# CLI size adım adım sorular soracak:
# - Create & configure a new site? → Yes
# - Team → Kendi team'inizi seçin
# - Site name → istediğiniz ismi girin (opsiyonel)
# - Build command → (boş bırakın)
# - Publish directory → . (nokta)

# 6. Deploy tamamlandığında URL'iniz gösterilecek
```

---

## ⚙️ Netlify Ortam Değişkenleri (Environment Variables)

Netlify Dashboard'da → Site Settings → Environment Variables:

```
# Backend API URL (Eğer backend Render'da vs. deploy edilmişse)
API_BASE_URL=https://your-backend-api.onrender.com

# Diğer gerekli environment variables
# (Şu an frontend'de doğrudan kullanılmıyor, ama ileride gerekebilir)
```

---

## 🔐 Güvenlik Ayarları

### _headers Dosyası (Zaten Mevcut)
`_headers` dosyasında aşağıdaki güvenlik başlıkları ayarlanmış:
- ✅ X-Frame-Options: DENY (Clickjacking koruması)
- ✅ X-Content-Type-Options: nosniff (MIME sniffing koruması)
- ✅ Content-Security-Policy (XSS koruması)
- ✅ Referrer-Policy

### netlify.toml Ayarları (Zaten Mevcut)
- ✅ SPA routing redirect'leri
- ✅ 404 handling
- ✅ Security headers

---

## 📱 Deploy Sonrası Kontroller

### 1. Frontend Kontrolü
- [ ] Ana sayfa açılıyor mu?
- [ ] Login sayfası çalışıyor mu?
- [ ] Takvim görünümü render oluyor mu?
- [ ] CSS ve JavaScript dosyaları yükleniyor mu?

### 2. API Bağlantısı
- [ ] Backend API'ye bağlanabiliyor mu?
- [ ] CORS hatası var mı?
- [ ] Login işlemi başarılı mı?

### 3. Responsive Test
- [ ] Mobil görünüm düzgün mü?
- [ ] Tablet görünümü çalışıyor mu?
- [ ] Desktop görünümü OK mi?

---

## 🔄 Otomatik Deploy (Continuous Deployment)

Netlify artık GitHub repo'nuzu izliyor:
- ✅ Her `git push origin main` yaptığınızda **otomatik deploy** olacak
- ✅ Her commit için ayrı preview URL oluşturulacak
- ✅ Deploy loglarını Netlify Dashboard'dan takip edebilirsiniz

---

## 🌐 Özel Domain Ekleme (Opsiyonel)

1. Netlify Dashboard → Site Settings → Domain Management
2. "Add custom domain" butonuna tıklayın
3. Domain'inizi girin (örn: `paylasimtakvimi.com`)
4. DNS kayıtlarını Netlify'ın verdiği şekilde ayarlayın
5. SSL sertifikası otomatik olarak sağlanacak (Let's Encrypt)

---

## 🐛 Yaygın Sorunlar ve Çözümler

### Sorun 1: "Page Not Found" Hatası
**Çözüm:** `netlify.toml` dosyasında redirect kuralı var, deploy'dan sonra düzelmeli.

### Sorun 2: API Bağlantı Hatası
**Çözüm:** 
- Backend URL'ini kontrol edin
- CORS ayarlarını backend'de kontrol edin
- Backend'in çalıştığından emin olun

### Sorun 3: CSS/JS Yüklenmiyor
**Çözüm:**
- index.html'deki path'leri kontrol edin
- Relative path'ler (`./` veya `/`) kullanıldığından emin olun

### Sorun 4: Build Hatası
**Çözüm:**
- Netlify build log'larını inceleyin
- `netlify.toml` ayarlarını kontrol edin

---

## 📊 Deploy Bilgileri

- **Repository:** https://github.com/goartcan/paylasimtakvimi
- **Branch:** main
- **Build Command:** (yok - Vanilla JS)
- **Publish Directory:** `.` (root)
- **Framework:** None (Vanilla JavaScript)

---

## 🎉 Deploy Tamamlandı!

Siteniniz artık canlıda! Netlify size bir URL verdi:
- Production URL: `https://your-site-name.netlify.app`
- Deploy durumunu kontrol edin: https://app.netlify.com

### Sonraki Adımlar:
1. Backend'i de deploy edin (Render, Railway, Fly.io)
2. Backend URL'ini frontend'de güncelleyin
3. CORS ayarlarını backend'de yapın
4. Test edin ve ekip arkadaşlarınızla paylaşın!

---

**🚀 İyi Çalışmalar!**

