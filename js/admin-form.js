// --- ADMIN FORM CONTROLS ---
function admCatSel(v, l) {
    document.getElementById('admCat').value = v; 
    document.getElementById('admCatLabel').innerText = l; 
    document.getElementById('admCatDrop').classList.remove('show');
    renderDropOpts('admCatDrop', categoryOptions.filter(o=>o.value!==''), v, 'admCatSel'); 
    admCatChange();
}

function admProgSel(v, l) {
    if(!v) return; 
    document.getElementById('admProg').value = v; 
    document.getElementById('admProgLabel').innerText = l; 
    document.getElementById('admProgLabel').className = 'font-bold text-white truncate'; 
    document.getElementById('admProgDrop').classList.remove('show');
    
    let c = document.getElementById('admCat').value;
    let isG = c.includes('(Girls)');
    let bC = c.replace(' (Girls)','').trim();
    let p = categoryPrograms[c]||[];
    
    p = p.filter(x => !allData.some(d => d.cat===bC && d.item===(isG?`${x} (Girls)`:x) && parseInt(d.no)!==editingNo));
    renderDropOpts('admProgDrop', p.length?p.map(x=>({value:x,label:x})):[{value:'',label:'All Added!'}], v, 'admProgSel');
}

function admCatChange() {
    let c = document.getElementById('admCat').value;
    let isG = c.includes('(Girls)');
    let bC = c.replace(' (Girls)','').trim();
    let p = categoryPrograms[c]||[];
    
    p = p.filter(x => !allData.some(d => d.cat===bC && d.item===(isG?`${x} (Girls)`:x) && parseInt(d.no)!==editingNo));
    
    if(!p.length) { 
        document.getElementById('admProgLabel').innerText='All Added!'; 
        document.getElementById('admProgLabel').className='font-bold text-accent truncate'; 
        document.getElementById('admProg').value=''; 
    } else { 
        document.getElementById('admProgLabel').innerText='Select Program'; 
        document.getElementById('admProgLabel').className='text-muted truncate'; 
        document.getElementById('admProg').value=''; 
    }
    renderDropOpts('admProgDrop', p.length?p.map(x=>({value:x,label:x})):[{value:'',label:'All Added!'}], '', 'admProgSel');
}

function addInput(r, n='', u='', c='') {
    let div = document.createElement('div'); 
    div.className = 'winner-input-block';
    let dId = 'drop_' + Math.random().toString(36).substr(2,9);
    
    let uOpts = unitsList.map(un => `<div class="dropdown-item" onclick="selUnit('${dId}','${un}')"><span class="${u===un?'font-bold text-white':'text-muted'}">${un}</span>${u===un?'<i class="fa-solid fa-check text-accent"></i>':''}</div>`).join('');
    
    div.innerHTML = `
        <button class="remove-btn" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
        <div class="flex flex-col gap-2">
            <input type="text" placeholder="Name" class="admin-input w-name" value="${n}" style="margin:0; padding:10px 15px;">
            <div class="input-row" style="margin:0;">
                <input type="number" placeholder="Chest" class="admin-input w-small w-chest text-center" value="${c}" style="margin:0; padding:10px;">
                <div class="custom-dropdown-container w-large">
                    <div class="admin-input flex justify-between items-center" style="margin:0; padding:10px 15px; cursor:pointer;" onclick="toggleDrop('${dId}')">
                        <span id="lbl_${dId}" class="${u?'font-bold text-white':'text-muted'} truncate">${u||'Select Unit'}</span> <i class="fa-solid fa-chevron-down text-muted"></i>
                    </div>
                    <div id="${dId}" class="custom-dropdown-menu" style="right:0; left:auto; min-width:100%; width:max-content; z-index:90;">${uOpts}</div>
                    <input type="hidden" class="w-unit" id="val_${dId}" value="${u}">
                </div>
            </div>
        </div>`;
    document.getElementById(`g${r}`).appendChild(div);
}

function selUnit(id, v) {
    document.getElementById('val_'+id).value=v; 
    document.getElementById('lbl_'+id).innerText=v; 
    document.getElementById('lbl_'+id).className='font-bold text-white truncate'; 
    document.getElementById(id).classList.remove('show');
    
    Array.from(document.getElementById(id).children).forEach(o=>{ 
        let s=o.querySelector('span'); 
        if(s.innerText===v){ 
            s.className='font-bold text-white'; 
            if(!o.querySelector('i')) o.innerHTML+='<i class="fa-solid fa-check text-accent"></i>'; 
        } else { 
            s.className='text-muted'; 
            let i=o.querySelector('i'); 
            if(i) i.remove(); 
        } 
    });
}

function getF(r) { 
    let a=[]; 
    document.querySelectorAll(`#g${r} > div`).forEach(row=>{ 
        let n=row.querySelector('.w-name').value, u=row.querySelector('.w-unit').value, c=row.querySelector('.w-chest').value; 
        if(n&&u) a.push({n,u,c}); 
    }); 
    return a; 
}

function resetForm() { 
    editingNo=null; 
    document.getElementById('resNo').value=latestNumber; 
    admCatSel('Lower Primary','Lower Primary'); 
    [1,2,3].forEach(r=>{ document.getElementById(`g${r}`).innerHTML=''; addInput(r); }); 
    document.getElementById('saveResBtn').innerText='Save Result'; 
}
