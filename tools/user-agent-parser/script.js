// script.js for tools/user-agent-parser/

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const uaStringInput = document.getElementById('uaStringInput');
    const parseBtn = document.getElementById('parseBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const messageBox = document.getElementById('messageBox');
    const loadingOverlay = document.getElementById('loadingOverlay');

    let parser;

    // Function to display messages
    function showMessage(message, type = 'info') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        } else {
            console.warn("Message box element not found.");
        }
    }

    // Show/hide loading overlay
    function toggleLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    // Function to display parsed results
    function displayResults(result) {
        let html = '';

        const appendDetail = (category, name, version) => {
            if (name) {
                html += `<p><strong>${category}:</strong> ${name}`;
                if (version) {
                    html += ` (Version: ${version})`;
                }
                html += `</p>`;
            }
        };

        html += '<h3>Parsed User-Agent Details</h3>';

        appendDetail('Browser', result.browser.name, result.browser.version);
        appendDetail('OS', result.os.name, result.os.version);
        appendDetail('Device', result.device.vendor, result.device.model);
        if (result.device.type) {
            html += `<p><strong>Device Type:</strong> ${result.device.type}</p>`;
        }
        appendDetail('CPU', result.cpu.architecture);
        appendDetail('Engine', result.engine.name, result.engine.version);

        // Add raw UA string for reference
        html += `<br><h3>Raw User-Agent String</h3>`;
        html += `<p>${uaStringInput.value}</p>`;


        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
    }

    // Function to parse User-Agent
    async function parseUserAgent() {
        // Check if UAParser is loaded before proceeding
        if (typeof UAParser === 'undefined') {
            showMessage('Error: UAParser library not loaded. Please ensure your internet connection is stable and try refreshing the page.', 'error');
            resultsContainer.innerHTML = '<p style="text-align: center; color: red;">Error: UAParser library not available.</p>';
            resultsContainer.style.display = 'block';
            return;
        }

        // Initialize parser only once, if not already
        if (!parser) {
            parser = new UAParser();
        }

        const uaString = uaStringInput.value.trim();

        if (!uaString) {
            showMessage('Please enter a User-Agent string to parse.', 'info');
            resultsContainer.innerHTML = '<p style="text-align: center; color: rgba(238,238,238,0.5);">Parsed User-Agent details will appear here.</p>';
            resultsContainer.style.display = 'block'; // Ensure it's visible even if empty
            return;
        }

        toggleLoading(true);

        // Use setTimeout to allow the loading overlay to render before computation
        setTimeout(() => {
            try {
                parser.setUA(uaString);
                const result = parser.getResult();
                displayResults(result);
                showMessage('User-Agent parsed successfully!', 'success');
            } catch (error) {
                console.error('Error parsing User-Agent:', error);
                resultsContainer.innerHTML = '<p style="text-align: center; color: red;">Error parsing User-Agent. Please check the string format.</p>';
                showMessage('An error occurred during parsing.', 'error');
            } finally {
                toggleLoading(false);
            }
        }, 10); // Small delay
    }

    // Function to clear all fields and results
    function clearAll() {
        uaStringInput.value = '';
        resultsContainer.innerHTML = '<p style="text-align: center; color: rgba(238,238,238,0.5);">Parsed User-Agent details will appear here.</p>';
        resultsContainer.style.display = 'block';
        showMessage('Cleared all fields.', 'info');
    }

    // --- Event Listeners ---
    parseBtn.addEventListener('click', parseUserAgent);
    clearBtn.addEventListener('click', clearAll);

    // Pre-fill with current browser's User-Agent on load and parse it
    uaStringInput.value = navigator.userAgent;
    parseUserAgent();
});
