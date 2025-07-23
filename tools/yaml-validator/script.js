// script.js for YAML Validator

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const yamlInput = document.getElementById("yamlInput");
    const validateFormatBtn = document.getElementById("validateFormatBtn");
    const clearInputBtn = document.getElementById("clearInputBtn");
    const yamlOutput = document.getElementById("yamlOutput");
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
        // Automatically hide the message after 3 seconds, but keep critical errors visible longer
        const hideDelay = isError ? 5000 : 3000;
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, hideDelay);
    }

    /**
     * Validates and formats the YAML input.
     */
    validateFormatBtn.addEventListener("click", () => {
        const rawYaml = yamlInput.value;
        yamlOutput.value = ""; // Clear previous output
        copyOutputBtn.disabled = true;
        messageBox.classList.remove("show", "error");
        messageBox.textContent = "";

        if (!rawYaml.trim()) {
            showMessage("Please paste YAML data into the input field.", true);
            return;
        }

        try {
            // Attempt to parse the YAML. js-yaml.load will throw an error if invalid.
            const parsedYaml = jsyaml.load(rawYaml);

            // If parsing is successful, dump it back to a formatted string.
            // This also handles cases where input YAML might be minified or inconsistently formatted.
            const formattedYaml = jsyaml.dump(parsedYaml, { indent: 2, skipInvalid: true });

            yamlOutput.value = formattedYaml;
            copyOutputBtn.disabled = false;
            showMessage("YAML is valid and formatted successfully!");
        } catch (e) {
            // Catch parsing errors from js-yaml
            yamlOutput.value = `Error: Invalid YAML syntax.\n\n${e.message}`;
            showMessage("YAML validation failed. Please check the errors in the output.", true);
            console.error("YAML parsing error:", e);
        }
    });

    /**
     * Clears the input and output textareas.
     */
    clearInputBtn.addEventListener("click", () => {
        yamlInput.value = "";
        yamlOutput.value = "";
        copyOutputBtn.disabled = true;
        showMessage("Input and output cleared.");
    });

    /**
     * Copies the content of the output textarea to the clipboard.
     */
    copyOutputBtn.addEventListener("click", () => {
        if (yamlOutput.value) {
            yamlOutput.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'Formatted YAML copied to clipboard!' : 'Failed to copy text. Please copy manually.';
                showMessage(msg, !successful);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showMessage('Copying not supported or failed in this browser. Please copy manually.', true);
            }
        } else {
            showMessage("No YAML to copy.", true);
        }
    });

    // Initial state setup
    yamlOutput.value = "";
    copyOutputBtn.disabled = true;
});
