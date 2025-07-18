// script.js for tools/epoch-converter/

document.addEventListener('DOMContentLoaded', () => {
    const epochInput = document.getElementById('epochInput');
    const humanDateInput = document.getElementById('humanDateInput');
    const convertToHumanBtn = document.getElementById('convertToHumanBtn');
    const convertToEpochBtn = document.getElementById('convertToEpochBtn');
    const getCurrentEpochBtn = document.getElementById('getCurrentEpochBtn');
    const copyEpochBtn = document.getElementById('copyEpochBtn');
    const copyHumanDateBtn = document.getElementById('copyHumanDateBtn');
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

    // Convert Epoch to Human Readable Date
    convertToHumanBtn.addEventListener('click', () => {
        const epochValue = epochInput.value.trim();
        if (!epochValue) {
            showMessage('Please enter an Epoch timestamp.', 'info');
            return;
        }

        const timestamp = parseInt(epochValue, 10);
        if (isNaN(timestamp)) {
            showMessage('Invalid Epoch timestamp. Please enter a number.', 'error');
            return;
        }

        // JavaScript Date object expects milliseconds for Epoch
        const date = new Date(timestamp);

        // Check for invalid date (e.g., if timestamp is too large/small)
        if (isNaN(date.getTime())) {
            showMessage('Invalid date generated from timestamp. Check your input.', 'error');
            humanDateInput.value = '';
            return;
        }

        // Format the date to a human-readable string
        // Using toLocaleString with options for better readability
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
            timeZoneName: 'short' // e.g., GMT, WIB
        };
        humanDateInput.value = date.toLocaleString(undefined, options);
        showMessage('Converted to human readable date!', 'success');
    });

    // Convert Human Readable Date to Epoch
    convertToEpochBtn.addEventListener('click', () => {
        const humanDateValue = humanDateInput.value.trim();
        if (!humanDateValue) {
            showMessage('Please enter a human readable date/time.', 'info');
            return;
        }

        const date = new Date(humanDateValue);

        if (isNaN(date.getTime())) {
            showMessage('Invalid date format. Please use a recognized format (e.g., YYYY-MM-DD HH:MM:SS GMT).', 'error');
            epochInput.value = '';
            return;
        }

        // Get epoch timestamp in milliseconds
        epochInput.value = date.getTime();
        showMessage('Converted to Epoch timestamp!', 'success');
    });

    // Get Current Epoch
    getCurrentEpochBtn.addEventListener('click', () => {
        const currentEpoch = Date.now(); // Current time in milliseconds
        epochInput.value = currentEpoch;
        // Automatically convert and display the human-readable date as well
        const date = new Date(currentEpoch);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZoneName: 'short'
        };
        humanDateInput.value = date.toLocaleString(undefined, options);
        showMessage('Current Epoch timestamp retrieved!', 'success');
    });

    // Copy Epoch
    copyEpochBtn.addEventListener('click', () => {
        if (epochInput.value) {
            epochInput.select();
            document.execCommand('copy');
            showMessage('Epoch timestamp copied to clipboard!', 'success');
        } else {
            showMessage('No Epoch timestamp to copy.', 'info');
        }
    });

    // Copy Human Date
    copyHumanDateBtn.addEventListener('click', () => {
        if (humanDateInput.value) {
            humanDateInput.select();
            document.execCommand('copy');
            showMessage('Human readable date copied to clipboard!', 'success');
        } else {
            showMessage('No human readable date to copy.', 'info');
        }
    });

    // Clear All
    clearBtn.addEventListener('click', () => {
        epochInput.value = '';
        humanDateInput.value = '';
        showMessage('Cleared all content.', 'info');
    });
});
