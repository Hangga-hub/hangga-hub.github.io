// script.js for Tailwind CSS Class Generator / Previewer

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const tailwindClassesInput = document.getElementById("tailwindClasses");
    const applyClassesBtn = document.getElementById("applyClassesBtn");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const previewIframe = document.getElementById("previewIframe");
    const htmlOutput = document.getElementById("htmlOutput");
    const copyOutputBtn = document.getElementById("copyOutputBtn");
    const messageBox = document.getElementById("messageBox");

    // Default HTML content for the iframe preview
    const defaultIframeContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <!-- Include Tailwind CSS via CDN -->
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                /* Basic styles for the preview container within the iframe */
                body {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #1a1a1f; /* Match main app's dark background */
                    font-family: sans-serif; /* Default font for content */
                }
            </style>
        </head>
        <body>
            <!-- The element to be styled by Tailwind classes -->
            <div id="styledElement" class="p-8 bg-gray-800 text-white rounded-xl shadow-lg flex items-center justify-center text-center text-lg font-bold">
                Preview Element
            </div>
        </body>
        </html>
    `;

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
     * Updates the iframe preview and generates the HTML output.
     */
    function updatePreviewAndHtml() {
        const classes = tailwindClassesInput.value.trim();
        const doc = previewIframe.contentWindow.document;

        // Write the base HTML structure to the iframe
        doc.open();
        doc.write(defaultIframeContent);
        doc.close();

        // Wait for the iframe content to load, especially Tailwind CSS
        previewIframe.onload = () => {
            const styledElement = doc.getElementById('styledElement');
            if (styledElement) {
                // Apply the new classes
                styledElement.className = classes;

                // Generate the HTML for output
                const generatedHtml = `<div class="${classes}">\n    Preview Element\n</div>`;
                htmlOutput.value = generatedHtml;
                copyOutputBtn.disabled = false;
                showMessage("Classes applied and HTML generated!");
            } else {
                showMessage("Error: Could not find the styled element in the preview.", true);
                htmlOutput.value = "Error generating HTML.";
                copyOutputBtn.disabled = true;
            }
        };

        // Trigger onload if iframe is already loaded (e.g., on subsequent calls)
        if (previewIframe.contentDocument.readyState === 'complete') {
            previewIframe.onload();
        }
    }

    /**
     * Clears all input and output fields and resets the preview.
     */
    clearAllBtn.addEventListener("click", () => {
        tailwindClassesInput.value = "";
        htmlOutput.value = "";
        copyOutputBtn.disabled = true;
        messageBox.classList.remove("show", "error");
        messageBox.textContent = "";

        // Reset the iframe to its default state
        const doc = previewIframe.contentWindow.document;
        doc.open();
        doc.write(defaultIframeContent);
        doc.close();

        showMessage("All fields cleared and preview reset.");
    });

    /**
     * Copies the content of the output textarea to the clipboard.
     */
    copyOutputBtn.addEventListener("click", () => {
        if (htmlOutput.value) {
            htmlOutput.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'HTML copied to clipboard!' : 'Failed to copy text. Please copy manually.';
                showMessage(msg, !successful);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showMessage('Copying not supported or failed in this browser. Please copy manually.', true);
            }
        } else {
            showMessage("No HTML to copy.", true);
        }
    });

    // --- Event Listeners ---
    applyClassesBtn.addEventListener("click", updatePreviewAndHtml);

    // Initial setup when the page loads
    // Load the default content into the iframe initially
    const doc = previewIframe.contentWindow.document;
    doc.open();
    doc.write(defaultIframeContent);
    doc.close();

    // Set initial state of the copy button
    copyOutputBtn.disabled = true;

    // Optional: Update preview live as user types (debounce to prevent too many updates)
    let debounceTimer;
    tailwindClassesInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            updatePreviewAndHtml();
        }, 500); // Update after 500ms of no typing
    });
});
