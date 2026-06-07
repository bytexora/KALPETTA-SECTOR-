// 🌟 SAVE / UPDATE RESULT (WITH UNIQUE ID & TIMESTAMP) 🌟
function saveResult() {
    let no = document.getElementById('resNo').value;
    let cr = document.getElementById('admCat').value;
    let pr = document.getElementById('admProg').value;
    
    if(!no || !pr) return showToast("Fill missing details", "error");
    
    let p = cr.includes('(Girls)') ? `${pr} (Girls)` : pr;
    let c = cr.replace(' (Girls)', '').trim();
    let w1 = getF(1), w2 = getF(2), w3 = getF(3);
    let btn = document.getElementById('saveResBtn');
    
    btn.innerHTML = '<i class="fa-solid fa-spinner loader-spin"></i> Saving...';
    
    // പുതിയ റിസൾട്ട് ആണോ അതോ എഡിറ്റ് ആണോ എന്ന് നോക്കുന്നു
    let isNew = !window.editTargetId;
    
    // പുതിയതാണെങ്കിൽ Firebase തന്നെ ഒരു Unique ID ഉണ്ടാക്കും, അല്ലെങ്കിൽ പഴയ ID എടുക്കും
    let saveKey = isNew ? db.ref('results').push().key : window.editTargetId; 

    let dataToSave = {
        cat: c, 
        item: p, 
        w1: JSON.stringify(w1), 
        w2: JSON.stringify(w2), 
        w3: JSON.stringify(w3)
    };
    
    // പുതിയ റിസൾട്ടിന് മാത്രം ടൈംസ്റ്റാമ്പ് വെക്കുന്നു (ഓർഡർ കറക്റ്റ് ആവാൻ)
    if(isNew) {
        dataToSave.timestamp = Date.now();
    }

    // .update ഉപയോഗിച്ച് സുരക്ഷിതമായി ഡാറ്റാബേസിൽ സേവ് ചെയ്യുന്നു
    db.ref('results/' + saveKey).update(dataToSave, err => {
        btn.innerText = 'Save Result'; 
        if(err) {
            showToast("Failed to save", "error"); 
        } else { 
            showToast("Saved Successfully", "success"); 
            window.editTargetId = null; // സേവ് ചെയ്ത ശേഷം എഡിറ്റ് ഐഡി ക്ലിയർ ചെയ്യുന്നു
            resetForm(); 
        }
    });
}

// 🌟 RENDER ADMIN RESULTS (LIST VIEW) 🌟
function renderAdminResults() {
    let s = document.getElementById('admSearch').value.toLowerCase();
    document.getElementById('adminResultsList').innerHTML = allData.filter(d => (d.item + d.cat).toLowerCase().includes(s)).map(d => `
        <div class="glass-panel flex items-center justify-between" style="padding:15px;">
            <div style="flex:1">
                <div class="flex gap-2 items-center" style="margin-bottom:5px; flex-wrap:wrap;">
                    <span style="background:rgba(245, 158, 11, 0.1); color:var(--gold); border:1px solid rgba(245, 158, 11, 0.2); padding:2px 6px; border-radius:5px; font-size:0.7rem; font-weight:bold;">${d.no}</span>
                    <span style="background:rgba(59, 130, 246, 0.1); color:var(--info); border:1px solid rgba(59, 130, 246, 0.2); padding:2px 6px; border-radius:5px; font-size:0.6rem; font-weight:bold; text-transform:uppercase;">${d.cat}</span>
                </div>
                <h4 style="margin:0; font-size:1.05rem;">${d.item}</h4>
            </div>
            <div class="flex gap-2">
                <button onclick="editRes('${d.id}')" class="btn-icon" style="background:rgba(59,130,246,0.1); color:var(--info); border:1px solid rgba(59,130,246,0.2);"><i class="fa-solid fa-pen"></i></button>
                <button onclick="delRes('${d.id}')" class="btn-icon" style="background:rgba(239,68,68,0.1); color:var(--danger); border:1px solid rgba(239,68,68,0.2);"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>`).join('');
}

// 🌟 EDIT RESULT 🌟
function editRes(id) {
    let item = allData.find(d => d.id === id); 
    if(!item) return; 
    
    window.editTargetId = id; // ഡാറ്റാബേസ് അഡ്രസ്സ് (ID) സേവ് ചെയ്യുന്നു
    editingNo = parseInt(item.no); // കാറ്റഗറി ഡ്രോപ്പ്ഡൗണിന് വേണ്ടി
    
    document.getElementById('resNo').value = item.no; 
    document.getElementById('resNo').setAttribute('data-editing', 'true');
    
    let c = item.item.includes('(Girls)') ? `${item.cat} (Girls)` : item.cat; 
    admCatSel(c, c); 
    setTimeout(() => { admProgSel(item.item.replace(' (Girls)', '').trim(), item.item.replace(' (Girls)', '').trim()); }, 50);
    
    [1, 2, 3].forEach(r => document.getElementById(`g${r}`).innerHTML = '');
    JSON.parse(item.w1 || "[]").forEach(w => addInput(1, w.n, w.u, w.c)); 
    JSON.parse(item.w2 || "[]").forEach(w => addInput(2, w.n, w.u, w.c)); 
    JSON.parse(item.w3 || "[]").forEach(w => addInput(3, w.n, w.u, w.c));
    
    document.getElementById('saveResBtn').innerText = 'Update Result'; 
    window.scrollTo(0, 0); 
    showToast("Loaded for editing", "success");
}

// 🌟 DELETE CONFIRMATION 🌟
function delRes(id) { 
    delTarget = id; // Unique ID വെച്ച് ഡിലീറ്റ് ചെയ്യാൻ സെറ്റ് ചെയ്യുന്നു
    
    // പോപ്പ് അപ്പിൽ കാണിക്കാൻ മാത്രം സ്ക്രീനിലെ നമ്പർ എടുക്കുന്നു
    let item = allData.find(d => d.id === id);
    let displayNo = item ? item.no : "";
    
    openConfirm('Delete Result?', `Remove result no: ${displayNo}?`, 'fa-solid fa-trash', 'danger', execDel); 
}

// 🌟 EXECUTE DELETE 🌟
function execDel() { 
    if(!delTarget) return; 
    
    // ആ Unique ID വെച്ച് ഡാറ്റാബേസിൽ നിന്ന് റിമൂവ് ചെയ്യുന്നു
    db.ref('results/' + delTarget).remove().then(() => { 
        showToast("Deleted Successfully", "success"); 
        closeModal('confirmModal'); 
    }); 
}
