// tools/html-entity-converter/script.js

document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const inputTextarea = document.getElementById("inputText");
    const outputTextarea = document.getElementById("outputText");
    const encodeBtn = document.getElementById("encodeBtn");
    const decodeBtn = document.getElementById("decodeBtn");
    const copyBtn = document.getElementById("copyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const messageBox = document.getElementById("messageBox");

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
     * Encodes special HTML characters into HTML entities.
     */
    function encodeHtmlEntities() {
        const inputText = inputTextarea.value;
        if (!inputText) {
            outputTextarea.value = "";
            showMessage("Please enter text to encode.", "error");
            return;
        }

        // Create a temporary DOM element to leverage browser's encoding
        const tempDiv = document.createElement("div");
        tempDiv.textContent = inputText; // Assign textContent to automatically encode
        outputTextarea.value = tempDiv.innerHTML; // Retrieve encoded HTML

        showMessage("Text encoded successfully!", "success");
    }

    /**
     * Decodes HTML entities back into their original characters.
     */
    function decodeHtmlEntities() {
        const inputText = inputTextarea.value;
        if (!inputText) {
            outputTextarea.value = "";
            showMessage("Please enter text to decode.", "error");
            return;
        }

        // Create a temporary DOM element to leverage browser's decoding
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = inputText; // Assign innerHTML to automatically decode
        outputTextarea.value = tempDiv.textContent; // Retrieve decoded text

        showMessage("Entities decoded successfully!", "success");
    }

    /**
     * Copies the content of the output textarea to the clipboard.
     */
    function copyOutput() {
        if (!outputTextarea.value) {
            showMessage("Nothing to copy!", "error");
            return;
        }
        outputTextarea.select();
        document.execCommand('copy'); // Fallback for navigator.clipboard.writeText
        showMessage("Output copied to clipboard!", "success");
    }

    /**
     * Clears both input and output text areas.
     */
    function clearAll() {
        inputTextarea.value = "";
        outputTextarea.value = "";
        showMessage("Cleared all fields.", "success");
    }

    // Add event listeners to buttons
    encodeBtn.addEventListener("click", encodeHtmlEntities);
    decodeBtn.addEventListener("click", decodeHtmlEntities);
    copyBtn.addEventListener("click", copyOutput);
    clearBtn.addEventListener("click", clearAll);
});
