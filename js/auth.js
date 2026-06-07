// --- AUTHENTICATION ---
function verifyAdmin() {
    let e = document.getElementById('adminEmail').value, p = document.getElementById('adminPass').value;
    let btn = document.getElementById('loginBtn');
    if(!e || !p) return showToast("Enter credentials", "error");
    
    btn.innerHTML = '<i class="fa-solid fa-spinner loader-spin"></i> Verifying...';
    auth.signInWithEmailAndPassword(e, p)
        .then(() => { btn.innerText = 'Login securely'; showToast("Access Granted", "success"); })
        .catch(err => { btn.innerText = 'Login securely'; showToast("Invalid Credentials", "error"); });
}

function logoutAdmin() {
    auth.signOut().then(() => {
        showToast("Logged out securely", "success");
        showSection('home');
    }).catch(err => showToast(err.message, "error"));
}