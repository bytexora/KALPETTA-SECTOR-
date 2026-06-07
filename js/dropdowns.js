// --- CUSTOM DROPDOWNS ---
const categoryOptions = [
    { value: '', label: 'All Categories' }, { value: 'Lower Primary', label: 'Lower Primary' }, { value: 'Upper Primary', label: 'Upper Primary' },
    { value: 'High School', label: 'High School' }, { value: 'Higher Secondary', label: 'Higher Secondary' }, { value: 'Junior', label: 'Junior' },
    { value: 'Senior', label: 'Senior' }, { value: 'General', label: 'General' }, { header: 'Girls Categories' },
    { value: 'Lower Primary (Girls)', label: 'Lower Primary (Girls)' }, { value: 'Upper Primary (Girls)', label: 'Upper Primary (Girls)' },
    { value: 'High School (Girls)', label: 'High School (Girls)' }, { value: 'Higher Secondary (Girls)', label: 'Higher Secondary (Girls)' }, { value: 'Campus (Girls)', label: 'Campus (Girls)' }
];

function renderDropOpts(id, opts, selVal, funcName) {
    let el = document.getElementById(id); if(!el) return;
    let html = '';
    opts.forEach(o => {
        if(o.header) html += `<div style="padding:10px 15px; font-size:11px; font-weight:bold; color:var(--text-muted); text-transform:uppercase; background:rgba(0,0,0,0.3);">${o.header}</div>`;
        else {
            let isSel = o.value === selVal;
            let icon = isSel ? `<i class="fa-solid fa-circle-dot text-accent"></i>` : `<i class="fa-regular fa-circle text-muted"></i>`;
            let cls = isSel ? 'font-bold text-white' : 'text-muted';
            html += `<div class="dropdown-item" onclick="${funcName}('${o.value}', '${o.label.replace(/'/g,"\\'")}')"><span class="${cls}">${o.label}</span>${icon}</div>`;
        }
    });
    el.innerHTML = html;
}

function toggleDrop(id) {
    const el = document.getElementById(id);
    const isShowing = el.classList.contains('show');
    document.querySelectorAll('.custom-dropdown-menu').forEach(d => d.classList.remove('show'));
    if (!isShowing) el.classList.add('show');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown-container')) document.querySelectorAll('.custom-dropdown-menu').forEach(d => d.classList.remove('show'));
});
