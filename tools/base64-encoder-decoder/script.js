// script.js for tools/base64-encoder-decoder/

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
                showMessage('Please enter text to encode.', 'info');
                return;
            }
            // btoa() expects a string of characters in the Latin-1 range.
            // For full Unicode support, you need to encode to UTF-8 first.
            const encoded = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));
            outputText.value = encoded;
            showMessage('Text encoded to Base64!', 'success');
        } catch (e) {
            console.error("Encoding error:", e);
            showMessage('Error encoding text. Invalid characters?', 'error');
        }
    });

    // Decode function
    decodeBtn.addEventListener('click', () => {
        try {
            const input = inputText.value;
            if (!input) {
                showMessage('Please enter a Base64 string to decode.', 'info');
                return;
            }
            // atob() expects a Base64 string.
            // For full Unicode support, you need to decode from UTF-8 first.
            const decoded = decodeURIComponent(Array.prototype.map.call(atob(input), function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            outputText.value = decoded;
            showMessage('Base64 string decoded!', 'success');
        } catch (e) {
            console.error("Decoding error:", e);
            showMessage('Error decoding Base64. Invalid Base64 string?', 'error');
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
