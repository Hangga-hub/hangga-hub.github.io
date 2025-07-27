// tools/random-user-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const userProfileDiv = document.getElementById('userProfile');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultSection = document.querySelector('.result-section');

    // Output elements for user details
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const userLocation = document.getElementById('userLocation');

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
     * Resets all user profile output fields and messages.
     */
    const resetOutputs = () => {
        userAvatar.src = '';
        userAvatar.classList.add('hidden'); // Hide avatar if it was shown
        userName.textContent = '';
        userEmail.innerHTML = '<strong>Email:</strong> N/A';
        userPhone.innerHTML = '<strong>Phone:</strong> N/A';
        userLocation.innerHTML = '<strong>Location:</strong> N/A';
        userProfileDiv.classList.add('hidden'); // Hide the profile card
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Scrolls the window down to the result output section.
     */
    const scrollToResults = () => {
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    /**
     * Fetches a random user profile from the Random User API.
     */
    const generateUser = async () => {
        const apiUrl = 'https://randomuser.me/api/';

        // Clear previous results and messages, show loading spinner
        resetOutputs(); // Reset all outputs first
        showMessage(messageBox, 'Generating new user...', false);
        loadingSpinner.style.display = 'block'; // Show spinner

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (data.results && data.results.length > 0) {
                const user = data.results[0];
                
                // Display user avatar
                if (user.picture && user.picture.large) {
                    userAvatar.src = user.picture.large;
                    userAvatar.classList.remove('hidden');
                } else {
                    userAvatar.src = 'https://placehold.co/120x120/333333/FFFFFF?text=User'; // Fallback
                    userAvatar.classList.remove('hidden');
                }

                userName.textContent = `${user.name.first} ${user.name.last}`;
                userEmail.innerHTML = `<strong>Email:</strong> ${user.email}`;
                userPhone.innerHTML = `<strong>Phone:</strong> ${user.phone}`;
                userLocation.innerHTML = `<strong>Location:</strong> ${user.location.city}, ${user.location.country}`;
                
                userProfileDiv.classList.remove('hidden'); // Show the profile card
                showMessage(messageBox, 'User generated successfully!', false);
                scrollToResults();
            } else {
                showMessage(resultsMessageBox, 'Failed to generate a user. Please try again.', true);
                console.error('Random User API response unexpected:', data);
                scrollToResults();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage(resultsMessageBox, 'An error occurred while fetching data. Please check your network connection or try again later.', true);
            scrollToResults();
        }
    };

    // Event listeners
    generateBtn.addEventListener('click', generateUser);
    clearBtn.addEventListener('click', resetOutputs);
});
