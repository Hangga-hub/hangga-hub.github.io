// tools/dns-lookup/script.js

document.addEventListener('DOMContentLoaded', () => {
    const domainInput = document.getElementById('domainInput');
    const lookupBtn = document.getElementById('lookupBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const dnsResultsDiv = document.getElementById('dnsResults'); // Container for all record sections
    const outputSection = document.querySelector('.output-section'); // For scrolling

    // Output lists for various record types
    const aRecordsList = document.getElementById('aRecordsList');
    const aaaaRecordsList = document.getElementById('aaaaRecordsList');
    const mxRecordsList = document.getElementById('mxRecordsList');
    const nsRecordsList = document.getElementById('nsRecordsList');
    const txtRecordsList = document.getElementById('txtRecordsList');
    const cnameRecordsList = document.getElementById('cnameRecordsList');

    const recordTypeLists = {
        A: aRecordsList,
        AAAA: aaaaRecordsList,
        MX: mxRecordsList,
        NS: nsRecordsList,
        TXT: txtRecordsList,
        CNAME: cnameRecordsList
    };

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
     * Resets all output fields and messages.
     */
    const resetOutputs = () => {
        domainInput.value = '';
        // Clear all record lists
        for (const type in recordTypeLists) {
            recordTypeLists[type].innerHTML = '<li class="no-records">No ' + type + ' records found.</li>';
        }
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Validates a domain name.
     * @param {string} domain - The domain name to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    const isValidDomain = (domain) => {
        // Basic regex for domain validation (not exhaustive but covers most cases)
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/;
        return domainRegex.test(domain);
    };

    /**
     * Fetches DNS records for a given domain and type.
     * @param {string} domain - The domain name.
     * @param {string} type - The DNS record type (e.g., 'A', 'MX').
     * @returns {Promise<Array>} A promise that resolves to an array of record data.
     */
    const fetchDnsRecord = async (domain, type) => {
        const apiUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Filter answers to only include the requested type
            return data.Answer ? data.Answer.filter(record => record.type === getRecordTypeCode(type)) : [];
        } catch (error) {
            console.error(`Error fetching ${type} record for ${domain}:`, error);
            return []; // Return empty array on error
        }
    };

    /**
     * Maps record type string to numeric code (as used by Google DNS API).
     * This is a simplified mapping for common types.
     * @param {string} type - The record type string.
     * @returns {number} The numeric record type code.
     */
    const getRecordTypeCode = (type) => {
        switch (type.toUpperCase()) {
            case 'A': return 1;
            case 'NS': return 2;
            case 'CNAME': return 5;
            case 'MX': return 15;
            case 'TXT': return 16;
            case 'AAAA': return 28;
            default: return 1; // Default to A record
        }
    };

    /**
     * Handles the DNS lookup process.
     */
    const handleDnsLookup = async () => {
        const domain = domainInput.value.trim();

        // Clear previous outputs
        for (const type in recordTypeLists) {
            recordTypeLists[type].innerHTML = '<li class="no-records">No ' + type + ' records found.</li>';
        }
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';

        if (!domain) {
            showMessage(messageBox, 'Please enter a domain name.', true);
            return;
        }

        if (!isValidDomain(domain)) {
            showMessage(messageBox, 'Please enter a valid domain name (e.g., example.com).', true);
            return;
        }

        showMessage(messageBox, `Looking up DNS records for ${domain}...`, false);
        loadingSpinner.style.display = 'block';

        const recordTypesToFetch = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME'];
        let hasRecords = false;

        // Fetch all record types in parallel
        const fetchPromises = recordTypesToFetch.map(type => fetchDnsRecord(domain, type));
        const allResults = await Promise.all(fetchPromises);

        loadingSpinner.style.display = 'none';

        recordTypesToFetch.forEach((type, index) => {
            const records = allResults[index];
            const listElement = recordTypeLists[type];
            listElement.innerHTML = ''; // Clear "No records found" placeholder

            if (records && records.length > 0) {
                hasRecords = true;
                records.forEach(record => {
                    const listItem = document.createElement('li');
                    if (type === 'MX') {
                        listItem.textContent = `Priority: ${record.priority}, Host: ${record.data}`;
                    } else {
                        listItem.textContent = record.data;
                    }
                    listElement.appendChild(listItem);
                });
            } else {
                listElement.innerHTML = `<li class="no-records">No ${type} records found.</li>`;
            }
        });

        if (hasRecords) {
            showMessage(resultsMessageBox, 'DNS lookup complete!', false);
        } else {
            showMessage(resultsMessageBox, 'No DNS records found for this domain or an error occurred.', true);
        }
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Event Listeners
    lookupBtn.addEventListener('click', handleDnsLookup);
    clearBtn.addEventListener('click', resetOutputs);

    // Allow Enter key to trigger lookup in the domain input field
    domainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleDnsLookup();
        }
    });

    // Initial state setup
    resetOutputs();
});
