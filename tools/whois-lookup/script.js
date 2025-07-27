// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the DOM elements
    const domainInput = document.getElementById('domainInput');
    const lookupBtn = document.getElementById('lookupBtn');
    const clearBtn = document.getElementById('clearBtn');
    const whoisOutput = document.getElementById('whoisOutput');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const messageBox = document.getElementById('messageBox');

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        if (isError) {
            messageBox.classList.add('error');
        } else {
            messageBox.classList.remove('error');
        }

        // Hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
            messageBox.classList.remove('error'); // Ensure error class is removed
            messageBox.textContent = ''; // Clear message text
        }, 3000);
    }

    /**
     * Validates the domain input.
     * @param {string} domain - The domain string to validate.
     * @returns {boolean} True if the domain is valid, false otherwise.
     */
    function isValidDomain(domain) {
        // A simple regex for domain validation. This can be made more robust.
        // It checks for at least one alphanumeric character, followed by a dot,
        // and then another alphanumeric character, to ensure a basic domain format.
        const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return domainRegex.test(domain);
    }

    /**
     * Performs a WHOIS lookup for the given domain using the WHOISXMLAPI.
     * @param {string} domain - The domain name to look up.
     */
    async function performWhoisLookup(domain) {
        whoisOutput.value = 'Fetching WHOIS data... Please wait.';
        showMessage('Looking up WHOIS data...', false);

        // Auto-scroll to the result section for better UX
        whoisOutput.scrollIntoView({ behavior: 'smooth', block: 'end' });

        // Construct the API URL using the provided WHOISXMLAPI endpoint and API key
        // Note: It's generally not recommended to expose API keys directly in client-side code.
        // For a production application, this should be proxied through a backend server.
        const apiKey = 'at_7DUIi4GGBOu9eNhwMU3AC5zrU8omy'; // Provided API Key
        const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domain}&outputFormat=json`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                // If the response is not OK (e.g., 404, 500), throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Check if WHOIS data is available in the response
            if (data && data.WhoisRecord && data.WhoisRecord.rawText) {
                whoisOutput.value = data.WhoisRecord.rawText;
                showMessage('WHOIS lookup complete!', false);
            } else if (data && data.ErrorMessage) {
                // Handle API-specific error messages
                whoisOutput.value = `Error from API: ${data.ErrorMessage}`;
                showMessage('WHOIS lookup failed!', true);
            } else {
                // Generic message if no rawText is found or unexpected response
                whoisOutput.value = `No WHOIS data found for "${domain}". This might be due to privacy protection, an unregistered domain, or an invalid domain name.`;
                showMessage('WHOIS lookup complete, but no data found.', false);
            }

        } catch (error) {
            console.error('WHOIS lookup failed:', error);
            whoisOutput.value = `Error: Could not retrieve WHOIS data for "${domain}". Please check the domain name and your network connection.`;
            showMessage('WHOIS lookup failed!', true);
        } finally {
            // Ensure the result textarea is scrolled to the top for new results
            whoisOutput.scrollTop = 0;
        }
    }

    /**
     * Clears the input field and the WHOIS output area.
     */
    function clearFields() {
        domainInput.value = '';
        whoisOutput.value = '';
        showMessage('Fields cleared.', false);
    }

    /**
     * Copies the content of the WHOIS output textarea to the clipboard.
     */
    function copyResult() {
        if (whoisOutput.value.trim() === '') {
            showMessage('Nothing to copy!', true);
            return;
        }

        // Use the execCommand method for clipboard operations as navigator.clipboard.writeText()
        // might not work reliably in all iframe environments.
        whoisOutput.select();
        whoisOutput.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            showMessage('WHOIS data copied to clipboard!', false);
        } catch (err) {
            console.error('Failed to copy WHOIS data:', err);
            showMessage('Failed to copy. Please copy manually.', true);
        }
    }

    // Event Listeners

    // Listen for click on the Lookup button
    lookupBtn.addEventListener('click', () => {
        const domain = domainInput.value.trim();
        if (domain === '') {
            showMessage('Please enter a domain name.', true);
            return;
        }
        if (!isValidDomain(domain)) {
            showMessage('Please enter a valid domain name (e.g., example.com).', true);
            return;
        }
        performWhoisLookup(domain);
    });

    // Allow lookup on Enter key press in the input field
    domainInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            lookupBtn.click(); // Trigger the lookup button click
        }
    });

    // Listen for click on the Clear button
    clearBtn.addEventListener('click', clearFields);

    // Listen for click on the Copy Result button
    copyResultBtn.addEventListener('click', copyResult);

    // Initial state: clear fields when page loads
    clearFields();
});
