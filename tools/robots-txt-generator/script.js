// script.js for Robots.txt Generator

document.addEventListener('DOMContentLoaded', () => {
    console.log("Robots.txt Generator script loaded.");

    // --- Get references to all input elements ---
    const userAgentInput = document.getElementById('userAgent');
    const disallowPathsInput = document.getElementById('disallowPaths');
    const allowPathsInput = document.getElementById('allowPaths');
    const sitemapUrlInput = document.getElementById('sitemapUrl');
    const crawlDelayInput = document.getElementById('crawlDelay');

    // --- Get references to output and button elements ---
    const generatedRobotsTxtOutput = document.getElementById('generatedRobotsTxt');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');

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

    // --- Main function to generate robots.txt content ---
    function generateRobotsTxt() {
        console.log("generateRobotsTxt() called.");

        let robotsTxtContent = [];

        // User-agent
        const userAgent = userAgentInput ? userAgentInput.value.trim() : '*';
        robotsTxtContent.push(`User-agent: ${userAgent}`);

        // Disallow paths
        const disallowPaths = disallowPathsInput ? disallowPathsInput.value.trim() : '';
        if (disallowPaths) {
            disallowPaths.split('\n').forEach(path => {
                const trimmedPath = path.trim();
                if (trimmedPath) {
                    robotsTxtContent.push(`Disallow: ${trimmedPath}`);
                }
            });
        }

        // Allow paths
        const allowPaths = allowPathsInput ? allowPathsInput.value.trim() : '';
        if (allowPaths) {
            allowPaths.split('\n').forEach(path => {
                const trimmedPath = path.trim();
                if (trimmedPath) {
                    robotsTxtContent.push(`Allow: ${trimmedPath}`);
                }
            });
        }

        // Sitemap URL
        const sitemapUrl = sitemapUrlInput ? sitemapUrlInput.value.trim() : '';
        if (sitemapUrl) {
            // Validate URL format roughly
            if (sitemapUrl.startsWith('http://') || sitemapUrl.startsWith('https://')) {
                robotsTxtContent.push(`Sitemap: ${sitemapUrl}`);
            } else {
                showMessage("Sitemap URL must be a full URL (e.g., https://example.com/sitemap.xml)", true);
                console.warn("Invalid Sitemap URL format:", sitemapUrl);
            }
        }

        // Crawl-delay
        const crawlDelay = crawlDelayInput ? parseInt(crawlDelayInput.value.trim(), 10) : '';
        if (!isNaN(crawlDelay) && crawlDelay >= 0) {
            robotsTxtContent.push(`Crawl-delay: ${crawlDelay}`);
        } else if (crawlDelayInput && crawlDelayInput.value.trim() !== '') {
            showMessage("Crawl-delay must be a non-negative number.", true);
            console.warn("Invalid Crawl-delay value:", crawlDelayInput.value.trim());
        }

        // Add a newline at the end for proper file formatting
        if (robotsTxtContent.length > 0) {
            robotsTxtContent.push(''); // Add an empty line at the end
        }

        // Update the output textarea
        if (generatedRobotsTxtOutput) {
            generatedRobotsTxtOutput.value = robotsTxtContent.join('\n');
            console.log("Generated robots.txt content updated in output textarea.");
        } else {
            console.error("Error: Output textarea (#generatedRobotsTxt) not found.");
        }
    }

    // --- Function to copy text to clipboard ---
    function copyToClipboard(element) {
        if (!element || !element.value) {
            showMessage('Nothing to copy!', true);
            return;
        }
        element.select();
        try {
            document.execCommand('copy');
            showMessage('Robots.txt content copied to clipboard!', false);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showMessage('Failed to copy! Please try manually.', true);
        }
    }

    // --- Function to clear all input fields and the output ---
    function clearAll() {
        console.log("clearAll() called.");

        if (userAgentInput) userAgentInput.value = '*'; // Default back to wildcard
        if (disallowPathsInput) disallowPathsInput.value = '';
        if (allowPathsInput) allowPathsInput.value = '';
        if (sitemapUrlInput) sitemapUrlInput.value = '';
        if (crawlDelayInput) crawlDelayInput.value = '';

        if (generatedRobotsTxtOutput) generatedRobotsTxtOutput.value = '';
        showMessage('All fields cleared!', false);

        // Regenerate robots.txt with default/empty values after clearing
        generateRobotsTxt();
    }

    // --- Attach Event Listeners ---
    // Generate button
    if (generateBtn) {
        generateBtn.addEventListener('click', generateRobotsTxt);
        console.log("Generate button event listener attached.");
    } else {
        console.error("Error: Generate button (#generateBtn) not found.");
    }

    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => copyToClipboard(generatedRobotsTxtOutput));
        console.log("Copy button event listener attached.");
    } else {
        console.error("Error: Copy button (#copyBtn) not found.");
    }

    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
        console.log("Clear button event listener attached.");
    } else {
        console.error("Error: Clear button (#clearBtn) not found.");
    }

    // Live updates on input change for all relevant fields
    document.querySelectorAll(
        '#userAgent, #disallowPaths, #allowPaths, #sitemapUrl, #crawlDelay'
    ).forEach(input => {
        if (input) {
            const eventType = (input.tagName === 'TEXTAREA' || input.type === 'text') ? 'input' : 'change';
            input.addEventListener(eventType, generateRobotsTxt);
            console.log(`Event listener attached to ${input.id} for '${eventType}' event.`);
        } else {
            console.warn(`Warning: Input element with ID '${input.id}' not found for live update listener.`);
        }
    });

    // --- Initial setup on page load ---
    // Populate with default values and generate initial robots.txt
    generateRobotsTxt();
    console.log("Initial robots.txt generation completed on DOMContentLoaded.");
});
