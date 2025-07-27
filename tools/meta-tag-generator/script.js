// tools/meta-tag-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    // General & SEO Inputs
    const pageTitleInput = document.getElementById('pageTitleInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const keywordsInput = document.getElementById('keywordsInput');
    const authorInput = document.getElementById('authorInput');
    const canonicalUrlInput = document.getElementById('canonicalUrlInput');

    // Open Graph (Facebook/Social) Inputs
    const ogTitleInput = document.getElementById('ogTitleInput');
    const ogDescriptionInput = document.getElementById('ogDescriptionInput');
    const ogImageUrlInput = document.getElementById('ogImageUrlInput');
    const ogUrlInput = document.getElementById('ogUrlInput');
    const ogTypeInput = document.getElementById('ogTypeInput');

    // Twitter Card Inputs
    const twitterCardTypeInput = document.getElementById('twitterCardTypeInput');
    const twitterTitleInput = document.getElementById('twitterTitleInput');
    const twitterDescriptionInput = document.getElementById('twitterDescriptionInput');
    const twitterImageUrlInput = document.getElementById('twitterImageUrlInput');
    const twitterUrlInput = document.getElementById('twitterUrlInput');

    // Buttons and Messages
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const copyBtn = document.getElementById('copyBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const outputMetaTags = document.getElementById('outputMetaTags');
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
        // Clear General & SEO
        pageTitleInput.value = '';
        descriptionInput.value = '';
        keywordsInput.value = '';
        authorInput.value = '';
        canonicalUrlInput.value = '';

        // Clear Open Graph
        ogTitleInput.value = '';
        ogDescriptionInput.value = '';
        ogImageUrlInput.value = '';
        ogUrlInput.value = '';
        ogTypeInput.value = '';

        // Clear Twitter Card
        twitterCardTypeInput.value = 'summary'; // Reset to default
        twitterTitleInput.value = '';
        twitterDescriptionInput.value = '';
        twitterImageUrlInput.value = '';
        twitterUrlInput.value = '';

        // Clear Output
        outputMetaTags.value = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Generates the meta tags based on user input.
     */
    const generateMetaTags = () => {
        outputMetaTags.value = ''; // Clear previous output
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        loadingSpinner.style.display = 'block';

        let generatedTags = [];

        // General & SEO Tags
        const pageTitle = pageTitleInput.value.trim();
        const description = descriptionInput.value.trim();
        const keywords = keywordsInput.value.trim();
        const author = authorInput.value.trim();
        const canonicalUrl = canonicalUrlInput.value.trim();

        if (pageTitle) {
            generatedTags.push(`<title>${pageTitle}</title>`);
        }
        if (description) {
            generatedTags.push(`<meta name="description" content="${description}">`);
        }
        if (keywords) {
            generatedTags.push(`<meta name="keywords" content="${keywords}">`);
        }
        if (author) {
            generatedTags.push(`<meta name="author" content="${author}">`);
        }
        if (canonicalUrl) {
            generatedTags.push(`<link rel="canonical" href="${canonicalUrl}">`);
        }

        // Open Graph (Facebook/Social) Tags
        const ogTitle = ogTitleInput.value.trim();
        const ogDescription = ogDescriptionInput.value.trim();
        const ogImageUrl = ogImageUrlInput.value.trim();
        const ogUrl = ogUrlInput.value.trim();
        const ogType = ogTypeInput.value.trim();

        if (ogTitle) {
            generatedTags.push(`<meta property="og:title" content="${ogTitle}">`);
        }
        if (ogDescription) {
            generatedTags.push(`<meta property="og:description" content="${ogDescription}">`);
        }
        if (ogImageUrl) {
            generatedTags.push(`<meta property="og:image" content="${ogImageUrl}">`);
        }
        if (ogUrl) {
            generatedTags.push(`<meta property="og:url" content="${ogUrl}">`);
        }
        if (ogType) {
            generatedTags.push(`<meta property="og:type" content="${ogType}">`);
        }

        // Twitter Card Tags
        const twitterCardType = twitterCardTypeInput.value.trim();
        const twitterTitle = twitterTitleInput.value.trim();
        const twitterDescription = twitterDescriptionInput.value.trim();
        const twitterImageUrl = twitterImageUrlInput.value.trim();
        const twitterUrl = twitterUrlInput.value.trim();

        if (twitterCardType) {
            generatedTags.push(`<meta name="twitter:card" content="${twitterCardType}">`);
        }
        if (twitterTitle) {
            generatedTags.push(`<meta name="twitter:title" content="${twitterTitle}">`);
        }
        if (twitterDescription) {
            generatedTags.push(`<meta name="twitter:description" content="${twitterDescription}">`);
        }
        if (twitterImageUrl) {
            generatedTags.push(`<meta name="twitter:image" content="${twitterImageUrl}">`);
        }
        if (twitterUrl) {
            generatedTags.push(`<meta name="twitter:url" content="${twitterUrl}">`);
        }

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            if (generatedTags.length > 0) {
                outputMetaTags.value = generatedTags.join('\n');
                showMessage(resultsMessageBox, 'Meta tags generated successfully!', false);
            } else {
                showMessage(resultsMessageBox, 'No input provided. Please fill in some fields to generate tags.', true);
            }
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    /**
     * Copies the generated meta tags to the clipboard.
     */
    const copyTags = () => {
        if (outputMetaTags.value) {
            outputMetaTags.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showMessage(resultsMessageBox, 'Meta tags copied to clipboard!', false);
                } else {
                    throw new Error('Copy command failed.');
                }
            } catch (err) {
                console.error('Error copying text: ', err);
                showMessage(resultsMessageBox, 'Failed to copy text. Please copy manually.', true);
            }
            window.getSelection().removeAllRanges();
        } else {
            showMessage(resultsMessageBox, 'No meta tags to copy.', true);
        }
    };

    // Event Listeners
    generateBtn.addEventListener('click', generateMetaTags);
    clearAllBtn.addEventListener('click', resetOutputs);
    copyBtn.addEventListener('click', copyTags);

    // Initial state setup
    resetOutputs();
});
