# 🧠 EEG Brainwave Animation Viewer

MindMonitor uygulamasından alınan Muse EEG CSV dosyalarını görselleştiren interaktif web uygulaması.

## ✨ Yeni Özellikler (v2.1)

### ⭐ Ortalama Kanal
- **4 kanalın ortalaması**: TP9, AF7, AF8, TP10 kanallarının ortalamasını hesaplar
- **Genel beyin aktivitesi**: Tüm beyin bölgelerinin ortalama durumunu gösterir
- **Hem single hem multi-band**: Her iki modda da kullanılabilir

### 🌈 Multi-Band Modu
- **Tek seferde 5 dalgayı görüntüleme**: Seçili kanal için tüm beyin dalgalarını (Delta, Theta, Alpha, Beta, Gamma) aynı grafikte gösterir
- **Teknik analiz tarzı görünüm**: Her dalga kendi renginde, sade line chart
- **Dinamik legend**: 5 bandın tümü kolayca ayırt edilebilir

### 📊 Kayan Pencere Animasyonu
- **Sliding window**: Son 300 örneği gösterir, eski veriler sürekli kayar
- **Canlı grafik**: Teknik analiz sitelerindeki gibi gerçek zamanlı görünüm
- **Sabit pencere boyutu**: Grafik her zaman okunabilir kalır

## 🎯 Tüm Özellikler

- ✅ CSV dosyası yükleme
- ✅ **YENİ:** Ortalama kanal (4 kanalın ortalaması)
- ✅ **YENİ:** Multi-band modu (5 dalga bir arada)
- ✅ Single-band modu (tek dalga)
- ✅ Kanal seçimi (TP9, AF7, AF8, TP10, Ortalama)
- ✅ **YENİ:** Kayan pencere animasyonu (300 örnek)
- ✅ Oynat/Duraklat/Sıfırla kontrolleri
- ✅ Ayarlanabilir animasyon hızı (1x-10x)
- ✅ Dark tema modern UI
- ✅ Responsive tasarım

## 📁 Dosya Yapısı

```
eeg-viewer/
├── index.html          # Ana HTML (multi-band seçeneği eklendi)
├── style.css           # Stil dosyası (dark tema)
├── script.js           # JavaScript mantığı (yenilenmiş)
└── README.md           # Bu dosya
```

## 🚀 Kullanım

### 1. Projeyi Açın
- `index.html` dosyasını herhangi bir modern tarayıcıda açın

### 2. CSV Dosyası Yükleyin
- "CSV Dosyası Yükle" butonuna tıklayın
- MindMonitor'dan aldığınız `.csv` dosyasını seçin

### 3. Mod Seçin

#### ⭐ Ortalama Kanal (En Önerilen)
1. **Kanal** dropdown'ından **"⭐ Ortalama (4 Kanal)"** seçin
2. Bu mod 4 fiziksel kanalın (TP9, AF7, AF8, TP10) ortalamasını hesaplar
3. Genel beyin aktivitesini görmek için idealdir
4. Hem single-band hem multi-band modunda kullanılabilir

#### 🌈 Multi-Band Modu (Önerilen)
1. **Beyin Dalgası** dropdown'ından **"🌈 Tümü"** seçin
2. **Kanal** dropdown'ından bir kanal seçin (Ortalama/TP9/AF7/AF8/TP10)
3. Seçili kanal için 5 dalga (Delta, Theta, Alpha, Beta, Gamma) aynı grafikte gösterilir
4. Her dalga kendi renginde görünür:
   - **Delta**: Kırmızı
   - **Theta**: Turuncu
   - **Alpha**: Mavi
   - **Beta**: Yeşil
   - **Gamma**: Mor

#### 📈 Single-Band Modu
1. **Beyin Dalgası** dropdown'ından tek bir dalga seçin (Delta/Theta/Alpha/Beta/Gamma)
2. **Kanal** dropdown'ından bir kanal seçin (Ortalama/TP9/AF7/AF8/TP10)
3. Sadece seçilen dalga gösterilir

