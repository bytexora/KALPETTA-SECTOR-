// --- ADMIN GALLERY LOGIC ---

// 🌟 1. UPLOAD BUTTON CLICK (Shows Confirm Popup) 🌟
function uploadToGallery() {
    let input = document.getElementById('galleryImageInput');
    let file = input.files[0];
    
    if(!file) return showToast("Please select a photo first", "error");

    // പോപ്പ്-അപ്പ് കാണിക്കുന്നു. Confirm അടിച്ചാൽ execUploadGallery വർക്ക് ആവും
    openConfirm("Upload Photo?", "Are you sure you want to publish this photo to the gallery?", "fa-solid fa-cloud-arrow-up", "success", execUploadGallery);
}

// 🌟 2. ACTUAL UPLOAD LOGIC (HQ + HEIC Support) 🌟
async function execUploadGallery() {
    closeModal('confirmModal'); // ആദ്യം പോപ്പ്-അപ്പ് ക്ലോസ് ചെയ്യുന്നു

    let input = document.getElementById('galleryImageInput');
    let file = input.files[0];
    if(!file) return;

    let btn = document.getElementById('uploadGalBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner loader-spin"></i> Processing...';

    try {
        let processFile = file;
        let fileName = file.name.toLowerCase();

        // iPhone HEIC/HEIF formats support cheyyan
        if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
            showToast("Converting HEIC format...", "info");
            const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.95
            });
            processFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        }

        let reader = new FileReader();
        reader.readAsDataURL(processFile);
        
        reader.onload = function(e) {
            let img = new Image();
            img.src = e.target.result;

            img.onload = function() {
                // Canvas upayogichu Full HD (1920px) quality-il resize cheyyunnu
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                
                let MAX_WIDTH = 1920;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, width, height);

                // High Quality JPEG aayi maattunnu
                let optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

                btn.innerHTML = '<i class="fa-solid fa-spinner loader-spin"></i> Uploading...';
                
                // Database-lekku save cheyyunnu
                db.ref('gallery').push({
                    url: optimizedDataUrl,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }, err => {
                    btn.innerHTML = 'Upload to Gallery';
                    if(err) {
                        showToast("Upload Failed: Check connection", "error");
                    } else {
                        input.value = ''; 
                        showToast("Photo Uploaded Successfully!", "success");
                    }
                });
            };
            
            img.onerror = function() {
                btn.innerHTML = 'Upload to Gallery';
                showToast("Invalid Image format", "error");
            };
        };
        
        reader.onerror = function() {
            btn.innerHTML = 'Upload to Gallery';
            showToast("Error reading file!", "error");
        };
        
    } catch (error) {
        btn.innerHTML = 'Upload to Gallery';
        showToast("Error processing image", "error");
        console.error(error);
    }
}

// 🌟 3. RENDER GALLERY 🌟
function renderAdmGal() {
    let grid = document.getElementById('adminGalleryGrid');
    if(!grid) return;
    if(!galleryData.length) { 
        grid.innerHTML = '<div class="text-muted col-span-full text-center p-20">No photos uploaded yet</div>'; 
        return; 
    }
    
    grid.innerHTML = galleryData.map(img => `
        <div style="position:relative; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <div style="padding-top:100%;"></div>
            <img src="${img.url}" onerror="this.src='https://via.placeholder.com/300x300/1e293b/64748b?text=Image+Error'" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
            <button onclick="delGalImg('${img.id}')" style="position:absolute; top:8px; right:8px; background:rgba(239, 68, 68, 0.9); color:white; border:none; border-radius:6px; padding:6px 12px; cursor:pointer; backdrop-filter: blur(5px);"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

// 🌟 4. DELETE PHOTO (Shows Confirm Popup) 🌟
function delGalImg(id) {
    delTarget = id;
    openConfirm("Delete Photo?", "Are you sure you want to delete this photo from the gallery?", "fa-solid fa-trash", "danger", execDelGal);
}

function execDelGal() {
    if(!delTarget) return;
    db.ref('gallery/'+delTarget).remove().then(() => {
        showToast("Photo deleted permanently", "success");
        closeModal('confirmModal');
    });
}