// Global Variables
let csvData = null;
let currentChart = null;
let animationInterval = null;
let currentIndex = 0;
let times = [];
let values = []; // For single band mode
let valuesByBand = {}; // For multi-band mode
let selectedBand = '';
let selectedChannel = '';
let animationSpeed = 0.5; // Start with very slow speed
let isPaused = false;
let isMultiMode = false;

// Configuration
const WINDOW_SIZE = 300; // Sliding window size
const SMOOTHING_FACTOR = 10; // Moving average window for data smoothing
const BAND_NAMES = ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'];
const PHYSICAL_CHANNELS = ['TP9', 'AF7', 'AF8', 'TP10']; // Physical channels for averaging

// Modern, soft color palette - more professional and easier on the eyes
const BAND_COLORS = {
    'Delta': '#ff6b9d',    // Soft pink-red
    'Theta': '#ffa726',    // Warm orange
    'Alpha': '#42a5f5',    // Sky blue
    'Beta': '#66bb6a',     // Fresh green
    'Gamma': '#ab47bc'     // Royal purple
};

// Brain Profile System - 16 profiles
const brainProfiles = [
    "Denge Ustası",
    "Meditatif Lider",
    "Yaratıcı Lider",
    "Zihinsel Savaşçı",
    "Derin Sessiz",
    "Sessiz Gözlemci",
    "Vizyon Ustası",
    "Empatik Savaşçı",
    "Kararlı Gözlemci",
    "Rahatına Düşkün",
    "Keyif Yolcusu",
    "Sezgisel Stratejist",
    "Yaratıcı Odak",
    "Veri Meditatörü",
    "Görev İnsanı",
    "Güç Odaklı Yöneten"
];

const profileDescriptions = {
    "Denge Ustası": "Hayatında her şeyi dengede tutabilen, duygularını kontrol edebilen birisin. Delta ve theta dalgaların uyumlu, alpha aktiviten yüksek. Stresli durumlarda bile sakin kalabilir, hem içsel huzuru hem de dış dünyadaki sorumluluklarını dengeli şekilde yönetirsin. Meditasyon ve farkındalık pratiğinde doğal bir yeteneğin var.",
    
    "Meditatif Lider": "Yüksek theta ve alpha aktiviten derin bir içsel odağa ve meditasyon benzeri bir zihniyet durumuna işaret ediyor. Stresi düşürme, sezgisel düşünme ve vizyoner planlama konusunda güçlüsün. İnsanları sakin ve güvenli hissettiren bir liderlik tarzın var. Sessiz gücün ve içsel bilgeliğinle yol gösterirsin.",
    
    "Yaratıcı Lider": "Düşük delta, belirgin alpha ve beta dengen yaratıcı ve vizyoner bir zihin yapısını gösteriyor. Yeni fikirler üretmekte, stratejik düşünmekte ve ilham vermekte mükemmelsin. Hem sanatsal hem analitik düşünebilir, sıra dışı çözümler bulursun. Takımına yenilikçi bakış açıları kazandırırsın.",
    
    "Zihinsel Savaşçı": "Yüksek beta aktiviten yoğun odaklanma, hızlı karar verme ve problem çözme yeteneğini ortaya koyuyor. Zorluklar karşısında zihinsel dayanıklılığın güçlü. Aksiyon odaklısın, çabuk düşünür ve hareket edersin. Baskı altında performans gösterme konusunda doğal bir yeteneğin var.",
    
    "Derin Sessiz": "Yüksek delta ve düşük beta aktiviten derin bir dinginlik ve içe dönüklük gösteriyor. Gürültülü ortamlardan uzak durur, kendi iç dünyanı keşfetmeyi seversin. Derin düşünme, refleksiyon ve şifa süreçlerinde güçlüsün. Sessizlikte kendini bulursun.",
    
    "Sessiz Gözlemci": "Dengelenmiş theta ve düşük beta ile çevrenizi sessizce gözlemleyip analiz edersin. Aceleci kararlar vermezsin; önce izler, sonra hareket edersin. Empatin yüksek, insanları ve durumları derinlemesine anlarsın. Söze değil, gözleme değer verirsin.",
    
    "Vizyon Ustası": "Güçlü alpha ve dengeli theta aktiviten geleceği görselleştirme ve büyük resmi kavrama konusunda seni öne çıkarıyor. Stratejik düşünür, uzun vadeli planlar yaparsın. İlham verici hedefler belirler ve insanları o hedefe doğru yönlendirirsin. Hayal gücün güçlü, gerçekçi de kalırsın.",
    
    "Empatik Savaşçı": "Hem yüksek theta (empati, sezgi) hem de yüksek beta (aksiyon, çözüm) kombinasyonu seni eşsiz kılıyor. İnsanların duygularını anlarsın ama aynı zamanda onlar için somut adımlar atarsın. Koruyucu ve destekleyicisin, hem kalp hem akıl ile hareket edersin.",
    
    "Kararlı Gözlemci": "Düşük theta, dengeli alpha ve orta beta aktiviten sabırlı ve kararlı bir yapıya işaret ediyor. Duygusal dalgalanmalara kapılmadan, soğukkanlı şekilde gözlemler ve en doğru kararı verirsin. Tutarlısın ve sözünün arkasında dururusun.",
    
    "Rahatına Düşkün": "Yüksek alpha ve düşük beta aktiviten rahat, sakin ve stressiz bir yaşam tarzını yansıtıyor. Koşuşturmayı sevmez, anın tadını çıkartırsın. Yaşam felsefem 'acele etme, akışına bırak' şeklinde. Huzuru bulmakta ve korumakta ustasın.",
    
    "Keyif Yolcusu": "Dengeli alpha ve gamma aktiviten anı yaşama, keyif alma ve deneyimlere açık olma konusunda seni öne çıkarıyor. Hayattan zevk alır, yeni şeyler denemeyi seversin. Sosyal, enerjik ve pozitifsin. Etrafına neşe ve enerji katarsın.",
    
    "Sezgisel Stratejist": "Yüksek theta ve dengeli beta kombinasyonu güçlü bir sezgi ile analitik düşünmeyi birleştiriyor. İçgüdülerin güvenilir, ama kararlarını mantık süzgecinden de geçirirsin. Hem kalp hem akıl ile strateji geliştirirsin. İş dünyasında ve kişisel hayatta dengeli kararlar alırsın.",
    
    "Yaratıcı Odak": "Yüksek alpha ve beta dengesi yaratıcı düşünce ile odaklanmış çalışma yeteneğini bir araya getiriyor. Hem hayal gücün güçlü hem de fikirleri hayata geçirme disiplinin var. Sanatsal projelerde, yazıda, tasarımda veya inovasyonda parlarsın.",
    
    "Veri Meditatörü": "Yüksek alpha ve düşük beta ile veri, bilgi ve içgörüyü içsel bir sakinlik ile işlersin. Araştırma, analiz ve derin öğrenme konusunda yeteneklisin. Bilgiyi sadece toplamakla kalmaz, onu içselleştirip anlamlandırırsın. Bilgelik ve huzur birleşimi.",
    
    "Görev İnsanı": "Yüksek beta ve düşük theta aktiviten görev odaklı, disiplinli ve verimli bir yapıya işaret ediyor. Listeleri sever, planlarını takip eder ve işleri bitirirsin. Duygusal faktörlerden çok sonuca odaklanırsın. Güvenilir, tutarlı ve üretkensin.",
    
    "Güç Odaklı Yöneten": "Yüksek beta ve gamma aktiviten liderlik, kontrol ve performans odaklı bir zihin yapısını gösteriyor. Güçlü kararlar alır, sorumluluk üstlenir ve hedeflere ulaşmak için enerjiyle çalışırsın. Rekabetçi, hırslı ve etkilisin. Sonuç odaklı liderlik tarzın var."
};

