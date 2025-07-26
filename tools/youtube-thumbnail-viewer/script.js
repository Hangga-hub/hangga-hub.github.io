// tools/youtube-thumbnail-viewer/script.js

document.addEventListener('DOMContentLoaded', () => {
    const youtubeUrlInput = document.getElementById('youtubeUrlInput');
    const viewThumbnailBtn = document.getElementById('viewThumbnailBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const thumbnailResultDiv = document.getElementById('thumbnailResult');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Output elements for thumbnail details
    const thumbnailOutput = document.getElementById('thumbnailOutput');
    const thumbnailLink = document.getElementById('thumbnailLink');

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
     * Resets all thumbnail output fields and messages.
     */
    const resetOutputs = () => {
        youtubeUrlInput.value = '';
        thumbnailOutput.src = '';
        thumbnailOutput.classList.add('hidden'); // Hide thumbnail image
        thumbnailLink.textContent = '';
        thumbnailLink.href = '#';
        thumbnailResultDiv.classList.add('hidden'); // Hide the result card
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Extracts the YouTube video ID from a given URL.
     * Supports various YouTube URL formats.
     * @param {string} url - The YouTube video URL.
     * @returns {string|null} The video ID or null if not found.
     */
    const getYouTubeVideoId = (url) => {
        let videoId = null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        if (match && match[1]) {
            videoId = match[1];
        }
        return videoId;
    };

    /**
     * Extracts and displays the YouTube thumbnail.
     */
    const viewThumbnail = () => {
        const youtubeUrl = youtubeUrlInput.value.trim();

        if (!youtubeUrl) {
            showMessage(messageBox, 'Please enter a YouTube video URL.', true);
            return;
        }

        // Clear previous results and messages, show loading spinner
        resetOutputs(); // Reset all outputs first
        showMessage(messageBox, 'Extracting thumbnail...', false);
        loadingSpinner.style.display = 'block'; // Show spinner

        // Simulate a small delay for "processing"
        setTimeout(() => {
            const videoId = getYouTubeVideoId(youtubeUrl);

            if (videoId) {
                // Construct the thumbnail URL as specified: https://img.youtube.com/vi/<VIDEO_ID>/hqdefault.jpg
                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                thumbnailOutput.src = thumbnailUrl;
                thumbnailOutput.classList.remove('hidden'); // Show thumbnail image
                thumbnailLink.textContent = thumbnailUrl;
                thumbnailLink.href = thumbnailUrl;
                
                thumbnailResultDiv.classList.remove('hidden'); // Show the result card
                showMessage(messageBox, 'Thumbnail extracted successfully!', false);

                // Scroll to the result section
                thumbnailResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

            } else {
                showMessage(resultsMessageBox, 'Invalid YouTube URL. Please enter a valid video URL.', true);
                thumbnailOutput.classList.add('hidden'); // Ensure image is hidden on error
                thumbnailLink.textContent = '';
                thumbnailLink.href = '#';
            }
            loadingSpinner.style.display = 'none'; // Hide spinner
        }, 500); // Simulate processing delay
    };

    // Event listeners
    viewThumbnailBtn.addEventListener('click', viewThumbnail);
    clearBtn.addEventListener('click', resetOutputs);

    // Allow pressing Enter in the input field to trigger view
    youtubeUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            viewThumbnail();
        }
    });
});
