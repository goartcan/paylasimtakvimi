# ⚡ 3 Dakikada Netlify Deploy

## 🚀 Kod GitHub'da Hazır!

Repository: https://github.com/goartcan/paylasimtakvimi

---

## 📱 Şimdi Yapılacaklar (3 Adım):

### 1️⃣ Netlify'a Git
**Link:** https://app.netlify.com

- GitHub hesabınla giriş yap

### 2️⃣ Import Et
- **"Add new site"** butonuna tıkla
- **"Import an existing project"** seç
- **GitHub** seç
- **`goartcan/paylasimtakvimi`** repository'sini bul ve seç

### 3️⃣ Deploy!
Ayarlar şöyle görünecek (netlify.toml otomatik algılıyor):

```
Branch to deploy: main
Build command: (boş - otomatik)
Publish directory: . (nokta - kök dizin)
```

**"Deploy site"** butonuna bas → BİTTİ! 🎉

---

## ✅ 1-2 Dakikada Deploy Olacak

Netlify size bir URL verecek:
```
https://paylasimtakvimi-XXXXX.netlify.app
```

Bu URL'i ekip arkadaşlarınla paylaşabilirsin!

---

## 🔧 Önemli Not: Backend URL

Deploy'dan sonra **index.html** dosyasında backend URL'ini kontrol et:

```javascript
// index.html içinde şu satırı bul:
const API_BASE = 'https://paylasimtakvimi.onrender.com';
```

Eğer backend farklı bir yerdeyse bu URL'i güncelle ve tekrar push et.

---

## 🔄 Bundan Sonra

Her `git push origin main` yaptığında Netlify **otomatik deploy** edecek!

---

**⚡ Hadi başla!** → https://app.netlify.com

