// tools/readme-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const projectTitleInput = document.getElementById('projectTitleInput');
    const projectDescriptionInput = document.getElementById('projectDescriptionInput');
    const featuresInput = document.getElementById('featuresInput');
    const installationInput = document.getElementById('installationInput');
    const usageInput = document.getElementById('usageInput');
    const contributingInput = document.getElementById('contributingInput');
    const licenseSelect = document.getElementById('licenseSelect');
    const authorNameInput = document.getElementById('authorNameInput');
    const githubUsernameInput = document.getElementById('githubUsernameInput');
    const repoNameInput = document.getElementById('repoNameInput');

    // Buttons and Messages
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const copyBtn = document.getElementById('copyBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const outputReadme = document.getElementById('outputReadme');
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
        projectTitleInput.value = '';
        projectDescriptionInput.value = '';
        featuresInput.value = '';
        installationInput.value = '';
        usageInput.value = '';
        contributingInput.value = '';
        licenseSelect.value = ''; // Reset to "None"
        authorNameInput.value = '';
        githubUsernameInput.value = '';
        repoNameInput.value = '';

        outputReadme.value = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Generates the README.md content.
     */
    const generateReadme = () => {
        outputReadme.value = ''; // Clear previous output
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        loadingSpinner.style.display = 'block';

        const title = projectTitleInput.value.trim();
        const description = projectDescriptionInput.value.trim();
        const features = featuresInput.value.trim();
        const installation = installationInput.value.trim();
        const usage = usageInput.value.trim();
        const contributing = contributingInput.value.trim();
        const license = licenseSelect.value.trim();
        const author = authorNameInput.value.trim();
        const githubUsername = githubUsernameInput.value.trim();
        const repoName = repoNameInput.value.trim();

        if (!title) {
            showMessage(messageBox, 'Project Title is required to generate the README.', true);
            loadingSpinner.style.display = 'none';
            return;
        }

        let readmeContent = `# ${title}\n\n`;

        // Add badges if GitHub info is provided
        if (githubUsername && repoName) {
            // License badge
            if (license) {
                readmeContent += `[![License: ${license}](https://img.shields.io/badge/License-${license}-blue.svg)](https://opensource.org/licenses/${license})\n`;
            }
            // Add more badges here if desired (e.g., build status, stars)
            // Example: [![GitHub stars](https://img.shields.io/github/stars/${githubUsername}/${repoName}.svg?style=social)](https://github.com/${githubUsername}/${repoName}/stargazers)
            readmeContent += '\n'; // Newline after badges
        }


        if (description) {
            readmeContent += `## Description\n\n${description}\n\n`;
        }

        if (features) {
            readmeContent += `## Features\n\n`;
            // Split features by newline or comma and format as a list
            const featureList = features.split(/[\n,]+/).map(f => f.trim()).filter(f => f !== '');
            featureList.forEach(feature => {
                readmeContent += `- ${feature}\n`;
            });
            readmeContent += '\n';
        }

        if (installation) {
            readmeContent += `## Installation\n\n${installation}\n\n`;
        }

        if (usage) {
            readmeContent += `## Usage\n\n${usage}\n\n`;
        }

        if (contributing) {
            readmeContent += `## Contributing\n\n${contributing}\n\n`;
        }

        if (license) {
            readmeContent += `## License\n\nThis project is licensed under the [${license} License](https://opensource.org/licenses/${license}).\n\n`;
        } else {
            readmeContent += `## License\n\nThis project is unlicensed. Please refer to the repository for details.\n\n`;
        }

        if (author) {
            readmeContent += `## Author\n\n${author}\n\n`;
        }

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            outputReadme.value = readmeContent.trim(); // Trim final whitespace
            showMessage(resultsMessageBox, 'README generated successfully!', false);
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    /**
     * Copies the generated README content to the clipboard.
     */
    const copyReadme = () => {
        if (outputReadme.value) {
            outputReadme.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showMessage(resultsMessageBox, 'README copied to clipboard!', false);
                } else {
                    throw new Error('Copy command failed.');
                }
            } catch (err) {
                console.error('Error copying text: ', err);
                showMessage(resultsMessageBox, 'Failed to copy text. Please copy manually.', true);
            }
            window.getSelection().removeAllRanges();
        } else {
            showMessage(resultsMessageBox, 'No README content to copy.', true);
        }
    };

    // Event Listeners
    generateBtn.addEventListener('click', generateReadme);
    clearAllBtn.addEventListener('click', resetOutputs);
    copyBtn.addEventListener('click', copyReadme);

    // Initial state setup
    resetOutputs();
});