### 4. Animasyonu Başlatın
- "▶ Oynat" butonuna basın
- **Çizgiler yavaşça çizilmeye başlar** (sıfırdan)
- Animasyon hızını slider ile ayarlayın:
  - **0.1x** = Çok çok yavaş (her saniyede 1 nokta)
  - **0.5x** = Çok yavaş (varsayılan)
  - **1x** = Yavaş
  - **5x** = Orta hızlı
  - **10x** = Hızlı
  - **20x** = Çok hızlı
- İsterseniz "⏸ Duraklat" veya "⟲ Sıfırla" butonlarını kullanın

**Not:** Animasyon her zaman boş grafikten başlar ve çizgiler pürüzsüz şekilde çizilir.

## 📊 Animasyon Detayları

### Kalem Gibi Çizim Mantığı
```
X ve Y eksenleri SABİT (baştan sona açık)
┌─────────────────────────────────────┐
│ Y │                                 │
│   │                                 │
│   │                                 │
│   │ ●━━━━━━━━●                      │ ← Çizgi yavaşça ilerliyor
│   │           (●) ← Renkli nokta    │ ← Çizginin ucu
│   │                                 │
│   └─────────────────────────────→ X │
└─────────────────────────────────────┘
```

**Animasyon Davranışı:**
- ✅ **Sabit eksenler**: X (0 → tüm örnekler) ve Y eksenleri baştan belli
- ✅ **Kalem çizimi**: Her frame'de 1 nokta eklenir, çizgi uzar
- ✅ **Renkli nokta**: Her çizginin ucunda kendi renginde nokta (●)
- ✅ **Hafif yumuşatma**: `tension: 0.25` (doğal + pürüzsüz denge)
- ✅ **Yuvarlatılmış çizgiler**: Round joins/caps (keskin köşeler yok)
- ✅ **Hız kontrolü**: 0.1x (çok yavaş) - 20x (çok hızlı)
- ✅ **Interval**: 100ms / hız (örn: 0.5x = 200ms, 10x = 10ms)
- ✅ **Grafik zoom yapmaz**: Tüm alan baştan görünür, çizgiler çizilir

### Multi-Band Renk Kodları

| Dalga | Frekans | Renk | Hex | Anlamı |
|-------|---------|------|-----|--------|
| **Delta** | 0.5-4 Hz | 🔴 Kırmızı | #f56565 | Derin uyku |
| **Theta** | 4-8 Hz | 🟠 Turuncu | #ed8936 | Meditasyon |
| **Alpha** | 8-13 Hz | 🔵 Mavi | #4299e1 | Rahatlama |
| **Beta** | 13-30 Hz | 🟢 Yeşil | #48bb78 | Konsantrasyon |
| **Gamma** | 30-100 Hz | 🟣 Mor | #9f7aea | Yüksek kognitif |

### Ortalama Kanal Hesaplama

```javascript
// Her örnek için 4 kanalın ortalaması
Average = (TP9 + AF7 + AF8 + TP10) / 4

// En az 3 geçerli kanal değeri gereklidir
// Örnek: Eğer bir kanal eksikse, kalan 3'ün ortalaması alınır
```

## 🛠️ Teknik Detaylar

### Yeni Fonksiyonlar

#### `parseCsv(text, band, channel)`
- **Single-band**: `{times: [], values: []}`
- **Multi-band**: `{times: [], valuesByBand: {Delta: [], Theta: [], ...}}`
- Otomatik mod tespiti (band === 'All')
- Tüm bandler için validasyon

#### `setupChart(mode)`
- **mode = 'single'**: 1 dataset
- **mode = 'multi'**: 5 dataset (Delta, Theta, Alpha, Beta, Gamma)
- Dinamik renk atama
- Sade grid ve tooltip

#### `initializeChartWindow()`
- İlk 300 örneği (veya mevcut tüm veriyi) yükler
- Animasyon başlangıç noktası

