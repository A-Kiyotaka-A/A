document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const encryptBtn = document.getElementById('encryptBtn');
    const resultSection = document.getElementById('resultSection');
    const outputText = document.getElementById('outputText');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const newEncryptBtn = document.getElementById('newEncryptBtn');

    const ZWSP = '\u200B';
    const ZWNJ = '\u200C';
    const ZWJ  = '\u200D';
    const BOM  = '\uFEFF';

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

    encryptBtn.addEventListener('click', () => {
        const text = inputText.value;
        if (!text.trim()) {
            alert('> خطأ: الرجاء كتابة رسالة أولاً!');
            return;
        }
        const encrypted = textToZeroWidth(text);
        outputText.textContent = encrypted || '> (النص فارغ ظاهرياً)';
        resultSection.classList.remove('hidden');
    });

    copyTextBtn.addEventListener('click', () => {
        const text = inputText.value;
        const encrypted = textToZeroWidth(text);
        navigator.clipboard.writeText(encrypted).then(() => {
            copyTextBtn.textContent = '[ تم النسخ ✓ ]';
            setTimeout(() => copyTextBtn.textContent = '[ نسخ الرسالة ]', 2000);
        });
    });

    copyLinkBtn.addEventListener('click', () => {
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        const link = baseUrl + 'decode.html';
        navigator.clipboard.writeText(link).then(() => {
            copyLinkBtn.textContent = '[ تم النسخ ✓ ]';
            setTimeout(() => copyLinkBtn.textContent = '[ نسخ رابط الفك ]', 2000);
        });
    });

    // زر رسالة جديدة
    newEncryptBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.textContent = '';
        resultSection.classList.add('hidden');
        inputText.focus();
    });
});
