// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the DOM elements
    const startTestBtn = document.getElementById('startTestBtn');
    const clearResultsBtn = document.getElementById('clearResultsBtn');
    const speedResultDisplay = document.getElementById('speedResult');
    const progressDisplay = document.getElementById('progressDisplay');
    const progressBar = document.getElementById('progressBar');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const messageBox = document.getElementById('messageBox');
    const resultSection = document.querySelector('.result-section'); // For auto-scrolling

    // Constants for the test
    // We will now download a dummy file from a public server to measure actual internet speed.
    // The Cloudflare speed test endpoint is used as a reliable source for dummy file downloads.
    const FILE_SIZE_MB = 50; // Size of the dummy file to download in Megabytes (e.g., 50MB for a more substantial test)
    const FILE_SIZE_BYTES = FILE_SIZE_MB * 1024 * 1024; // Convert MB to Bytes
    // URL to a dummy file provided by Cloudflare's speed test service.
    // This URL will serve a file of the specified byte size.
    const TEST_FILE_URL = `https://speed.cloudflare.com/__down?bytes=${FILE_SIZE_BYTES}`;

    // State variables
    let isTesting = false;

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
     * Updates the UI to reflect the current test state.
     * @param {boolean} testing - True if test is ongoing, false otherwise.
     */
    function updateUIForTest(testing) {
        isTesting = testing;
        startTestBtn.disabled = testing;
        clearResultsBtn.disabled = testing;
        copyResultBtn.disabled = testing;
        if (testing) {
            startTestBtn.textContent = 'Testing...';
            startTestBtn.classList.add('secondary'); // Change style while testing
            startTestBtn.classList.remove('primary');
            speedResultDisplay.textContent = '-- Mbps';
            progressDisplay.textContent = '0%';
            progressBar.style.width = '0%';
        } else {
            startTestBtn.textContent = 'Start Test';
            startTestBtn.classList.add('primary');
            startTestBtn.classList.remove('secondary');
            clearResultsBtn.disabled = false; // Enable clear after test
            copyResultBtn.disabled = false; // Enable copy after test
        }
    }

    /**
     * Performs the internet speed test by downloading a dummy file from a remote server.
     */
    async function startSpeedTest() {
        if (isTesting) {
            return; // Prevent multiple tests simultaneously
        }

        updateUIForTest(true);
        showMessage('Starting speed test by downloading a dummy file...', false);

        // Auto-scroll to the result section when test starts
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        try {
            // 1. Start timing the download
            const startTime = performance.now();

            // 2. Fetch the dummy file from the remote URL
            const response = await fetch(TEST_FILE_URL);

            if (!response.ok) {
                throw new Error(`Failed to fetch dummy file: ${response.statusText} (Status: ${response.status})`);
            }

            // Get the readable stream from the response body
            const reader = response.body.getReader();
            let receivedLength = 0; // Total bytes received
            let chunks = []; // Array to hold received data chunks

            // Read the stream and update progress
            while (true) {
                const { done, value } = await reader.read(); // Read a chunk

                if (done) {
                    // All data has been read
                    break;
                }

                chunks.push(value); // Store the chunk
                receivedLength += value.length; // Add chunk length to total received

                // Calculate and update progress
                const progress = Math.round((receivedLength / FILE_SIZE_BYTES) * 100);
                progressDisplay.textContent = `${progress}%`;
                progressBar.style.width = `${progress}%`;
            }

            // 3. End timing
            const endTime = performance.now();
            const durationMs = endTime - startTime; // Duration in milliseconds

            // Ensure duration is not zero to avoid division by zero
            if (durationMs === 0) {
                speedResultDisplay.textContent = 'Very Fast!';
                showMessage('Speed test complete! Connection is extremely fast.', false);
                return; // Exit early as calculation would be problematic
            }

            // 4. Calculate speed
            // Speed = (Bytes * 8 bits/byte) / (milliseconds / 1000 ms/s) = (Bytes * 8 * 1000) / milliseconds
            // Convert to Mbps: (Bytes * 8 * 1000) / (milliseconds * 1,000,000 bits/Mbps)
            const speedMbps = (FILE_SIZE_BYTES * 8) / (durationMs / 1000) / 1000000;

            speedResultDisplay.textContent = `${speedMbps.toFixed(2)} Mbps`;
            showMessage('Speed test complete!', false);

        } catch (error) {
            console.error('Speed test failed:', error);
            speedResultDisplay.textContent = 'Error';
            showMessage(`Speed test failed: ${error.message}. Please check your internet connection or try again.`, true);
            progressDisplay.textContent = '0%';
            progressBar.style.width = '0%';
        } finally {
            updateUIForTest(false);
        }
    }

    /**
     * Clears the displayed results.
     */
    function clearResults() {
        speedResultDisplay.textContent = '-- Mbps';
        progressDisplay.textContent = '0%';
        progressBar.style.width = '0%';
        showMessage('Results cleared.', false);
        clearResultsBtn.disabled = true; // Disable clear until next test
        copyResultBtn.disabled = true; // Disable copy until next test
    }

    /**
     * Copies the current speed result to the clipboard.
     */
    function copyResult() {
        const resultText = speedResultDisplay.textContent;
        if (resultText === '-- Mbps' || resultText === 'Error' || resultText.trim() === '') {
            showMessage('Nothing to copy!', true);
            return;
        }

        // Use document.execCommand('copy') for better compatibility in iframes
        const tempInput = document.createElement('input');
        tempInput.value = resultText;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            showMessage('Result copied to clipboard!', false);
        } catch (err) {
            console.error('Failed to copy result:', err);
            showMessage('Failed to copy. Please copy manually.', true);
        } finally {
            document.body.removeChild(tempInput);
        }
    }

    // Event Listeners
    startTestBtn.addEventListener('click', startSpeedTest);
    clearResultsBtn.addEventListener('click', clearResults);
    copyResultBtn.addEventListener('click', copyResult);

    // Initial state setup
    clearResults(); // Set initial display and disable buttons
});
