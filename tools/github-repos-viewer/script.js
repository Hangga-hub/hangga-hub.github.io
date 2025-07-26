// tools/github-repos-viewer/script.js

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('usernameInput');
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
        usernameInput.value = '';
        searchResultsDiv.innerHTML = ''; // Clear previous results
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Fetches public GitHub repositories for a given username.
     */
    const searchGithubRepos = async () => {
        const username = usernameInput.value.trim();

        if (!username) {
            showMessage(messageBox, 'Please enter a GitHub username.', true);
            return;
        }

        // Clear previous results and messages, show loading spinner
        searchResultsDiv.innerHTML = '';
        showMessage(messageBox, 'Fetching repositories...', false);
        resultsMessageBox.classList.remove('show'); // Hide previous results message
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'block'; // Show spinner

        try {
            const apiUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (response.ok) {
                if (data.length > 0) {
                    showMessage(messageBox, `Found ${data.length} public repositories for ${username}!`, false);
                    data.sort((a, b) => b.stargazers_count - a.stargazers_count); // Sort by stars descending
                    data.forEach(repo => {
                        const card = document.createElement('div');
                        card.classList.add('repo-card');

                        const repoName = repo.name || 'N/A';
                        const repoUrl = repo.html_url || '#';
                        const stars = repo.stargazers_count !== undefined ? repo.stargazers_count : 'N/A';
                        const forks = repo.forks_count !== undefined ? repo.forks_count : 'N/A';
                        const description = repo.description || 'No description provided.';

                        card.innerHTML = `
                            <h4><a href="${repoUrl}" target="_blank" rel="noopener noreferrer">${repoName}</a></h4>
                            <p class="repo-description">${description}</p>
                            <div class="repo-stats">
                                <span><i class="ri-star-fill"></i> ${stars}</span>
                                <span><i class="ri-git-branch-fill"></i> ${forks}</span>
                            </div>
                        `;
                        searchResultsDiv.appendChild(card);
                    });

                    // Auto scroll down to show the result
                    searchResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    showMessage(resultsMessageBox, `No public repositories found for ${username}.`, false);
                }
            } else {
                // Handle specific GitHub API errors (e.g., user not found, rate limit)
                let errorMessage = 'Failed to retrieve repositories. Please try again.';
                if (response.status === 404) {
                    errorMessage = `GitHub user "${username}" not found. Please check the username.`;
                } else if (response.status === 403 && data.message && data.message.includes('API rate limit exceeded')) {
                    errorMessage = 'GitHub API rate limit exceeded. Please wait a moment and try again.';
                } else if (data.message) {
                    errorMessage = `Error: ${data.message}`;
                }
                showMessage(resultsMessageBox, errorMessage, true);
            }
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage(resultsMessageBox, 'An error occurred while fetching data. Please check your network connection or try again later.', true);
        }
    };

    // Event listeners
    searchBtn.addEventListener('click', searchGithubRepos);
    clearBtn.addEventListener('click', resetOutputs);

    // Allow pressing Enter in the input field to trigger search
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchGithubRepos();
        }
    });
});
