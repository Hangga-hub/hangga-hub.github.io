// tools/http-request-maker/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const methodSelect = document.getElementById('methodSelect');
    const urlInput = document.getElementById('urlInput');
    const headersContainer = document.getElementById('headersContainer');
    const addHeaderBtn = document.getElementById('addHeaderBtn');
    const requestBodyInput = document.getElementById('requestBody');

    // Buttons and Messages
    const sendRequestBtn = document.getElementById('sendRequestBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Output elements
    const responseDetailsDiv = document.getElementById('responseDetails');
    const responseStatusSpan = document.getElementById('responseStatus');
    const responseStatusTextSpan = document.getElementById('responseStatusText');
    const responseTimeSpan = document.getElementById('responseTime');
    const responseBodyOutput = document.getElementById('responseBody');
    const outputSection = document.querySelector('.output-section'); // For scrolling

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
     * Resets all input and output fields.
     */
    const resetOutputs = () => {
        methodSelect.value = 'GET';
        urlInput.value = '';
        headersContainer.innerHTML = ''; // Clear all headers
        addHeaderRow(); // Add back one empty header row
        requestBodyInput.value = '';

        responseStatusSpan.textContent = 'N/A';
        responseStatusTextSpan.textContent = 'N/A';
        responseTimeSpan.textContent = 'N/A';
        responseBodyOutput.value = '';
        responseDetailsDiv.classList.add('hidden'); // Hide response details
        
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Adds a new header input row.
     */
    const addHeaderRow = () => {
        const headerRow = document.createElement('div');
        headerRow.classList.add('header-row');
        headerRow.innerHTML = `
            <input type="text" class="header-key" placeholder="Header Name">
            <input type="text" class="header-value" placeholder="Header Value">
            <button type="button" class="remove-header-btn" title="Remove Header"><i class="ri-delete-bin-line"></i></button>
        `;
        headersContainer.appendChild(headerRow);

        // Add event listener to the new remove button
        headerRow.querySelector('.remove-header-btn').addEventListener('click', () => {
            headerRow.remove();
            showMessage(messageBox, 'Header removed.', false);
        });
    };

    /**
     * Validates a URL.
     * @param {string} urlString - The URL string to validate.
     * @returns {boolean} True if valid URL, false otherwise.
     */
    const isValidUrl = (urlString) => {
        try {
            new URL(urlString);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * Sends the HTTP request.
     */
    const sendHttpRequest = async () => {
        const method = methodSelect.value;
        const url = urlInput.value.trim();
        const requestBody = requestBodyInput.value.trim();

        // Clear previous outputs
        responseStatusSpan.textContent = 'N/A';
        responseStatusTextSpan.textContent = 'N/A';
        responseTimeSpan.textContent = 'N/A';
        responseBodyOutput.value = '';
        responseDetailsDiv.classList.add('hidden');
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';

        if (!url) {
            showMessage(messageBox, 'Please enter a URL.', true);
            return;
        }
        if (!isValidUrl(url)) {
            showMessage(messageBox, 'Please enter a valid URL (e.g., https://api.example.com/data).', true);
            return;
        }

        showMessage(messageBox, `Sending ${method} request to ${url}...`, false);
        loadingSpinner.style.display = 'block';

        const headers = new Headers();
        headersContainer.querySelectorAll('.header-row').forEach(row => {
            const key = row.querySelector('.header-key').value.trim();
            const value = row.querySelector('.header-value').value.trim();
            if (key && value) {
                headers.append(key, value);
            }
        });

        const requestOptions = {
            method: method,
            headers: headers,
        };

        // Add body for methods that typically have one
        if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody) {
            requestOptions.body = requestBody;
            // Attempt to set Content-Type header if not already set, based on common body types
            if (!headers.has('Content-Type')) {
                try {
                    JSON.parse(requestBody);
                    headers.set('Content-Type', 'application/json');
                } catch (e) {
                    // Not JSON, could be text or XML, leave Content-Type unset or user-defined
                }
            }
        }

        const startTime = performance.now();
        try {
            const response = await fetch(url, requestOptions);
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);

            responseStatusSpan.textContent = response.status;
            responseStatusTextSpan.textContent = response.statusText || 'OK';
            responseTimeSpan.textContent = `${duration} ms`;
            responseDetailsDiv.classList.remove('hidden');

            // Try to parse response as JSON, then text
            let responseData;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    responseData = await response.json();
                    responseBodyOutput.value = JSON.stringify(responseData, null, 2); // Pretty print JSON
                } catch (e) {
                    responseData = await response.text();
                    responseBodyOutput.value = responseData;
                    showMessage(resultsMessageBox, 'Response is not valid JSON, showing as plain text.', false);
                }
            } else {
                responseData = await response.text();
                responseBodyOutput.value = responseData;
            }

            if (response.ok) {
                showMessage(resultsMessageBox, 'Request successful!', false);
            } else {
                showMessage(resultsMessageBox, `Request failed with status: ${response.status}`, true);
            }

        } catch (error) {
            console.error('Error sending HTTP request:', error);
            responseBodyOutput.value = `Error: ${error.message}\n\nCheck console for more details.`;
            showMessage(resultsMessageBox, `Network Error: ${error.message}. Check URL or CORS policy.`, true);
        } finally {
            loadingSpinner.style.display = 'none';
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Event Listeners
    addHeaderBtn.addEventListener('click', addHeaderRow);
    sendRequestBtn.addEventListener('click', sendHttpRequest);
    clearAllBtn.addEventListener('click', resetOutputs);

    // Allow Enter key to trigger sending request in URL input
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendHttpRequest();
        }
    });

    // Initial state setup
    resetOutputs();
    addHeaderRow(); // Add one initial header row on load
});
