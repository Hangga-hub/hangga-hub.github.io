// script.js for tools/javascript-formatter-minifier/

document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const messageBox = document.getElementById('messageBox');

    // Function to display messages
    function showMessage(message, type = 'info') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        } else {
            console.warn("Message box element not found.");
        }
    }

    // Function to format (beautify) JavaScript
    function formatJs(jsCode) {
        // js_beautify is provided by the beautify.min.js CDN
        // Options can be customized, e.g., { indent_size: 4, space_in_empty_paren: true }
        return js_beautify(jsCode, { indent_size: 4, space_in_empty_paren: true });
    }

    // Function to minify JavaScript
    function minifyJs(jsCode) {
        // UglifyJS.minify is provided by the uglify-es.min.js CDN
        // It returns an object with 'code' (minified JS) and 'error' properties
        const result = UglifyJS.minify(jsCode);

        if (result.error) {
            throw result.error; // Propagate the error for handling
        }
        return result.code;
    }

    // Event listeners
    formatBtn.addEventListener('click', () => {
        const input = inputText.value;
        if (!input) {
            showMessage('Please paste JavaScript code to format.', 'info');
            return;
        }
        try {
            outputText.value = formatJs(input);
            showMessage('JavaScript formatted successfully!', 'success');
        } catch (e) {
            console.error("Formatting error:", e);
            showMessage('Error formatting JavaScript. Please check your input. Details: ' + e.message, 'error');
        }
    });

    minifyBtn.addEventListener('click', () => {
        const input = inputText.value;
        if (!input) {
            showMessage('Please paste JavaScript code to minify.', 'info');
            return;
        }
        try {
            outputText.value = minifyJs(input);
            showMessage('JavaScript minified successfully!', 'success');
        } catch (e) {
            console.error("Minifying error:", e);
            showMessage('Error minifying JavaScript. Please check your input. Details: ' + e.message, 'error');
        }
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        showMessage('Cleared all content.', 'info');
    });

    copyOutputBtn.addEventListener('click', () => {
        if (outputText.value) {
            outputText.select();
            document.execCommand('copy');
            showMessage('Output JavaScript copied to clipboard!', 'success');
        } else {
            showMessage('No output JavaScript to copy.', 'info');
        }
    });
});
