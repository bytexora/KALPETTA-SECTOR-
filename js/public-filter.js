// --- PUBLIC FILTERS ---
function pubCatSel(v, l) {
    document.getElementById('pubCatFilter').value = v; 
    document.getElementById('pubCatLabel').innerText = l; 
    document.getElementById('pubCatLabel').className = v ? 'font-bold text-white truncate' : 'text-muted truncate'; 
    document.getElementById('pubCatDrop').classList.remove('show');
    
    renderDropOpts('pubCatDrop', categoryOptions, v, 'pubCatSel'); 
    updatePubProgOpts(); 
    filterPublicResults();
}

function pubProgSel(v, l) {
    document.getElementById('pubProgFilter').value = v; 
    document.getElementById('pubProgLabel').innerText = l; 
    document.getElementById('pubProgLabel').className = v ? 'font-bold text-white truncate' : 'text-muted truncate'; 
    document.getElementById('pubProgDrop').classList.remove('show');
    
    let cat = document.getElementById('pubCatFilter').value; 
    let opts = [{value:'', label:'All Programs'}, ...(categoryPrograms[cat]||[]).map(p=>({value:p, label:p}))];
    
    renderDropOpts('pubProgDrop', opts, v, 'pubProgSel'); 
    filterPublicResults();
}

function updatePubProgOpts() {
    let cat = document.getElementById('pubCatFilter').value; 
    let opts = [{value:'', label:'All Programs'}, ...(categoryPrograms[cat]||[]).map(p=>({value:p, label:p}))];
    
    document.getElementById('pubProgFilter').value = ''; 
    document.getElementById('pubProgLabel').innerText = 'All Programs'; 
    document.getElementById('pubProgLabel').className = 'text-muted truncate';
    
    renderDropOpts('pubProgDrop', opts, '', 'pubProgSel');
}

function filterPublicResults() { 
    if(typeof renderPubRes === 'function') renderPubRes(); 
}
