document.addEventListener('DOMContentLoaded', () => {
    const accessCodeInput = document.getElementById('accessCodeInput');
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    const codeSection = document.getElementById('codeSection');
    const decryptSection = document.getElementById('decryptSection');
    const outputDecrypted = document.getElementById('outputDecrypted');
    const newMessageBtn = document.getElementById('newMessageBtn');
    const copyDecryptedBtn = document.getElementById('copyDecryptedBtn');
    const copyPageLinkBtn = document.getElementById('copyPageLinkBtn');
    const toast = document.getElementById('toast');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const timerDisplay = document.getElementById('timerDisplay');
    const countdown = document.getElementById('countdown');
    const expiredMessage = document.getElementById('expiredMessage');
    const decryptContent = document.getElementById('decryptContent');

    const ZWSP = '\u200B';
    const ZWNJ = '\u200C';
    const ZWJ = '\u200D';
    const BOM = '\uFEFF';

    let encryptedMessage = '';
    let expectedCode = '';
    let timerInterval = null;

    function zeroWidthToText(zeroWidth) {
        let clean = zeroWidth.replace(new RegExp(`[${ZWJ}${BOM}]`, 'g'), '');
        
        let binary = '';
        for (let char of clean) {
            if (char === ZWSP) binary += '0';
            else if (char === ZWNJ) binary += '1';
        }

        if (binary.length === 0 || binary.length % 8 !== 0) {
            return null;
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

    function loadTheme() {
        const theme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '☀' : '☾';
    }

    function startTimer(expiryTime) {
        timerInterval = setInterval(() => {
            const now = Date.now();
            const remaining = expiryTime - now;

            if (remaining <= 0) {
                clearInterval(timerInterval);
                expiredMessage.classList.remove('hidden');
                decryptContent.classList.add('hidden');
                timerDisplay.classList.add('hidden');
                showToast('انتهت صلاحية الرسالة');
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            countdown.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀' : '☾';
    });

    verifyCodeBtn.addEventListener('click', () => {
        const inputCode = accessCodeInput.value.trim();
        
        if (!inputCode) {
            showToast('الرجاء إدخال كود الوصول');
            return;
        }

        if (inputCode !== expectedCode) {
            showToast('كود الوصول غير صحيح');
            return;
        }

        try {
            const decrypted = zeroWidthToText(encryptedMessage);
            if (!decrypted) {
                showToast('الرسالة تالفة أو غير صالحة');
                return;
            }

            const data = JSON.parse(decrypted);
            
            if (data.expiry) {
                const expiryTime = data.timestamp + data.expiry;
                if (Date.now() > expiryTime) {
                    expiredMessage.classList.remove('hidden');
                    decryptContent.classList.add('hidden');
                    timerDisplay.classList.add('hidden');
                    showToast('انتهت صلاحية الرسالة');
                    return;
                }
                timerDisplay.classList.remove('hidden');
                startTimer(expiryTime);
            }

            outputDecrypted.textContent = data.text;
            codeSection.classList.add('hidden');
            decryptSection.classList.remove('hidden');
            showToast('تم فك التشفير بنجاح');
        } catch (e) {
            showToast('حدث خطأ في فك التشفير');
        }
    });

    newMessageBtn.addEventListener('click', () => {
        accessCodeInput.value = '';
        outputDecrypted.textContent = '';
        codeSection.classList.remove('hidden');
        decryptSection.classList.add('hidden');
        timerDisplay.classList.add('hidden');
        expiredMessage.classList.add('hidden');
        decryptContent.classList.remove('hidden');
        if (timerInterval) clearInterval(timerInterval);
        accessCodeInput.focus();
        showToast('تم المسح');
    });

    copyDecryptedBtn.addEventListener('click', () => {
        const text = outputDecrypted.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('تم نسخ الرسالة');
        });
    });

    copyPageLinkBtn.addEventListener('click', () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            showToast('تم نسخ رابط الصفحة');
        });
    });

    if (window.location.hash) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const msg = params.get('msg');
        const code = params.get('code');

        if (msg && code) {
            encryptedMessage = decodeURIComponent(msg);
            expectedCode = decodeURIComponent(code);
        }
    }

    loadTheme();
});
