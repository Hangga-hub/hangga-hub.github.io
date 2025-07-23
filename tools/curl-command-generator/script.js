// script.js for cURL Command Generator

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const httpMethodSelect = document.getElementById("httpMethod");
    const requestUrlInput = document.getElementById("requestUrl");
    const requestHeadersInput = document.getElementById("requestHeaders");
    const requestBodyInput = document.getElementById("requestBody");
    const generateCurlBtn = document.getElementById("generateCurlBtn");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const curlOutput = document.getElementById("curlOutput");
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
     * Escapes single quotes in a string for shell compatibility.
     * @param {string} str - The string to escape.
     * @returns {string} The escaped string.
     */
    function escapeSingleQuotes(str) {
        // Replace ' with '\'' to properly escape it in a single-quoted string
        return str.replace(/'/g, "'\\''");
    }

    /**
     * Generates the cURL command based on user inputs.
     */
    generateCurlBtn.addEventListener("click", () => {
        const method = httpMethodSelect.value;
        const url = requestUrlInput.value.trim();
        const headers = requestHeadersInput.value.trim();
        const body = requestBodyInput.value; // Keep original spacing for body

        curlOutput.value = ""; // Clear previous output
        copyOutputBtn.disabled = true;
        messageBox.classList.remove("show", "error");
        messageBox.textContent = "";

        if (!url) {
            showMessage("Please enter a URL.", true);
            return;
        }

        let curlCommand = `curl -X ${method}`;

        // Add URL
        curlCommand += ` '${escapeSingleQuotes(url)}'`;

        // Add Headers
        if (headers) {
            const headerLines = headers.split('\n');
            headerLines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    // Basic validation for header format (e.g., "Name: Value")
                    if (!trimmedLine.includes(':')) {
                        showMessage(`Invalid header format: "${trimmedLine}". Headers should be "Name: Value".`, true);
                        curlOutput.value = ""; // Clear output on error
                        return; // Stop processing headers
                    }
                    curlCommand += ` -H '${escapeSingleQuotes(trimmedLine)}'`;
                }
            });
            // If an error was shown, stop here
            if (messageBox.classList.contains('error')) {
                return;
            }
        }

        // Add Body for methods that typically have a body
        const methodsWithBody = ['POST', 'PUT', 'PATCH'];
        if (methodsWithBody.includes(method) && body) {
            // Use --data-raw to send the body exactly as provided, preserving newlines etc.
            // Escape single quotes within the body content for shell compatibility.
            curlCommand += ` --data-raw $'${escapeSingleQuotes(body)}'`;
        }

        curlOutput.value = curlCommand;
        copyOutputBtn.disabled = false;
        showMessage("cURL command generated successfully!");
    });

    /**
     * Clears all input and output fields.
     */
    clearAllBtn.addEventListener("click", () => {
        httpMethodSelect.value = "GET"; // Reset to default method
        requestUrlInput.value = "";
        requestHeadersInput.value = "";
        requestBodyInput.value = "";
        curlOutput.value = "";
        copyOutputBtn.disabled = true;
        showMessage("All fields cleared.");
    });

    /**
     * Copies the content of the output textarea to the clipboard.
     */
    copyOutputBtn.addEventListener("click", () => {
        if (curlOutput.value) {
            curlOutput.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'cURL command copied to clipboard!' : 'Failed to copy text. Please copy manually.';
                showMessage(msg, !successful);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showMessage('Copying not supported or failed in this browser. Please copy manually.', true);
            }
        } else {
            showMessage("No cURL command to copy.", true);
        }
    });

    // Initial state setup
    curlOutput.value = "";
    copyOutputBtn.disabled = true;
});
