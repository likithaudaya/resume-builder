async function downloadWordOptimized() {
    generatePreview();
    const original = document.getElementById('resumePreview');
    const clone = original.cloneNode(true);
    clone.querySelectorAll('script, style, .no-print').forEach(el => el.remove());

    const header = clone.querySelector('.resume-header');
    if (header) {
        header.style.cssText = `background:${currentTheme.primaryColor};color:#fff;padding:4px 8px;margin:0 0 6px 0;display:flex;align-items:center;gap:8px;height:auto;max-height:72px;overflow:hidden;box-sizing:border-box;`;
        // ensure photo container doesn't force large height
        const photoWrap = header.querySelector('.resume-header-photo');
        if (photoWrap) photoWrap.style.cssText = 'width:auto;flex:0 0 auto;overflow:hidden;display:flex;align-items:center;justify-content:center;';
        const img = header.querySelector('img');
        if (img) img.style.cssText = 'width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #fff;display:block;margin-right:8px;';
        const name = header.querySelector('.resume-name');
        if (name) name.style.cssText = 'font-size:16px;font-weight:700;margin:0;';
    }

    clone.querySelectorAll('.resume-contact').forEach(el => el.style.cssText = 'font-size:11px;margin:0;display:flex;gap:6px;flex-wrap:wrap;');

    const imgs = Array.from(clone.querySelectorAll('img'));

    async function toDataURL(src) {
        return new Promise((resolve) => {
            if (!src) return resolve(null);
            if (src.startsWith('data:')) return resolve(src);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                try {
                    const c = document.createElement('canvas');
                    c.width = img.naturalWidth;
                    c.height = img.naturalHeight;
                    const ctx = c.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    resolve(c.toDataURL('image/png'));
                } catch (e) { resolve(null); }
            };
            img.onerror = function() { resolve(null); };
            img.src = src;
            setTimeout(() => resolve(null), 3000);
        });
    }

    const parts = [];
    for (let i = 0; i < imgs.length; i++) {
        const im = imgs[i];
        const data = await toDataURL(im.src);
        if (data) {
            const match = data.match(/^data:(image\/(png|jpeg|jpg|gif));base64,(.*)$/i);
            const mime = match ? match[1] : 'image/png';
            const base64 = match ? match[3] : (data.split(',')[1] || '');
            // Use absolute file URL for Content-Location (Word expects a URL-like reference)
            const ext = mime.split('/')[1];
            const contentLocation = `file:///C:/image${i+1}.${ext}`;
            parts.push({ contentLocation, mime, base64 });
            // Update img src in HTML to the same content location so the MHTML part matches
            im.setAttribute('src', contentLocation);
            // Force explicit width/height attributes and compact inline style to keep header small in Word
            try {
                im.setAttribute('width', '72');
                im.setAttribute('height', '72');
                im.style.cssText = 'width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #fff;display:block;margin-right:8px;';
            } catch (e) {}
        }
    }

    const htmlContent = `<!doctype html><html><head><meta charset="utf-8"><title>Resume</title><style>*{box-sizing:border-box;margin:0;padding:0}@page{size:A4;margin:18mm}body{font-family:${currentTheme.fontFamily};font-size:12px;color:#1f2937}.resume-header{width:100%}</style></head><body>${clone.innerHTML}</body></html>`;

    const boundary = '----=_NextPart_000_0000';
    let mhtml = '';
    mhtml += 'Mime-Version: 1.0\n';
    mhtml += 'Content-Type: multipart/related; boundary="' + boundary + '"; type="text/html"\n\n';

    mhtml += '--' + boundary + '\n';
    mhtml += 'Content-Type: text/html; charset="utf-8"\n';
    mhtml += 'Content-Location: file:///C:/Document.html\n\n';
    mhtml += htmlContent + '\n\n';

    parts.forEach(p => {
        mhtml += '--' + boundary + '\n';
        mhtml += 'Content-Location: ' + p.contentLocation + '\n';
        mhtml += 'Content-Transfer-Encoding: base64\n';
        mhtml += 'Content-Type: ' + p.mime + '\n\n';
        mhtml += p.base64 + '\n\n';
    });

    mhtml += '--' + boundary + '--';

    const blob = new Blob([mhtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `resume_${new Date().getTime()}.doc`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
}

// Wire the existing Download Word button to the optimized exporter
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.preview-header button[onclick="downloadWord()"]');
    if (btn) {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function(e){
            e.preventDefault();
            downloadWordOptimized();
        });
    }
});
