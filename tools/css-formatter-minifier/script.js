// script.js for tools/css-formatter-minifier/

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

    // Function to minify CSS
    function minifyCss(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s*([{}|:;,])\s*/g, '$1') // Remove whitespace around important chars
            .replace(/;}/g, '}') // Remove semicolon before closing brace
            .replace(/\s+/g, ' ') // Collapse multiple spaces to single space
            .trim();
    }

    // Function to format (beautify) CSS
    function formatCss(css) {
        // First, minify to clean up inconsistencies
        let minified = minifyCss(css);

        let formatted = '';
        let indentLevel = 0;
        const indentChar = '    '; // 4 spaces

        // Add newlines strategically for formatting
        minified = minified.replace(/\{/g, '{\n')
                           .replace(/\}/g, '\n}\n')
                           .replace(/;/g, ';\n');

        const lines = minified.split('\n').filter(line => line.trim() !== '');

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('}')) {
                indentLevel--;
            }
            formatted += indentChar.repeat(indentLevel) + line + '\n';
            if (line.endsWith('{')) {
                indentLevel++;
            }
        });

        return formatted.trim();
    }

    // Event listeners
    formatBtn.addEventListener('click', () => {
        const input = inputText.value;
        if (!input) {
            showMessage('Please paste CSS code to format.', 'info');
            return;
        }
        try {
            outputText.value = formatCss(input);
            showMessage('CSS formatted successfully!', 'success');
        } catch (e) {
            console.error("Formatting error:", e);
            showMessage('Error formatting CSS. Please check your input.', 'error');
        }
    });

    minifyBtn.addEventListener('click', () => {
        const input = inputText.value;
        if (!input) {
            showMessage('Please paste CSS code to minify.', 'info');
            return;
        }
        try {
            outputText.value = minifyCss(input);
            showMessage('CSS minified successfully!', 'success');
        } catch (e) {
            console.error("Minifying error:", e);
            showMessage('Error minifying CSS. Please check your input.', 'error');
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
            showMessage('Output CSS copied to clipboard!', 'success');
        } else {
            showMessage('No output CSS to copy.', 'info');
        }
    });
});
