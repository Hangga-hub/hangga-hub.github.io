// tools/json-yaml-converter/script.js

document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const inputTextarea = document.getElementById("inputText");
    const outputTextarea = document.getElementById("outputText");
    const jsonToYamlBtn = document.getElementById("jsonToYamlBtn");
    const yamlToJsonBtn = document.getElementById("yamlToJsonBtn");
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
     * Converts JSON input to YAML output.
     */
    function convertJsonToYaml() {
        const inputText = inputTextarea.value.trim();
        if (!inputText) {
            outputTextarea.value = "";
            showMessage("Please enter JSON to convert.", "error");
            return;
        }

        try {
            const jsonObject = JSON.parse(inputText);
            const yamlString = jsyaml.dump(jsonObject); // Use jsyaml.dump for JSON to YAML
            outputTextarea.value = yamlString;
            showMessage("JSON converted to YAML successfully!", "success");
        } catch (e) {
            outputTextarea.value = "";
            showMessage(`Invalid JSON: ${e.message}`, "error");
        }
    }

    /**
     * Converts YAML input to JSON output.
     */
    function convertYamlToJson() {
        const inputText = inputTextarea.value.trim();
        if (!inputText) {
            outputTextarea.value = "";
            showMessage("Please enter YAML to convert.", "error");
            return;
        }

        try {
            const yamlObject = jsyaml.load(inputText); // Use jsyaml.load for YAML to JSON
            const jsonString = JSON.stringify(yamlObject, null, 2); // Pretty print JSON
            outputTextarea.value = jsonString;
            showMessage("YAML converted to JSON successfully!", "success");
        } catch (e) {
            outputTextarea.value = "";
            showMessage(`Invalid YAML: ${e.message}`, "error");
        }
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
    jsonToYamlBtn.addEventListener("click", convertJsonToYaml);
    yamlToJsonBtn.addEventListener("click", convertYamlToJson);
    copyBtn.addEventListener("click", copyOutput);
    clearBtn.addEventListener("click", clearAll);
});
