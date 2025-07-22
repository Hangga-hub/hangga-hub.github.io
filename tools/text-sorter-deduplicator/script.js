// script.js for Text Sorter / Deduplicator

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const sortAscBtn = document.getElementById("sortAscBtn");
    const sortDescBtn = document.getElementById("sortDescBtn");
    const deduplicateBtn = document.getElementById("deduplicateBtn");
    const clearBtn = document.getElementById("clearBtn");
    const outputArea = document.getElementById("outputArea");
    const copyOutputBtn = document.getElementById("copyOutputBtn");
    const messageBox = document.getElementById("messageBox");

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
        // Automatically hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, 3000);
    }

    /**
     * Processes the input text: splits into lines, removes empty lines, and trims whitespace.
     * @returns {string[]} An array of cleaned lines.
     */
    function getCleanedLines() {
        // Split by newline, filter out lines that are just whitespace, and trim each line.
        // This handles cases where user might have multiple blank lines or lines with only spaces.
        return textInput.value.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    /**
     * Sorts the text lines alphabetically or reverse alphabetically.
     * @param {'asc' | 'desc'} order - The sorting order ('asc' for A-Z, 'desc' for Z-A).
     */
    function sortText(order) {
        const lines = getCleanedLines();

        if (lines.length === 0) {
            outputArea.value = ""; // Clear output if no input
            showMessage("Please enter text to sort.", true);
            return;
        }

        // Use localeCompare for proper alphabetical sorting across different languages
        lines.sort((a, b) => {
            if (order === 'asc') {
                return a.localeCompare(b);
            } else {
                return b.localeCompare(a);
            }
        });

        outputArea.value = lines.join('\n');
        showMessage(`Text sorted ${order === 'asc' ? 'A-Z' : 'Z-A'} successfully!`);
    }

    /**
     * Removes duplicate lines from the text.
     */
    function deduplicateText() {
        console.log("Deduplicate button clicked!"); // Added for debugging

        const lines = getCleanedLines();

        if (lines.length === 0) {
            outputArea.value = ""; // Clear output if no input
            showMessage("Please enter text to deduplicate.", true);
            return;
        }

        // Use a Set to automatically handle unique values.
        // Convert back to Array for joining.
        const uniqueLines = Array.from(new Set(lines));

        outputArea.value = uniqueLines.join('\n');
        showMessage("Duplicates removed successfully!");
    }

    /**
     * Clears all input and output fields.
     */
    function clearAll() {
        textInput.value = "";
        outputArea.value = "";
        showMessage("All fields cleared.");
    }

    /**
     * Copies the content of the output textarea to the clipboard.
     */
    function copyOutputToClipboard() {
        if (outputArea.value.trim() === "") {
            showMessage("Nothing to copy. Please process some text first.", true);
            return;
        }

        // Select the text in the output area
        outputArea.select();
        // For mobile devices, ensure the entire text is selected
        outputArea.setSelectionRange(0, 99999);

        try {
            // Execute the copy command
            const successful = document.execCommand('copy');
            if (successful) {
                showMessage("Result copied to clipboard!");
            } else {
                // Fallback for browsers that might not support execCommand or if it fails
                showMessage("Failed to copy to clipboard. Please copy manually.", true);
            }
        } catch (err) {
            console.error('Oops, unable to copy', err);
            showMessage("Copy failed! Your browser might not support this feature or there was an error.", true);
        }
    }

    // Event Listeners
    sortAscBtn.addEventListener("click", () => sortText('asc'));
    sortDescBtn.addEventListener("click", () => sortText('desc'));
    deduplicateBtn.addEventListener("click", deduplicateText);
    clearBtn.addEventListener("click", clearAll);
    copyOutputBtn.addEventListener("click", copyOutputToClipboard);

    // Initial clear on load to ensure clean state
    clearAll();
});
