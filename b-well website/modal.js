// Sayfa yüklendiğinde modal'ı gizle
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("authModal").classList.add("hidden");
});

function showLogin() {
    document.getElementById("authModal").classList.remove("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("signupForm").classList.add("hidden");
}

function showSignup() {
    document.getElementById("authModal").classList.remove("hidden");
    document.getElementById("signupForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
}

function closeModal() {
    document.getElementById("authModal").classList.add("hidden");
}

// Bu fonksiyonları window objesine ekle (onclick çalışsın diye)
window.showLogin = showLogin;
window.showSignup = showSignup;
window.closeModal = closeModal;

// Ölçüm Modal Fonksiyonları
function showMeasurementModal() {
    document.getElementById("measurementModal").classList.remove("hidden");
}

function closeMeasurementModal() {
    document.getElementById("measurementModal").classList.add("hidden");
    document.getElementById("results").classList.add("hidden");
    document.getElementById("measurementForm").reset();
}

function calculateMeasurements(event) {
    event.preventDefault();
    
    // Değerleri al
    const weight = parseFloat(document.getElementById("weight").value);
    const waist = parseFloat(document.getElementById("waist").value);
    const hip = parseFloat(document.getElementById("hip").value);
    const neck = parseFloat(document.getElementById("neck").value);
    const height = parseFloat(document.getElementById("height").value);
    
    // BMI hesapla (kg/m²)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // WHR hesapla (Bel/Kalça oranı)
    const whr = waist / hip;
    
    // Vücut yağ oranı hesapla (Navy Body Fat Formula)
    // Erkekler için: %Fat = 495 / (1.0324 - 0.19077 * log10(bel - boyun) + 0.15456 * log10(boy)) - 450
    // Kadınlar için: %Fat = 495 / (1.29579 - 0.35004 * log10(bel + kalça - boyun) + 0.22100 * log10(boy)) - 450
    // Şimdilik erkek formülünü kullanıyoruz
    const bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    
    // Sonuçları göster
    document.getElementById("bmiResult").textContent = bmi.toFixed(1);
    document.getElementById("whrResult").textContent = whr.toFixed(2);
    document.getElementById("fatResult").textContent = bodyFat.toFixed(1);
    
    // Sonuçları görünür yap
    document.getElementById("results").classList.remove("hidden");
}

// Fonksiyonları window objesine ekle
window.showMeasurementModal = showMeasurementModal;
window.closeMeasurementModal = closeMeasurementModal;
window.calculateMeasurements = calculateMeasurements;
  