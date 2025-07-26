// tools/random-activity-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Removed activityTypeSelect and participantsInput as they are no longer relevant for Advice Slip API
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const activityResultDiv = document.getElementById('activityResult');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Output element for the advice
    const activityOutput = document.getElementById('activityOutput');
    // Removed activityTypeOutput and activityParticipantsOutput

    /**
     * Displays a message in a specified message box.
     * @param {HTMLElement} element - The message box HTML element.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.classList.remove('error');
        if (isError) {
            element.classList.add('error');
        }
        element.classList.add('show');
        setTimeout(() => {
            element.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Resets the input fields and clears all activity results and messages.
     */
    const resetOutputs = () => {
        // No input fields to reset
        activityOutput.textContent = '';
        activityResultDiv.classList.add('hidden'); // Hide the result card
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Fetches a random advice from the Advice Slip API.
     */
    const generateAdvice = async () => {
        // API URL for Advice Slip
        const apiUrl = 'https://api.adviceslip.com/advice';

        // Clear previous results and messages, show loading spinner
        activityOutput.textContent = '';
        activityResultDiv.classList.add('hidden');
        showMessage(messageBox, 'Generating advice...', false);
        resultsMessageBox.classList.remove('show'); // Hide previous results message
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'block'; // Show spinner

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (data.slip && data.slip.advice) {
                activityOutput.textContent = data.slip.advice;
                activityResultDiv.classList.remove('hidden'); // Show the result card
                showMessage(messageBox, 'Advice generated!', false);
            } else {
                // This usually happens if there's an issue with the API response
                showMessage(resultsMessageBox, 'Failed to retrieve advice. Please try again.', true);
                console.error('Advice Slip API response unexpected:', data);
            }
        } catch (error) {
            console.error('Error fetching advice data:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage(resultsMessageBox, 'An error occurred while fetching data. Please check your network connection or try again later.', true);
        }
    };

    // Event listeners
    generateBtn.addEventListener('click', generateAdvice);
    clearBtn.addEventListener('click', resetOutputs);

    // No longer need keypress listener for participants input
});
