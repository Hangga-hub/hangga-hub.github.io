// tools/jwt-decoder/script.js

document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const jwtInput = document.getElementById("jwtInput");
    const decodeBtn = document.getElementById("decodeBtn");
    const clearBtn = document.getElementById("clearBtn");
    const headerOutput = document.getElementById("headerOutput");
    const payloadOutput = document.getElementById("payloadOutput");
    const signatureStatus = document.getElementById("signatureStatus");
    const copyHeaderBtn = document.getElementById("copyHeaderBtn");
    const copyPayloadBtn = document.getElementById("copyPayloadBtn");
    const messageBox = document.getElementById("messageBox");

    // Example JWT for initial display
    const exampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    jwtInput.value = exampleJwt;

    /**
     * Displays a message in the message box.
     * @param {string} message The message to display.
     * @param {string} type The type of message (e.g., 'success', 'error').
     */
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = "block";
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000); // Hide after 3 seconds
    }

    /**
     * Decodes a Base64Url string.
     * @param {string} str The Base64Url string to decode.
     * @returns {string} The decoded string.
     */
    function base64UrlDecode(str) {
        // Replace non-url-safe characters
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad out with = for Base64 if needed
        while (str.length % 4) {
            str += '=';
        }
        try {
            return Base64.decode(str); // Using js-base64 library
        } catch (e) {
            console.error("Base64 decoding error:", e);
            return null;
        }
    }

    /**
     * Decodes the JWT and displays its parts.
     */
    function decodeJwt() {
        const token = jwtInput.value.trim();
        if (!token) {
            clearOutputs();
            showMessage("Please enter a JWT to decode.", "error");
            return;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            clearOutputs();
            showMessage("Invalid JWT format. A JWT must have 3 parts separated by dots.", "error");
            return;
        }

        const encodedHeader = parts[0];
        const encodedPayload = parts[1];
        const signature = parts[2];

        let decodedHeader = null;
        let decodedPayload = null;

        try {
            decodedHeader = base64UrlDecode(encodedHeader);
            headerOutput.textContent = JSON.stringify(JSON.parse(decodedHeader), null, 2);
            headerOutput.classList.remove('error');
        } catch (e) {
            headerOutput.textContent = `Error decoding header: ${e.message || e}`;
            headerOutput.classList.add('error');
            showMessage("Error decoding JWT header.", "error");
        }

        try {
            decodedPayload = base64UrlDecode(encodedPayload);
            payloadOutput.textContent = JSON.stringify(JSON.parse(decodedPayload), null, 2);
            payloadOutput.classList.remove('error');
        } catch (e) {
            payloadOutput.textContent = `Error decoding payload: ${e.message || e}`;
            payloadOutput.classList.add('error');
            showMessage("Error decoding JWT payload.", "error");
        }

        // For signature, we only check for its presence and format, not validity without a key
        if (signature) {
            signatureStatus.textContent = "Signature is present. (Validity cannot be checked without a secret/public key)";
            signatureStatus.className = "decoded-status info";
        } else {
            signatureStatus.textContent = "Signature is missing.";
            signatureStatus.className = "decoded-status error";
        }

        if (decodedHeader && decodedPayload) {
            showMessage("JWT decoded successfully!", "success");
        }
    }

    /**
     * Clears all output fields.
     */
    function clearOutputs() {
        headerOutput.textContent = "";
        payloadOutput.textContent = "";
        signatureStatus.textContent = "";
        headerOutput.classList.remove('error');
        payloadOutput.classList.remove('error');
        signatureStatus.classList.remove('info', 'error');
    }

    /**
     * Clears all input and output fields.
     */
    function clearAll() {
        jwtInput.value = "";
        clearOutputs();
        showMessage("Cleared all fields.", "success");
    }

    /**
     * Copies content from a given element to clipboard.
     * @param {HTMLElement} element The HTML element whose text content needs to be copied.
     */
    function copyToClipboard(element) {
        if (!element.textContent) {
            showMessage("Nothing to copy!", "error");
            return;
        }
        const textarea = document.createElement('textarea');
        textarea.value = element.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showMessage("Content copied to clipboard!", "success");
    }

    // Event Listeners
    decodeBtn.addEventListener("click", decodeJwt);
    clearBtn.addEventListener("click", clearAll);
    copyHeaderBtn.addEventListener("click", () => copyToClipboard(headerOutput));
    copyPayloadBtn.addEventListener("click", () => copyToClipboard(payloadOutput));

    // Initial decode on page load with example JWT
    decodeJwt();
});
