// Ensure the DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the DOM elements
    const cardTypeSelect = document.getElementById('cardType');
    const numCardsInput = document.getElementById('numCards');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const cardOutput = document.getElementById('cardOutput');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const messageBox = document.getElementById('messageBox');

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
     * Generates a single dummy credit card number based on the specified card type,
     * ensuring it passes the Luhn algorithm.
     * @param {string} cardType - The type of card (e.g., 'visa', 'mastercard').
     * @returns {string} A 15 or 16-digit dummy credit card number.
     */
    function generateCreditCardNumber(cardType) {
        let prefix;
        let length;

        // Define prefixes and lengths for different card types
        switch (cardType) {
            case 'visa':
                prefix = '4';
                length = 16;
                break;
            case 'mastercard':
                // Mastercard prefixes typically start with 51-55 or 2221-2720
                // For simplicity, we'll use a common 5 prefix for dummy generation.
                prefix = '5' + Math.floor(Math.random() * 5 + 1); // 51-55
                length = 16;
                break;
            case 'amex':
                // Amex prefixes are 34 or 37
                prefix = Math.random() < 0.5 ? '34' : '37';
                length = 15;
                break;
            case 'discover':
                // Discover prefixes are 6011, 644-649, 65
                const discoverPrefixes = ['6011', '65'];
                prefix = discoverPrefixes[Math.floor(Math.random() * discoverPrefixes.length)];
                if (prefix === '65') {
                    // For 65, add a random digit to make it 65x
                    prefix += Math.floor(Math.random() * 10);
                }
                length = 16;
                break;
            default:
                return ''; // Should not happen with proper input validation
        }

        let cardNumber = prefix;

        // Fill the rest of the number with random digits, leaving one for the checksum
        while (cardNumber.length < length - 1) {
            cardNumber += Math.floor(Math.random() * 10);
        }

        // Calculate the Luhn checksum digit
        let sum = 0;
        let double = false; // Flag to indicate if the current digit should be doubled
        // Iterate from right to left (excluding the last digit which will be the checksum)
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);

            if (double) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9; // If doubling results in a two-digit number, subtract 9
                }
            }
            sum += digit;
            double = !double; // Toggle the double flag for the next digit
        }

        // The checksum digit is what needs to be added to make the total sum a multiple of 10
        const checksum = (10 - (sum % 10)) % 10;
        cardNumber += checksum; // Append the checksum digit

        return cardNumber;
    }

    /**
     * Generates and displays dummy credit card numbers based on user input.
     */
    function generateCards() {
        const cardType = cardTypeSelect.value;
        const numCards = parseInt(numCardsInput.value, 10);

        // Input validation
        if (isNaN(numCards) || numCards < 1 || numCards > 100) {
            showMessage('Please enter a valid number between 1 and 100.', true);
            return;
        }

        let generatedNumbers = [];
        for (let i = 0; i < numCards; i++) {
            generatedNumbers.push(generateCreditCardNumber(cardType));
        }

        cardOutput.value = generatedNumbers.join('\n');
        showMessage(`Generated ${numCards} dummy credit card numbers.`, false);

        // Auto-scroll to the bottom of the output area to show results
        cardOutput.scrollTop = cardOutput.scrollHeight;
    }

    /**
     * Clears the input fields and the output area.
     */
    function clearFields() {
        cardTypeSelect.value = 'visa'; // Reset to default
        numCardsInput.value = '1';    // Reset to default
        cardOutput.value = '';
        showMessage('Fields cleared.', false);
    }

    /**
     * Copies the content of the output textarea to the clipboard.
     */
    function copyResult() {
        if (cardOutput.value.trim() === '') {
            showMessage('Nothing to copy!', true);
            return;
        }

        // Use the execCommand method for clipboard operations as navigator.clipboard.writeText()
        // might not work reliably in all iframe environments.
        cardOutput.select();
        cardOutput.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            showMessage('Numbers copied to clipboard!', false);
        } catch (err) {
            console.error('Failed to copy numbers:', err);
            showMessage('Failed to copy. Please copy manually.', true);
        }
    }

    // Event Listeners

    // Listen for click on the Generate Cards button
    generateBtn.addEventListener('click', generateCards);

    // Allow generation on Enter key press in the number input field
    numCardsInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            generateBtn.click(); // Trigger the generate button click
        }
    });

    // Listen for click on the Clear button
    clearBtn.addEventListener('click', clearFields);

    // Listen for click on the Copy Result button
    copyResultBtn.addEventListener('click', copyResult);

    // Initial state: clear fields when page loads
    clearFields();
});