const profileShortDescriptions = {
    "Denge Ustası": "Dalgalar arasında dengeli bir dağılım sergileyen, sakin ama uyanık profil.",
    "Meditatif Lider": "Yüksek içsel odak ve meditasyon benzeri gevşeme paterni.",
    "Yaratıcı Lider": "Düşük delta, belirgin alpha ile yaratıcı ve vizyoner zihin modu.",
    "Zihinsel Savaşçı": "Yüksek beta aktivitesi ile problem çözme ve odaklanma gücü.",
    "Derin Sessiz": "Dominant delta dalgaları ile derin dinlenme ve toparlanma evresi.",
    "Sessiz Gözlemci": "Sakin ve gözlemci bir zihin durumu, düşük aktivite seviyeleri.",
    "Vizyon Ustası": "Yüksek alpha-theta kombinasyonu ile sezgisel ve yaratıcı düşünce.",
    "Empatik Savaşçı": "Duygusal zeka ve analitik düşüncenin dengeli birleşimi.",
    "Kararlı Gözlemci": "Sabırlı ve stratejik, düşük impulsivite ile dikkatli analiz.",
    "Rahatına Düşkün": "Gevşek ve rahat bir zihin durumu, minimal stres göstergeleri.",
    "Keyif Yolcusu": "Pozitif ve akışkan zihin durumu, yaşam enerjisi yüksek.",
    "Sezgisel Stratejist": "İçgörü ve mantığın birleşimi ile uzun vadeli planlama.",
    "Yaratıcı Odak": "Yaratıcılık ve konsantrasyonun güçlü kombinasyonu.",
    "Veri Meditatörü": "Analitik düşünce ve içsel sakinliğin dengesi.",
    "Görev İnsanı": "Yüksek odak ve görev tamamlama motivasyonu.",
    "Güç Odaklı Yöneten": "Liderlik ve kontrol eğilimi, güçlü beta aktivitesi."
};

let profileTimer = null;
let profileStates = [];
let totalSamples = 0;
let profileScoreTimer = null;

// DOM Elements
const csvFileInput = document.getElementById('csvFile');
const bandSelect = document.getElementById('bandSelect');
const channelSelect = document.getElementById('channelSelect');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.getElementById('statusText');
const chartCanvas = document.getElementById('eegChart');
const profileListEl = document.getElementById('profile-list');
const viewProfileBtn = document.getElementById('viewProfileBtn');
const profileModal = document.getElementById('profileModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalProfileName = document.getElementById('modalProfileName');
const modalProfileDesc = document.getElementById('modalProfileDesc');

// Event Listeners
csvFileInput.addEventListener('change', handleFileSelect);
bandSelect.addEventListener('change', handleSelectionChange);
channelSelect.addEventListener('change', handleSelectionChange);
speedSlider.addEventListener('input', handleSpeedChange);
playBtn.addEventListener('click', startAnimation);
pauseBtn.addEventListener('click', stopAnimation);
resetBtn.addEventListener('click', resetAnimation);

// Profile Modal Event Listeners
if (viewProfileBtn) {
    viewProfileBtn.addEventListener('click', showProfileModal);
}
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideProfileModal);
}
if (profileModal) {
    profileModal.addEventListener('click', (e) => {
        // Close modal if clicking on backdrop (not the content)
        if (e.target === profileModal) {
            hideProfileModal();
        }
    });
}

// Keyboard Event Listener - Space to Play
document.addEventListener('keydown', (e) => {
    // Check if Space key is pressed
    if (e.code === 'Space' || e.key === ' ') {
        // Prevent default space behavior (scrolling page)
        e.preventDefault();
        
        // Check if modal is open - don't trigger play if modal is open
        if (profileModal && !profileModal.classList.contains('hidden')) {
            return;
        }
        
        // Check if input/textarea is focused - don't trigger if user is typing
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            return;
        }
        
        // Trigger play button if it's enabled
        if (playBtn && !playBtn.disabled) {
            console.log('⌨️ Space pressed - Starting animation!');
            startAnimation();
        }
    }
});

