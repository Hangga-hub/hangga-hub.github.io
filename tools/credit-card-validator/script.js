document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const cardNumberInput = document.getElementById("cardNumberInput");
    const validateBtn = document.getElementById("validateBtn");
    const resetBtn = document.getElementById("resetBtn");
    const resultOutput = document.getElementById("resultOutput");
    const messageBox = document.getElementById("messageBox");

    // Example valid card number for testing (not a real one)
    cardNumberInput.value = "49927398716"; // A valid Luhn number

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("show", "error");
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");

        // Hide message after 5 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 5000);
    }

    /**
     * Implements the Luhn algorithm to validate a credit card number.
     * @param {string} cardNumber - The credit card number string.
     * @returns {boolean} True if the card number is valid according to Luhn algorithm, false otherwise.
     */
    function isValidLuhn(cardNumber) {
        // Remove any non-digit characters (spaces, hyphens)
        const cleanedCardNumber = cardNumber.replace(/\D/g, '');

        if (!/^\d+$/.test(cleanedCardNumber)) {
            // Contains non-digits after cleaning, or is empty
            return false;
        }

        let sum = 0;
        let double = false; // Flag to indicate whether to double the digit

        // Iterate from right to left
        for (let i = cleanedCardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanedCardNumber.charAt(i), 10);

            if (double) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9; // If doubled digit is > 9, subtract 9 (e.g., 12 becomes 3)
                }
            }
            sum += digit;
            double = !double; // Toggle the flag for the next digit
        }

        // The number is valid if the sum is a multiple of 10
        return (sum % 10 === 0);
    }

    /**
     * Handles the validation of the credit card number.
     */
    function validateCard() {
        const cardNumber = cardNumberInput.value.trim();
        resultOutput.classList.remove("valid", "invalid"); // Clear previous styling

        if (!cardNumber) {
            resultOutput.textContent = "Please enter a credit card number.";
            showMessage("Please enter a credit card number.", true);
            return;
        }

        // Basic check for non-digit characters (after trimming)
        if (!/^\d[\d\s-]*\d$/.test(cardNumber)) { // Allows spaces and hyphens, but must start/end with digit
            resultOutput.textContent = "Invalid input: Please enter only digits, spaces, or hyphens.";
            resultOutput.classList.add("invalid");
            showMessage("Invalid input: Card number should contain only digits, spaces, or hyphens.", true);
            return;
        }

        if (isValidLuhn(cardNumber)) {
            resultOutput.textContent = "Valid (Luhn Algorithm)";
            resultOutput.classList.add("valid");
            showMessage("Credit card number is valid by Luhn algorithm.", false);
        } else {
            resultOutput.textContent = "Invalid (Luhn Algorithm)";
            resultOutput.classList.add("invalid");
            showMessage("Credit card number is invalid by Luhn algorithm.", true);
        }
    }

    /**
     * Resets the input and output fields.
     */
    function resetTool() {
        cardNumberInput.value = "";
        resultOutput.textContent = "Enter a credit card number and click 'Validate Card'.";
        resultOutput.classList.remove("valid", "invalid");
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Tool reset.");
    }

    // Add event listeners
    validateBtn.addEventListener("click", validateCard);
    resetBtn.addEventListener("click", resetTool);

    // Optional: Validate on input change (for real-time feedback)
    // cardNumberInput.addEventListener("input", validateCard);
});
