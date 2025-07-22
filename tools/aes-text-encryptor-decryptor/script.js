// script.js for AES Text Encryptor/Decryptor

document.addEventListener('DOMContentLoaded', () => {
    console.log("AES Text Encryptor/Decryptor script loaded.");

    // --- Get references to elements ---
    const plainTextInput = document.getElementById('plainTextInput');
    const encryptedTextInput = document.getElementById('encryptedTextInput');
    const encryptionKeyInput = document.getElementById('encryptionKey');
    const generateKeyBtn = document.getElementById('generateKeyBtn');
    const copyKeyBtn = document.getElementById('copyKeyBtn');
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');

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

    // --- Utility functions for ArrayBuffer <-> Base64 conversion ---
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        const binary_string = atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // --- Key Management ---
    async function generateAesKey() {
        try {
            const key = await crypto.subtle.generateKey(
                {
                    name: "AES-GCM",
                    length: 256, // 256-bit key
                },
                true, // exportable
                ["encrypt", "decrypt"]
            );
            const exportedKey = await crypto.subtle.exportKey("raw", key);
            const base64Key = arrayBufferToBase64(exportedKey);
            encryptionKeyInput.value = base64Key;
            copyKeyBtn.disabled = false;
            showMessage("New AES key generated! Save it securely.", false);
        } catch (error) {
            console.error("Error generating key:", error);
            showMessage("Failed to generate key. Web Cryptography API might not be available.", true);
        }
    }

    async function importAesKey(base64Key) {
        try {
            const keyBuffer = base64ToArrayBuffer(base64Key);
            const key = await crypto.subtle.importKey(
                "raw",
                keyBuffer,
                {
                    name: "AES-GCM",
                    length: 256,
                },
                true, // exportable
                ["encrypt", "decrypt"]
            );
            return key;
        } catch (error) {
            console.error("Error importing key:", error);
            showMessage("Invalid key format. Please ensure it's a valid Base64 AES-256 key.", true);
            return null;
        }
    }

    // --- Encryption ---
    async function encryptText() {
        const plainText = plainTextInput.value.trim();
        const base64Key = encryptionKeyInput.value.trim();

        if (!plainText) {
            showMessage("Please enter text to encrypt.", true);
            return;
        }
        if (!base64Key) {
            showMessage("Please generate or enter an encryption key.", true);
            return;
        }

        try {
            const key = await importAesKey(base64Key);
            if (!key) return; // Error message already shown by importAesKey

            const iv = crypto.getRandomValues(new Uint8Array(12)); // GCM recommended IV length is 12 bytes
            const encodedText = new TextEncoder().encode(plainText);

            const ciphertext = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                key,
                encodedText
            );

            // Combine IV and ciphertext for storage/transmission
            const fullCiphertext = new Uint8Array(iv.length + ciphertext.byteLength);
            fullCiphertext.set(iv, 0);
            fullCiphertext.set(new Uint8Array(ciphertext), iv.length);

            encryptedTextInput.value = arrayBufferToBase64(fullCiphertext.buffer);
            plainTextInput.value = ''; // Clear plain text after encryption
            showMessage("Text encrypted successfully!", false);
        } catch (error) {
            console.error("Encryption failed:", error);
            showMessage("Encryption failed. Check your key and text.", true);
        }
    }

    // --- Decryption ---
    async function decryptText() {
        const encryptedText = encryptedTextInput.value.trim();
        const base64Key = encryptionKeyInput.value.trim();

        if (!encryptedText) {
            showMessage("Please enter encrypted text to decrypt.", true);
            return;
        }
        if (!base64Key) {
            showMessage("Please enter the encryption key.", true);
            return;
        }

        try {
            const key = await importAesKey(base64Key);
            if (!key) return; // Error message already shown by importAesKey

            const fullCiphertextBuffer = base64ToArrayBuffer(encryptedText);
            const iv = new Uint8Array(fullCiphertextBuffer.slice(0, 12));
            const ciphertext = fullCiphertextBuffer.slice(12);

            const decrypted = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                key,
                ciphertext
            );

            plainTextInput.value = new TextDecoder().decode(decrypted);
            encryptedTextInput.value = ''; // Clear encrypted text after decryption
            showMessage("Text decrypted successfully!", false);
        } catch (error) {
            console.error("Decryption failed:", error);
            showMessage("Decryption failed. Ensure the key and encrypted text are correct.", true);
        }
    }

    // --- Clear All ---
    function clearAll() {
        plainTextInput.value = '';
        encryptedTextInput.value = '';
        encryptionKeyInput.value = '';
        copyKeyBtn.disabled = true;
        showMessage("All fields cleared.", false);
    }

    // --- Copy to Clipboard ---
    function copyToClipboard(element) {
        if (!element || !element.value) {
            showMessage('Nothing to copy!', true);
            return;
        }
        element.select();
        try {
            document.execCommand('copy');
            showMessage('Copied to clipboard!', false);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showMessage('Failed to copy! Please try manually.', true);
        }
    }

    // --- Event Listeners ---
    if (generateKeyBtn) {
        generateKeyBtn.addEventListener('click', generateAesKey);
    }
    if (copyKeyBtn) {
        copyKeyBtn.addEventListener('click', () => copyToClipboard(encryptionKeyInput));
    }
    if (encryptBtn) {
        encryptBtn.addEventListener('click', encryptText);
    }
    if (decryptBtn) {
        decryptBtn.addEventListener('click', decryptText);
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
    }

    // Initial state
    copyKeyBtn.disabled = true;
});
