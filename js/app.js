window.addEventListener('DOMContentLoaded', () => { try { if(typeof renderDropOpts === 'function' && document.getElementById('pubCatDrop')) { renderDropOpts('pubCatDrop', categoryOptions, '', 'pubCatSel'); updatePubProgOpts(); } if(typeof renderDropOpts === 'function' && document.getElementById('admCatDrop')) { renderDropOpts('admCatDrop', categoryOptions.filter(o=>o.value!==''), 'Lower Primary', 'admCatSel'); } } catch(e) {} });
auth.onAuthStateChanged(user => { currentUser = user; let mAdmin = document.getElementById('menuAdmin'); let mGuest = document.getElementById('menuGuest'); if(user) { if(mGuest) mGuest.classList.add('hidden'); if(mAdmin) { mAdmin.classList.remove('hidden'); mAdmin.classList.add('flex'); } if(!document.getElementById('admin-panel').classList.contains('show-section')) showSection('admin-panel'); } else { if(mGuest) mGuest.classList.remove('hidden'); if(mAdmin) { mAdmin.classList.add('hidden'); mAdmin.classList.remove('flex'); } if(document.getElementById('admin-panel').classList.contains('show-section')) showSection('home'); } });

// 🌟 FIXED DATA VARIABLES (To prevent Empty Gallery Bug) 🌟
window.allData = [];
window.galleryData = [];

db.ref('results').on('value', snap => { 
    let data = snap.val(); 
    window.allData = []; 
    if(data) { 
        let tempArr = []; 
        Object.keys(data).forEach(k => { 
            let item = Object.assign({}, data[k]); 
            item.id = k; 
            item.sortTime = item.timestamp ? item.timestamp : (parseInt(item.no || 0) * 1000000); 
            tempArr.push(item); 
        }); 
        tempArr.sort((a, b) => a.sortTime - b.sortTime); 
        tempArr.forEach((item, index) => { 
            item.no = String(index + 1).padStart(2, '0'); 
            window.allData.push(item); 
        }); 
        window.allData.sort((a, b) => parseInt(b.no) - parseInt(a.no)); 
    } 
    window.latestNumber = window.allData.length + 1; 
    let resNoInput = document.getElementById('resNo'); 
    if(resNoInput && !resNoInput.hasAttribute('data-editing')) { resNoInput.value = window.latestNumber; } 
    try { if(typeof renderPubRes === 'function') renderPubRes(); } catch(e){} 
    try { if(typeof renderPublicResults === 'function') renderPublicResults(); } catch(e){} 
    try { if(currentUser && typeof renderAdminResults === 'function') renderAdminResults(); } catch(e){} 
});

db.ref('gallery').on('value', snap => { 
    let data = snap.val(); 
    window.galleryData = []; 
    if(data) { 
        Object.keys(data).forEach(k => { 
            let item = Object.assign({}, data[k]); 
            item.id = k; 
            window.galleryData.push(item); 
        }); 
        window.galleryData.sort((a,b)=>b.timestamp-a.timestamp); 
    } 
    try { if(typeof renderPublicGallery === 'function') renderPublicGallery(); } catch(e){} 
    try { if(typeof renderPubGal === 'function') renderPubGal(); } catch(e){} 
    try { if(currentUser && typeof renderAdmGal === 'function') renderAdmGal(); } catch(e){} 
});

function confirmSaveResult() { let prog = document.getElementById('admProg').value; if(!prog || prog === "") return showToast("Please select a program first!", "error"); openConfirm("Save Result?", "Are you sure you want to publish this result to the portal?", "fa-solid fa-cloud-arrow-up", "success", function() { closeModal('confirmModal'); setTimeout(() => { if(typeof saveResult === 'function') saveResult(); }, 100); }); }
function resetForm() { let resNoInput = document.getElementById('resNo'); if(resNoInput) { resNoInput.removeAttribute('data-editing'); resNoInput.value = window.latestNumber || 1; } let admProg = document.getElementById('admProg'); let admProgLabel = document.getElementById('admProgLabel'); if(admProg) admProg.value = ''; if(admProgLabel) admProgLabel.innerText = 'Select Program'; for(let i=1; i<=3; i++) { let container = document.getElementById('g'+i); if(container) container.innerHTML = ''; } window.editTargetId = null; }

window.posterTemplates = {}; window.activeStudioSlotKey = null;