/**
 * Handle file selection
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) {
        updateStatus('Dosya seçilmedi.', 'error');
        return;
    }

    if (!file.name.endsWith('.csv')) {
        updateStatus('Lütfen geçerli bir CSV dosyası seçin.', 'error');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            csvData = text;
            updateStatus('CSV dosyası başarıyla yüklendi. Lütfen dalga ve kanal seçimi yapın.', 'success');
            
            // Enable controls
            bandSelect.disabled = false;
            channelSelect.disabled = false;
            
            // Try to setup chart if selections are already made
            if (selectedBand && selectedChannel) {
                reloadFromCurrentFile();
            }
        } catch (error) {
            updateStatus('Dosya okunurken hata oluştu: ' + error.message, 'error');
        }
    };
    
    reader.onerror = function() {
        updateStatus('Dosya okunurken hata oluştu.', 'error');
    };
    
    reader.readAsText(file);
}

/**
 * Handle band/channel selection change
 */
function handleSelectionChange() {
    selectedBand = bandSelect.value;
    selectedChannel = channelSelect.value;
    
    // Check if multi-band mode
    isMultiMode = (selectedBand === 'All');
    
    if (csvData && selectedBand && selectedChannel) {
        reloadFromCurrentFile();
    } else if (selectedBand && selectedChannel) {
        updateStatus('Lütfen bir CSV dosyası yükleyin.', 'error');
    }
}

/**
 * Handle speed slider change
 */
function handleSpeedChange(event) {
    animationSpeed = parseFloat(event.target.value);
    speedValue.textContent = animationSpeed.toFixed(1);
}

/**
 * Apply moving average smoothing to reduce noise
 */
function smoothData(data, windowSize = SMOOTHING_FACTOR) {
    if (data.length < windowSize) return data;
    
    const smoothed = [];
    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;
        
        // Calculate average of surrounding points
        const halfWindow = Math.floor(windowSize / 2);
        const start = Math.max(0, i - halfWindow);
        const end = Math.min(data.length - 1, i + halfWindow);
        
        for (let j = start; j <= end; j++) {
            sum += data[j];
            count++;
        }
        
        smoothed.push(sum / count);
    }
    
    return smoothed;
}

/**
 * Parse CSV and extract data - supports both single and multi-band modes
 */
