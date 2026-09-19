document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const encryptBtn = document.getElementById('encryptBtn');
    const resultSection = document.getElementById('resultSection');
    const outputText = document.getElementById('outputText');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const openDecodeBtn = document.getElementById('openDecodeBtn');
    const newEncryptBtn = document.getElementById('newEncryptBtn');
    const toast = document.getElementById('toast');

    const ZWSP = '\u200B';
    const ZWNJ = '\u200C';
    const ZWJ = '\u200D';
    const BOM = '\uFEFF';

    let currentEncrypted = '';

    function textToZeroWidth(text) {
        if (!text) return '';
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
        zeroWidth += ZWJ + BOM;
        return zeroWidth;
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    encryptBtn.addEventListener('click', () => {
        const text = inputText.value;
        if (!text.trim()) {
            showToast('الرجاء كتابة رسالة أولاً');
            return;
        }
        currentEncrypted = textToZeroWidth(text);
        outputText.textContent = currentEncrypted || '(النص فارغ ظاهرياً)';
        resultSection.classList.remove('hidden');
        showToast('تم التشفير بنجاح');
    });

    copyTextBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentEncrypted).then(() => {
            showToast('تم نسخ الرسالة المشفرة');
        });
    });

    openDecodeBtn.addEventListener('click', () => {
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        const link = baseUrl + 'decode.html';
        window.open(link, '_blank');
        showToast('تم فتح نافذة فك التشفير');
    });

    newEncryptBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.textContent = '';
        resultSection.classList.add('hidden');
        currentEncrypted = '';
        inputText.focus();
        showToast('تم المسح');
    });
});
