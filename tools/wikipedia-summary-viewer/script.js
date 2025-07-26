// tools/wikipedia-summary-viewer/script.js

document.addEventListener('DOMContentLoaded', () => {
    const topicInput = document.getElementById('topicInput');
    const searchTopicBtn = document.getElementById('searchTopicBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const topicDetails = document.getElementById('topicDetails');
    const topicImage = document.getElementById('topicImage');
    const topicTitle = document.getElementById('topicTitle');
    const topicDescription = document.getElementById('topicDescription');
    const readMoreLink = document.getElementById('readMoreLink');
    const initialMessage = document.getElementById('initialMessage');
    const messageBox = document.getElementById('messageBox');

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
     * Resets all topic detail output fields to their default state.
     */
    const resetOutputs = () => {
        topicDetails.style.display = 'none';
        topicImage.src = 'https://placehold.co/400x300/333333/FFFFFF?text=No+Image';
        topicImage.alt = 'Topic Image';
        topicTitle.textContent = '';
        topicDescription.textContent = '';
        readMoreLink.style.display = 'none';
        readMoreLink.href = '#';
        initialMessage.style.display = 'block';
    };

    // Initialize the display
    resetOutputs();

    // Event listener for the "Search Topic" button
    searchTopicBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();

        if (!topic) {
            showMessage('Please enter a topic to search.', true);
            resetOutputs();
            return;
        }

        showMessage(`Searching Wikipedia for "${topic}"...`);
        resetOutputs(); // Clear previous results

        try {
            // Wikipedia REST API for page summary
            const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.type !== 'disambiguation' && data.extract) {
                // Check for 'type' to avoid disambiguation pages and ensure extract exists
                topicDetails.style.display = 'block';
                initialMessage.style.display = 'none';

                topicTitle.textContent = data.title || 'No Title Available';
                topicDescription.textContent = data.extract || 'No summary available.';

                // Update image if available
                const imageUrl = data.thumbnail ? data.thumbnail.source : null;
                topicImage.src = imageUrl || 'https://placehold.co/400x300/333333/FFFFFF?text=No+Image';
                topicImage.alt = `Image for ${data.title || 'Unknown Topic'}`;

                // Update read more link
                if (data.content_urls && data.content_urls.desktop && data.content_urls.desktop.page) {
                    readMoreLink.href = data.content_urls.desktop.page;
                    readMoreLink.style.display = 'inline-flex'; // Show the button
                } else {
                    readMoreLink.style.display = 'none';
                }

                showMessage('Summary loaded!', false);
            } else if (response.status === 404 || data.type === 'disambiguation' || !data.extract) {
                showMessage(`Topic "${topic}" not found or no direct summary available. Please try a more specific topic.`, true);
                resetOutputs();
            } else {
                showMessage('Failed to retrieve Wikipedia summary. Please try again later.', true);
                resetOutputs();
            }
        } catch (error) {
            console.error('Error fetching Wikipedia data:', error);
            showMessage('An error occurred while fetching Wikipedia data. Please check your network connection or try again later.', true);
            resetOutputs();
        }
    });

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        topicInput.value = ''; // Clear the input field
        showMessage('', false); // Clear any active message
        resetOutputs(); // Reset all output fields
    });
});