function parseCsv(text, band, channel) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        throw new Error('CSV dosyası boş veya geçersiz.');
    }
    
    // Parse header
    const header = lines[0].split(',').map(col => col.trim());
    
    // Find TimeStamp column
    const timeIndex = header.indexOf('TimeStamp');
    if (timeIndex === -1) {
        throw new Error('TimeStamp sütunu bulunamadı.');
    }
    
    // Check if we need to calculate average of 4 channels
    const isAverageChannel = (channel === 'Average');
    
    // Multi-band mode
    if (band === 'All') {
        // Find all band columns for the selected channel(s)
        const columnIndices = {};
        
        if (isAverageChannel) {
            // For average, we need all 4 channels x 5 bands = 20 columns
            for (const bandName of BAND_NAMES) {
                columnIndices[bandName] = [];
                for (const physicalChannel of PHYSICAL_CHANNELS) {
                    const columnName = `${bandName}_${physicalChannel}`;
                    const index = header.indexOf(columnName);
                    if (index === -1) {
                        throw new Error(`${columnName} sütunu bulunamadı. Ortalama hesabı için tüm kanallar gerekli.`);
                    }
                    columnIndices[bandName].push(index);
                }
            }
        } else {
            // Single channel mode
            for (const bandName of BAND_NAMES) {
                const columnName = `${bandName}_${channel}`;
                const index = header.indexOf(columnName);
                if (index === -1) {
                    throw new Error(`${columnName} sütunu bulunamadı. CSV dosyası eksik sütunlar içeriyor.`);
                }
                columnIndices[bandName] = index;
            }
        }
        
        // Parse data rows
        const parsedTimes = [];
        const parsedValuesByBand = {
            Delta: [],
            Theta: [],
            Alpha: [],
            Beta: [],
            Gamma: []
        };
        
        for (let i = 1; i < lines.length; i++) {
            const cells = lines[i].split(',');
            
            // Skip rows with insufficient data
            if (cells.length <= timeIndex) {
                continue;
            }
            
            const timeValue = cells[timeIndex].trim();
            
            // Check if all band values are valid
            let allValid = true;
            const rowValues = {};
            
            for (const bandName of BAND_NAMES) {
                if (isAverageChannel) {
                    // Calculate average of 4 channels
                    let sum = 0;
                    let validCount = 0;
                    
                    for (const channelIndex of columnIndices[bandName]) {
                        const dataValue = cells[channelIndex]?.trim();
                        
                        if (!dataValue || dataValue === '' || isNaN(parseFloat(dataValue))) {
                            continue;
                        }
                        
                        const numericValue = parseFloat(dataValue);
                        if (!isNaN(numericValue)) {
                            sum += numericValue;
                            validCount++;
                        }
                    }
                    
                    // Need at least 3 valid channels for average
                    if (validCount < 3) {
                        allValid = false;
                        break;
                    }
                    
                    rowValues[bandName] = sum / validCount;
                } else {
                    // Single channel
                    const dataValue = cells[columnIndices[bandName]]?.trim();
                    
                    if (!dataValue || dataValue === '' || isNaN(parseFloat(dataValue))) {
                        allValid = false;
                        break;
                    }
                    
                    const numericValue = parseFloat(dataValue);
                    if (isNaN(numericValue)) {
                        allValid = false;
                        break;
                    }
                    
                    rowValues[bandName] = numericValue;
                }
            }
            
            // Only add row if all bands have valid data
            if (allValid) {
                parsedTimes.push(timeValue || `Sample ${i}`);
                for (const bandName of BAND_NAMES) {
                    parsedValuesByBand[bandName].push(rowValues[bandName]);
                }
            }
        }
        
        if (parsedTimes.length === 0) {
            throw new Error('Geçerli veri bulunamadı. CSV dosyasında sayısal değerler eksik olabilir.');
        }
        
        // Apply smoothing to all bands to reduce noise
        for (const bandName of BAND_NAMES) {
            parsedValuesByBand[bandName] = smoothData(parsedValuesByBand[bandName]);
        }
        
        console.log('Multi-band data parsed:', {
            bands: Object.keys(parsedValuesByBand),
            sampleCount: parsedTimes.length,
            firstSample: Object.keys(parsedValuesByBand).reduce((obj, band) => {
                obj[band] = parsedValuesByBand[band][0];
                return obj;
            }, {})
        });
        
        return {
            times: parsedTimes,
            valuesByBand: parsedValuesByBand
        };
    }
    
    // Single-band mode (original logic)
    else {
        let columnIndices;
        
        if (isAverageChannel) {
            // For average, get all 4 channels for this band
            columnIndices = [];
            for (const physicalChannel of PHYSICAL_CHANNELS) {
                const columnName = `${band}_${physicalChannel}`;
                const index = header.indexOf(columnName);
                if (index === -1) {
                    throw new Error(`${columnName} sütunu bulunamadı. Ortalama hesabı için tüm kanallar gerekli.`);
                }
                columnIndices.push(index);
            }
        } else {
            // Single channel
            const columnName = `${band}_${channel}`;
            const valueIndex = header.indexOf(columnName);
            
            if (valueIndex === -1) {
                throw new Error(`${columnName} sütunu bulunamadı. Lütfen farklı bir band/kanal kombinasyonu deneyin.`);
            }
            
            columnIndices = valueIndex;
        }
        
        // Parse data rows
        const parsedTimes = [];
        const parsedValues = [];
        
        for (let i = 1; i < lines.length; i++) {
            const cells = lines[i].split(',');
            
            if (cells.length <= timeIndex) {
                continue;
            }
            
            const timeValue = cells[timeIndex].trim();
            let finalValue;
            
            if (isAverageChannel) {
                // Calculate average of 4 channels
                let sum = 0;
                let validCount = 0;
                
                for (const channelIndex of columnIndices) {
                    if (cells.length <= channelIndex) continue;
                    
                    const dataValue = cells[channelIndex]?.trim();
                    
                    if (!dataValue || dataValue === '' || isNaN(parseFloat(dataValue))) {
                        continue;
                    }
                    
                    const numericValue = parseFloat(dataValue);
                    if (!isNaN(numericValue)) {
                        sum += numericValue;
                        validCount++;
                    }
                }
                
                // Need at least 3 valid channels for average
                if (validCount < 3) {
                    continue;
                }
                
                finalValue = sum / validCount;
            } else {
                // Single channel
                if (cells.length <= columnIndices) {
                    continue;
                }
                
                const dataValue = cells[columnIndices].trim();
                
                if (!dataValue || dataValue === '' || isNaN(parseFloat(dataValue))) {
                    continue;
                }
                
                finalValue = parseFloat(dataValue);
                
                if (isNaN(finalValue)) {
                    continue;
                }
            }
            
            parsedTimes.push(timeValue || `Sample ${i}`);
            parsedValues.push(finalValue);
        }
        
        if (parsedValues.length === 0) {
            throw new Error('Geçerli veri bulunamadı. CSV dosyasında sayısal değerler eksik olabilir.');
        }
        
        // Apply smoothing to single band to reduce noise
        const smoothedValues = smoothData(parsedValues);
        
        return {
            times: parsedTimes,
            values: smoothedValues
        };
    }
}

/**
 * Calculate Y-axis range from all data
 */
function calculateYRange(mode) {
    let allValues = [];
    
    if (mode === 'multi') {
        // Collect all values from all bands
        for (const bandName of BAND_NAMES) {
            if (valuesByBand[bandName]) {
                allValues = allValues.concat(valuesByBand[bandName]);
            }
        }
    } else {
        // Single band
        allValues = values;
    }
    
    if (allValues.length === 0) {
        return { min: 0, max: 1 };
    }
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    
    // Add 5% padding
    const padding = (max - min) * 0.05;
    
    return {
        min: min - padding,
        max: max + padding
    };
}

/**
 * Setup Chart.js chart - supports both single and multi-band modes
 */
