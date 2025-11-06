# Deploy Rehberi

Takvimi ekiple paylaşmadan önce backend ve frontend taraflarını ayrı servislerde barındırabilir, ardından otomatik dağıtım ve doğrulama adımlarını ekleyebilirsin. Aşağıdaki plan Render + Netlify üzerindeki örnek senaryoya göre yazıldı; farklı servisler kullanıyorsan adımları uyarlayabilirsin.

---

## 1. Backend (Render) Adımları

1. **Hazırlık**
   - Repo’yu GitHub/GitLab üzerinde erişilebilir hale getir. Render, doğrudan repo’yu klonlayacak.
   - `.env` dosyanı yerelde hazırla; `JWT_SECRET` için güvenli rastgele değer, `ADMIN_EMAILS` için en az bir admin e-postası, `DATABASE_FILE` için kalıcı dizin belirle (örn. `storage/calendar.db`).

2. **Render’da Servis Oluştur**
   - https://render.com adresinden giriş yap, “New +” → “Web Service” seç.
   - Depoyu seçtikten sonra `Root Directory` alanına `server` yaz; böylece Render sadece backend klasörünü kullanır.
   - Build & start komutları:
     - Build Command: `npm install --omit=dev && npm rebuild better-sqlite3`
     - Start Command: `npm run start` (package.json’daki `node server.js`)
   - Environment sekmesinde Node sürümünü 20.x olacak şekilde ayarla (Render’da `NODE_VERSION` ortam değişkeni olarak da ekleyebilirsin).

3. **Ortam Değişkenleri**
   - `Environment Variables` sekmesinde `.env` değerlerini tek tek gir:
     - `PORT=10000` gibi bir değer verme; Render kendi port’unu `PORT` env olarak gönderir, kodumuz bu değeri kullanıyor.
     - `JWT_SECRET=...`, `ADMIN_EMAILS=ad.soyad@sirket.com`, `DATABASE_FILE=data/calendar.db`.
   - SQLite dosyası için “Advanced” → “Add Disk” diyerek kalıcı disk ekle (ör. `data`, 1 GB); `DATABASE_FILE` yolu bu diskle eşleşmeli (`/var/data/calendar.db` gibi).

4. **Dağıtım**
   - “Create Web Service” de; Render ilk build’i yapar ve URL üretir (`https://paylasimtakvimi.onrender.com` gibi).
   - Deployment başarılı olduğunda `/` endpoint’ini açıp `{"ok":true}` döndüğünü kontrol et.

5. **İlk Kullanıcı Testi**
   - `POST /auth/register` ile admin email’i için istek yaparak hesap oluştur; Render dashboard’undaki “Logs” panelinde hataları izle.
   - `index.html` içerisinde `API_BASE` değerini geçici olarak bu backend URL’sine ayarlayıp tarayıcıdan giriş/Excel yükleme akışını sın.

---

## 2. Frontend (Netlify) Adımları

1. **Hazırlık**
   - `index.html` içindeki `API_BASE` sabitini canlı backend URL’siyle değiştir (örn. `https://paylasimtakvimi.onrender.com`).
   - Uzun vadede farklı ortamları yönetmek için build sistemi düşünüyorsan `API_BASE` değerini bir proje yapılandırmasına taşımayı planla.

2. **Netlify’ya Yükle**
   - https://app.netlify.com → “Add new site” → “Deploy manually”.
   - `index.html`, `goart-logo.png` ve varsa diğer statik dosyaları zipleyip sürükle-bırak yap; Netlify otomatik olarak site URL’si verir.
   - Alternatif: Git tabanlı dağıtım seçersen repo’nun kök dizinini seç ve build komutu olmadan deploy et.

3. **Ayarlar**
   - “Site settings” → “Domain management” kısmından özel alan adı (ör. `takvim.sirket.com`) ekleyebilirsin.
   - CORS için backend tarafında ekstra ayar gerekmez; Express `cors()` varsayılan açık.

4. **Doğrulama**
   - Yayınlanan URL’yi aç, admin hesabıyla giriş yap ve takvim/rapor/Excel sıfırlama akışlarını test et.
   - Tarayıcı konsolunda 40x/50x hatası yoksa bağlantı sağlıklı.

---

## 3. CI/CD ve Otomasyon

1. **GitHub Actions Örneği**
   - Backend için `.github/workflows/backend.yml` benzeri bir dosya oluşturup `render-cli` veya `curl` ile Render deploy tetikleyebilirsin.
   - Frontend için Netlify CLI kullanarak `netlify deploy --prod` komutunu otomatikleştir.

2. **Ortamlar**
   - `main` branch = prod, `develop` branch = staging gibi bir süreç belirle.
   - Staging ortamında testleri tamamladıktan sonra prod’a merge et; Render/Netlify otomatik deploy yapar.

3. **Test Senaryoları**
   - Backend’e Jest veya Supertest ile en azından `/auth/login`, `/calendar` uçlarını doğrulayan smoke testler eklemeyi düşün.
   - Excel içe aktarma için örnek `.xlsx` dosyasıyla manuel senaryo listesi oluştur.

---

## 4. Canlı Sonrası Kontrol Listesi

- [ ] `.env` değerleri üretim için güncellendi (farklı ortamlar için gizli anahtarlar ayrı).
- [ ] Admin hesapları oluşturuldu, parolalar güvenli kanalla paylaşıldı.
- [ ] `DATABASE_FILE` kalıcı disk veya yönetilen veritabanında tutuluyor.
- [ ] Backend URL’si `index.html` içerisindeki `API_BASE` sabitine işlendi.
- [ ] Frontend ve backend HTTPS üzerinden erişilebilir.
- [ ] Günlük/haftalık rapor akışı ve Excel içe aktarma canlı ortamda test edildi.
- [ ] Yedekleme planı belirlendi (en azından SQLite dosyasını düzenli kopyalama).
- [ ] Kullanıcı rehberi ve sorumlu kişiler ekiple paylaşıldı.

Bu dosyayı güncel tutarak ekipte herkesin üretim sürecine hakim olmasını sağlayabilirsin.
