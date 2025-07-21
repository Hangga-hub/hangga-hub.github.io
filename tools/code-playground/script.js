// Update the entire script with this version
document.addEventListener('DOMContentLoaded', () => {
    const htmlCodeInput = document.getElementById('htmlCode');
    const cssCodeInput = document.getElementById('cssCode');
    const jsCodeInput = document.getElementById('jsCode');
    const livePreviewFrame = document.getElementById('livePreviewFrame');
    const copyButtons = document.querySelectorAll('.copy-button');
    const messageBox = document.getElementById('messageBox');
    const boilerplates = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>

</body>
</html>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}`,
    js: `document.addEventListener('DOMContentLoaded', () => {
  console.log('Boilerplate ready!');
});`
};



    function updatePreview() {
        const html = htmlCodeInput.value;
        const css = `<style>${cssCodeInput.value}</style>`;
        const js = `<script>${jsCodeInput.value}<\/script>`;

        const completeDocument = `
            <!DOCTYPE html>
            <html lang="en">
            <head><meta charset="UTF-8">${css}</head>
            <body>${html}${js}</body>
            </html>
        `;

        const iframeDoc = livePreviewFrame.contentDocument || livePreviewFrame.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(completeDocument);
        iframeDoc.close();
    }

    [htmlCodeInput, cssCodeInput, jsCodeInput].forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    function handleShortcut(input, type) {
    input.addEventListener('keyup', (e) => {
        const value = input.value;
        const cursorPos = input.selectionStart;

        // Look behind two characters for "!!"
        if (value.slice(cursorPos - 2, cursorPos) === '!!') {
            const before = value.slice(0, cursorPos - 2);
            const after = value.slice(cursorPos);
            const newValue = before + boilerplates[type] + after;

            input.value = newValue;

            // Move cursor to end of inserted boilerplate
            const newCursorPos = before.length + boilerplates[type].length;
            input.setSelectionRange(newCursorPos, newCursorPos);

            updatePreview();

            messageBox.textContent = `Inserted ${type.toUpperCase()} boilerplate!`;
            messageBox.classList.remove('error');
            messageBox.classList.add('show');
            setTimeout(() => messageBox.classList.remove('show'), 2000);
        }
    });
}

handleShortcut(htmlCodeInput, 'html');
handleShortcut(cssCodeInput, 'css');
handleShortcut(jsCodeInput, 'js');

    const exampleButtons = document.querySelectorAll('.example-buttons button');
    exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const exampleType = button.dataset.example;

            switch(exampleType) {
                case 'basic':
                    htmlCodeInput.value = `<div class="container">
    <h1>Hello World!</h1>
    <p>Start editing to see live changes</p>
</div>`;
                    cssCodeInput.value = `body {
    font-family: Arial, sans-serif;
    background: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.container {
    text-align: center;
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}`;
                    jsCodeInput.value = `// Simple JavaScript example
console.log('Playground ready!');`;
                    break;

                case 'css':
                    htmlCodeInput.value = `<div class="animation-box">
    <div class="circle"></div>
</div>`;
                    cssCodeInput.value = `.animation-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff6b6b, #48dbfb);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}`;
                    jsCodeInput.value = `// No JS needed for this animation`;
                    break;

                case 'js':
                    htmlCodeInput.value = `<div class="clock-container">
    <h2>Digital Clock</h2>
    <div id="clock"></div>
</div>`;
                    cssCodeInput.value = `.clock-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-family: 'Courier New', monospace;
}

#clock {
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-top: 1rem;
}`;
                    jsCodeInput.value = `function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('clock').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();`;
                    break;
            }

            updatePreview();
            messageBox.textContent = `Loaded ${button.textContent} example!`;
            messageBox.classList.remove('error');
            messageBox.classList.add('show');
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 2000);
        });
    });

    // Function to display messages
    function showMessage(text, isError = false) {
        messageBox.textContent = text;
        messageBox.classList.remove('show', 'error');
        if (isError) {
            messageBox.classList.add('error');
        }
        messageBox.classList.add('show');
        setTimeout(() => messageBox.classList.remove('show'), 2000);
    }

    // Add event listeners for copy buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const targetId = button.dataset.target;
            const targetInput = document.getElementById(targetId);

            if (!targetInput) {
                showMessage(`Error: Target input for ${targetId} not found.`, true);
                return;
            }

            const textToCopy = targetInput.value;

            // Try modern Clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    showMessage(`${targetId.toUpperCase().replace('CODE', '')} code copied to clipboard!`);
                } catch (err) {
                    console.error('Failed to copy using Clipboard API:', err);
                    // Fallback to older method if modern API fails or is not permitted
                    copyFallback(targetInput, targetId);
                }
            } else {
                // Fallback for older browsers or non-HTTPS environments
                copyFallback(targetInput, targetId);
            }
        });
    });

    function copyFallback(targetInput, targetId) {
        // Create a temporary textarea element
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = targetInput.value;
        tempTextArea.style.position = 'fixed'; // Avoid scrolling to bottom
        tempTextArea.style.left = '-9999px'; // Move off-screen
        tempTextArea.style.top = '0';
        document.body.appendChild(tempTextArea);

        // Select the text
        tempTextArea.focus();
        tempTextArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showMessage(`${targetId.toUpperCase().replace('CODE', '')} code copied to clipboard! (Fallback)`);
            } else {
                showMessage(`Failed to copy ${targetId.toUpperCase().replace('CODE', '')} code. Please copy manually.`, true);
                console.warn('Fallback copy command was not successful.');
            }
        } catch (err) {
            showMessage(`Failed to copy ${targetId.toUpperCase().replace('CODE', '')} code. Please copy manually.`, true);
            console.error('Error during fallback copy:', err);
        } finally {
            document.body.removeChild(tempTextArea); // Clean up the temporary textarea
        }
    }

    updatePreview();
});