function setupChart(mode) {
    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
    
    const ctx = chartCanvas.getContext('2d');
    
    // Calculate fixed Y-axis range based on ALL data
    const yRange = calculateYRange(mode);
    
    let datasets = [];
    
    if (mode === 'multi') {
        // Multi-band mode: create 5 datasets
        console.log('Creating multi-band chart with bands:', BAND_NAMES);
        for (const bandName of BAND_NAMES) {
            datasets.push({
                label: bandName,
                data: [],
                borderColor: BAND_COLORS[bandName],
                backgroundColor: BAND_COLORS[bandName] + '15', // Subtle fill with transparency
                borderWidth: 2.5,
                fill: true,
                tension: 0.25, // Smooth curves (data is pre-smoothed)
                showLine: true, // Connect points with line
                pointRadius: (context) => {
                    // Show point only at the last data point (drawing tip)
                    return context.dataIndex === context.dataset.data.length - 1 ? 6 : 0;
                },
                pointBackgroundColor: BAND_COLORS[bandName],
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                segment: {
                    borderColor: context => {
                        // Keep color consistent during animation
                        return BAND_COLORS[bandName];
                    }
                }
            });
        }
    } else {
        // Single-band mode: create 1 dataset
        const lineColor = BAND_COLORS[selectedBand] || '#667eea';
        
        datasets.push({
            label: `${selectedBand} - ${selectedChannel}`,
            data: [],
                borderColor: lineColor,
                backgroundColor: lineColor + '15', // Subtle fill with transparency
                borderWidth: 2.5,
                fill: true,
                tension: 0.25, // Smooth curves (data is pre-smoothed)
            showLine: true, // Connect points with line
            pointRadius: (context) => {
                // Show point only at the last data point (drawing tip)
                return context.dataIndex === context.dataset.data.length - 1 ? 6 : 0;
            },
            pointBackgroundColor: lineColor,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointHoverRadius: 8,
            segment: {
                borderColor: context => {
                    // Keep color consistent during animation
                    return lineColor;
                }
            }
        });
    }
    
    currentChart = new Chart(ctx, {
        type: 'scatter', // Use scatter to support x,y coordinates
        data: {
            labels: [],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                line: {
                    borderJoinStyle: 'round', // Smooth line joins
                    borderCapStyle: 'round'   // Smooth line caps
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        color: '#e2e8f0',
                        font: {
                            size: 14,
                            weight: '600',
                            family: "'Inter', 'Segoe UI', sans-serif"
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 18,
                        boxWidth: 12,
                        boxHeight: 12
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(15, 23, 42, 0.96)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e0',
                    borderColor: 'rgba(100, 150, 255, 0.4)',
                    borderWidth: 2,
                    padding: 14,
                    displayColors: true,
                    boxWidth: 10,
                    boxHeight: 10,
                    boxPadding: 6,
                    usePointStyle: true,
                    titleFont: {
                        size: 13,
                        weight: 'bold',
                        family: "'Inter', 'Segoe UI', sans-serif"
                    },
                    bodyFont: {
                        size: 12,
                        family: "'Inter', 'Segoe UI', sans-serif"
                    },
                    cornerRadius: 8,
                    callbacks: {
                        title: function(context) {
                            const xValue = Math.floor(context[0].parsed.x);
                            const time = times[xValue];
                            if (time && typeof time === 'string' && time.includes(':')) {
                                const timePart = time.split(' ')[1];
                                return `⏱ Örnek #${xValue} - ${timePart ? timePart.substring(0, 12) : ''}`;
                            }
                            return `⏱ Örnek #${xValue}`;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label;
                            return ` ${label}: ${value.toFixed(3)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    min: 0,
                    max: times.length - 1,
                    grid: {
                        color: 'rgba(100, 150, 255, 0.08)',
                        lineWidth: 1,
                        drawBorder: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#a0aec0',
                        maxTicksLimit: 12,
                        font: {
                            size: 11,
                            family: "'Inter', 'Segoe UI', sans-serif"
                        },
                        callback: function(value) {
                            return Math.floor(value);
                        }
                    },
                    title: {
                        display: true,
                        text: `⏱ Zaman Ekseni (${times.length} örnek)`,
                        color: '#e2e8f0',
                        font: {
                            size: 13,
                            weight: '600',
                            family: "'Inter', 'Segoe UI', sans-serif"
                        },
                        padding: { top: 10 }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    min: yRange.min,
                    max: yRange.max,
                    grid: {
                        color: 'rgba(100, 150, 255, 0.12)',
                        lineWidth: 1,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#a0aec0',
                        font: {
                            size: 11,
                            family: "'Inter', 'Segoe UI', sans-serif"
                        },
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    },
                    title: {
                        display: true,
                        text: mode === 'multi' ? `📊 ${selectedChannel === 'Average' ? 'Ortalama' : selectedChannel} Kanal - Dalga Gücü` : '📊 Dalga Gücü',
                        color: '#e2e8f0',
                        font: {
                            size: 13,
                            weight: '600',
                            family: "'Inter', 'Segoe UI', sans-serif"
                        },
                        padding: { bottom: 10 }
                    }
                }
            }
        }
    });
}

/**
 * Initialize chart with empty data (for animation from scratch)
 */
function initializeChartWindow() {
    if (!currentChart) return;
    
    // Start with completely empty chart
    currentChart.data.labels = [];
    
    if (isMultiMode) {
        // Reset all datasets to empty
        for (let i = 0; i < BAND_NAMES.length; i++) {
            currentChart.data.datasets[i].data = [];
        }
    } else {
        // Single band mode - empty
        currentChart.data.datasets[0].data = [];
    }
    
    currentChart.update('none');
    currentIndex = 0; // Start from beginning
}

/**
 * Start animation with sliding window
 */
function startAnimation() {
    if (!csvData || !selectedBand || !selectedChannel) {
        updateStatus('Lütfen CSV dosyası yükleyin ve dalga/kanal seçimi yapın.', 'error');
        return;
    }
    
    if (times.length === 0) {
        updateStatus('Animasyon için veri bulunamadı.', 'error');
        return;
    }
    
    // If animation is complete, restart from beginning
    if (currentIndex >= times.length) {
        initializeChartWindow();
    }
    
    // If starting fresh (currentIndex === 0), initialize empty chart
    if (currentIndex === 0) {
        initializeChartWindow();
    }
    
    isPaused = false;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    
    updateStatus(`Animasyon oynatılıyor... (${currentIndex}/${times.length} örnek)`, 'success');
    
    // Start profile system
    initProfileStates();
    startProfileScoreLoop();
    
    // Start animation loop - drawing like a pen
    animationInterval = setInterval(() => {
        if (currentIndex >= times.length) {
            stopAnimation();
            updateStatus(`Animasyon tamamlandı! Toplam ${times.length} örnek görüntülendi.`, 'success');
            // Highlight winner and show button after animation completes
            setTimeout(() => {
                highlightFinalWinner();
            }, 500);
            return;
        }
        
        if (isMultiMode) {
            // Multi-band: add point to all 5 datasets at current index
            for (let j = 0; j < BAND_NAMES.length; j++) {
                const bandName = BAND_NAMES[j];
                // Add data point with x: index, y: value
                currentChart.data.datasets[j].data.push({
                    x: currentIndex,
                    y: valuesByBand[bandName][currentIndex]
                });
            }
        } else {
            // Single band: add point at current index
            currentChart.data.datasets[0].data.push({
                x: currentIndex,
                y: values[currentIndex]
            });
        }
        
        currentIndex++;
        
        // Update chart without animation
        currentChart.update('none');
        
        // Update status every 10 frames to reduce overhead
        if (currentIndex % 10 === 0) {
            updateStatus(`Animasyon oynatılıyor... (${currentIndex}/${times.length} örnek)`, 'success');
        }
        
    }, 100 / animationSpeed); // Dynamic interval based on speed slider (100ms / speed)
}

/**
 * Stop/Pause animation
 */
function stopAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    
    // Stop profile system
    stopProfileScoreLoop();
    
    isPaused = true;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    
    if (currentIndex < times.length) {
        updateStatus(`Animasyon duraklatıldı. (${currentIndex}/${times.length} örnek)`, '');
    }
}

/**
 * Reset animation
 */
function resetAnimation() {
    stopAnimation();
    
    currentIndex = 0;
    
    // Hide "View Profile" button and modal
    if (viewProfileBtn) {
        viewProfileBtn.classList.add('hidden');
    }
    if (profileModal) {
        profileModal.classList.add('hidden');
    }
    
    // Clear profile list and references
    if (profileListEl) {
        profileListEl.innerHTML = '';
    }
    profileStates.forEach(p => {
        p.el = null;
        p.rankEl = null;
        p.scoreEl = null;
        p.barFillEl = null;
    });
    profileStates = [];
    
    if (currentChart) {
        currentChart.data.labels = [];
        if (isMultiMode) {
            for (let i = 0; i < BAND_NAMES.length; i++) {
                currentChart.data.datasets[i].data = [];
            }
        } else {
            currentChart.data.datasets[0].data = [];
        }
        currentChart.update('none');
    }
    
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    
    updateStatus(`Animasyon sıfırlandı. ${times.length} örnek hazır.`, '');
}

/**
 * Reload data from current file with new selection
 */
function reloadFromCurrentFile() {
    try {
        // Stop any running animation
        stopAnimation();
        
        // Parse CSV with new selection
        const parsed = parseCsv(csvData, selectedBand, selectedChannel);
        times = parsed.times;
        
        if (isMultiMode) {
            // Multi-band mode
            valuesByBand = parsed.valuesByBand;
            values = []; // Clear single band values
        } else {
            // Single-band mode
            values = parsed.values;
            valuesByBand = {}; // Clear multi-band values
        }
        
        // Reset animation state
        currentIndex = 0;
        totalSamples = times.length; // Set total samples for progress calculation
        
        // Setup new chart
        setupChart(isMultiMode ? 'multi' : 'single');
        
        // Enable play button
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = false;
        
        // Update status
        const channelDisplay = selectedChannel === 'Average' ? 'Ortalama (4 kanal)' : selectedChannel;
        
        if (isMultiMode) {
            updateStatus(
                `✓ ${times.length} örnek yüklendi – ${channelDisplay} için 5 dalga (Delta, Theta, Alpha, Beta, Gamma) seçili. Oynat butonuna basarak animasyonu başlatın.`,
                'success'
            );
        } else {
            updateStatus(
                `✓ ${times.length} örnek yüklendi – ${selectedBand}_${channelDisplay} seçili. Oynat butonuna basarak animasyonu başlatın.`,
                'success'
            );
        }
        
    } catch (error) {
        updateStatus(error.message, 'error');
        playBtn.disabled = true;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
    }
}

/**
 * Update status text
 */
function updateStatus(message, type = '') {
    statusText.textContent = message;
    statusText.className = 'status-text';
    
    if (type === 'error') {
        statusText.classList.add('error');
    } else if (type === 'success') {
        statusText.classList.add('success');
    }
}

// ============================================
// PROFILE SYSTEM - Progressive Score Display
// ============================================

/**
 * Random int helper
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Initialize profile states with multiple reordering waves
 */
function initProfileStates() {
    // Create profiles with VARYING growth rates for multiple reorderings
    // Strategy: Different profiles peak at different times
    const profileConfigs = [
        { range: [88, 95], growthRate: 1.3 },  // Slow starter, wins at end
        { range: [82, 88], growthRate: 0.7 },  // Fast start, loses position
        { range: [76, 82], growthRate: 1.0 },  // Steady climber
        { range: [70, 76], growthRate: 0.9 },  // Early peak, falls back
        { range: [64, 70], growthRate: 1.1 },  // Mid-game riser
        { range: [60, 68], growthRate: 0.8 },
        { range: [56, 64], growthRate: 1.2 },
        { range: [52, 60], growthRate: 0.85 },
        { range: [48, 56], growthRate: 1.15 },
        { range: [44, 52], growthRate: 0.75 },
        { range: [72, 80], growthRate: 1.05 },
        { range: [66, 74], growthRate: 0.95 },
        { range: [58, 66], growthRate: 1.25 },
        { range: [54, 62], growthRate: 0.9 },
        { range: [50, 58], growthRate: 1.1 },
        { range: [46, 54], growthRate: 0.8 }
    ];
    
    profileStates = brainProfiles.map((name, index) => {
        const config = profileConfigs[index] || { range: [40, 70], growthRate: 1.0 };
        const [min, max] = config.range;
        return {
            name,
            finalScore: getRandomInt(min, max),
            growthRate: config.growthRate, // Different growth speeds
            currentScore: 0,
            el: null,
            rankEl: null,
            scoreEl: null,
            barFillEl: null
        };
    });
    
    // Sort by final score and take top 5
    profileStates.sort((a, b) => b.finalScore - a.finalScore);
    profileStates = profileStates.slice(0, 5);
    
    // Close final scores for competitive racing
    profileStates[0].finalScore = 92;  
    profileStates[1].finalScore = 90;  
    profileStates[2].finalScore = 88;  
    profileStates[3].finalScore = 86;  
    profileStates[4].finalScore = 84;
    
    // Delayed start: each profile "wakes up" at different graph progress
    // They all grow at SAME speed (parallel to graph), just start at different times
    profileStates[0].startDelay = 0.5;   // Wakes at 50% - catches up in second half
    profileStates[1].startDelay = 0.35;  // Wakes at 35% - mid-game entry
    profileStates[2].startDelay = 0.2;   // Wakes at 20% - early starter
    profileStates[3].startDelay = 0.1;   // Wakes at 10% - very early
    profileStates[4].startDelay = 0.0;   // Wakes immediately - leader at start
    
    // Shuffle for interesting start
    const shuffled = [...profileStates];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    profileStates = shuffled;
    
    console.log('🎲 Initial ORDER (shuffled):', profileStates.map((p, i) => 
        `${i+1}. ${p.name} (→${p.finalScore}%, wakes @${(p.startDelay*100).toFixed(0)}%)`
    ));
    console.log('🎯 Parallel Growth System:');
    console.log('  • All grow at SAME speed (parallel to graph)');
    console.log('  • Difference: WHEN they wake up');
    console.log('  • Graph 100% = ALL profiles at their finalScore');
    console.log('📊 Timeline:');
    console.log('  0%: Profil 5 starts alone');
    console.log(' 10%: Profil 4 wakes → 2 racing');
    console.log(' 20%: Profil 3 wakes → 3 racing');
    console.log(' 35%: Profil 2 wakes → 4 racing');
    console.log(' 50%: Profil 1 wakes → ALL 5 racing!');
}

/**
 * Create profile cards ONCE with state references - no flickering
 */
function createProfileCards() {
    if (!profileListEl) return;
    
    profileListEl.innerHTML = '';
    
    profileStates.forEach((p, idx) => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.dataset.profileName = p.name;
        card.style.order = idx.toString(); // Initial order
        
        // Rank
        const rankEl = document.createElement('div');
        rankEl.className = 'profile-rank';
        rankEl.textContent = `${idx + 1}. SIRA`;
        
        // Name
        const nameEl = document.createElement('div');
        nameEl.className = 'profile-name';
        nameEl.textContent = p.name;
        
        // Score
        const scoreEl = document.createElement('div');
        scoreEl.className = 'profile-score';
        scoreEl.textContent = `%${p.currentScore} Eşleşme`;
        
        // Progress bar
        const bar = document.createElement('div');
        bar.className = 'profile-bar';
        const barFill = document.createElement('div');
        barFill.className = 'profile-bar-fill';
        bar.appendChild(barFill);
        
        card.appendChild(rankEl);
        card.appendChild(nameEl);
        card.appendChild(scoreEl);
        card.appendChild(bar);
        
        // Add click event listener to open modal
        card.addEventListener('click', () => {
            showProfileModalForProfile(p);
        });
        
        profileListEl.appendChild(card);
        
        // Store references in state
        p.el = card;
        p.rankEl = rankEl;
        p.scoreEl = scoreEl;
        p.barFillEl = barFill;
        
        // Add primary class to first card
        if (idx === 0) {
            card.classList.add('profile-card-primary');
        }
        
        // Make visible after a moment
        setTimeout(() => {
            card.classList.add('visible');
        }, 50 * idx);
    });
}

/**
 * Capture current positions before reordering (FLIP: First)
 */
function capturePositions() {
    const rects = new Map();
    profileStates.forEach(p => {
        if (!p.el) return;
        rects.set(p.name, p.el.getBoundingClientRect());
    });
    return rects;
}

/**
 * Render profile row with FLIP animation
 * This actually REORDERS the DOM based on current scores
 */
function renderProfileRow() {
    if (!profileListEl) return;
    
    // 1) FLIP: First - Capture old positions BEFORE any changes
    const firstRects = capturePositions();
    
    // Store old order for debugging
    const oldOrder = profileStates.map(p => p.name);
    
    // 2) Sort by current score (this changes the data order!)
    profileStates.sort((a, b) => b.currentScore - a.currentScore);
    
    // Log order change
    const newOrder = profileStates.map(p => p.name);
    const orderChanged = JSON.stringify(oldOrder) !== JSON.stringify(newOrder);
    if (orderChanged) {
        console.log('🔄 Order changed!', {
            old: oldOrder,
            new: newOrder,
            scores: profileStates.map(p => `${p.name}: ${p.currentScore}%`)
        });
    }
    
    // 3) Update content
    profileStates.forEach((p, idx) => {
        const card = p.el;
        if (!card) return;
        
        // Update rank, score, bar
        if (p.rankEl) p.rankEl.textContent = `${idx + 1}. SIRA`;
        if (p.scoreEl) p.scoreEl.textContent = `%${p.currentScore} Eşleşme`;
        if (p.barFillEl) {
            p.barFillEl.style.transform = `scaleX(${p.currentScore / 100})`;
        }
        
        // Highlight first card
        card.classList.toggle('profile-card-primary', idx === 0);
        
        // Set flex order to reorder visually (without removing from DOM)
        card.style.order = idx.toString();
    });
    
    // 4) FLIP: Animate from old to new positions (only if order changed)
    if (orderChanged) {
        // Small delay to ensure order is applied
        requestAnimationFrame(() => {
            animateReorder(firstRects);
        });
    }
}

/**
 * Animate reordering with FLIP technique (FLIP: Invert, Play)
 */
function animateReorder(firstRects) {
    console.log('🎬 Starting FLIP animation with', firstRects.size, 'cards');
    
    // Wait for order changes to take effect in layout
    requestAnimationFrame(() => {
        profileStates.forEach((p, idx) => {
            const el = p.el;
            if (!el) return;
            
            const first = firstRects.get(p.name);
            if (!first) {
                console.log(`⚠️ No first rect for ${p.name}`);
                return;
            }
            
            // FLIP: Last - Get new position AFTER order change
            const last = el.getBoundingClientRect();
            
            // Calculate horizontal distance
            const dx = first.left - last.left;
            
            console.log(`📍 ${p.name} → rank ${idx + 1}: dx = ${dx.toFixed(1)}px (${first.left.toFixed(1)} → ${last.left.toFixed(1)})`);
            
            // Skip if no movement
            if (Math.abs(dx) < 1) {
                console.log(`  ✅ No movement needed`);
                return;
            }
            
            // FLIP: Invert - Move to old position instantly (no transition)
            el.style.transition = 'none';
            el.style.transform = `translateX(${dx}px)`;
            
            // Force a reflow to ensure the transform is applied
            el.offsetHeight;
            
            // FLIP: Play - Animate to new position smoothly (SLOWER)
            requestAnimationFrame(() => {
                el.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Smooth ease, longer duration
                el.style.transform = 'translateX(0)';
                console.log(`  ✨ ${p.name} sliding from ${dx.toFixed(0)}px → 0`);
            });
        });
    });
}

/**
 * Get animation progress (0-1)
 */
function getAnimationProgress() {
    if (!totalSamples || totalSamples === 0) return 0;
    return Math.max(0, Math.min(1, currentIndex / totalSamples));
}

/**
 * Easing function for smooth score increase
 */
function easeOutQuad(t) {
    return t * (2 - t);
}

/**
 * Update profile scores - parallel to graph with delayed starts
 */
function updateProfileScores() {
    const rawProgress = getAnimationProgress();
    
    // Each profile grows parallel to graph, but starts at different times
    profileStates.forEach(p => {
        let effectiveProgress = 0;
        
        if (rawProgress < p.startDelay) {
            // Before waking up: stay at 0
            effectiveProgress = 0;
        } else {
            // After waking up: grow from 0 to 100% in remaining time
            const timeSinceStart = rawProgress - p.startDelay;
            const timeToGrow = 1.0 - p.startDelay;
            
            // Progress from 0 to 1 over the remaining time
            effectiveProgress = timeSinceStart / timeToGrow;
            
            // Clamp to 0-1 (will reach 100% when graph reaches 100%)
            effectiveProgress = Math.max(0, Math.min(1, effectiveProgress));
        }
        
        // Apply easing for smooth growth
        const t = easeOutQuad(effectiveProgress);
        
        // Score grows parallel to graph: at graph 100%, score will be at finalScore
        p.currentScore = Math.round(p.finalScore * t);
    });
    
    // Render with FLIP animation
    renderProfileRow();
}


/**
 * Start profile score loop
 */
function startProfileScoreLoop() {
    if (profileScoreTimer) clearInterval(profileScoreTimer);
    
    // Create cards once with state references
    createProfileCards();
    
    console.log('▶️ Starting profile animation loop...');
    
    // Update every 400ms (faster updates = more reordering opportunities)
    profileScoreTimer = setInterval(() => {
        const progress = getAnimationProgress();
        
        updateProfileScores();
        
        // Check if animation is complete (use 0.99 to catch near-complete states)
        if (progress >= 0.99) {
            console.log('🏁 Animation complete! Highlighting winner... (progress:', (progress * 100).toFixed(1) + '%)');
            clearInterval(profileScoreTimer);
            profileScoreTimer = null;
            // Small delay to ensure final scores are rendered
            setTimeout(() => {
                highlightFinalWinner();
            }, 200);
        }
    }, 400);
}

/**
 * Stop profile score loop
 */
function stopProfileScoreLoop() {
    if (profileScoreTimer) {
        clearInterval(profileScoreTimer);
        profileScoreTimer = null;
    }
}

/**
 * Highlight the winning profile at the end
 */
function highlightFinalWinner() {
    if (!profileListEl) return;
    
    // Highlight the first card (highest score)
    const firstProfile = profileStates[0];
    if (firstProfile && firstProfile.el) {
        firstProfile.el.classList.add('profile-card-winner');
    }
    
    // Show "View Profile" button
    if (viewProfileBtn) {
        viewProfileBtn.classList.remove('hidden');
    }
    
    console.log('🏆 Winner highlighted:', firstProfile?.name);
}

/**
 * Show profile detail modal (for button click - shows winner)
 */
function showProfileModal() {
    if (!profileModal || profileStates.length === 0) return;
    
    // Get the winner (first profile)
    const winner = profileStates[0];
    showProfileModalForProfile(winner);
}

/**
 * Show profile detail modal for a specific profile
 */
function showProfileModalForProfile(profile) {
    if (!profileModal || !profile) return;
    
    // Find the profile's current rank
    const rank = profileStates.findIndex(p => p.name === profile.name) + 1;
    
    // Update modal content
    const modalRank = document.querySelector('.profile-modal-rank');
    if (modalRank) {
        if (rank === 1) {
            modalRank.textContent = '🏆 1. SIRA';
            modalRank.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        } else {
            modalRank.textContent = `${rank}. SIRA`;
            modalRank.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        }
    }
    
    if (modalProfileName) {
        modalProfileName.textContent = profile.name;
    }
    if (modalProfileDesc) {
        const description = profileDescriptions[profile.name] || "Bu profil hakkında detaylı bilgi yakında eklenecek.";
        modalProfileDesc.textContent = description;
    }
    
    // Show modal
    profileModal.classList.remove('hidden');
    
    console.log('📖 Showing profile:', profile.name, `(Rank: ${rank})`);
}

/**
 * Hide profile detail modal
 */
function hideProfileModal() {
    if (profileModal) {
        profileModal.classList.add('hidden');
    }
}

// Initialize
updateStatus('Başlamak için bir CSV dosyası yükleyin...', '');

