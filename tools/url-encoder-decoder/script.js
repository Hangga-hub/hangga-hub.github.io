// script.js for tools/url-encoder-decoder/

document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyInputBtn = document.getElementById('copyInputBtn');
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

    // Encode function
    encodeBtn.addEventListener('click', () => {
        try {
            const input = inputText.value;
            if (!input) {
                showMessage('Please enter text or URL to encode.', 'info');
                return;
            }
            const encoded = encodeURIComponent(input);
            outputText.value = encoded;
            showMessage('URL/Text encoded!', 'success');
        } catch (e) {
            console.error("Encoding error:", e);
            showMessage('Error encoding URL/text.', 'error');
        }
    });

    // Decode function
    decodeBtn.addEventListener('click', () => {
        try {
            const input = inputText.value;
            if (!input) {
                showMessage('Please enter a URL-encoded string to decode.', 'info');
                return;
            }
            const decoded = decodeURIComponent(input);
            outputText.value = decoded;
            showMessage('URL/Text decoded!', 'success');
        } catch (e) {
            console.error("Decoding error:", e);
            showMessage('Error decoding URL/text. Invalid URL-encoded string?', 'error');
        }
    });

    // Clear function
    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        showMessage('Cleared all content.', 'info');
    });

    // Copy Input function
    copyInputBtn.addEventListener('click', () => {
        if (inputText.value) {
            inputText.select();
            document.execCommand('copy');
            showMessage('Input text copied to clipboard!', 'success');
        } else {
            showMessage('No input text to copy.', 'info');
        }
    });

    // Copy Output function
    copyOutputBtn.addEventListener('click', () => {
        if (outputText.value) {
            outputText.select();
            document.execCommand('copy');
            showMessage('Output text copied to clipboard!', 'success');
        } else {
            showMessage('No output text to copy.', 'info');
        }
    });
});
