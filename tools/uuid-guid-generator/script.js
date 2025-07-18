// script.js for tools/uuid-guid-generator/

document.addEventListener('DOMContentLoaded', () => {
    const numUuidsInput = document.getElementById('numUuids');
    const generateBtn = document.getElementById('generateBtn');
    const generatedUuidsTextarea = document.getElementById('generatedUuids');
    const copyUuidsBtn = document.getElementById('copyUuidsBtn');
    const clearBtn = document.getElementById('clearBtn');
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

    // Function to generate UUIDs
    function generateUuids() {
        const num = parseInt(numUuidsInput.value);
        if (isNaN(num) || num < 1 || num > 100) {
            showMessage('Please enter a number between 1 and 100.', 'error');
            return;
        }

        let uuids = [];
        for (let i = 0; i < num; i++) {
            // crypto.randomUUID() generates a UUID v4
            uuids.push(crypto.randomUUID());
        }
        generatedUuidsTextarea.value = uuids.join('\n');
        showMessage(`${num} UUID(s) generated!`, 'success');
    }

    // Event listeners
    generateBtn.addEventListener('click', generateUuids);

    copyUuidsBtn.addEventListener('click', () => {
        if (generatedUuidsTextarea.value) {
            generatedUuidsTextarea.select();
            document.execCommand('copy');
            showMessage('UUID(s) copied to clipboard!', 'success');
        } else {
            showMessage('No UUIDs to copy.', 'info');
        }
    });

    clearBtn.addEventListener('click', () => {
        generatedUuidsTextarea.value = '';
        showMessage('Cleared all UUIDs.', 'info');
    });

    // Generate 1 UUID on initial load
    generateUuids();
});
