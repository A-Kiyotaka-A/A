document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const encryptBtn = document.getElementById('encryptBtn');
    const resultSection = document.getElementById('resultSection');
    const outputText = document.getElementById('outputText');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const shareBtn = document.getElementById('shareBtn');
    const newEncryptBtn = document.getElementById('newEncryptBtn');
    const toast = document.getElementById('toast');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const enableTimer = document.getElementById('enableTimer');
    const timerSection = document.getElementById('timerSection');
    const timerMinutes = document.getElementById('timerMinutes');
    const enableShare = document.getElementById('enableShare');
    const shareModal = document.getElementById('shareModal');
    const accessCode = document.getElementById('accessCode');
    const shareLink = document.getElementById('shareLink');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const ZWSP = '\u200B';
    const ZWNJ = '\u200C';
    const ZWJ = '\u200D';
    const BOM = '\uFEFF';

    let currentEncrypted = '';
    let currentCode = '';

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

    function generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function loadTheme() {
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀' : '☾';
    });

    enableTimer.addEventListener('change', () => {
        if (enableTimer.checked) {
            timerSection.classList.remove('hidden');
        } else {
            timerSection.classList.add('hidden');
        }
    });

    encryptBtn.addEventListener('click', () => {
        const text = inputText.value;
        if (!text.trim()) {
            showToast('الرجاء كتابة رسالة أولاً');
            return;
        }

        let data = {
            text: text,
            timestamp: Date.now()
        };

        if (enableTimer.checked) {
            data.expiry = parseInt(timerMinutes.value) * 60 * 1000;
        }

        currentEncrypted = textToZeroWidth(JSON.stringify(data));
        outputText.textContent = currentEncrypted || '(النص فارغ ظاهرياً)';
        resultSection.classList.remove('hidden');
        
        // إظهار زر المشاركة المباشرة فقط إذا كان مفعل
        if (enableShare.checked) {
            shareBtn.classList.remove('hidden');
        } else {
            shareBtn.classList.add('hidden');
        }
        
        showToast('تم التشفير بنجاح');
    });

    copyTextBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentEncrypted).then(() => {
            showToast('تم نسخ الرسالة المشفرة');
        });
    });

    shareBtn.addEventListener('click', () => {
        if (!currentEncrypted) {
            showToast('الرجاء تشفير رسالة أولاً');
            return;
        }

        // توليد كود جديد
        currentCode = generateCode();
        
        // عرض الكود في النافذة
        accessCode.textContent = currentCode;

        // بناء الرابط
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        const encodedMessage = encodeURIComponent(currentEncrypted);
        const encodedCode = encodeURIComponent(currentCode);
        const fullLink = `${baseUrl}decode.html#msg=${encodedMessage}&code=${encodedCode}`;
        
        // عرض الرابط في النافذة
        shareLink.value = fullLink;

        // إظهار النافذة المنبثقة
        shareModal.classList.remove('hidden');
    });

    copyCodeBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentCode).then(() => {
            showToast('تم نسخ كود الوصول');
        });
    });

    copyLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shareLink.value).then(() => {
            showToast('تم نسخ رابط المشاركة');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        shareModal.classList.add('hidden');
    });

    newEncryptBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.textContent = '';
        resultSection.classList.add('hidden');
        shareBtn.classList.add('hidden');
        currentEncrypted = '';
        currentCode = '';
        inputText.focus();
        showToast('تم المسح');
    });

    loadTheme();
});
