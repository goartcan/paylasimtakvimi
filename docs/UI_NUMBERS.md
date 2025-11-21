# Paylaşım Takvimi - UI Elementleri Numaralandırması

Bu dokümanda projedeki tüm önemli ekranlar, modallar, paneller, toast mesajları ve dropdown'lar kategorilerine göre gruplandırılmıştır.

---

## 📱 Ana Ekranlar

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 1 | Ana Takvim Sayfası | Sayfa yüklendiğinde gelen ana ekran. Takvim görünümü ve gün detaylarını içerir. |
| 2 | Giriş Ekranı (Login Overlay) | Kullanıcı giriş yapmadığında otomatik açılan modal. E-posta ve şifre ile giriş/kayıt formu. |
| 3 | Kayıt Modu | Giriş ekranında "Kayıt olmak istiyorum" butonuna tıklayınca form kayıt moduna geçer. |
| 27 | Raporlar Ekranı | Üst menüdeki "Raporlar" sekmesine tıklayınca açılan tam sayfa rapor görünümü. |
| 51 | Sekme Navigasyonu | Ana ekranda "Takvim" ve "Raporlar" arasında geçiş yapan sekme butonları. |

---

## 🪟 Modallar ve Popover'lar

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 4 | Gün Detay Modalı (Day Modal) | Takvimde bir güne tıklayınca açılan büyük modal pencere. |
| 5 | Paylaşım Oluştur Formu | Gün modalı içinde "Paylaşım oluştur +" butonuna tıklayınca görünen form bölümü. |
| 6 | Kart Detay/Düzenleme | Takvimde bir paylaşım kartına tıklayınca gün modalı açılır ve form dolu gelir. |
| 7 | Kontrol Modu (Modal Control Section) | Geçmiş tarihli bir paylaşıma tıklayınca, paylaşımın yapılıp yapılmadığını işaretleme bölümü. |
| 8 | Kontrol Edilmiş Durum (Modal Checked Section) | Daha önce "Paylaşıldı" veya "Paylaşılmadı" işaretlenmiş kartların detay görünümü. |
| 13 | Paylaşım Kopyalama Popover'ı | Bir kartta sağ tıklayınca veya kopyala ikonuna tıklayınca açılan hedef tarih seçim penceresi. |
| 15 | Admin Paneli (Admin Overlay) | Admin kullanıcısında görünen "Admin paneli" butonuna tıklayınca açılan tam ekran overlay. |
| 53 | Görev Oluştur/Düzenle Modalı | Görev Panosu'ndaki "+ Görev" butonuna (26) veya bir görev kartına tıklayınca açılan form modalı. |

---

## 📋 Paneller ve Yan Barlar

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 10 | Gün Rengi Açıklamaları Paneli | Gün rengi seçicisinin yanındaki "?" butonuna tıklayınca açılan yardım paneli. |
| 14 | Bildirim Paneli (Notification Panel) | Sağ üst köşedeki 🔔 çan ikonuna tıklayınca açılan dropdown panel. |
| 20 | Gün Detayı Panel (Sağ Yan Panel) | Ana takvim sayfasının sağında "Gün Detayı / Takvim Özeti" başlıklı sabit panel. |
| 25 | Görev Panosu Paneli (Task Board Panel) | Ana sayfanın sağ kısmında yer alan  bölümü  |

---

## 🎨 Dropdown'lar ve Renk Seçiciler

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 9 | Gün Rengi Seçici (Highlight Color Picker) | Gün modalı üst araç çubuğunda "Gün rengi" dropdown'ı. Butona tıklayınca renk paleti açılır. |
| 11 | Kart Rengi Seçici (Entry Color Picker) | Form içinde "Kart rengi Seç" butonuna tıklayınca açılan renk paleti. |
| 42 | Sorumlu Kişi Dropdown | Paylaşım formu içinde "Sorumlu kişi" seçim dropdown'ı. |

---

## 🔽 Filtreler ve Toggle'lar

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 18 | Kanal Filtreleri (Channel Filter) | Ana takvim üzerinde "Kanallar" bölümündeki butonlar (Tümü, Instagram, X, Telegram, vb.). |
| 19 | Görünüm Filtreleri (Assignee Filter) | Ana takvim üzerinde "Görünüm" bölümündeki butonlar (Tüm kartlar / Sadece benim kartlarım). |
| 22 | Takvim Görünüm Toggle (Schedule View Toggle) | Sağ yan panelde "Günlük / Haftalık / Aylık" görünüm seçici butonları. |
| 28 | Rapor Modu Seçici | Raporlar ekranında "Aylık" veya "Tarih aralığı" radio butonları. |
| 31 | Rapor İçerik Görünümü Toggle | Raporlarda "Özet" veya "Paylaşılan içerikler" görünüm değiştirme butonları. |
| 36 | Rapor - Kaçanları Göster Toggle | Paylaşılan içerikler tablosunda "Kaçanları da göster" checkbox'ı. |
| 38 | Tema Değiştir Butonu | Sağ üst köşede "Koyu mod" butonu (tema değiştirir). |