// 🌟 STRICT DEFAULT SETTINGS 🌟
window.defaultFonts = { resText: { fam: 'Montserrat', size: 85, color: '#6A0453' }, resNum: { fam: 'Montserrat', size: 230, color: '#6A0453' }, cat: { fam: 'Montserrat', size: 75, color: '#000000' }, prog: { fam: 'Montserrat', size: 105, color: '#000000' }, name: { fam: 'Montserrat', size: 80, color: '#000000' }, unit: { fam: 'Montserrat', size: 55, color: '#444444' } };
window.defaultGaps = { resGap: 0, nameUnitGap: 5, winnerGap: 30 };
window.currentStudioFonts = {}; window.currentStudioGaps = {};
window.tempPaletteColor = "#000000"; 

db.ref('poster_templates').on('value', snap => { window.posterTemplates = snap.val() || {}; renderAdminTemplatesListDashboard(); });

function renderAdminTemplatesListDashboard() { let container = document.getElementById('templatesGridContainer'); if(!container) return; let normalKeys = Object.keys(window.posterTemplates).filter(k => k.startsWith('bg') && k !== 'bg_tie'); let maxNormalIndex = Math.max(5, normalKeys.map(k => parseInt(k.replace('bg', '')) || 0).reduce((a, b) => Math.max(a, b), 0)); let html = ''; for (let i = 1; i <= maxNormalIndex; i++) { let slotKey = `bg${i}`; html += buildTemplateRowItemHtml(slotKey, `Template Slot ${i}`, `Result Range: ${((i-1)*10)+1} - ${i*10}`, window.posterTemplates[slotKey] || {}); } html += buildTemplateRowItemHtml('bg_tie', 'Template (Tie Layout)', 'Fallback logic if match ties', window.posterTemplates['bg_tie'] || {}); container.innerHTML = html; }
function buildTemplateRowItemHtml(key, title, subtitle, templateData) { let imgUrl = templateData.url || ""; let thumbContent = imgUrl ? `<img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;">` : `<i class="fa-regular fa-image"></i>`; let delBtn = key !== 'bg_tie' ? `<button onclick="deleteTemplateSlot('${key}', '${title}')" class="btn-icon" style="background:rgba(239,68,68,0.1); color:var(--danger); border:1px solid rgba(239,68,68,0.2); width:34px; height:34px;"><i class="fa-solid fa-trash"></i></button>` : ''; return `<div class="template-list-card"><div class="template-info"><div class="template-thumb">${thumbContent}</div><div><h4 style="margin:0; font-size:0.95rem; color:#fff; font-weight:700;">${title}</h4><p style="margin:4px 0 0 0; font-size:0.75rem; color:var(--text-muted);">${subtitle}</p></div></div><div class="flex gap-2"><button onclick="openStudioWorkspace('${key}', '${title}')" class="btn btn-glass" style="font-size:0.75rem; padding:8px 14px; background:rgba(59,130,246,0.1); border-color:rgba(59,130,246,0.2); color:#fff; margin:0;"><i class="fa-solid fa-sliders text-info"></i> Open Studio</button>${delBtn}</div></div>`; }
function addNewTemplateSlot() { let normalKeys = Object.keys(window.posterTemplates).filter(k => k.startsWith('bg') && k !== 'bg_tie'); let nextNum = Math.max(5, normalKeys.map(k => parseInt(k.replace('bg', '')) || 0).reduce((a, b) => Math.max(a, b), 0)) + 1; showToast(`Added Slot ${nextNum}`, "success"); db.ref('poster_templates/bg' + nextNum).set({ url: "" }); }

// 🌟 PREMIUM MODAL DELETE INCLUDED 🌟
function deleteTemplateSlot(slotKey, label) { 
    if(typeof openConfirm === 'function') {
        openConfirm(
            "Delete Template Slot?", 
            `Are you sure you want to permanently remove <b>${label}</b>? This action cannot be undone.`, 
            "fa-solid fa-trash-can", 
            "danger", 
            function() { 
                closeModal('confirmModal'); 
                db.ref('poster_templates/' + slotKey).remove().then(() => { 
                    showToast("Slot deleted successfully", "success"); 
                }).catch(err => {
                    console.error("Delete Error:", err);
                    showToast("Error deleting slot", "error");
                });
            }
        ); 
    } else {
        let isSure = confirm(`Are you sure you want to permanently remove ${label}?`);
        if (isSure) {
            db.ref('poster_templates/' + slotKey).remove().then(() => { showToast("Slot deleted successfully", "success"); });
        }
    }
}

