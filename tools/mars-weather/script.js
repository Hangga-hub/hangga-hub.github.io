// tools/mars-weather/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Output elements
    const solOutput = document.getElementById('solOutput');
    const earthDateOutput = document.getElementById('earthDateOutput');
    const minTempOutput = document.getElementById('minTempOutput');
    const maxTempOutput = document.getElementById('maxTempOutput');
    const pressureOutput = document.getElementById('pressureOutput');
    const pressureTrendOutput = document.getElementById('pressureTrendOutput');
    const sunriseOutput = document.getElementById('sunriseOutput');
    const sunsetOutput = document.getElementById('sunsetOutput');
    const messageBox = document.getElementById('messageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const refreshBtn = document.getElementById('refreshBtn');
    const weatherInfoGrid = document.getElementById('weatherInfoGrid'); // For scrolling

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
     * Resets all output fields to their initial "Detecting..." state.
     */
    const resetOutputs = () => {
        solOutput.textContent = 'Detecting...';
        earthDateOutput.textContent = 'Detecting...';
        minTempOutput.textContent = 'Detecting...';
        maxTempOutput.textContent = 'Detecting...';
        pressureOutput.textContent = 'Detecting...';
        pressureTrendOutput.textContent = 'Detecting...';
        sunriseOutput.textContent = 'Detecting...';
        sunsetOutput.textContent = 'Detecting...';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
    };

    /**
     * Fetches and displays current Mars weather conditions.
     */
    const getMarsWeather = async () => {
        resetOutputs(); // Reset outputs before fetching
        loadingSpinner.style.display = 'block'; // Show spinner
        showMessage('Fetching latest Mars weather data...', false);

        try {
            const apiUrl = 'https://api.maas2.apollorion.com/';
            const response = await fetch(apiUrl);
            const data = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (response.ok && data) {
                solOutput.textContent = data.sol || 'N/A';
                earthDateOutput.textContent = data.terrestrial_date || 'N/A';
                minTempOutput.textContent = data.min_temp_fahrenheit !== undefined ? `${data.min_temp_fahrenheit}°F (${data.min_temp}°C)` : 'N/A';
                maxTempOutput.textContent = data.max_temp_fahrenheit !== undefined ? `${data.max_temp_fahrenheit}°F (${data.max_temp}°C)` : 'N/A';
                pressureOutput.textContent = data.pressure !== undefined ? `${data.pressure} Pa` : 'N/A';
                pressureTrendOutput.textContent = data.pressure_desc || 'N/A';
                sunriseOutput.textContent = data.sunrise || 'N/A';
                sunsetOutput.textContent = data.sunset || 'N/A';

                showMessage('Mars weather updated successfully!', false);
                // Scroll to the weather info grid
                weatherInfoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });

            } else {
                const errorMessage = data.message || 'Failed to retrieve Mars weather. Please try again.';
                showMessage(`Error: ${errorMessage}`, true);
                // Set outputs to N/A if there's an error
                resetOutputs(); // Ensure all fields are reset to N/A
            }
        } catch (error) {
            console.error('Error fetching Mars weather data:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage('An error occurred while fetching Mars weather. Please check your network connection or try again later.', true);
            // Set outputs to N/A on network error
            resetOutputs(); // Ensure all fields are reset to N/A
        }
    };

    // Automatically fetch info on page load
    getMarsWeather();

    // Event listener for the "Refresh Weather" button
    refreshBtn.addEventListener('click', getMarsWeather);
});