---

## 📊 Rapor Bileşenleri

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 29 | Tarih Aralığı Girdileri | Raporlarda "Tarih aralığı" seçildiğinde görünen başlangıç/bitiş tarih seçicileri. |
| 30 | Hızlı Tarih Aralığı Butonları | Raporlarda tarih aralığı modunda "Son 7/14/30/90 gün" kısayol butonları. |
| 32 | Rapor Özet Görünümü | Raporlarda varsayılan açılan özet istatistikler ve grafikler bölümü. |
| 33 | Rapor - Platform Grafiği | Rapor özet ekranında platforma göre içerik sayısı grafiği (Canvas Chart). |
| 34 | Rapor - Saat Dağılım Grafiği | Rapor özet ekranında saat aralığına göre dağılım grafiği (Canvas Chart). |
| 35 | Rapor - Paylaşılan İçerikler Tablosu | Raporlarda "Paylaşılan içerikler" görünümüne geçildiğinde görünen detaylı tablo. |

---

## ⚙️ Form ve Input Alanları

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 12 | Platform Hızlı Seçim Butonları | Form içinde "Hangi sosyal medya?" bölümünde hızlı seçim butonları (Instagram paketi, Çoklu sosyal, Temizle). |
| 21 | İçerik Arama Kutusu | Sağ yan panelde takvim içeriklerinde arama yapma input alanı. |
| 23 | Sıfırlama Seçenekleri (Reset Options) | Sağ yan panelde "Sıfırla" butonuna tıklayınca açılan 4 seçenekli menü. |
| 24 | Excel Yükleme Bölümü | Sağ yan panelde "Excel yükle" butonu ve ilgili açıklama notu. |
| 41 | Platform Checkbox Listesi | Paylaşım formu içinde tüm sosyal medya platformlarının checkbox listesi (13 adet). |
| 43 | Form İşlem Butonları | Paylaşım formunda "Sil / Temizle / Kaydet" butonları. |

---

## 🔔 Bildirimler ve Mesajlar

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 37 | Toast Bildirimleri (Toast Container) | Sağ alt köşede beliren geçici başarı/hata mesajları. |
| 44 | Kaydedildi Mesajı | Paylaşım formu altında başarılı kayıt sonrası görünen yeşil başarı mesajı. |
| 45 | Geçmişe Dönüş Banner'ı | Geçmiş tarihli bir paylaşımı düzenlerken formun üstünde görünen uyarı banner'ı. |

---

## 👤 Admin Özel Bileşenler

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 16 | Admin - Kullanıcı Yönetimi Sekmesi | Admin paneli açıldığında varsayılan aktif sekme. Kullanıcı listesi ve onay işlemleri. |
| 17 | Admin - Renk Açıklamaları Sekmesi | Admin panelinde "Renk açıklamalarını düzenle" sekmesine tıklayınca açılan form. |
| 46 | Admin Kullanıcı Listesi | Admin panelinde bekleyen/onaylı kullanıcıların gösterildiği dinamik liste. |
| 47 | Bekleyen Kayıt Badge'i | Admin panelinde bekleyen kullanıcı sayısını gösteren "(0 bekleyen kayıt)" etiketi. |
| 48 | Admin - Kendi Takvimi Göster Butonu | Admin panelinde başka bir kullanıcıyı görüntülerken kendi takvime dönme butonu. |
| 49 | Admin - Renk Açıklamaları Form | Admin panelinde tüm renklerin açıklamalarını düzenleme formu. |
| 50 | Admin - Renk Kaydet Butonu | Renk açıklamaları sekmesinde değişiklikleri kaydetme butonu. |
| 52 | Admin Görünüm Bilgisi | Admin bir başka kullanıcının takvimini görüntülerken üstte görünen bilgi mesajı. |

---

## 🔧 Diğer UI Elementleri

| # | Ekran Adı | Kısa Açıklama / Nasıl Açılır |
|---|---|---|
| 26 | Ekleme Butonu | Görev panosu başlığındaki "+ Görev" butonu. |
| 39 | Çıkış Yap Butonu | Sağ üst köşede kullanıcı girişi yaptıktan sonra görünen buton. |
| 40 | Ay Navigasyon Butonları | Takvim başlığındaki sağ/sol ok butonları (önceki/sonraki ay). |

---

## 📊 Özet İstatistikler

- **Toplam UI Elementi:** 53
- **Ana Ekranlar:** 5
- **Modallar ve Popover'lar:** 8
- **Paneller ve Yan Barlar:** 4
- **Dropdown'lar ve Renk Seçiciler:** 3
- **Filtreler ve Toggle'lar:** 7
- **Rapor Bileşenleri:** 6
- **Form ve Input Alanları:** 6
- **Bildirimler ve Mesajlar:** 3
- **Admin Özel Bileşenler:** 8
- **Diğer UI Elementleri:** 3

---

**Not:** Bu dokümanda sadece UI elementleri listelenmiştir. Kod tabanına herhangi bir değişiklik yapılmamıştır.

**Son Güncelleme:** 20 Kasım 2025
