document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const messageInput = document.getElementById("messageInput");
    const secretKeyInput = document.getElementById("secretKeyInput");
    const algorithmSelect = document.getElementById("algorithmSelect");
    const generateHmacBtn = document.getElementById("generateHmacBtn");
    const resetBtn = document.getElementById("resetBtn");
    const hmacOutput = document.getElementById("hmacOutput");
    const copyHmacBtn = document.getElementById("copyHmacBtn");
    const messageBox = document.getElementById("messageBox");

    // Default values
    messageInput.value = "Hello, World!";
    secretKeyInput.value = "mysecretkey";

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("show", "error");
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");

        // Hide message after 5 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 5000);
    }

    /**
     * Generates the HMAC based on the provided message, secret key, and algorithm.
     */
    function generateHmac() {
        const message = messageInput.value;
        const secretKey = secretKeyInput.value;
        const algorithm = algorithmSelect.value;

        if (!message) {
            showMessage("Please enter a message to hash.", true);
            return;
        }
        if (!secretKey) {
            showMessage("Please enter a secret key.", true);
            return;
        }

        hmacOutput.textContent = "Generating HMAC...";
        copyHmacBtn.disabled = true;
        generateHmacBtn.disabled = true;

        try {
            let hmacHash;
            switch (algorithm) {
                case "SHA256":
                    hmacHash = CryptoJS.HmacSHA256(message, secretKey);
                    break;
                case "SHA512":
                    hmacHash = CryptoJS.HmacSHA512(message, secretKey);
                    break;
                case "MD5":
                    hmacHash = CryptoJS.HmacMD5(message, secretKey);
                    break;
                case "SHA1":
                    hmacHash = CryptoJS.HmacSHA1(message, secretKey);
                    break;
                default:
                    throw new Error("Unsupported HMAC algorithm selected.");
            }

            const generatedHmac = hmacHash.toString(CryptoJS.enc.Hex);
            hmacOutput.textContent = generatedHmac;
            copyHmacBtn.disabled = false;
            showMessage("HMAC generated successfully!");

        } catch (error) {
            console.error("Error generating HMAC:", error);
            showMessage(`Error generating HMAC: ${error.message || error}`, true);
            hmacOutput.textContent = "Error generating HMAC.";
            copyHmacBtn.disabled = true;
        } finally {
            generateHmacBtn.disabled = false;
        }
    }

    /**
     * Copies the generated HMAC to the clipboard.
     */
    function copyHmac() {
        const hmacText = hmacOutput.textContent;
        if (hmacText && hmacText !== "Your generated HMAC will appear here." && hmacText !== "Generating HMAC..." && hmacText !== "Error generating HMAC.") {
            try {
                // Use document.execCommand('copy') for better compatibility in iframes
                const textArea = document.createElement("textarea");
                textArea.value = hmacText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showMessage("HMAC copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy HMAC:", err);
                showMessage("Failed to copy HMAC. Please copy manually.", true);
            }
        } else {
            showMessage("No HMAC to copy.", true);
        }
    }

    /**
     * Resets all inputs and output.
     */
    function resetAll() {
        messageInput.value = "Hello, World!";
        secretKeyInput.value = "mysecretkey";
        algorithmSelect.value = "SHA256";
        hmacOutput.textContent = "Your generated HMAC will appear here.";
        copyHmacBtn.disabled = true;
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Inputs reset.");
    }

    // Add event listeners
    generateHmacBtn.addEventListener("click", generateHmac);
    copyHmacBtn.addEventListener("click", copyHmac);
    resetBtn.addEventListener("click", resetAll);

    // Initial generation on page load with default values
    generateHmac();
});
