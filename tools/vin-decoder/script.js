// tools/vin-decoder/script.js

document.addEventListener('DOMContentLoaded', () => {
    const vinInput = document.getElementById('vinInput');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const vinResultDiv = document.getElementById('vinResult');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Output elements for VIN details
    const makeOutput = document.getElementById('makeOutput');
    const modelOutput = document.getElementById('modelOutput');
    const yearOutput = document.getElementById('yearOutput');
    const engineTypeOutput = document.getElementById('engineTypeOutput');
    const bodyClassOutput = document.getElementById('bodyClassOutput');
    const manufacturerOutput = document.getElementById('manufacturerOutput');

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
     * Resets all VIN output fields and messages.
     */
    const resetOutputs = () => {
        vinInput.value = '';
        makeOutput.innerHTML = '<strong>Make:</strong> N/A';
        modelOutput.innerHTML = '<strong>Model:</strong> N/A';
        yearOutput.innerHTML = '<strong>Model Year:</strong> N/A';
        engineTypeOutput.innerHTML = '<strong>Engine Type:</strong> N/A';
        bodyClassOutput.innerHTML = '<strong>Body Class:</strong> N/A';
        manufacturerOutput.innerHTML = '<strong>Manufacturer:</strong> N/A';
        vinResultDiv.classList.add('hidden'); // Hide the result card
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Fetches vehicle information from the NHTSA VIN Decoder API.
     */
    const decodeVin = async () => {
        const vin = vinInput.value.trim().toUpperCase(); // VINs are usually uppercase

        if (!vin) {
            showMessage(messageBox, 'Please enter a VIN.', true);
            return;
        }

        // Basic VIN validation: must be 17 characters long
        if (vin.length !== 17) {
            showMessage(messageBox, 'VIN must be exactly 17 characters long.', true);
            return;
        }

        // Clear previous results and messages, show loading spinner
        resetOutputs(); // Reset all outputs first
        showMessage(messageBox, 'Decoding VIN...', false);
        loadingSpinner.style.display = 'block'; // Show spinner

        try {
            const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${encodeURIComponent(vin)}?format=json`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (data.Results && data.Results.length > 0) {
                const results = data.Results;
                let foundMake = 'N/A';
                let foundModel = 'N/A';
                let foundYear = 'N/A';
                let foundEngineType = 'N/A';
                let foundBodyClass = 'N/A';
                let foundManufacturer = 'N/A';

                // Iterate through results to find relevant information
                results.forEach(item => {
                    if (item.Variable === 'Make' && item.Value) {
                        foundMake = item.Value;
                    } else if (item.Variable === 'Model' && item.Value) {
                        foundModel = item.Value;
                    } else if (item.Variable === 'Model Year' && item.Value) {
                        foundYear = item.Value;
                    } else if (item.Variable === 'Engine Type' && item.Value) {
                        foundEngineType = item.Value;
                    } else if (item.Variable === 'Body Class' && item.Value) {
                        foundBodyClass = item.Value;
                    } else if (item.Variable === 'Manufacturer' && item.Value) {
                        foundManufacturer = item.Value;
                    }
                });

                // Check if any meaningful data was found
                if (foundMake !== 'N/A' || foundModel !== 'N/A' || foundYear !== 'N/A') {
                    makeOutput.innerHTML = `<strong>Make:</strong> ${foundMake}`;
                    modelOutput.innerHTML = `<strong>Model:</strong> ${foundModel}`;
                    yearOutput.innerHTML = `<strong>Model Year:</strong> ${foundYear}`;
                    engineTypeOutput.innerHTML = `<strong>Engine Type:</strong> ${foundEngineType}`;
                    bodyClassOutput.innerHTML = `<strong>Body Class:</strong> ${foundBodyClass}`;
                    manufacturerOutput.innerHTML = `<strong>Manufacturer:</strong> ${foundManufacturer}`;
                    vinResultDiv.classList.remove('hidden'); // Show the result card
                    showMessage(messageBox, 'VIN decoded successfully!', false);
                } else {
                    showMessage(resultsMessageBox, 'Could not retrieve full details for this VIN. It might be invalid or not in the database.', true);
                }

            } else {
                showMessage(resultsMessageBox, 'Invalid VIN or no data found. Please check the VIN and try again.', true);
            }
        } catch (error) {
            console.error('Error fetching VIN data:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage(resultsMessageBox, 'An error occurred while fetching data. Please check your network connection or try again later.', true);
        }
    };

    // Event listeners
    decodeBtn.addEventListener('click', decodeVin);
    clearBtn.addEventListener('click', resetOutputs);

    // Allow pressing Enter in the input field to trigger decode
    vinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            decodeVin();
        }
    });
});