function openStudioWorkspace(slotKey, label) {
    window.activeStudioSlotKey = slotKey; document.getElementById('studioTitleLabel').innerText = label;
    let templateData = window.posterTemplates[slotKey] || {};
    let bgStyle = templateData.url ? `<img src="${templateData.url}" style="position:absolute; top:0; left:0; width:1080px; height:1354px; object-fit:cover; pointer-events:none;">` : `<div style="position:absolute; top:0; left:0; background:#090d16; width:1080px; height:1354px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:40px;">No Background Uploaded</div>`;

    window.currentStudioFonts = templateData.fonts ? JSON.parse(JSON.stringify(templateData.fonts)) : JSON.parse(JSON.stringify(window.defaultFonts));
    window.currentStudioGaps = templateData.gaps ? JSON.parse(JSON.stringify(templateData.gaps)) : JSON.parse(JSON.stringify(window.defaultGaps));

    let isTie = slotKey === 'bg_tie'; let defNum = isTie ? 1 : ((parseInt(slotKey.replace('bg','')) - 1) % 5) + 1; let defSX = defNum === 5 ? 611 : 174;
    
    // 🌟 FULL NATIVE RESOLUTION LOGIC (NO MATH DIVISIONS!) 🌟
    let sX = templateData.sX !== undefined ? Number(templateData.sX) : defSX; 
    let sY = templateData.sY !== undefined ? Number(templateData.sY) : 174; 
    let sW = templateData.sW !== undefined ? Number(templateData.sW) : 295; 
    let sH = templateData.sH !== undefined ? Number(templateData.sH) : (defNum === 1 ? 160 : 295);
    
    let lX = templateData.lX !== undefined ? Number(templateData.lX) : (defNum === 5 ? 174 : (defNum === 1 ? 469 : 174)); 
    let lY = templateData.lY !== undefined ? Number(templateData.lY) : 469; 
    let lW = templateData.lW !== undefined ? Number(templateData.lW) : 505; 
    let lH = templateData.lH !== undefined ? Number(templateData.lH) : 505;

    let handlesHtml = `<div class="handle handle-tl" style="width:30px;height:30px;top:-15px;left:-15px;border-width:3px;"></div><div class="handle handle-tr" style="width:30px;height:30px;top:-15px;right:-15px;border-width:3px;"></div><div class="handle handle-bl" style="width:30px;height:30px;bottom:-15px;left:-15px;border-width:3px;"></div><div class="handle handle-br" style="width:30px;height:30px;bottom:-15px;right:-15px;border-width:3px;"></div>`;
    
    let demoSmallBox = `<div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; height:100%; pointer-events:none;">
        <div class="dyn-res" style="margin:0;">Result</div>
        <div class="dyn-num" id="preview-dyn-num" style="margin:0;">01</div>
    </div>`;
    
    let demoLargeBox = `<div style="display:flex; flex-direction:column; width:100%; height:100%; pointer-events:none; align-items:flex-start;">
        <div class="header-wrap" style="width:100%;">
            <div class="dyn-cat" style="margin:0;">Junior</div>
            <div class="dyn-prog" style="margin:0;">Story writing</div>
        </div>
        <div style="display:flex; flex-direction:column; width:100%;">
            ${[1,2,3].map(i => `
            <div class="preview-winner-block" style="display:flex; align-items:flex-start; width:100%;">
                <div class="dyn-dot-wrap"><div class="dyn-dot" style="margin:0; line-height:1;">●</div></div>
                <div style="display:flex; flex-direction:column; flex:1; width:100%;">
                    <div class="dyn-name" style="margin:0; word-wrap:break-word; white-space:normal;">Muhammad Hashir</div>
                    <div class="dyn-unit preview-dyn-unit" style="margin:0; word-wrap:break-word; white-space:normal;">Malappuram Unit</div>
                </div>
            </div>`).join('')}
        </div>
    </div>`;

    let board = document.getElementById('studioWorkspaceBoard');
    board.innerHTML = `
        <div id="native-resolution-board" style="position:absolute; top:0; left:0; width:1080px; height:1354px; transform:scale(0.3148148); transform-origin:top left; background:#fff;">
            ${bgStyle}
            <div id="studio-small-box" class="v-box v-box-small draggable resizable" data-type="small" style="position:absolute; left:${sX}px; top:${sY}px; width:${sW}px; height:${sH}px; border: 3px solid rgba(150,150,150,0.8);">
                ${handlesHtml}
                ${demoSmallBox}
            </div>
            <div id="studio-large-box" class="v-box v-box-large draggable resizable" data-type="large" style="position:absolute; left:${lX}px; top:${lY}px; width:${lW}px; height:${lH}px; border: 3px solid rgba(150,150,150,0.8);">
                ${handlesHtml}
                ${demoLargeBox}
            </div>
        </div>
    `;

    document.getElementById('layoutStudioModal').style.display = 'flex';
    initInteractJsStudioEngine();
    
    document.getElementById('gapResNum').value = window.currentStudioGaps.resGap;
    document.getElementById('gapNameUnit').value = window.currentStudioGaps.nameUnitGap;
    document.getElementById('gapWinner').value = window.currentStudioGaps.winnerGap;

    if(typeof loadElementSettings === 'function') loadElementSettings();
    applyStylesToVisuals(); 
}

