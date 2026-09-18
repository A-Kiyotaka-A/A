document.addEventListener('DOMContentLoaded', () => {
    const inputCipher = document.getElementById('inputCipher');
    const decryptBtn = document.getElementById('decryptBtn');
    const decryptedSection = document.getElementById('decryptedSection');
    const outputDecrypted = document.getElementById('outputDecrypted');
    const newMessageBtn = document.getElementById('newMessageBtn');
    const copyDecryptedBtn = document.getElementById('copyDecryptedBtn');
    const copyPageLinkBtn = document.getElementById('copyPageLinkBtn');
    const toast = document.getElementById('toast');

    const ZWSP = '\u200B'; 
    const ZWNJ = '\u200C'; 
    const ZWJ  = '\u200D'; 
    const BOM  = '\uFEFF'; 

    function zeroWidthToText(zeroWidth) {
        let clean = zeroWidth.replace(new RegExp(`[${ZWJ}${BOM}]`, 'g'), '');
        
        let binary = '';
        for (let char of clean) {
            if (char === ZWSP) binary += '0';
            else if (char === ZWNJ) binary += '1';
        }

        if (binary.length === 0 || binary.length % 8 !== 0) {
            return 'خطأ: النص المشفر غير صالح أو تالف.';
        }

        const bytes = new Uint8Array(binary.length / 8);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(binary.substr(i * 8, 8), 2);
        }

        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    decryptBtn.addEventListener('click', () => {
        const cipher = inputCipher.value;
        if (!cipher.trim()) {
            showToast('⚠️ الرجاء لصق الرسالة المشفرة أولاً');
            return;
        }
        
        const decrypted = zeroWidthToText(cipher);
        outputDecrypted.textContent = decrypted;
        decryptedSection.classList.remove('hidden');
        showToast('✅ تم فك التشفير بنجاح');
    });

    newMessageBtn.addEventListener('click', () => {
        inputCipher.value = '';
        outputDecrypted.textContent = '';
        decryptedSection.classList.add('hidden');
        inputCipher.focus();
        showToast('🔄 تم المسح');
    });

    copyDecryptedBtn.addEventListener('click', () => {
        const text = outputDecrypted.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 تم نسخ الرسالة الأصلية');
        });
    });

    copyPageLinkBtn.addEventListener('click', () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            showToast('🔗 تم نسخ رابط الصفحة');
        });
    });

    // ميزة القراءة التلقائية من الرابط
    if (window.location.hash) {
        const encryptedText = decodeURIComponent(window.location.hash.substring(1));
        inputCipher.value = encryptedText;
        decryptBtn.click();
        showToast('🔓 تم فك التشفير تلقائياً');
    }
});
