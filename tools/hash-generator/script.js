// script.js for Hash Generator

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const generateHashesBtn = document.getElementById("generateHashesBtn");
    const clearBtn = document.getElementById("clearBtn");
    const md5Output = document.getElementById("md5Output");
    const sha1Output = document.getElementById("sha1Output");
    const sha256Output = document.getElementById("sha256Output");
    const messageBox = document.getElementById("messageBox");
    const copyButtons = document.querySelectorAll(".copy-btn");

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("error", "show"); // Reset classes
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 3000); // Message disappears after 3 seconds
    }

    /**
     * Generates MD5, SHA1, and SHA256 hashes for the given text.
     * Updates the respective output fields.
     */
    function generateHashes() {
        const text = textInput.value;

        if (text.trim() === "") {
            showMessage("Please enter some text to generate hashes.", true);
            clearOutputs(); // Clear previous hashes if input is empty
            return;
        }

        try {
            // Generate MD5 hash
            const md5 = CryptoJS.MD5(text).toString();
            md5Output.value = md5;

            // Generate SHA1 hash
            const sha1 = CryptoJS.SHA1(text).toString();
            sha1Output.value = sha1;

            // Generate SHA256 hash
            const sha256 = CryptoJS.SHA256(text).toString();
            sha256Output.value = sha256;

            showMessage("Hashes generated successfully!");
        } catch (error) {
            console.error("Error generating hashes:", error);
            showMessage("An error occurred during hash generation.", true);
            clearOutputs();
        }
    }

    /**
     * Clears all hash output fields.
     */
    function clearOutputs() {
        md5Output.value = "";
        sha1Output.value = "";
        sha256Output.value = "";
    }

    /**
     * Clears the input text area and all hash output fields.
     */
    function clearAll() {
        textInput.value = "";
        clearOutputs();
        showMessage("All fields cleared.");
    }

    /**
     * Copies the content of a specified input field to the clipboard.
     * @param {string} targetId - The ID of the input field whose content should be copied.
     */
    function copyToClipboard(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement && targetElement.value) {
            targetElement.select(); // Select the text
            targetElement.setSelectionRange(0, 99999); // For mobile devices

            try {
                // Use document.execCommand('copy') for clipboard operations due to iframe restrictions
                const successful = document.execCommand('copy');
                if (successful) {
                    showMessage("Copied to clipboard!");
                } else {
                    showMessage("Failed to copy to clipboard.", true);
                }
            } catch (err) {
                console.error('Oops, unable to copy', err);
                showMessage("Copy failed! Your browser might not support this feature.", true);
            }
        } else {
            showMessage("Nothing to copy.", true);
        }
    }

    // Event Listeners
    generateHashesBtn.addEventListener("click", generateHashes);
    clearBtn.addEventListener("click", clearAll);

    // Automatically generate hashes as text is typed
    textInput.addEventListener("input", generateHashes);

    copyButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const targetId = event.currentTarget.dataset.target; // Use currentTarget for delegated events
            copyToClipboard(targetId);
        });
    });

    // Initial clear on load
    clearAll();
});
