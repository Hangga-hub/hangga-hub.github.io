// script.js for Responsive Design Tester

document.addEventListener('DOMContentLoaded', () => {
    console.log("Responsive Design Tester script loaded.");

    // --- Get references to all input elements ---
    const websiteUrlInput = document.getElementById('websiteUrl');
    const devicePresetButtons = document.querySelectorAll('.device-presets button');
    const customWidthInput = document.getElementById('customWidth');
    const customHeightInput = document.getElementById('customHeight');

    // --- Get references to output and button elements ---
    const responsiveIframe = document.getElementById('responsiveIframe');
    const loadUrlBtn = document.getElementById('loadUrlBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const applyCustomSizeBtn = document.getElementById('applyCustomSizeBtn');
    const messageBox = document.getElementById('messageBox');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // --- Helper function to show messages to the user ---
    function showMessage(message, isError = false) {
        if (!messageBox) {
            console.error("Error: Message box element (#messageBox) not found in HTML.");
            return;
        }

        messageBox.textContent = message;
        messageBox.classList.remove('error');
        messageBox.classList.add('show');

        if (isError) {
            messageBox.classList.add('error');
            messageBox.style.color = 'var(--cyber-neon-pink)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-pink)';
            console.error("Message (Error):", message);
        } else {
            messageBox.style.color = 'var(--cyber-neon-cyan)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-cyan)';
            console.log("Message (Success/Info):", message);
        }

        setTimeout(() => {
            messageBox.classList.remove('show');
            messageBox.textContent = '';
        }, 3000);
    }

    // --- Function to show/hide loading overlay ---
    function toggleLoading(show) {
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.add('show');
            } else {
                loadingOverlay.classList.remove('show');
            }
        }
    }

    // --- Function to load URL into iframe with specified dimensions ---
    function loadIframe(url, width, height) {
        if (!responsiveIframe) {
            console.error("Error: Iframe element (#responsiveIframe) not found.");
            return;
        }

        if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
            showMessage("Please enter a valid URL starting with http:// or https://", true);
            return;
        }

        toggleLoading(true); // Show loading indicator

        responsiveIframe.style.width = `${width}px`;
        responsiveIframe.style.height = `${height}px`;
        responsiveIframe.src = url;

        // Hide loading once iframe content starts loading (can be unreliable for cross-origin)
        responsiveIframe.onload = () => {
            toggleLoading(false);
            showMessage(`Loaded ${url} at ${width}x${height}px.`, false);
        };

        responsiveIframe.onerror = () => {
            toggleLoading(false);
            showMessage("Failed to load URL. Ensure it's accessible and not blocked by CORS.", true);
        };
    }

    // --- Event Handlers ---

    // Load URL button click
    if (loadUrlBtn) {
        loadUrlBtn.addEventListener('click', () => {
            const url = websiteUrlInput ? websiteUrlInput.value.trim() : '';
            const width = customWidthInput ? parseInt(customWidthInput.value, 10) : 992;
            const height = customHeightInput ? parseInt(customHeightInput.value, 10) : 768;
            loadIframe(url, width, height);
        });
        console.log("Load URL button event listener attached.");
    } else {
        console.error("Error: Load URL button (#loadUrlBtn) not found.");
    }

    // Refresh button click
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const url = websiteUrlInput ? websiteUrlInput.value.trim() : '';
            const width = responsiveIframe ? parseInt(responsiveIframe.style.width, 10) : (customWidthInput ? parseInt(customWidthInput.value, 10) : 992);
            const height = responsiveIframe ? parseInt(responsiveIframe.style.height, 10) : (customHeightInput ? parseInt(customHeightInput.value, 10) : 768);
            loadIframe(url, width, height);
        });
        console.log("Refresh button event listener attached.");
    } else {
        console.error("Error: Refresh button (#refreshBtn) not found.");
    }

    // Device preset buttons click
    devicePresetButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all preset buttons
            devicePresetButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const width = button.dataset.width;
            const height = button.dataset.height;
            const url = websiteUrlInput ? websiteUrlInput.value.trim() : '';

            if (customWidthInput) customWidthInput.value = width;
            if (customHeightInput) customHeightInput.value = height;

            loadIframe(url, width, height);
        });
        console.log(`Device preset button for ${button.textContent} event listener attached.`);
    });

    // Apply Custom Size button click
    if (applyCustomSizeBtn) {
        applyCustomSizeBtn.addEventListener('click', () => {
            // Remove active class from all preset buttons
            devicePresetButtons.forEach(btn => btn.classList.remove('active'));

            const url = websiteUrlInput ? websiteUrlInput.value.trim() : '';
            const width = customWidthInput ? parseInt(customWidthInput.value, 10) : 0;
            const height = customHeightInput ? parseInt(customHeightInput.value, 10) : 0;

            if (isNaN(width) || width < 100 || isNaN(height) || height < 100) {
                showMessage("Please enter valid positive numbers for custom width and height (min 100px).", true);
                return;
            }

            loadIframe(url, width, height);
        });
        console.log("Apply Custom Size button event listener attached.");
    } else {
        console.error("Error: Apply Custom Size button (#applyCustomSizeBtn) not found.");
    }

    // --- Initial setup on page load ---
    // Load default URL and size on page load
    const initialUrl = websiteUrlInput ? websiteUrlInput.value.trim() : '';
    const initialWidth = customWidthInput ? parseInt(customWidthInput.value, 10) : 992;
    const initialHeight = customHeightInput ? parseInt(customHeightInput.value, 10) : 768;

    if (initialUrl) {
        loadIframe(initialUrl, initialWidth, initialHeight);
    } else {
        showMessage("Enter a URL and click 'Load URL' or choose a preset to begin.", false);
    }
    console.log("Initial iframe load triggered.");
});
