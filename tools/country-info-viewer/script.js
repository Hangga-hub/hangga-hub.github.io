// tools/country-info-viewer/script.js

document.addEventListener('DOMContentLoaded', () => {
    const countryInput = document.getElementById('countryInput');
    const searchCountryBtn = document.getElementById('searchCountryBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const countryFlag = document.getElementById('countryFlag');
    const countryNameOutput = document.getElementById('countryNameOutput');
    const capitalOutput = document.getElementById('capitalOutput');
    const populationOutput = document.getElementById('populationOutput');
    const regionOutput = document.getElementById('regionOutput');
    const subregionOutput = document.getElementById('subregionOutput');
    const currenciesOutput = document.getElementById('currenciesOutput');
    const languagesOutput = document.getElementById('languagesOutput');
    const timezonesOutput = document.getElementById('timezonesOutput');
    const mapsOutput = document.getElementById('mapsOutput');
    const mapLinks = document.getElementById('mapLinks');
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
     * Scrolls the window down to the result output section.
     */
    const scrollToResults = () => {
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    /**
     * Resets all country detail output fields to their default "N/A" state.
     */
    const resetOutputs = () => {
        countryFlag.src = 'https://placehold.co/300x200/333333/FFFFFF?text=Flag+Here';
        countryFlag.alt = 'Country Flag';
        countryNameOutput.innerHTML = '<strong>Country:</strong> N/A';
        capitalOutput.innerHTML = '<strong>Capital:</strong> N/A';
        populationOutput.innerHTML = '<strong>Population:</strong> N/A';
        regionOutput.innerHTML = '<strong>Region:</strong> N/A';
        subregionOutput.innerHTML = '<strong>Subregion:</strong> N/A';
        currenciesOutput.innerHTML = '<strong>Currencies:</strong> N/A';
        languagesOutput.innerHTML = '<strong>Languages:</strong> N/A';
        timezonesOutput.innerHTML = '<strong>Timezones:</strong> N/A';
        mapLinks.innerHTML = 'N/A';
    };

    // Initialize the display
    resetOutputs();

    // Event listener for the "Search Country" button
    searchCountryBtn.addEventListener('click', async () => {
        const countryName = countryInput.value.trim();

        if (!countryName) {
            showMessage('Please enter a country name.', true);
            resetOutputs();
            return;
        }

        showMessage(`Searching for ${countryName}...`);
        resetOutputs(); // Clear previous results

        try {
            // Using restcountries.com API to search by country name
            const apiUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.length > 0) {
                const country = data[0]; // Assuming the first result is the most relevant

                // Update flag
                countryFlag.src = country.flags.png || 'https://placehold.co/300x200/333333/FFFFFF?text=Flag+Not+Available';
                countryFlag.alt = `Flag of ${country.name.common}`;

                // Update general info
                countryNameOutput.innerHTML = `<strong>Country:</strong> ${country.name.common || 'N/A'}`;
                capitalOutput.innerHTML = `<strong>Capital:</strong> ${country.capital ? country.capital.join(', ') : 'N/A'}`;
                populationOutput.innerHTML = `<strong>Population:</strong> ${country.population ? country.population.toLocaleString() : 'N/A'}`;
                regionOutput.innerHTML = `<strong>Region:</strong> ${country.region || 'N/A'}`;
                subregionOutput.innerHTML = `<strong>Subregion:</strong> ${country.subregion || 'N/A'}`;

                // Update currencies
                if (country.currencies) {
                    const currencyNames = Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ');
                    currenciesOutput.innerHTML = `<strong>Currencies:</strong> ${currencyNames || 'N/A'}`;
                } else {
                    currenciesOutput.innerHTML = '<strong>Currencies:</strong> N/A';
                }

                // Update languages
                if (country.languages) {
                    const languageNames = Object.values(country.languages).join(', ');
                    languagesOutput.innerHTML = `<strong>Languages:</strong> ${languageNames || 'N/A'}`;
                } else {
                    languagesOutput.innerHTML = '<strong>Languages:</strong> N/A';
                }

                // Update timezones
                timezonesOutput.innerHTML = `<strong>Timezones:</strong> ${country.timezones ? country.timezones.join(', ') : 'N/A'}`;

                // Update maps links
                if (country.maps) {
                    let mapHtml = '';
                    if (country.maps.googleMaps) {
                        mapHtml += `<a href="${country.maps.googleMaps}" target="_blank" rel="noopener noreferrer">Google Maps</a>`;
                    }
                    if (country.maps.openStreetMaps) {
                        if (mapHtml) mapHtml += ', ';
                        mapHtml += `<a href="${country.maps.openStreetMaps}" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>`;
                    }
                    mapLinks.innerHTML = mapHtml || 'N/A';
                } else {
                    mapLinks.innerHTML = 'N/A';
                }

                showMessage('Country data loaded!', false);
                scrollToResults();
            } else if (response.status === 404) {
                showMessage(`Country "${countryName}" not found. Please check the spelling.`, true);
                resetOutputs();
                scrollToResults();
            } else {
                showMessage('Failed to retrieve country information. Please try again later.', true);
                resetOutputs();
                scrollToResults();
            }
        } catch (error) {
            console.error('Error fetching country data:', error);
            showMessage('An error occurred while fetching country data. Please check your network connection or try again later.', true);
            resetOutputs();
            scrollToResults();
        }
    });

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        countryInput.value = ''; // Clear the input field
        showMessage('', false); // Clear any active message
        resetOutputs(); // Reset all output fields
    });
});