#### `startAnimation()` - Kayan Pencere
```javascript
// Her frame'de:
1. Yeni veri ekle: chart.data.labels.push(times[currentIndex])
2. Eski veri sil:  chart.data.labels.shift()
3. Tüm dataset'leri güncelle (single veya multi)
4. Chart'ı redraw et: chart.update('none')
```

### Performans Optimizasyonları

- **Sabit pencere boyutu**: Sürekli 300 eleman, bellek kullanımı sabit
- **Chart.js 'none' update**: Animasyon overhead'i yok
- **Batch processing**: Hız ayarına göre çoklu veri noktası ekleme
- **3000+ örnek desteği**: Büyük dosyalar sorunsuz işlenir

## 💡 Kullanım İpuçları

### ⭐ Ortalama Kanal İçin
- **Genel durum**: Beynin genel aktivite seviyesini görmek için
- **Karşılaştırma baseline**: Farklı zamanlardaki kayıtları karşılaştırmak için
- **Gürültü azaltma**: 4 kanalın ortalaması, tek kanal gürültüsünü azaltır
- **Multi-band önerisi**: "Tümü + Ortalama" kombinasyonu en kapsamlı görünümü verir

### 🌈 Multi-Band Modu İçin
- **Dalga karşılaştırması**: 5 dalgayı aynı anda izleyerek korelasyonları görün
- **Hız ayarı**: Başlangıçta 5x hız ile genel pattern'i görün
- **Duraklatma**: İlginç bir nokta gördüğünüzde duraklatıp detaylı inceleyin
- **Kanal karşılaştırma**: Farklı kanalları sırayla açıp karşılaştırın

### 📈 Single-Band Modu İçin
- **Detaylı analiz**: Tek bir dalgaya odaklanmak için
- **Temiz görünüm**: Grafik daha az kalabalık
- **Özel inceleme**: Spesifik bir dalga anomalisi araştırması için

### 🎮 Genel
- Daha hızlı animasyon için hız slider'ını artırın
- Kayan pencere sayesinde grafik hiç dolmaz, sürekli akar
- Animasyon sırasında duraklatıp tooltip ile değerlere bakabilirsiniz
- Reset butonu ile her zaman başa dönebilirsiniz

## 📊 CSV Formatı

```csv
TimeStamp,Delta_TP9,Theta_TP9,Alpha_TP9,Beta_TP9,Gamma_TP9,Delta_AF7,...
2025-10-21 14:53:19.894,0.681,0.296,0.213,-0.027,-0.716,...
```

### Gerekli Sütunlar

**Multi-Band Modu için:**
- `TimeStamp`
- `Delta_[Channel]`, `Theta_[Channel]`, `Alpha_[Channel]`, `Beta_[Channel]`, `Gamma_[Channel]`
- Örnek: Kanal AF7 seçiliyse → `Delta_AF7`, `Theta_AF7`, `Alpha_AF7`, `Beta_AF7`, `Gamma_AF7`

**Single-Band Modu için:**
- `TimeStamp`
- `[Band]_[Channel]`
- Örnek: `Alpha_AF7`, `Delta_TP9`, vb.

## 🔧 Kod Yapısı

### Global Variables
```javascript
let isMultiMode = false;           // Multi-band mode flag
let valuesByBand = {};             // {Delta: [], Theta: [], ...}
const WINDOW_SIZE = 300;           // Sliding window size
const BAND_NAMES = ['Delta', ...]; // All band names
const BAND_COLORS = {...};         // Color mapping
```

### Ana Fonksiyonlar
1. **parseCsv()** - CSV parsing (single & multi)
2. **setupChart()** - Chart initialization (1 or 5 datasets)
3. **initializeChartWindow()** - Initial window load
4. **startAnimation()** - Sliding window animation loop
5. **stopAnimation()** - Pause
6. **resetAnimation()** - Reset to beginning

## 🐛 Hata Ayıklama

**Problem:** Multi-band modunda tüm dalgalar gösterilmiyor
- CSV'de ilgili kanalın tüm band sütunlarının olduğundan emin olun
- Eksik sütun varsa hata mesajı gösterilir

