const CANV_W = 2160;
const CANV_H = 2708;

async function getPoster(item) {
    // 🌟 ഫോണ്ടുകൾ പൂർണ്ണമായി ലോഡ് ആയെന്ന് ഉറപ്പുവരുത്തുന്നു 🌟
    await document.fonts.ready;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas'); 
        const ctx = canvas.getContext('2d');
        canvas.width = CANV_W; 
        canvas.height = CANV_H; 
        ctx.scale(2, 2); 

        const winners = [
            { rank: '🥇', data: JSON.parse(item.w1 || "[]") },
            { rank: '🥈', data: JSON.parse(item.w2 || "[]") },
            { rank: '🥉', data: JSON.parse(item.w3 || "[]") }
        ];

        let hasTie = (winners[0].data.length > 1) || (winners[1].data.length > 1) || (winners[2].data.length > 1);
        let itemNo = parseInt(item.no) || 1;
        let uploadedKeys = Object.keys(window.posterTemplates || {}).filter(k => k.startsWith('bg') && k !== 'bg_tie' && window.posterTemplates[k].url);
        let chosenBgDataUrl = null; 
        let currentSlotKey = 'bg1';

        if (hasTie && window.posterTemplates && window.posterTemplates['bg_tie']?.url) {
            chosenBgDataUrl = window.posterTemplates['bg_tie'].url; 
            currentSlotKey = 'bg_tie';
        } else if (uploadedKeys.length > 0) {
            let groupIndex = Math.floor((itemNo - 1) / 10); 
            let arrayIndex = groupIndex % uploadedKeys.length;
            currentSlotKey = uploadedKeys[arrayIndex]; 
            chosenBgDataUrl = window.posterTemplates[currentSlotKey].url;
        }

        const bg = new Image(); 
        bg.crossOrigin = "anonymous"; 
        if (chosenBgDataUrl) bg.src = chosenBgDataUrl; 
        else { let localIndex = hasTie ? 6 : (((Math.ceil(itemNo / 10) - 1) % 5) + 1); bg.src = `bg${localIndex}.jpg`; currentSlotKey = hasTie ? 'bg_tie' : `bg${Math.ceil(itemNo / 10)}`; }

        bg.onload = function() {
            try {
                ctx.drawImage(bg, 0, 0, 1080, 1354);
                let layoutTemplate = window.posterTemplates ? (window.posterTemplates[currentSlotKey] || {}) : {};
                
                // 🌟 സിങ്ക് ചെയ്ത പുതിയ ലേഔട്ട് എഞ്ചിൻ 🌟
                drawUniversalLayout(ctx, item, winners, layoutTemplate);
                
                resolve(canvas.toDataURL("image/jpeg", 0.95));
            } catch (error) { resolve(canvas.toDataURL("image/jpeg", 0.9)); }
        };
        bg.onerror = function() { resolve(canvas.toDataURL("image/jpeg", 0.9)); }
    });
}

