// script.js for tools/case-converter/

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const textOutput = document.getElementById('textOutput');
    const uppercaseBtn = document.getElementById('uppercaseBtn');
    const lowercaseBtn = document.getElementById('lowercaseBtn');
    const titlecaseBtn = document.getElementById('titlecaseBtn');
    const sentencecaseBtn = document.getElementById('sentencecaseBtn');
    const camelcaseBtn = document.getElementById('camelcaseBtn');
    const pascalcaseBtn = document.getElementById('pascalcaseBtn');
    const kebabcaseBtn = document.getElementById('kebabcaseBtn');
    const snakecaseBtn = document.getElementById('snakecaseBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');

    // Function to display messages
    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`; // Add type for styling (e.g., 'success', 'error', 'info')
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    // Case conversion functions
    function toUppercase(text) {
        return text.toUpperCase();
    }

    function toLowercase(text) {
        return text.toLowerCase();
    }

    function toTitleCase(text) {
        // Convert to lowercase first to handle existing capitalization
        return text.toLowerCase().split(' ').map(word => {
            if (word.length === 0) return '';
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }

    function toSentenceCase(text) {
        // Convert to lowercase first
        let lowerText = text.toLowerCase();
        // Capitalize the first letter of the entire string
        if (lowerText.length === 0) return '';
        let result = lowerText.charAt(0).toUpperCase() + lowerText.slice(1);

        // Handle capitalization after periods, question marks, and exclamation points
        result = result.replace(/([.?!]\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());

        return result;
    }

    function toCamelCase(text) {
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    function toPascalCase(text) {
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
            return word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    function toKebabCase(text) {
        return text.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
                   .toLowerCase()
                   .replace(/\s+/g, '-') // Replace spaces with hyphens
                   .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
                   .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
    }

    function toSnakeCase(text) {
        return text.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2')
                   .toLowerCase()
                   .replace(/\s+/g, '_') // Replace spaces with underscores
                   .replace(/[^a-z0-9_]/g, '') // Remove non-alphanumeric characters except underscores
                   .replace(/__+/g, '_'); // Replace multiple underscores with a single one
    }

    // Event listeners for conversion buttons
    uppercaseBtn.addEventListener('click', () => {
        textOutput.value = toUppercase(textInput.value);
        showMessage('Converted to UPPERCASE!', 'success');
    });

    lowercaseBtn.addEventListener('click', () => {
        textOutput.value = toLowercase(textInput.value);
        showMessage('Converted to lowercase!', 'success');
    });

    titlecaseBtn.addEventListener('click', () => {
        textOutput.value = toTitleCase(textInput.value);
        showMessage('Converted to Title Case!', 'success');
    });

    sentencecaseBtn.addEventListener('click', () => {
        textOutput.value = toSentenceCase(textInput.value);
        showMessage('Converted to Sentence case!', 'success');
    });

    camelcaseBtn.addEventListener('click', () => {
        textOutput.value = toCamelCase(textInput.value);
        showMessage('Converted to camelCase!', 'success');
    });

    pascalcaseBtn.addEventListener('click', () => {
        textOutput.value = toPascalCase(textInput.value);
        showMessage('Converted to PascalCase!', 'success');
    });

    kebabcaseBtn.addEventListener('click', () => {
        textOutput.value = toKebabCase(textInput.value);
        showMessage('Converted to kebab-case!', 'success');
    });

    snakecaseBtn.addEventListener('click', () => {
        textOutput.value = toSnakeCase(textInput.value);
        showMessage('Converted to snake_case!', 'success');
    });

    // Function to copy text to clipboard
    copyBtn.addEventListener('click', () => {
        if (textOutput.value) {
            textOutput.select();
            document.execCommand('copy'); // Fallback for navigator.clipboard.writeText
            showMessage('Converted text copied to clipboard!', 'success');
        } else {
            showMessage('No text to copy.', 'info');
        }
    });

    // Function to clear both text areas
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        textOutput.value = '';
        showMessage('Cleared all content.', 'info');
    });
});
