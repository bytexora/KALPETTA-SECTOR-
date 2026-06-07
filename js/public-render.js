function renderPubRes() {
    let dataArr = window.allData || [];
    let cat = document.getElementById('pubCatFilter').value.toLowerCase(), 
        prog = document.getElementById('pubProgFilter').value.toLowerCase(), 
        search = document.getElementById('pubSearch').value.toLowerCase();
    
    let filtered = dataArr.filter(d => {
        let mC = false, cC = (d.cat||'').toLowerCase(), cP = (d.item||'').toLowerCase();
        if(!cat) mC = true; 
        else if(cat.includes('(girls)')) { 
            if(cC===cat.replace(' (girls)','').trim() && cP.includes('(girls)')) mC=true; 
        } else { 
            if(cC===cat && !cP.includes('(girls)')) mC=true; 
        }
        let mP = !prog ? true : cP.includes(prog);
        let mS = !search ? true : ((d.item||'')+(d.cat||'')+d.w1+d.w2+d.w3).toLowerCase().includes(search);
        return mC && mP && mS;
    });
    
    let list = document.getElementById('publicResultsList');
    if(!list) return;
    if(!filtered.length) { 
        list.innerHTML = '<div class="text-center text-muted" style="padding:40px;">No results found</div>'; 
        return; 
    }
    
    list.innerHTML = filtered.map(d => {
        let w1 = JSON.parse(d.w1||"[]"), w2 = JSON.parse(d.w2||"[]"), w3 = JSON.parse(d.w3||"[]");
        let html = `
        <div class="result-card">
            <div class="result-header" onclick="toggleAcc('${d.no}')">
                <div style="flex:1;">
                    <div class="flex gap-2 items-center" style="margin-bottom:8px; flex-wrap: wrap;">
                        <span style="background:rgba(245, 158, 11, 0.1); color:var(--gold); border:1px solid rgba(245, 158, 11, 0.2); padding:3px 8px; border-radius:6px; font-size:0.8rem; font-weight:bold;">${String(d.no).padStart(2,'0')}</span>
                        <span style="background:rgba(16, 185, 129, 0.1); color:var(--accent); border:1px solid rgba(16, 185, 129, 0.2); padding:3px 8px; border-radius:6px; font-size:0.65rem; font-weight:bold; text-transform:uppercase;">${d.cat}</span>
                    </div>
                    <h3 style="font-size:1.15rem; margin:0;">${d.item}</h3>
                </div>
                <i class="fa-solid fa-chevron-down text-muted" id="icon-acc-${d.no}" style="transition:0.3s;"></i>
            </div>
            <div class="result-body" id="acc-${d.no}">`;
            
        const buildR = (m, arr) => arr.map(w => `<div class="winner-row"><div style="font-size:1.8rem; margin-right:15px;">${m}</div><div style="flex:1;"><h4 style="margin:0; font-size:1.05rem;">${w.n}</h4><span class="text-muted" style="font-size:0.8rem;">${w.u}</span></div><div class="text-muted font-bold">#${w.c}</div></div>`).join('');
        
        html += buildR('🥇',w1) + buildR('🥈',w2) + buildR('🥉',w3);
        
        html += `
                <div class="flex gap-3" style="margin-top:15px;">
                    <button onclick="generatePoster('${d.no}', 'share')" class="btn w-full bg-whatsapp text-white"><i class="fa-brands fa-whatsapp"></i> Share</button>
                    <button onclick="generatePoster('${d.no}', 'download')" class="btn w-full bg-info text-white"><i class="fa-solid fa-download"></i> Poster</button>
                </div>
            </div></div>`;
        return html;
    }).join('');
}

function renderPubGal() {
    let grid = document.getElementById('publicGalleryGrid');
    if (!grid) return;
    
    let dataArr = window.galleryData || [];
    
    if(!dataArr || !dataArr.length) { 
        grid.innerHTML = '<div style="grid-column:1/-1; padding:40px;" class="text-center text-muted">Gallery empty</div>'; 
        return; 
    }
    
    grid.innerHTML = dataArr.map(img => `
        <div style="position:relative; padding-top:100%; border-radius:12px; overflow:hidden; cursor:pointer; border:1px solid var(--border-light);" 
             onclick="openGalleryLightbox('${img.url}')">
            <img src="${img.url}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
        </div>
    `).join('');
}

// 🌟 New Function for HD Download & Share 🌟
window.openGalleryLightbox = function(url) {
    document.getElementById('lightboxImage').src = url;
    document.getElementById('imageLightbox').style.display = 'flex';
    
    // Share Button Action
    document.getElementById('lbShareBtn').onclick = async function() {
        try {
            showToast("Preparing image...", "info");
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], 'Sahityotsav_Gallery.jpg', { type: blob.type });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Sahityotsav 2026 Gallery',
                    files: [file]
                });
            } else {
                showToast("Direct sharing not supported. Downloading instead...", "info");
                document.getElementById('lbDownloadBtn').click();
            }
        } catch (error) {
            showToast("Error sharing image.", "error");
        }
    };
    
    // HD Download Button Action
    document.getElementById('lbDownloadBtn').onclick = async function() {
        showToast("Downloading HD Image...", "info");
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = 'Sahityotsav_2026_HD.jpg';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
            showToast("Download Complete!", "success");
        } catch (e) {
            showToast("Failed to download.", "error");
        }
    };
};

window.renderPublicResults = renderPubRes;
window.renderPublicGallery = renderPubGal;
