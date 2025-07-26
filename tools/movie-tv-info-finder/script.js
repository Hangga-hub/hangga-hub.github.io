// tools/movie-tv-info-finder/script.js

document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('titleInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const searchResultsDiv = document.getElementById('searchResults');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Output elements
    const posterOutput = document.getElementById('posterOutput');
    const titleOutput = document.getElementById('titleOutput');
    const genreOutput = document.getElementById('genreOutput');
    const castOutput = document.getElementById('castOutput');
    const ratingOutput = document.getElementById('ratingOutput');

    // IMPORTANT: Replace 'YOUR_OMDB_API_KEY' with your actual OMDb API key.
    // You can get a free API key from http://www.omdbapi.com/
    const OMDB_API_KEY = '4344d4c5'; 

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
        posterOutput.src = '';
        posterOutput.classList.add('hidden');
        titleOutput.textContent = '';
        genreOutput.innerHTML = '<strong>Genre:</strong> N/A';
        castOutput.innerHTML = '<strong>Cast:</strong> N/A';
        ratingOutput.innerHTML = '<strong>IMDb Rating:</strong> N/A';
        searchResultsDiv.classList.add('hidden'); // Hide the result card
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Fetches movie/TV show information from the OMDb API based on the title.
     */
    const searchMovieTv = async () => {
        const title = titleInput.value.trim();

        if (!title) {
            showMessage(messageBox, 'Please enter a movie or TV show title.', true);
            return;
        }

        if (OMDB_API_KEY === 'YOUR_OMDB_API_KEY' || !OMDB_API_KEY) {
            showMessage(messageBox, 'Please replace "YOUR_OMDB_API_KEY" in script.js with a valid OMDb API key.', true);
            return;
        }

        // Clear previous results and messages, show loading spinner
        resetOutputs(); // Reset all outputs first
        showMessage(messageBox, 'Searching...', false);
        loadingSpinner.style.display = 'block'; // Show spinner

        try {
            const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (data.Response === 'True') {
                // Display the result card
                searchResultsDiv.classList.remove('hidden');

                // Update poster
                if (data.Poster && data.Poster !== 'N/A') {
                    posterOutput.src = data.Poster;
                    posterOutput.classList.remove('hidden');
                } else {
                    posterOutput.src = 'https://placehold.co/200x300/333333/FFFFFF?text=No+Poster';
                    posterOutput.classList.remove('hidden');
                }
                
                titleOutput.textContent = data.Title || 'N/A';
                genreOutput.innerHTML = `<strong>Genre:</strong> ${data.Genre || 'N/A'}`;
                castOutput.innerHTML = `<strong>Cast:</strong> ${data.Actors || 'N/A'}`;
                ratingOutput.innerHTML = `<strong>IMDb Rating:</strong> ${data.imdbRating || 'N/A'}`;
                
                showMessage(messageBox, `Found "${data.Title}"!`, false);

            } else {
                showMessage(resultsMessageBox, data.Error || 'No movie or TV show found for that title. Please try a different search term.', true);
                searchResultsDiv.classList.add('hidden'); // Hide the result card if no results
            }
        } catch (error) {
            console.error('Error fetching movie/TV data:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage(resultsMessageBox, 'An error occurred while fetching data. Please check your network connection or try again later.', true);
            searchResultsDiv.classList.add('hidden'); // Hide the result card on error
        }
    };

    // Event listeners
    searchBtn.addEventListener('click', searchMovieTv);
    clearBtn.addEventListener('click', resetOutputs);

    // Allow pressing Enter in the input field to trigger search
    titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovieTv();
        }
    });
});
