// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the DOM elements
    const domainInput = document.getElementById('domainInput');
    const findBtn = document.getElementById('findBtn');
    const clearBtn = document.getElementById('clearBtn');
    const subdomainOutput = document.getElementById('subdomainOutput');
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
        // A simple regex for domain validation. This allows for subdomains
        // but primarily checks for a basic domain structure (e.g., example.com, sub.example.com).
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;
        return domainRegex.test(domain);
    }

    /**
     * Performs a subdomain lookup for the given domain using a public API.
     * @param {string} domain - The main domain name to look up subdomains for.
     */
    async function findSubdomains(domain) {
        subdomainOutput.value = 'Searching for subdomains... Please wait.';
        showMessage('Finding subdomains...', false);

        // Auto-scroll to the result section for better UX
        subdomainOutput.scrollIntoView({ behavior: 'smooth', block: 'end' });

        // Using hackertarget.com's hostsearch API for subdomain enumeration.
        // Note: This API might have rate limits or require an API key for higher usage.
        // For a production application, consider a dedicated backend proxy or a more robust service.
        const apiUrl = `https://api.hackertarget.com/hostsearch/?q=${domain}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                // If the response is not OK (e.g., 404, 500), throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.text(); // API returns plain text

            let subdomains = [];
            if (data && data.trim() !== 'error check your api query' && !data.includes('no records found')) {
                // Parse the plain text response. Each line is typically "subdomain.domain.com,IP_address"
                subdomains = data.split('\n')
                               .map(line => line.split(',')[0].trim()) // Get the domain part
                               .filter(sub => sub.endsWith(domain) && sub !== domain); // Ensure it's a subdomain of the input domain

                if (subdomains.length > 0) {
                    subdomainOutput.value = subdomains.join('\n');
                    showMessage(`Found ${subdomains.length} subdomains!`, false);
                } else {
                    subdomainOutput.value = `No subdomains found for "${domain}".`;
                    showMessage('No subdomains found.', false);
                }
            } else {
                subdomainOutput.value = `Could not find subdomains for "${domain}". This might be due to an invalid domain, API limits, or no public records.`;
                showMessage('Subdomain lookup failed or no records found.', true);
            }

        } catch (error) {
            console.error('Subdomain lookup failed:', error);
            subdomainOutput.value = `Error: Could not retrieve subdomains for "${domain}". Please check the domain name and your network connection.`;
            showMessage('Subdomain lookup failed!', true);
        } finally {
            // Ensure the result textarea is scrolled to the top for new results
            subdomainOutput.scrollTop = 0;
        }
    }

    /**
     * Clears the input field and the subdomain output area.
     */
    function clearFields() {
        domainInput.value = '';
        subdomainOutput.value = '';
        showMessage('Fields cleared.', false);
    }

    /**
     * Copies the content of the subdomain output textarea to the clipboard.
     */
    function copyResult() {
        if (subdomainOutput.value.trim() === '') {
            showMessage('Nothing to copy!', true);
            return;
        }

        // Use the execCommand method for clipboard operations as navigator.clipboard.writeText()
        // might not work reliably in all iframe environments.
        subdomainOutput.select();
        subdomainOutput.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            showMessage('Subdomains copied to clipboard!', false);
        } catch (err) {
            console.error('Failed to copy subdomains:', err);
            showMessage('Failed to copy. Please copy manually.', true);
        }
    }

    // Event Listeners

    // Listen for click on the Find Subdomains button
    findBtn.addEventListener('click', () => {
        const domain = domainInput.value.trim();
        if (domain === '') {
            showMessage('Please enter a main domain name.', true);
            return;
        }
        if (!isValidDomain(domain)) {
            showMessage('Please enter a valid domain name (e.g., example.com).', true);
            return;
        }
        findSubdomains(domain);
    });

    // Allow lookup on Enter key press in the input field
    domainInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            findBtn.click(); // Trigger the find button click
        }
    });

    // Listen for click on the Clear button
    clearBtn.addEventListener('click', clearFields);

    // Listen for click on the Copy Result button
    copyResultBtn.addEventListener('click', copyResult);

    // Initial state: clear fields when page loads
    clearFields();
});
