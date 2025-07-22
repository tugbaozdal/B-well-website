import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuP9FJQgLDM_O23P6G9vTamjOhR9UeN_4",
  authDomain: "bwellapp.firebaseapp.com",
  projectId: "bwellapp",
  storageBucket: "bwellapp.firebasestorage.app",
  messagingSenderId: "685901944017",
  appId: "1:685901944017:web:b06fa61e797cc57140e1f0",
  measurementId: "G-LSSZS914W4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google hesap seçim penceresi ayarları
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Kullanıcı durumunu kontrol et
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Kullanıcı giriş yapmış
    updateUIForLoggedInUser();
  } else {
    // Kullanıcı çıkış yapmış
    updateUIForLoggedOutUser();
  }
});

// Giriş yapmış kullanıcı için UI güncelleme
function updateUIForLoggedInUser() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.innerHTML = `
    <li><a href="calorie-search.html"><i class="fas fa-calculator"></i> Kalori Hesapla</a></li>
    <li><a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Çıkış Yap</a></li>
    <li><a href="profile.html"><i class="fas fa-user"></i> Profil</a></li>
  `;
  closeModal();
}

// Çıkış yapmış kullanıcı için UI güncelleme
function updateUIForLoggedOutUser() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.innerHTML = `
    <li><a href="#">Kalori Hesapla</a></li>
    <li><a href="#" onclick="showLogin()">Giriş Yap</a></li>
    <li><a href="#" class="register-btn" onclick="showSignup()">Üye Ol</a></li>
  `;
}

// Hata mesajlarını Türkçeleştirme
function getErrorMessage(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresi zaten kullanımda.';
    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi.';
    case 'auth/operation-not-allowed':
      return 'E-posta/şifre girişi devre dışı bırakılmış.';
    case 'auth/weak-password':
      return 'Şifre çok zayıf. En az 6 karakter kullanın.';
    case 'auth/user-disabled':
      return 'Bu kullanıcı hesabı devre dışı bırakılmış.';
    case 'auth/user-not-found':
      return 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.';
    case 'auth/wrong-password':
      return 'Hatalı şifre.';
    default:
      return 'Bir hata oluştu: ' + error.message;
  }
}

// Üye Ol
window.signup = function () {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Kayıt başarılı! Hoş geldiniz.");
      closeModal();
      window.location.href = 'dashboard.html';
    })
    .catch((error) => alert(getErrorMessage(error)));
};

// Giriş Yap
window.login = function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Giriş başarılı! Hoş geldiniz.");
      closeModal();
      window.location.href = 'dashboard.html';
    })
    .catch((error) => alert(getErrorMessage(error)));
};

// Çıkış Yap
window.logout = function() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.error("Çıkış yapılırken hata oluştu:", error);
      alert("Çıkış yapılırken bir hata oluştu: " + error.message);
    });
};

// Gmail ile giriş
window.loginWithGoogle = function() {
  // Önce mevcut popup'ı kapat
  const existingPopup = document.querySelector('.modal');
  if (existingPopup) {
    existingPopup.classList.remove('active');
  }

  signInWithPopup(auth, googleProvider)
    .then((result) => {
      // Giriş başarılı
      const user = result.user;
      console.log("Google ile giriş başarılı:", user.email);
      alert("Giriş başarılı! Hoş geldiniz.");
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      console.error("Google giriş hatası:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Giriş penceresi kapatıldı. Lütfen tekrar deneyin.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        alert('Giriş işlemi iptal edildi. Lütfen tekrar deneyin.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Giriş penceresi engellendi. Lütfen pop-up engelleyiciyi kapatıp tekrar deneyin.');
      } else {
        alert('Bir hata oluştu: ' + error.message);
      }
    });
};

// Modal kapatma fonksiyonu
window.closeModal = function() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
};