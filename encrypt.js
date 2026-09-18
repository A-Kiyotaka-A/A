document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const encryptBtn = document.getElementById('encryptBtn');
    const resultSection = document.getElementById('resultSection');
    const outputText = document.getElementById('outputText');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    // محارف يونيكود غير المرئية
    const ZWSP = '\u200B'; // يمثل الرقم 0
    const ZWNJ = '\u200C'; // يمثل الرقم 1
    const ZWJ  = '\u200D'; // فاصل نهاية الحرف
    const BOM  = '\uFEFF'; // علامة نهاية الرسالة

    function textToZeroWidth(text) {
        if (!text) return '';
        // تحويل النص إلى بايتات UTF-8 (يدعم العربية واليابانية)
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        let binary = '';
        for (let byte of bytes) {
            binary += byte.toString(2).padStart(8, '0');
        }
        
        let zeroWidth = '';
        for (let bit of binary) {
            zeroWidth += (bit === '0') ? ZWSP : ZWNJ;
        }
        // إضافة علامات النهاية
        zeroWidth += ZWJ + BOM;
        return zeroWidth;
    }

    encryptBtn.addEventListener('click', () => {
        const text = inputText.value;
        if (!text.trim()) {
            alert('الرجاء كتابة رسالة أولاً!');
            return;
        }
        const encrypted = textToZeroWidth(text);
        outputText.textContent = encrypted || '(النص فارغ ظاهرياً)';
        resultSection.classList.remove('hidden');
    });

    copyTextBtn.addEventListener('click', () => {
        const text = inputText.value;
        const encrypted = textToZeroWidth(text);
        navigator.clipboard.writeText(encrypted).then(() => {
            copyTextBtn.textContent = 'تم النسخ! ✅';
            setTimeout(() => copyTextBtn.textContent = 'نسخ الرسالة المشفرة 📋', 2000);
        });
    });

    copyLinkBtn.addEventListener('click', () => {
        // الحصول على رابط صفحة فك التشفير
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        const link = baseUrl + 'decode.html';
        navigator.clipboard.writeText(link).then(() => {
            copyLinkBtn.textContent = 'تم نسخ الرابط! ✅';
            setTimeout(() => copyLinkBtn.textContent = 'نسخ رابط فك التشفير 🔗', 2000);
        });
    });
});
