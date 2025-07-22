import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

// Motivasyon mesajları
const motivationMessages = [
    {
        main: "Sağlıklı bir yaşam için ilk adımı attın!",
        sub: "Her gün, her adım, her ter damlası seni hedefine yaklaştırıyor."
    },
    {
        main: "Bugün kendin için bir şeyler yap!",
        sub: "Küçük değişiklikler büyük sonuçlar doğurur."
    },
    {
        main: "Vücudun sana teşekkür edecek!",
        sub: "Sağlıklı yaşam, mutlu yaşam demektir."
    },
    {
        main: "Hedeflerine ulaşmak için hazırsın!",
        sub: "Her gün yeni bir başlangıç, her gün yeni bir fırsat."
    }
];

// Rastgele motivasyon mesajı seç
function updateMotivationMessage() {
    const randomIndex = Math.floor(Math.random() * motivationMessages.length);
    const message = motivationMessages[randomIndex];
    document.getElementById('motivationText').textContent = message.main;
    document.getElementById('motivationSubText').textContent = message.sub;
}

// Kullanıcı durumunu kontrol et
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Kullanıcı giriş yapmış
        updateMotivationMessage();
    } else {
        // Kullanıcı giriş yapmamış, ana sayfaya yönlendir
        window.location.href = 'index.html';
    }
});

// Çıkış yap
window.logout = async function() {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        alert('Çıkış yapılırken bir hata oluştu: ' + error.message);
    }
}; 