// tools/anime-manga-lookup/script.js

document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('titleInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const searchResultsDiv = document.getElementById('searchResults');
    const loadingSpinner = document.getElementById('loadingSpinner');

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
     * Resets the input field and clears all search results and messages.
     */
    const resetOutputs = () => {
        titleInput.value = '';
        searchResultsDiv.innerHTML = ''; // Clear previous results
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Scrolls the window down to the search results section.
     */
    const scrollToResults = () => {
        const resultsSection = document.querySelector('.search-results-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    /**
     * Fetches anime/manga information from the Jikan API based on the title.
     */
    const searchAnimeManga = async () => {
        const title = titleInput.value.trim();

        if (!title) {
            showMessage(messageBox, 'Please enter an anime or manga title.', true);
            return;
        }

        // Clear previous results and messages, show loading spinner
        searchResultsDiv.innerHTML = '';
        showMessage(messageBox, 'Searching...', false);
        resultsMessageBox.classList.remove('show'); // Hide previous results message
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'block'; // Show spinner

        try {
            const apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (response.ok && data.data && data.data.length > 0) {
                showMessage(messageBox, `Found ${data.data.length} results!`, false);
                data.data.forEach(item => {
                    const card = document.createElement('div');
                    card.classList.add('anime-result-card');

                    const imageUrl = item.images?.webp?.image_url || item.images?.jpg?.image_url || 'https://placehold.co/150x200/333333/FFFFFF?text=No+Image';
                    const titleText = item.title || 'N/A';
                    const synopsis = item.synopsis || 'No synopsis available.';
                    const episodes = item.episodes !== null ? item.episodes : 'N/A';
                    const type = item.type || 'N/A';
                    const status = item.status || 'N/A';

                    card.innerHTML = `
                        <img src="${imageUrl}" alt="${titleText} poster" class="anime-image" onerror="this.onerror=null;this.src='https://placehold.co/150x200/333333/FFFFFF?text=No+Image';">
                        <h4>${titleText}</h4>
                        <p><strong>Type:</strong> ${type}</p>
                        <p><strong>Episodes:</strong> ${episodes}</p>
                        <p><strong>Status:</strong> ${status}</p>
                        <p class="anime-synopsis"><strong>Synopsis:</strong> ${synopsis}</p>
                    `;
                    searchResultsDiv.appendChild(card);
                });
                scrollToResults(); // Scroll down after results are displayed
            } else if (response.ok && data.data && data.data.length === 0) {
                showMessage(resultsMessageBox, 'No anime or manga found for that title. Please try a different search term.', false);
                scrollToResults(); // Scroll down even if no results
            }
            else {
                const errorMessage = data.message || 'Failed to retrieve information. Please try again.';
                showMessage(resultsMessageBox, `Error: ${errorMessage}`, true);
                scrollToResults(); // Scroll down on error
            }
        } catch (error) {
            console.error('Error fetching anime/manga data:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage(resultsMessageBox, 'An error occurred while fetching data. Please check your network connection or try again later.', true);
            scrollToResults(); // Scroll down on error
        }
    };

    // Event listeners
    searchBtn.addEventListener('click', searchAnimeManga);
    clearBtn.addEventListener('click', resetOutputs);

    // Allow pressing Enter in the input field to trigger search
    titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchAnimeManga();
        }
    });
});