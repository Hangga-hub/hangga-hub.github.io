// tools/sitemap-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const baseUrlInput = document.getElementById('baseUrlInput');
    const lastModInput = document.getElementById('lastModInput');
    const changeFreqSelect = document.getElementById('changeFreqSelect');
    const priorityInput = document.getElementById('priorityInput');
    const additionalUrlsInput = document.getElementById('additionalUrlsInput');

    // Buttons and Messages
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const copyBtn = document.getElementById('copyBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const outputSitemap = document.getElementById('outputSitemap');
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
        baseUrlInput.value = '';
        lastModInput.value = ''; // Clears date input
        changeFreqSelect.value = ''; // Resets to "None"
        priorityInput.value = '';
        additionalUrlsInput.value = '';

        outputSitemap.value = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Helper function to validate URL format.
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
     * Generates the XML sitemap content.
     */
    const generateSitemap = () => {
        outputSitemap.value = ''; // Clear previous output
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        loadingSpinner.style.display = 'block';

        const baseUrl = baseUrlInput.value.trim();
        const lastMod = lastModInput.value.trim(); // YYYY-MM-DD format from date input
        const changeFreq = changeFreqSelect.value.trim();
        const priority = priorityInput.value.trim();
        const additionalUrls = additionalUrlsInput.value.trim();

        if (!baseUrl) {
            showMessage(messageBox, 'Base URL is required to generate the sitemap.', true);
            loadingSpinner.style.display = 'none';
            return;
        }

        if (!isValidUrl(baseUrl)) {
            showMessage(messageBox, 'Please enter a valid Base URL (e.g., https://www.example.com).', true);
            loadingSpinner.style.display = 'none';
            return;
        }

        let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Add Base URL entry
        sitemapContent += `  <url>\n`;
        sitemapContent += `    <loc>${baseUrl}</loc>\n`;
        if (lastMod) {
            sitemapContent += `    <lastmod>${lastMod}</lastmod>\n`;
        }
        if (changeFreq) {
            sitemapContent += `    <changefreq>${changeFreq}</changefreq>\n`;
        }
        if (priority && !isNaN(parseFloat(priority))) {
            sitemapContent += `    <priority>${parseFloat(priority).toFixed(1)}</priority>\n`;
        }
        sitemapContent += `  </url>\n`;

        // Add Additional URLs
        if (additionalUrls) {
            const urls = additionalUrls.split('\n').map(url => url.trim()).filter(url => url !== '');
            urls.forEach(url => {
                let fullUrl = url;
                // If relative URL, prepend base URL
                if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')) {
                    fullUrl = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${url.startsWith('/') ? url : '/' + url}`;
                }

                if (isValidUrl(fullUrl)) {
                    sitemapContent += `  <url>\n`;
                    sitemapContent += `    <loc>${fullUrl}</loc>\n`;
                    // Apply global lastmod, changefreq, priority to additional URLs
                    if (lastMod) {
                        sitemapContent += `    <lastmod>${lastMod}</lastmod>\n`;
                    }
                    if (changeFreq) {
                        sitemapContent += `    <changefreq>${changeFreq}</changefreq>\n`;
                    }
                    if (priority && !isNaN(parseFloat(priority))) {
                        sitemapContent += `    <priority>${parseFloat(priority).toFixed(1)}</priority>\n`;
                    }
                    sitemapContent += `  </url>\n`;
                } else {
                    showMessage(messageBox, `Warning: Invalid URL ignored in additional URLs: ${url}`, true);
                }
            });
        }

        sitemapContent += `</urlset>`;

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            outputSitemap.value = sitemapContent.trim(); // Trim final whitespace
            showMessage(resultsMessageBox, 'Sitemap generated successfully!', false);
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    /**
     * Copies the generated XML sitemap content to the clipboard.
     */
    const copySitemap = () => {
        if (outputSitemap.value) {
            outputSitemap.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showMessage(resultsMessageBox, 'Sitemap XML copied to clipboard!', false);
                } else {
                    throw new Error('Copy command failed.');
                }
            } catch (err) {
                console.error('Error copying text: ', err);
                showMessage(resultsMessageBox, 'Failed to copy text. Please copy manually.', true);
            }
            window.getSelection().removeAllRanges();
        } else {
            showMessage(resultsMessageBox, 'No sitemap XML to copy.', true);
        }
    };

    // Event Listeners
    generateBtn.addEventListener('click', generateSitemap);
    clearAllBtn.addEventListener('click', resetOutputs);
    copyBtn.addEventListener('click', copySitemap);

    // Initial state setup
    resetOutputs();
});
