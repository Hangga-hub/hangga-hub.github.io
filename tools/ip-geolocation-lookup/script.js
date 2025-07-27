// tools/ip-geolocation-lookup/script.js

document.addEventListener('DOMContentLoaded', () => {
    const ipAddressInput = document.getElementById('ipAddressInput');
    const lookupIpBtn = document.getElementById('lookupIpBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const countryOutput = document.getElementById('countryOutput');
    const cityOutput = document.getElementById('cityOutput');
    const ispOutput = document.getElementById('ispOutput');
    const messageBox = document.getElementById('messageBox');
    const resultSection = document.querySelector('.result-section');

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (message, isError = false) => {
        messageBox.textContent = message;
        // Remove existing error class and add if it's an error
        messageBox.classList.remove('error');
        if (isError) {
            messageBox.classList.add('error');
        }
        // Show the message box
        messageBox.classList.add('show');
        // Hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000);
    };

    /**
     * Resets the output fields to their default "N/A" state.
     */
    const resetOutputs = () => {
        countryOutput.innerHTML = '<strong>Country:</strong> N/A';
        cityOutput.innerHTML = '<strong>City:</strong> N/A';
        ispOutput.innerHTML = '<strong>ISP:</strong> N/A';
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
     * Validates if a given string is a valid IPv4 or IPv6 address.
     * @param {string} ip - The IP address string to validate.
     * @returns {boolean} True if the IP is valid, false otherwise.
     */
    const isValidIp = (ip) => {
        // Regex for IPv4 validation
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        // Regex for IPv6 validation (basic, covers common formats)
        const ipv6Regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80::(([0-9a-fA-F]{0,4}%[0-9a-zA-Z]{1,})?)|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3,3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3,3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    };

    // Event listener for the "Lookup IP" button
    lookupIpBtn.addEventListener('click', async () => {
        const ipAddress = ipAddressInput.value.trim();

        // Validate if IP address is entered
        if (!ipAddress) {
            showMessage('Please enter an IP address.', true);
            resetOutputs(); // Clear previous results
            return;
        }

        // Validate IP address format
        if (!isValidIp(ipAddress)) {
            showMessage('Please enter a valid IP address.', true);
            resetOutputs(); // Clear previous results
            return;
        }

        // Show loading message and reset outputs
        showMessage('Looking up IP address...');
        resetOutputs();

        try {
            // Fetch IP geolocation data from ipapi.co
            const apiUrl = `https://ipapi.co/${ipAddress}/json/`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Check if the API call was successful and no error was returned by the API
            if (response.ok && !data.error) {
                // Update the output fields with the retrieved data
                countryOutput.innerHTML = `<strong>Country:</strong> ${data.country_name || 'N/A'} (${data.country_code || 'N/A'})`;
                cityOutput.innerHTML = `<strong>City:</strong> ${data.city || 'N/A'}${data.region ? ', ' + data.region : ''}${data.postal ? ' ' + data.postal : ''}`;
                ispOutput.innerHTML = `<strong>ISP:</strong> ${data.org || data.asn || 'N/A'}`;
                showMessage('Lookup successful!', false);
            } else {
                // Handle API-specific errors or general fetch failures
                const errorMessage = data.reason || 'Failed to retrieve IP information. Please try again or check the IP address.';
                showMessage(`Error: ${errorMessage}`, true);
                resetOutputs(); // Clear outputs on error
            }
        } catch (error) {
            // Handle network errors or other exceptions during fetch
            console.error('Error fetching IP data:', error);
            showMessage('An error occurred while fetching IP data. Please check your network connection or try again later.', true);
            resetOutputs(); // Clear outputs on error
        } finally {
            scrollToResults(); // Scroll to the results section after the operation
        }
    });

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        ipAddressInput.value = ''; // Clear the input field
        resetOutputs(); // Reset all output fields
        messageBox.classList.remove('show'); // Hide any active message
        messageBox.textContent = ''; // Clear message text
    });
});
