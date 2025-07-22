import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDuP9FJQgLDM_O23P6G9vTamjOhR9UeN_4",
    authDomain: "bwellapp.firebaseapp.com",
    projectId: "bwellapp",
    storageBucket: "bwellapp.firebasestorage.app",
    messagingSenderId: "685901944017",
    appId: "1:685901944017:web:b06fa61e797cc57140e1f0",
    measurementId: "G-LSSZS914W4"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Kullanıcı durumunu kontrol et
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Kullanıcı giriş yapmış
        document.getElementById('userEmail').textContent = user.email;
        await loadUserData(user.uid);
    } else {
        // Kullanıcı giriş yapmamış, ana sayfaya yönlendir
        window.location.href = 'index.html';
    }
});

// Kullanıcı verilerini yükle
async function loadUserData(userId) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
        const data = userDoc.data();
        // Form alanlarını doldur
        document.getElementById('name').value = data.name || '';
        document.getElementById('age').value = data.age || '';
        document.getElementById('gender').value = data.gender || '';
        document.getElementById('height').value = data.height || '';
        document.getElementById('weight').value = data.weight || '';
        document.getElementById('activity').value = data.activity || '';
        
        // Hesaplamaları güncelle
        updateCalculations();
    }
}

// Kişisel bilgileri kaydet
document.getElementById('personalInfoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const userData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value
    };

    try {
        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
        alert('Kişisel bilgileriniz kaydedildi!');
    } catch (error) {
        alert('Hata: ' + error.message);
    }
});

// Vücut ölçülerini kaydet
document.getElementById('measurementsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const measurementsData = {
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        activity: document.getElementById('activity').value
    };

    try {
        await setDoc(doc(db, 'users', user.uid), measurementsData, { merge: true });
        alert('Vücut ölçüleriniz kaydedildi!');
        updateCalculations();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
});

// Hesaplamaları güncelle
function updateCalculations() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activity = parseFloat(document.getElementById('activity').value);

    if (height && weight) {
        // BMI hesapla
        const bmi = weight / Math.pow(height / 100, 2);
        document.getElementById('bmiResult').textContent = bmi.toFixed(1);

        // İdeal kilo aralığı hesapla
        const minWeight = 18.5 * Math.pow(height / 100, 2);
        const maxWeight = 24.9 * Math.pow(height / 100, 2);
        document.getElementById('idealWeightResult').textContent = 
            `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`;

        // Günlük kalori ihtiyacı hesapla
        if (age && gender && activity) {
            let bmr;
            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
            const tdee = bmr * activity;
            document.getElementById('calorieResult').textContent = 
                `${Math.round(tdee)} kalori/gün`;
        }
    }
}

// Çıkış yap
window.logout = async function() {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        alert('Çıkış yapılırken bir hata oluştu: ' + error.message);
    }
}; 