**Problem:** Animasyon çok hızlı/yavaş
- Hız slider'ını ayarlayın (1-10x)
- Multi-band modunda daha yavaş hız önerilir (detaylı gözlem için)

**Problem:** Grafik okunmuyor
- Multi-band modunda 5 çizgi üst üste binebilir
- Legend'dan istediğiniz dalgayı tıklayarak gizleyebilirsiniz (Chart.js özelliği)

**Problem:** Kayan pencere çalışmıyor
- `WINDOW_SIZE = 300` değerini ihtiyacınıza göre değiştirebilirsiniz
- script.js içinde bu sabit tanımlı

## 🎨 Renk Paleti Değiştirme

`script.js` içinde `BAND_COLORS` objesini düzenleyin:

```javascript
const BAND_COLORS = {
    'Delta': '#f56565',    // İstediğiniz renk
    'Theta': '#ed8936',
    'Alpha': '#4299e1',
    'Beta': '#48bb78',
    'Gamma': '#9f7aea'
};
```

## 📝 Versiyon Geçmişi

### v2.2 (Güncel)
- 🎨 **Kalem gibi çizim**: X ve Y eksenleri sabit, çizgiler yavaşça çizilir
- 🎨 **Renkli nokta**: Her çizginin ucunda kendi renginde nokta (●)
- 🎨 **Dengeli yumuşatma**: `tension: 0.25` (su gibi akışkan, aşırı değil)
- 🎨 **Round corners**: Yuvarlatılmış çizgi bağlantıları (keskin köşeler yok)
- 🎨 **Çok yavaş mod**: 0.1x - 20x hız aralığı (0.1 step ile hassas kontrol)
- 🎨 **Kalın çizgiler**: borderWidth: 2.5 (daha net görünüm)
- 🎨 **Sabit eksenler**: Grafik zoom yapmaz, baştan sona tüm alan görünür
- 🎨 **Scatter chart**: X,Y koordinatları ile hassas çizim

### v2.1
- ⭐ **Ortalama Kanal** eklendi (4 kanalın ortalaması)
- ⭐ Hem single-band hem multi-band modunda ortalama desteği
- ⭐ Akıllı ortalama hesaplama (en az 3 geçerli kanal)
- ⭐ Geliştirilmiş durum mesajları

### v2.0
- ✨ Multi-band modu eklendi (5 dalga bir arada)
- ✨ Kayan pencere animasyonu (sliding window)
- ✨ Dinamik dataset yönetimi
- ✨ İyileştirilmiş tooltip ve legend
- ✨ Renk kodlu dalga görselleştirmesi

### v1.0
- 🎉 İlk sürüm
- ✅ Single-band modu
- ✅ CSV yükleme ve parsing
- ✅ Temel animasyon

## 🛠️ Teknolojiler

- **HTML5** - Yapı
- **CSS3** - Modern dark tema
- **JavaScript (Vanilla)** - Tüm mantık
- **Chart.js v4.4.0** - Grafik kütüphanesi

## 📄 Lisans

Bu proje eğitim ve araştırma amaçlı kullanım içindir.

## 👨‍💻 Geliştirici Notları

- Proje tamamen vanilla JavaScript ile yazılmıştır
- Tek harici bağımlılık: Chart.js CDN
- Offline kullanım için Chart.js'i local'e eklenebilir
- Multi-band modu için tüm bandlerin valid data içermesi gerekir

---

**Not:** Bu uygulama MindMonitor Muse EEG verileri için optimize edilmiştir.

**⭐ Önerilen kullanım:** 
1. **"Tümü (Multi-band)"** + **"Ortalama (4 Kanal)"** = En kapsamlı görünüm
2. 4 fiziksel kanalın ortalaması gürültüyü azaltır ve genel trendi gösterir
3. Farklı kanalları karşılaştırarak bölgesel farklılıkları inceleyin! 🧠✨
