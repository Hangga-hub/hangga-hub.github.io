// tools/animal-image-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    const getDogImageBtn = document.getElementById('getDogImageBtn');
    const getCatImageBtn = document.getElementById('getCatImageBtn');
    const clearImageBtn = document.getElementById('clearImageBtn');
    const imageDisplay = document.getElementById('imageDisplay');
    const messageBox = document.getElementById('messageBox');
    const resultSection = document.querySelector('.result-section');

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
     * Resets the image display and shows the initial message.
     */
    const resetOutputs = () => {
        imageDisplay.innerHTML = '<p style="color: var(--text); opacity: 0.7;">Click a button above to generate an image.</p>';
    };

    /**
     * Scrolls the window down to the result output section.
     */
    const scrollToResults = () => {
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Initialize the display
    resetOutputs();

    // Event listener for "Get Dog Image" button
    getDogImageBtn.addEventListener('click', async () => {
        showMessage('Fetching a random dog image...');
        resetOutputs();

        try {
            const apiUrl = 'https://dog.ceo/api/breeds/image/random';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.status === 'success' && data.message) {
                imageDisplay.innerHTML = `<img src="${data.message}" alt="Random Dog" onerror="this.onerror=null;this.src='https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Available';">`;
                showMessage('Dog image loaded!', false);
                scrollToResults();
            } else {
                showMessage('Failed to retrieve a dog image. Please try again.', true);
                scrollToResults();
            }
        } catch (error) {
            console.error('Error fetching dog image:', error);
            showMessage('An error occurred while fetching the dog image. Please check your network connection or try again later.', true);
            scrollToResults();
        }
    });

    // Event listener for "Get Cat Image" button
    getCatImageBtn.addEventListener('click', async () => {
        showMessage('Fetching a random cat image...');
        resetOutputs();

        try {
            const apiUrl = 'https://api.thecatapi.com/v1/images/search';
            // Note: TheCatAPI has a free tier but recommends an API key for higher rate limits.
            // For this simple tool, it might work without one for casual use.
            // If you experience issues, consider signing up for a free key and adding it to headers.
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.length > 0 && data[0].url) {
                imageDisplay.innerHTML = `<img src="${data[0].url}" alt="Random Cat" onerror="this.onerror=null;this.src='https://placehold.co/600x400/333333/FFFFFF?text=Image+Not+Available';">`;
                showMessage('Cat image loaded!', false);
                scrollToResults();
            } else {
                showMessage('Failed to retrieve a cat image. Please try again.', true);
                scrollToResults();
            }
        } catch (error) {
            console.error('Error fetching cat image:', error);
            showMessage('An error occurred while fetching the cat image. Please check your network connection or try again later.', true);
            scrollToResults();
        }
    });

    // Event listener for "Clear Image" button
    clearImageBtn.addEventListener('click', () => {
        resetOutputs();
        showMessage('', false); // Clear any active message
    });
});
