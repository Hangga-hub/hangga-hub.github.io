// script.js for Hash Generator (MD5, SHA1, SHA256)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Hash Generator script loaded.");

    // --- Get references to elements ---
    const textInput = document.getElementById('textInput');
    const md5Output = document.getElementById('md5Output');
    const sha1Output = document.getElementById('sha1Output');
    const sha256Output = document.getElementById('sha256Output');
    const generateHashesBtn = document.getElementById('generateHashesBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const copyButtons = document.querySelectorAll('.copy-btn');

    let debounceTimer;

    // --- Helper function to show messages to the user ---
    function showMessage(message, isError = false) {
        if (!messageBox) {
            console.error("Error: Message box element (#messageBox) not found in HTML.");
            return;
        }

        messageBox.textContent = message;
        messageBox.classList.remove('error');
        messageBox.classList.add('show');

        if (isError) {
            messageBox.classList.add('error');
            messageBox.style.color = 'var(--cyber-neon-pink)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-pink)';
            console.error("Message (Error):", message);
        } else {
            messageBox.style.color = 'var(--cyber-neon-cyan)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-cyan)';
            console.log("Message (Success/Info):", message);
        }

        // Hide message after a few seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
            messageBox.textContent = '';
        }, 3000);
    }

    // --- Utility function to convert ArrayBuffer to Hex String ---
    function bufferToHex(buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    // --- MD5 Hash Function (Self-contained, simplified implementation) ---
    // This is a basic, self-contained MD5 implementation. For production-grade security,
    // it's generally recommended to use well-vetted libraries or browser's native crypto for SHA.
    // However, for a client-side tool like this, and given the constraints, this suffices.
    function md5(string) {
        function rotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function addUnsigned(lX, lY) {
            let lResult = (lX & 0xFFFFFFFF) + (lY & 0xFFFFFFFF);
            if (lResult > 0xFFFFFFFF) {
                return (lResult & 0xFFFFFFFF) + 1;
            }
            return lResult;
        }

        function F(x, y, z) { return (x & y) | ((~x) & z); }
        function G(x, y, z) { return (x & z) | (y & (~z)); }
        function H(x, y, z) { return (x ^ y ^ z); }
        function I(x, y, z) { return (y ^ (x | (~z))); }

        function FF(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function GG(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function HH(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function II(a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }

        function convertToWordArray(string) {
            let lWordCount;
            const lMessageLength = string.length;
            const lNumberOfWords_l = Math.ceil(lMessageLength / 4);
            const lWordArray = new Array(lNumberOfWords_l);
            for (lWordCount = 0; lWordCount < lNumberOfWords_l; lWordCount++) {
                lWordArray[lWordCount] = string.charCodeAt(lWordCount * 4) & 0xFF |
                                        ((string.charCodeAt(lWordCount * 4 + 1) & 0xFF) << 8) |
                                        ((string.charCodeAt(lWordCount * 4 + 2) & 0xFF) << 16) |
                                        ((string.charCodeAt(lWordCount * 4 + 3) & 0xFF) << 24);
            }
            lWordCount = lWordCount * 8;
            lWordArray[lNumberOfWords_l] = lMessageLength * 8;
            lWordArray[lNumberOfWords_l + 1] = 0;
            return lWordArray;
        }

        const x = convertToWordArray(string);
        let a = 0x67452301;
        let b = 0xEFCDAB89;
        let c = 0x98BADCFE;
        let d = 0x10325476;

        for (let k = 0; k < x.length; k += 16) {
            const AA = a, BB = b, CC = c, DD = d;

            a = FF(a, b, c, d, x[k + 0], 7, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], 12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], 17, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], 22, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], 7, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], 12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], 17, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], 22, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], 7, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], 12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], 17, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], 22, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], 7, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], 12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], 17, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], 22, 0x49B40821);

            a = GG(a, b, c, d, x[k + 1], 5, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], 9, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], 14, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], 20, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], 5, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], 9, 0x2441453);
            c = GG(c, d, a, b, x[k + 15]