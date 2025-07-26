// tools/nasa-apod/script.js

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateInput');
    const getPictureBtn = document.getElementById('getPictureBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const apodMedia = document.getElementById('apodMedia');
    const apodTitle = document.getElementById('apodTitle');
    const apodDate = document.getElementById('apodDate');
    const apodExplanation = document.getElementById('apodExplanation');
    const apodCopyright = document.getElementById('apodCopyright');
    const messageBox = document.getElementById('messageBox');

    // NASA APOD API requires a key. DEMO_KEY is for testing.
    // For production, you should get your own API key from https://api.nasa.gov/
    const NASA_API_KEY = 'DEMO_KEY'; 
    const NASA_APOD_START_DATE = new Date('1995-06-16'); // First available APOD date

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (message, isError = false) => {
        messageBox.textContent = message;
        messageBox.classList.remove('error');
        if (isError) {
            messageBox.classList.add('error');
        }
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Resets all APOD display fields to their default state.
     */
    const resetOutputs = () => {
        apodMedia.innerHTML = '<p style="color: var(--text); opacity: 0.7;">Select a date and click \'Get Picture\' to view the Astronomy Picture of the Day.</p>';
        apodTitle.textContent = '';
        apodDate.textContent = '';
        apodExplanation.textContent = '';
        apodCopyright.textContent = '';
    };

    /**
     * Formats a Date object to YYYY-MM-DD string.
     * @param {Date} date - The date object.
     * @returns {string} Formatted date string.
     */
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Set initial date input to today's date and set max date
    const today = new Date();
    dateInput.value = formatDate(today);
    dateInput.max = formatDate(today); // Cannot select future dates
    dateInput.min = formatDate(NASA_APOD_START_DATE); // Cannot select dates before APOD started

    resetOutputs(); // Initialize the display

    // Event listener for the "Get Picture" button
    getPictureBtn.addEventListener('click', async () => {
        const selectedDate = dateInput.value;

        if (!selectedDate) {
            showMessage('Please select a date.', true);
            resetOutputs();
            return;
        }

        const dateObj = new Date(selectedDate);
        if (isNaN(dateObj.getTime())) {
            showMessage('Invalid date selected.', true);
            resetOutputs();
            return;
        }

        // Check if date is within valid range
        if (dateObj < NASA_APOD_START_DATE || dateObj > today) {
            showMessage(`Please select a date between ${formatDate(NASA_APOD_START_DATE)} and today.`, true);
            resetOutputs();
            return;
        }

        showMessage('Fetching Astronomy Picture of the Day...');
        resetOutputs(); // Clear previous results

        try {
            const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${selectedDate}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                if (data.code === 400 && data.msg.includes('date must be between')) {
                    // Specific error for date out of range from NASA API
                    showMessage(`Error: ${data.msg}. Please select a date within the valid range.`, true);
                    return;
                }
                if (data.media_type === 'image') {
                    apodMedia.innerHTML = `<img src="${data.url}" alt="${data.title || 'Astronomy Picture'}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Available';">`;
                } else if (data.media_type === 'video') {
                    // For YouTube videos, embed using iframe
                    const videoUrl = data.url.replace('http://', 'https://'); // Ensure HTTPS
                    apodMedia.innerHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
                } else {
                    apodMedia.innerHTML = '<p style="color: var(--text); opacity: 0.7;">Media type not supported or available for this date.</p>';
                }

                apodTitle.textContent = data.title || 'No Title Available';
                apodDate.textContent = data.date ? `Date: ${data.date}` : '';
                apodExplanation.textContent = data.explanation || 'No explanation available.';
                apodCopyright.textContent = data.copyright ? `© ${data.copyright}` : '';

                showMessage('Picture loaded successfully!', false);
            } else {
                // Handle general API errors (e.g., rate limiting, invalid key)
                const errorMessage = data.msg || 'Failed to retrieve APOD. Please check the date or try again later.';
                showMessage(`Error: ${errorMessage}`, true);
                resetOutputs();
            }
        } catch (error) {
            console.error('Error fetching APOD data:', error);
            showMessage('An error occurred while fetching APOD data. Please check your network connection or try again later.', true);
            resetOutputs();
        }
    });

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        dateInput.value = formatDate(new Date()); // Reset date to today
        showMessage('', false); // Clear any active message
        resetOutputs(); // Reset all output fields
    });
});
