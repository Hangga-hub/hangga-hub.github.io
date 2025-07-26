// tools/weather-viewer/script.js

document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const locationOutput = document.getElementById('locationOutput');
    const temperatureOutput = document.getElementById('temperatureOutput');
    const conditionOutput = document.getElementById('conditionOutput');
    const windOutput = document.getElementById('windOutput');
    const humidityOutput = document.getElementById('humidityOutput');
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
     * Resets all weather output fields to their default "N/A" state.
     */
    const resetOutputs = () => {
        locationOutput.innerHTML = '<strong>Location:</strong> N/A';
        temperatureOutput.innerHTML = '<strong>Temperature:</strong> N/A';
        conditionOutput.innerHTML = '<strong>Condition:</strong> N/A';
        windOutput.innerHTML = '<strong>Wind:</strong> N/A';
        humidityOutput.innerHTML = '<strong>Humidity:</strong> N/A';
    };

    // Event listener for the "Get Weather" button
    getWeatherBtn.addEventListener('click', async () => {
        const city = cityInput.value.trim();

        if (!city) {
            showMessage('Please enter a city name.', true);
            resetOutputs();
            return;
        }

        showMessage('Fetching weather data...');
        resetOutputs();

        try {
            // Using wttr.in API for weather data
            const apiUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Check if the API returned valid data
            if (response.ok && data.current_condition && data.current_condition.length > 0) {
                const current = data.current_condition[0];
                const nearestArea = data.nearest_area && data.nearest_area.length > 0 ? data.nearest_area[0] : null;

                // Extract location name, prioritizing city, then area, then country
                let locationName = city; // Default to input city
                if (nearestArea) {
                    const areaName = nearestArea.areaName && nearestArea.areaName.length > 0 ? nearestArea.areaName[0].value : '';
                    const countryName = nearestArea.country && nearestArea.country.length > 0 ? nearestArea.country[0].value : '';
                    if (areaName && countryName) {
                        locationName = `${areaName}, ${countryName}`;
                    } else if (areaName) {
                        locationName = areaName;
                    } else if (countryName) {
                        locationName = countryName;
                    }
                }

                locationOutput.innerHTML = `<strong>Location:</strong> ${locationName || 'N/A'}`;
                temperatureOutput.innerHTML = `<strong>Temperature:</strong> ${current.temp_C}°C / ${current.temp_F}°F`;
                conditionOutput.innerHTML = `<strong>Condition:</strong> ${current.weatherDesc[0].value}`;
                windOutput.innerHTML = `<strong>Wind:</strong> ${current.windspeedKmph} km/h (${current.winddir16Point})`;
                humidityOutput.innerHTML = `<strong>Humidity:</strong> ${current.humidity}%`;

                showMessage('Weather data loaded!', false);
            } else {
                // Handle cases where API returns an error or no data for the city
                showMessage('Could not find weather for that city. Please try a different name.', true);
                resetOutputs();
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            showMessage('An error occurred while fetching weather data. Please check your network connection or try again later.', true);
            resetOutputs();
        }
    });

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        cityInput.value = ''; // Clear the input field
        showMessage('', false); // Clear any active message
        resetOutputs(); // Reset all output fields
    });
});
