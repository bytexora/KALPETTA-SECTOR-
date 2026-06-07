// --- UI UTILS & NAVIGATION ---

function showToast(msg, type='success') {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid fa-${type==='success'?'circle-check':'circle-xmark'}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function showSection(id) {
    ['home', 'results', 'gallery', 'login', 'admin-panel', 'about'].forEach(s => {
        let el = document.getElementById(s);
        if(el) { el.classList.remove('show-section'); el.classList.add('hidden'); }
    });
    let target = document.getElementById(id);
    if(target) { target.classList.remove('hidden'); target.classList.add('show-section'); }
    window.scrollTo(0,0);
}

function toggleMenu() {
    let m = document.getElementById('mobileMenu');
    if(m) {
        if(m.classList.contains('show')) m.classList.remove('show'); 
        else m.classList.add('show');
    }
}

function navTo(id) { 
    let m = document.getElementById('mobileMenu');
    if(m) m.classList.remove('show');
    showSection(id); 
}

function toggleAcc(id) {
    let b = document.getElementById(id.toString().includes('adm') ? id : 'acc-'+id);
    let i = document.getElementById(id.toString().includes('adm') ? id.replace('body-','icon-') : 'icon-acc-'+id);
    if(b && i) {
        if(b.classList.contains('show')) { b.classList.remove('show'); i.style.transform='rotate(0)'; }
        else { b.classList.add('show'); i.style.transform='rotate(180deg)'; }
    }
}

function switchTab(tab) {
    if(tab==='results') {
        document.getElementById('adminTabResults').classList.remove('hidden');
        document.getElementById('adminTabGallery').classList.add('hidden');
        document.getElementById('tabResBtn').style.background = 'var(--info)'; 
        document.getElementById('tabResBtn').style.color = 'white';
        document.getElementById('tabGalBtn').style.background = 'rgba(255,255,255,0.1)'; 
        document.getElementById('tabGalBtn').style.color = 'var(--text-muted)';
    } else {
        document.getElementById('adminTabResults').classList.add('hidden');
        document.getElementById('adminTabGallery').classList.remove('hidden');
        document.getElementById('tabGalBtn').style.background = 'var(--accent)'; 
        document.getElementById('tabGalBtn').style.color = 'white';
        document.getElementById('tabResBtn').style.background = 'rgba(255,255,255,0.1)'; 
        document.getElementById('tabResBtn').style.color = 'var(--text-muted)';
    }
}

function closeModal(id) { 
    let el = document.getElementById(id);
    if(el) el.style.display = 'none'; 
}