window.loadElementSettings = function() {
    let elKey = document.getElementById('elementSelect').value;
    let data = window.currentStudioFonts[elKey] || window.defaultFonts[elKey];
    document.getElementById('fontSelect').value = data.fam;
    document.getElementById('fontSelectedText').innerText = data.fam;
    document.getElementById('fontSizeInput').value = data.size;
    let c = data.color || window.defaultFonts[elKey].color;
    window.tempPaletteColor = c;
    document.getElementById('mainColorPreview').style.backgroundColor = c;
};

window.updateStudioFonts = function() {
    let elKey = document.getElementById('elementSelect').value;
    window.currentStudioFonts[elKey].fam = document.getElementById('fontSelect').value || 'Montserrat'; 
    window.currentStudioFonts[elKey].size = parseInt(document.getElementById('fontSizeInput').value) || window.defaultFonts[elKey].size;
    window.currentStudioFonts[elKey].color = window.tempPaletteColor;
    let slotKey = window.activeStudioSlotKey;
    if(slotKey) db.ref(`poster_templates/${slotKey}/fonts`).set(window.currentStudioFonts);
    applyStylesToVisuals();
};

window.updateStudioGaps = function() {
    let gR = parseInt(document.getElementById('gapResNum').value) || 0;
    let gN = parseInt(document.getElementById('gapNameUnit').value) || 0;
    let gW = parseInt(document.getElementById('gapWinner').value) || 0;
    document.getElementById('gapResNumVal').innerText = gR;
    document.getElementById('gapNameUnitVal').innerText = gN;
    document.getElementById('gapWinnerVal').innerText = gW;
    window.currentStudioGaps = { resGap: gR, nameUnitGap: gN, winnerGap: gW };
    let slotKey = window.activeStudioSlotKey;
    if(slotKey) db.ref(`poster_templates/${slotKey}/gaps`).set(window.currentStudioGaps);
    applyStylesToVisuals();
}