// 🌟 STRICT HTML/CSS REPLICATION ENGINE (NO AUTO-SHRINK) 🌟
function drawUniversalLayout(ctx, item, winners, tmp) {
    const sX = tmp.sX ?? 174, sY = tmp.sY ?? 174, sW = tmp.sW ?? 295, sH = tmp.sH ?? 295;
    const lX = tmp.lX ?? 174, lY = tmp.lY ?? 469, lW = tmp.lW ?? 505, lH = tmp.lH ?? 505;

    const defF = { resText: { fam: 'Montserrat', size: 85, color: '#6A0453' }, resNum: { fam: 'Montserrat', size: 230, color: '#6A0453' }, cat: { fam: 'Montserrat', size: 75, color: '#000000' }, prog: { fam: 'Montserrat', size: 105, color: '#000000' }, name: { fam: 'Montserrat', size: 80, color: '#000000' }, unit: { fam: 'Montserrat', size: 55, color: '#444444' } };
    const defGaps = { resGap: 0, nameUnitGap: 5, winnerGap: 30 };
    
    let f = tmp.fonts || {}; 
    Object.keys(defF).forEach(k => { 
        if(!f[k]) f[k] = {};
        f[k].fam = f[k].fam || defF[k].fam;
        f[k].size = Number(f[k].size || defF[k].size);
        f[k].color = f[k].color || defF[k].color;
    });
    
    let gaps = tmp.gaps || {}; 
    gaps.resGap = gaps.resGap !== undefined ? Number(gaps.resGap) : defGaps.resGap;
    gaps.nameUnitGap = gaps.nameUnitGap !== undefined ? Number(gaps.nameUnitGap) : defGaps.nameUnitGap;
    gaps.winnerGap = gaps.winnerGap !== undefined ? Number(gaps.winnerGap) : defGaps.winnerGap;

    // കാൻവാസ് ബേസ് ലൈൻ കൃത്യമായി HTML ലെ പോലെ TOP ആക്കി സെറ്റ് ചെയ്യുന്നു
    ctx.textBaseline = 'top'; 

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' '); let line = ''; let linesCount = 0;
        for(let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, y + (linesCount * lineHeight)); 
                line = words[n] + ' '; 
                linesCount++;
            } else { line = testLine; }
        }
        ctx.fillText(line.trim(), x, y + (linesCount * lineHeight)); 
        return linesCount + 1;
    }

    // ================== 1. SMALL BOX ==================
    ctx.textAlign = 'center'; 
    let centerX = sX + (sW / 2); 
    
    let resLineH = f.resText.size * 1.2; 
    let numLineH = f.resNum.size * 1.0;
    let totalSmallH = resLineH + gaps.resGap + numLineH; 
    let currentY = sY + (sH - totalSmallH) / 2; // Center alignment

    ctx.fillStyle = f.resText.color;
    ctx.font = `italic 500 ${f.resText.size}px "${f.resText.fam}", sans-serif`; 
    // CSS ലെ line-height 1.2 യുമായി മാച്ച് ചെയ്യാൻ 0.1 padding നൽകുന്നു
    ctx.fillText('Result', centerX, currentY + (f.resText.size * 0.1)); 
    
    currentY += resLineH + gaps.resGap;

    ctx.fillStyle = f.resNum.color;
    ctx.font = `italic 700 ${f.resNum.size}px "${f.resNum.fam}", sans-serif`; 
    ctx.fillText(item.no.toString().padStart(2, '0'), centerX, currentY);

    // ================== 2. LARGE BOX ==================
    ctx.textAlign = 'left'; 
    currentY = lY;

    ctx.fillStyle = f.cat.color;
    ctx.font = `600 ${f.cat.size}px "${f.cat.fam}", sans-serif`; 
    let catLines = wrapText(ctx, item.cat, lX, currentY + (f.cat.size * 0.1), lW, f.cat.size * 1.2); 
    currentY += catLines * (f.cat.size * 1.2);

    ctx.fillStyle = f.prog.color;
    ctx.font = `italic 700 ${f.prog.size}px "${f.prog.fam}", sans-serif`; 
    let progLines = wrapText(ctx, item.item, lX, currentY + (f.prog.size * 0.1), lW, f.prog.size * 1.2);
    currentY += progLines * (f.prog.size * 1.2);
    
    currentY += 15; // Header-wrap margin bottom

    let flatWinners = [];
    winners.forEach(wObj => wObj.data.forEach(w => flatWinners.push(w)));
    let winCount = flatWinners.length; 
    if(winCount === 0) return;

    let dotSize = f.name.size * 0.4; 
    let dotMargin = f.name.size * 0.3;
    let textX = lX + dotSize + dotMargin; 
    let textW = lW - (dotSize + dotMargin);

    flatWinners.forEach((w, index) => {
        if (index > 0) currentY += gaps.winnerGap;

        let blockStartY = currentY;

        // ബുള്ളറ്റ് പോയിന്റ് (Exact margin mapping from HTML)
        ctx.fillStyle = f.name.color;
        ctx.font = `600 ${dotSize}px Arial, sans-serif`;
        ctx.fillText('●', lX, blockStartY + (f.name.size * 0.25));
        
        // പേര്
        ctx.fillStyle = f.name.color;
        ctx.font = `600 ${f.name.size}px "${f.name.fam}", sans-serif`; 
        let nLines = wrapText(ctx, w.n, textX, currentY + (f.name.size * 0.05), textW, f.name.size * 1.1);
        currentY += nLines * (f.name.size * 1.1);
        
        currentY += gaps.nameUnitGap;
        
        // യൂണിറ്റ്
        ctx.fillStyle = f.unit.color;
        ctx.font = `italic 600 ${f.unit.size}px "${f.unit.fam}", sans-serif`; 
        let unitText = w.u.toLowerCase().includes('unit') ? w.u : w.u + ' unit';
        let uLines = wrapText(ctx, unitText, textX, currentY + (f.unit.size * 0.05), textW, f.unit.size * 1.1);
        currentY += uLines * (f.unit.size * 1.1);
    });
}

// 🌟 GLOBAL BUTTON ACTIONS (Share & Download) 🌟
window.generatePoster = async function(no, action) {
    let d = window.allData.find(x => String(x.no) === String(no)); 
    if(!d) {
        if(typeof showToast === 'function') showToast("Result not found!", "error");
        return; 
    }
    
    if(typeof showToast === 'function') showToast("Generating HD poster...", "info");
    
    try {
        const imageURL = await getPoster(d);
        
        if (action === 'download') { 
            let link = document.createElement('a'); 
            link.download = `Sahityotsav_${d.item.replace(/\s+/g, '_')}_Result.jpg`; 
            link.href = imageURL; 
            link.click(); 
            if(typeof showToast === 'function') showToast("Poster Downloaded Successfully!", "success"); 
        } 
        else if (action === 'share') {
            try { 
                const blob = await (await fetch(imageURL)).blob(); 
                const file = new File([blob], 'Result_Poster.jpg', { type: 'image/jpeg' }); 
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) { 
                    await navigator.share({ 
                        title: `Result: ${d.item}`, 
                        text: `Sahityotsav 2026\n\nCongratulations to the winners of ${d.item}!\n\nCheck More Results :\nhttps://sahityotsav-result.vercel.app/\n\n© Organized by SSF Kalpetta Sector Committee`, 
                        files: [file] 
                    }); 
                } else { 
                    if(typeof showToast === 'function') showToast("Direct sharing not supported. Downloading instead...", "info"); 
                    let link = document.createElement('a'); 
                    link.download = `Sahityotsav_Result.jpg`; 
                    link.href = imageURL; 
                    link.click(); 
                } 
            } catch (err) { 
                console.error("Share failed:", err);
                if(typeof showToast === 'function') showToast("Share cancelled or blocked. Downloading...", "info"); 
                let link = document.createElement('a'); 
                link.download = `Sahityotsav_Result.jpg`; 
                link.href = imageURL; 
                link.click(); 
            }
        }
    } catch (error) { 
        console.error("Poster Error:", error);
        if(typeof showToast === 'function') showToast("Error generating poster", "error"); 
    }
};
