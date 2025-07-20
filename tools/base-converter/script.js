// script.js for Base Converter

document.addEventListener('DOMContentLoaded', () => {
    const numberInput = document.getElementById('numberInput');
    const fromBaseSelect = document.getElementById('fromBaseSelect');
    const toBaseSelect = document.getElementById('toBaseSelect');
    const convertedResult = document.getElementById('convertedResult');
    const copyResultButton = document.getElementById('copyResultButton');
    const messageBox = document.getElementById('messageBox');

    // Function to validate input based on the selected base
    function isValidInput(numberString, base) {
        if (!numberString) return true; // Empty input is valid, just no conversion

        let regex;
        switch (parseInt(base)) {
            case 2: // Binary
                regex = /^[01]+$/;
                break;
            case 8: // Octal
                regex = /^[0-7]+$/;
                break;
            case 10: // Decimal
                regex = /^-?\d+$/; // Allows negative numbers for decimal
                break;
            case 16: // Hexadecimal
                regex = /^[0-9a-fA-F]+$/;
                break;
            default:
                return false; // Should not happen with predefined options
        }
        return regex.test(numberString);
    }

    // Function to perform the conversion
    function convertBase() {
        messageBox.textContent = ''; // Clear previous messages
        const numberString = numberInput.value.trim();
        const fromBase = parseInt(fromBaseSelect.value);
        const toBase = parseInt(toBaseSelect.value);

        if (numberString === '') {
            convertedResult.value = '';
            return;
        }

        // Validate input string against the 'from' base
        if (!isValidInput(numberString, fromBase)) {
            messageBox.textContent = `Invalid input for Base ${fromBase}. Please enter a valid number.`;
            convertedResult.value = '';
            return;
        }

        let decimalValue;
        try {
            // Convert the input string from its base to a decimal integer
            decimalValue = parseInt(numberString, fromBase);

            // Check if parsing resulted in NaN (e.g., if the number is too large or invalid despite regex)
            if (isNaN(decimalValue)) {
                messageBox.textContent = 'Conversion error: Number is too large or malformed.';
                convertedResult.value = '';
                return;
            }

            // Convert the decimal integer to the target base
            // Ensure the output is uppercase for hexadecimal for consistency
            const result = decimalValue.toString(toBase);
            convertedResult.value = (toBase === 16) ? result.toUpperCase() : result;

        } catch (error) {
            messageBox.textContent = 'An unexpected error occurred during conversion.';
            convertedResult.value = '';
            console.error('Base conversion error:', error);
        }
    }

    // Event listeners for input changes
    numberInput.addEventListener('input', convertBase);
    fromBaseSelect.addEventListener('change', convertBase);
    toBaseSelect.addEventListener('change', convertBase);

    // Copy result to clipboard
    copyResultButton.addEventListener('click', () => {
        if (convertedResult.value) {
            convertedResult.select();
            try {
                document.execCommand('copy');
                messageBox.textContent = 'Result copied to clipboard!';
                messageBox.style.color = 'var(--cyber-neon-cyan)';
                messageBox.style.textShadow = '0 0 8px var(--cyber-neon-cyan)';
            } catch (err) {
                messageBox.textContent = 'Failed to copy result!';
                messageBox.style.color = '#ff5555';
                messageBox.style.textShadow = '0 0 8px #ff5555';
                console.error('Failed to copy text: ', err);
            }
        } else {
            messageBox.textContent = 'Nothing to copy!';
            messageBox.style.color = '#ff5555';
            messageBox.style.textShadow = '0 0 8px #ff5555';
        }
        setTimeout(() => {
            messageBox.textContent = '';
        }, 3000); // Clear message after 3 seconds
    });

    // Initial conversion on page load (if there's default input)
    convertBase();
});
