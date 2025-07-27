// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the DOM elements
    const markdownInput = document.getElementById('markdownInput');
    const previewOutput = document.getElementById('previewOutput');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');
    const messageBox = document.getElementById('messageBox');

    // Initialize marked.js options for better rendering, especially for code blocks
    // This setup helps marked.js to render GitHub Flavored Markdown (GFM)
    // and highlight code blocks if a syntax highlighter is used (though not implemented here).
    marked.setOptions({
        gfm: true, // Enable GitHub Flavored Markdown
        breaks: true, // Enable GFM line breaks
        sanitize: true // Sanitize the output HTML to prevent XSS attacks
    });

    /**
     * Renders the Markdown input to HTML and updates the preview area.
     * Also scrolls the preview area to the bottom if new content is added.
     */
    function renderMarkdown() {
        const markdownText = markdownInput.value;
        // Use marked.parse to convert Markdown to HTML
        const htmlOutput = marked.parse(markdownText);
        previewOutput.innerHTML = htmlOutput;

        // Auto-scroll to the bottom of the preview output
        // This provides a better user experience when typing long markdown
        previewOutput.scrollTop = previewOutput.scrollHeight;
    }

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        if (isError) {
            messageBox.classList.add('error');
        } else {
            messageBox.classList.remove('error');
        }

        // Hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
            messageBox.classList.remove('error'); // Ensure error class is removed
            messageBox.textContent = ''; // Clear message text
        }, 3000);
    }

    /**
     * Clears the Markdown input and the HTML preview.
     */
    function clearInput() {
        markdownInput.value = '';
        previewOutput.innerHTML = '';
        showMessage('Input and preview cleared!', false);
    }

    /**
     * Copies the generated HTML to the clipboard.
     */
    function copyHtml() {
        const htmlToCopy = previewOutput.innerHTML;

        // Create a temporary textarea element to hold the HTML content
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = htmlToCopy;
        document.body.appendChild(tempTextArea);

        // Select the content of the textarea
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        try {
            // Execute the copy command
            document.execCommand('copy');
            showMessage('HTML copied to clipboard!', false);
        } catch (err) {
            console.error('Failed to copy HTML:', err);
            showMessage('Failed to copy HTML. Please copy manually.', true);
        } finally {
            // Remove the temporary textarea
            document.body.removeChild(tempTextArea);
        }
    }

    // Event Listeners

    // Listen for input changes in the markdown textarea to update the preview in real-time
    markdownInput.addEventListener('input', renderMarkdown);

    // Listen for click on the Clear Input button
    clearInputBtn.addEventListener('click', clearInput);

    // Listen for click on the Copy HTML button
    copyHtmlBtn.addEventListener('click', copyHtml);

    // Initial render of the default markdown content when the page loads
    renderMarkdown();
});
