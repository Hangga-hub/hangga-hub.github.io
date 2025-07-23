// script.js for HTTP Header Parser

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const rawHeadersInput = document.getElementById("rawHeadersInput");
    const parseHeadersBtn = document.getElementById("parseHeadersBtn");
    const clearInputBtn = document.getElementById("clearInputBtn");
    const parsedHeadersOutput = document.getElementById("parsedHeadersOutput");
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
     * Parses raw HTTP headers and returns them as an array of objects.
     * Handles both request and response headers, including the initial status/request line.
     * @param {string} rawHeaders - The raw HTTP header string.
     * @returns {Array<Object>} An array of { name: string, value: string } objects,
     * with the first element potentially being { statusLine: string }.
     */
    function parseHeaders(rawHeaders) {
        const lines = rawHeaders.trim().split(/\r?\n/);
        const parsed = [];
        let isFirstLine = true;

        for (const line of lines) {
            if (!line.trim()) {
                continue; // Skip empty lines
            }

            if (isFirstLine) {
                // Check if it's an HTTP status line (e.g., "HTTP/1.1 200 OK")
                // or a request line (e.g., "GET /index.html HTTP/1.1")
                if (line.match(/^(HTTP\/\d\.\d \d{3}.*|GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\s/i)) {
                    parsed.push({ statusLine: line.trim() });
                } else {
                    // If the first line doesn't look like a status/request line,
                    // treat it as a regular header.
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        const name = parts[0].trim();
                        const value = parts.slice(1).join(':').trim();
                        parsed.push({ name, value });
                    } else {
                        // Malformed first line, treat as plain text if no colon
                        parsed.push({ name: "Malformed Line", value: line.trim() });
                    }
                }
                isFirstLine = false;
            } else {
                // Subsequent lines are headers
                const parts = line.split(':');
                if (parts.length > 1) {
                    const name = parts[0].trim();
                    const value = parts.slice(1).join(':').trim();
                    parsed.push({ name, value });
                } else {
                    // Handle malformed header lines (no colon)
                    parsed.push({ name: "Malformed Header", value: line.trim() });
                }
            }
        }
        return parsed;
    }

    /**
     * Renders the parsed headers into the output area.
     * @param {Array<Object>} headers - The array of parsed header objects.
     */
    function renderParsedHeaders(headers) {
        parsedHeadersOutput.innerHTML = ""; // Clear previous output

        if (headers.length === 0) {
            parsedHeadersOutput.innerHTML = '<p class="image-placeholder">No valid headers found or input is empty.</p>';
            copyOutputBtn.disabled = true;
            return;
        }

        const dl = document.createElement('dl');
        let rawOutputText = ""; // To store text for copying

        headers.forEach((header, index) => {
            if (header.statusLine) {
                const statusDiv = document.createElement('div');
                statusDiv.className = 'status-line';
                statusDiv.textContent = header.statusLine;
                dl.appendChild(statusDiv);
                rawOutputText += `Status/Request Line: ${header.statusLine}\n`;
            } else {
                const dt = document.createElement('dt');
                dt.textContent = header.name;
                const dd = document.createElement('dd');
                dd.textContent = header.value;
                dl.appendChild(dt);
                dl.appendChild(dd);
                rawOutputText += `${header.name}: ${header.value}\n`;
            }
        });

        parsedHeadersOutput.appendChild(dl);
        parsedHeadersOutput.dataset.rawText = rawOutputText.trim(); // Store for copying
        copyOutputBtn.disabled = false;
    }

    /**
     * Event listener for the Parse Headers button.
     */
    parseHeadersBtn.addEventListener("click", () => {
        const rawHeaders = rawHeadersInput.value;
        if (!rawHeaders.trim()) {
            showMessage("Please paste HTTP headers into the input field.", true);
            renderParsedHeaders([]); // Clear output if input is empty
            return;
        }

        const parsed = parseHeaders(rawHeaders);
        renderParsedHeaders(parsed);
        showMessage("Headers parsed successfully!");
    });

    /**
     * Event listener for the Clear Input button.
     */
    clearInputBtn.addEventListener("click", () => {
        rawHeadersInput.value = "";
        renderParsedHeaders([]); // Clear output
        copyOutputBtn.disabled = true;
        showMessage("Input cleared.");
    });

    /**
     * Event listener for the Copy Parsed button.
     */
    copyOutputBtn.addEventListener("click", () => {
        const textToCopy = parsedHeadersOutput.dataset.rawText;
        if (textToCopy) {
            // Create a temporary textarea to copy text
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'Parsed headers copied to clipboard!' : 'Failed to copy text. Please copy manually.';
                showMessage(msg, !successful);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showMessage('Copying not supported or failed in this browser. Please copy manually.', true);
            } finally {
                document.body.removeChild(tempTextArea);
            }
        } else {
            showMessage("No parsed headers to copy.", true);
        }
    });

    // Initial state setup
    renderParsedHeaders([]); // Ensure output area is clear on load
});
