// script.js for tools/markdown-html-converter/

document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdownInput');
    const htmlOutput = document.getElementById('htmlOutput');
    const convertBtn = document.getElementById('convertBtn');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');

    // Function to display messages
    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        // Add type for styling (e.g., 'success', 'error', 'info')
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    // Function to convert Markdown to HTML
    function convertMarkdown() {
        try {
            const markdownText = markdownInput.value;
            // Use marked.js to convert Markdown to HTML
            // Ensure marked.js is loaded before this script runs
            if (typeof marked === 'undefined') {
                console.error("marked.js library not loaded. Cannot convert Markdown.");
                showMessage("Conversion library not loaded. Please try again later.", "error");
                return;
            }
            const htmlText = marked.parse(markdownText);
            htmlOutput.value = htmlText;
        } catch (error) {
            console.error("Error converting Markdown:", error);
            showMessage("Error converting Markdown. Please check your input.", "error");
        }
    }

    // Event listener for the Convert button
    convertBtn.addEventListener('click', convertMarkdown);

    // Optional: Real-time conversion as user types
    // markdownInput.addEventListener('input', convertMarkdown);

    // Function to copy HTML to clipboard
    copyHtmlBtn.addEventListener('click', () => {
        if (htmlOutput.value) {
            htmlOutput.select();
            // Use document.execCommand('copy') as navigator.clipboard.writeText() might not work in some iframe contexts
            document.execCommand('copy');
            showMessage('HTML copied to clipboard!', 'success');
        } else {
            showMessage('No HTML to copy.', 'info');
        }
    });

    // Function to clear both text areas
    clearBtn.addEventListener('click', () => {
        markdownInput.value = '';
        htmlOutput.value = '';
        showMessage('Cleared all content.', 'info');
    });

    // Initial conversion on load if there's pre-filled content (optional)
    if (markdownInput.value) {
        convertMarkdown();
    }
});
