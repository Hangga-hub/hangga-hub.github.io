document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const inputTextarea = document.getElementById("inputText");
    const stripBlankLinesCheckbox = document.getElementById("stripBlankLines");
    const trimSpacesCheckbox = document.getElementById("trimSpaces");
    const removeDuplicateLinesCheckbox = document.getElementById("removeDuplicateLines");
    const removeExtraSpacesCheckbox = document.getElementById("removeExtraSpaces");
    const convertToSingleLineCheckbox = document.getElementById("convertToSingleLine");
    const cleanTextBtn = document.getElementById("cleanTextBtn");
    const resetBtn = document.getElementById("resetBtn");
    const outputTextarea = document.getElementById("outputText");
    const copyOutputBtn = document.getElementById("copyOutputBtn");
    const messageBox = document.getElementById("messageBox");

    // Default text for input area
    const defaultInputText = `This is a sample text.

    It has some leading and trailing spaces.

It also has some  extra   spaces between words.
And duplicate line.
And duplicate line.

Let's see how it cleans up.`;

    inputTextarea.value = defaultInputText;

    // Initially clear the output area and disable copy button
    outputTextarea.textContent = "Your cleaned text will appear here after clicking 'Clean Text'.";
    copyOutputBtn.disabled = true;

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
     * Performs the text cleaning operations based on selected options.
     */
    function cleanText() {
        let text = inputTextarea.value;

        if (!text.trim()) {
            outputTextarea.textContent = "No text to clean.";
            copyOutputBtn.disabled = true;
            showMessage("Please enter some text to clean.", true);
            return;
        }

        let lines = text.split('\n');

        // 1. Trim Leading/Trailing Spaces (per line)
        if (trimSpacesCheckbox.checked) {
            lines = lines.map(line => line.trim());
        }

        // 2. Strip Blank Lines
        if (stripBlankLinesCheckbox.checked) {
            lines = lines.filter(line => line !== ''); // Already trimmed, so empty string means blank
        }

        // 3. Remove Duplicate Lines
        if (removeDuplicateLinesCheckbox.checked) {
            lines = Array.from(new Set(lines));
        }

        // Re-join lines for further processing if needed, or for final output
        text = lines.join('\n');

        // 4. Remove Extra Spaces (between words)
        if (removeExtraSpacesCheckbox.checked) {
            // Replace multiple spaces with a single space, then trim the whole string
            text = text.replace(/\s+/g, ' ').trim();
        }

        // 5. Convert to Single Line
        if (convertToSingleLineCheckbox.checked) {
            // Replace all newline characters and multiple spaces with a single space
            text = text.replace(/\s+/g, ' ').trim();
        }

        outputTextarea.textContent = text;
        copyOutputBtn.disabled = text.length === 0;
        showMessage("Text cleaned successfully!");

        // Auto-scroll to the output section
        outputTextarea.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    /**
     * Copies the cleaned text to the clipboard.
     */
    function copyOutput() {
        const textToCopy = outputTextarea.textContent;
        if (textToCopy && textToCopy !== "Your cleaned text will appear here after clicking 'Clean Text'." && textToCopy !== "No text to clean.") {
            try {
                // Use document.execCommand('copy') for better compatibility in iframes
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showMessage("Cleaned text copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy text:", err);
                showMessage("Failed to copy text. Please copy manually.", true);
            }
        } else {
            showMessage("No text to copy.", true);
        }
    }

    /**
     * Resets all inputs and outputs to their default states.
     */
    function resetTool() {
        inputTextarea.value = defaultInputText;
        stripBlankLinesCheckbox.checked = true;
        trimSpacesCheckbox.checked = true;
        removeDuplicateLinesCheckbox.checked = false;
        removeExtraSpacesCheckbox.checked = false;
        convertToSingleLineCheckbox.checked = false;
        outputTextarea.textContent = "Your cleaned text will appear here after clicking 'Clean Text'.";
        copyOutputBtn.disabled = true;
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Tool reset.");
    }

    // Add event listeners
    cleanTextBtn.addEventListener("click", cleanText);
    resetBtn.addEventListener("click", resetTool);
    copyOutputBtn.addEventListener("click", copyOutput);

    // No automatic cleaning on input/checkbox change, only on button click
});