// 🌟 100% NATIVE CSS STYLING MATCHING CANVAS 🌟
function applyStylesToVisuals() {
    let smallBox = document.getElementById('studio-small-box'); let largeBox = document.getElementById('studio-large-box');
    if(!smallBox || !largeBox) return;

    let f = window.currentStudioFonts; 
    let g = window.currentStudioGaps;

    let resText = smallBox.querySelector('.dyn-res'); 
    if(resText) { 
        resText.style.fontFamily = f.resText.fam; 
        resText.style.fontSize = f.resText.size + 'px'; 
        resText.style.color = f.resText.color; 
        resText.style.fontStyle = 'italic';
        resText.style.fontWeight = '500';
        resText.style.lineHeight = '1.2';
    }
    
    let resNum = smallBox.querySelector('.dyn-num'); 
    if(resNum) { 
        resNum.style.fontFamily = f.resNum.fam; 
        resNum.style.fontSize = f.resNum.size + 'px'; 
        resNum.style.color = f.resNum.color; 
        resNum.style.fontStyle = 'italic';
        resNum.style.fontWeight = '700';
        resNum.style.lineHeight = '1.0';
        resNum.style.marginTop = g.resGap + 'px'; 
    }

    let cat = largeBox.querySelector('.dyn-cat'); 
    if(cat) { 
        cat.style.fontFamily = f.cat.fam; 
        cat.style.fontSize = f.cat.size + 'px'; 
        cat.style.color = f.cat.color; 
        cat.style.fontWeight = '600';
        cat.style.lineHeight = '1.2'; 
    }
    
    let prog = largeBox.querySelector('.dyn-prog'); 
    if(prog) { 
        prog.style.fontFamily = f.prog.fam; 
        prog.style.fontSize = f.prog.size + 'px'; 
        prog.style.color = f.prog.color; 
        prog.style.fontStyle = 'italic';
        prog.style.fontWeight = '700';
        prog.style.lineHeight = '1.2'; 
    }
    
    let headerWrap = largeBox.querySelector('.header-wrap');
    if(headerWrap) headerWrap.style.marginBottom = '15px'; // Exact mapping with Canvas

    let dotSize = f.name.size * 0.4;
    let dotMargin = f.name.size * 0.3;

    largeBox.querySelectorAll('.preview-winner-block').forEach((el, index) => { 
        if(index > 0) el.style.marginTop = g.winnerGap + 'px'; 
        else el.style.marginTop = '0px';
    });
    
    largeBox.querySelectorAll('.dyn-dot-wrap').forEach(el => {
        el.style.width = dotSize + 'px';
        el.style.marginRight = dotMargin + 'px';
        el.style.marginTop = (f.name.size * 0.25) + 'px'; 
    });

    largeBox.querySelectorAll('.dyn-dot').forEach(el => { 
        el.style.fontFamily = 'Arial, sans-serif'; 
        el.style.fontSize = dotSize + 'px'; 
        el.style.color = f.name.color; 
    });

    largeBox.querySelectorAll('.dyn-name').forEach(el => { 
        el.style.fontFamily = f.name.fam; 
        el.style.fontSize = f.name.size + 'px'; 
        el.style.color = f.name.color; 
        el.style.fontWeight = '600';
        el.style.lineHeight = '1.1';
    });

    largeBox.querySelectorAll('.preview-dyn-unit').forEach(el => { 
        el.style.fontFamily = f.unit.fam; 
        el.style.fontSize = f.unit.size + 'px'; 
        el.style.color = f.unit.color; 
        el.style.fontStyle = 'italic';
        el.style.fontWeight = '600';
        el.style.lineHeight = '1.1';
        el.style.marginTop = g.nameUnitGap + 'px'; 
    });
}

function closeStudioWorkspace() { document.getElementById('layoutStudioModal').style.display = 'none'; window.activeStudioSlotKey = null; }

function initInteractJsStudioEngine() {
    const UI_SCALE = 340 / 1080; // Reversing the CSS Scale
    interact('.v-box').draggable({
        listeners: {
            move(event) {
                const target = event.target; 
                let x = (parseFloat(target.style.left) || 0) + (event.dx / UI_SCALE); 
                let y = (parseFloat(target.style.top) || 0) + (event.dy / UI_SCALE);
                x = Math.max(0, Math.min(x, 1080 - parseFloat(target.style.width))); 
                y = Math.max(0, Math.min(y, 1354 - parseFloat(target.style.height)));
                target.style.left = `${x}px`; target.style.top = `${y}px`;
            },
            end(event) { saveStudioDataLiveToFirebase(event.target); }
        }
    }).resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
            move(event) {
                const target = event.target;
                let x = parseFloat(target.style.left) || 0; let y = parseFloat(target.style.top) || 0;
                let w = parseFloat(target.style.width) || 0; let h = parseFloat(target.style.height) || 0;
                
                w += (event.deltaRect.width / UI_SCALE); 
                h += (event.deltaRect.height / UI_SCALE);
                x += (event.deltaRect.left / UI_SCALE); 
                y += (event.deltaRect.top / UI_SCALE);
                
                if(w < 100) w = 100; if(h < 100) h = 100; // Minimum size protection
                
                target.style.width = `${w}px`; target.style.height = `${h}px`;
                target.style.left = `${x}px`; target.style.top = `${y}px`;
            },
            end(event) { saveStudioDataLiveToFirebase(event.target); }
        }
    });
}

function saveStudioDataLiveToFirebase(target) {
    let slotKey = window.activeStudioSlotKey; if(!slotKey) return;
    let type = target.getAttribute('data-type');
    
    // No more scale math here! The values are perfectly 1080p native
    let x = Math.round(parseFloat(target.style.left) || 0); 
    let y = Math.round(parseFloat(target.style.top) || 0);
    let w = Math.round(parseFloat(target.style.width) || 0); 
    let h = Math.round(parseFloat(target.style.height) || 0);
    
    let prefix = type === 'small' ? 's' : 'l'; let updates = {};
    updates[`${prefix}X`] = x; updates[`${prefix}Y`] = y; updates[`${prefix}W`] = w; updates[`${prefix}H`] = h;
    db.ref(`poster_templates/${slotKey}`).update(updates);
}

document.getElementById('studioImageUploaderInput')?.addEventListener('change', function() {
    let slotKey = window.activeStudioSlotKey; let file = this.files[0]; if(!file || !slotKey) return;
    showToast("Processing asset...", "info"); let reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = function(e) {
        let img = new Image(); img.src = e.target.result;
        img.onload = function() {
            let canvas = document.createElement('canvas'); let ctx = canvas.getContext('2d');
            canvas.width = 1080; canvas.height = 1354;
            ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.drawImage(img, 0, 0, 1080, 1354);
            let optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            db.ref(`poster_templates/${slotKey}/url`).set(optimizedDataUrl, err => {
                if(!err) { showToast("Background updated!", "success"); let bgImg = document.querySelector('.editor-bg-preview'); if(bgImg) bgImg.src = optimizedDataUrl; }
            });
        };
    };
});

window.openPremiumColorPicker = function() { document.getElementById('paletteChosenPreview').style.backgroundColor = window.tempPaletteColor; document.getElementById('premiumColorPaletteModal').style.display = 'flex'; }
window.pickPaletteColor = function(hex) { window.tempPaletteColor = hex; document.getElementById('paletteChosenPreview').style.backgroundColor = hex; }
window.confirmPaletteColor = function() { document.getElementById('mainColorPreview').style.backgroundColor = window.tempPaletteColor; document.getElementById('premiumColorPaletteModal').style.display = 'none'; if(typeof updateStudioFonts === 'function') updateStudioFonts(); }

let pickedColorFromImage = "#000000";
document.getElementById('colorImageUploader')?.addEventListener('change', function(e) {
    let file = e.target.files[0]; if (!file) return; let reader = new FileReader();
    reader.onload = function(event) {
        let img = new Image();
        img.onload = function() {
            let canvas = document.getElementById('colorPickerCanvas'); let ctx = canvas.getContext('2d');
            let MAX_WIDTH = window.innerWidth > 400 ? 360 : window.innerWidth - 60; let MAX_HEIGHT = 300; let width = img.width; let height = img.height;
            if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
            canvas.width = width; canvas.height = height; ctx.drawImage(img, 0, 0, width, height);
            document.getElementById('imageColorPickerModal').style.display = 'flex';
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file); e.target.value = '';
});

function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase(); }
function pickColorFromEvent(e) {
    let canvas = document.getElementById('colorPickerCanvas'); let rect = canvas.getBoundingClientRect(); let x, y;
    if (e.touches && e.touches.length > 0) { x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top; } else { x = e.clientX - rect.left; y = e.clientY - rect.top; }
    x = Math.max(0, Math.min(x, canvas.width - 1)); y = Math.max(0, Math.min(y, canvas.height - 1));
    let ctx = canvas.getContext('2d'); let pixelData = ctx.getImageData(x, y, 1, 1).data;
    let hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    pickedColorFromImage = hex; document.getElementById('pickedColorPreview').style.backgroundColor = hex; document.getElementById('pickedColorHex').innerText = hex;
}

let pickerCanvas = document.getElementById('colorPickerCanvas');
if(pickerCanvas) {
    pickerCanvas.addEventListener('mousedown', pickColorFromEvent); pickerCanvas.addEventListener('mousemove', (e) => { if(e.buttons === 1) pickColorFromEvent(e); });
    pickerCanvas.addEventListener('touchstart', pickColorFromEvent, {passive: false}); pickerCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); pickColorFromEvent(e); }, {passive: false});
}

window.applyPickedColor = function() { window.tempPaletteColor = pickedColorFromImage; document.getElementById('mainColorPreview').style.backgroundColor = window.tempPaletteColor; document.getElementById('imageColorPickerModal').style.display = 'none'; if(typeof updateStudioFonts === 'function') updateStudioFonts(); }
