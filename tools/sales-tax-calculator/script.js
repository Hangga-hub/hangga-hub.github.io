// tools/sales-tax-calculator/script.js

document.addEventListener('DOMContentLoaded', () => {
    const itemPriceInput = document.getElementById('itemPriceInput');
    const taxRateInput = document.getElementById('taxRateInput');
    const calculateTaxBtn = document.getElementById('calculateTaxBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const taxAmountOutput = document.getElementById('taxAmountOutput');
    const totalPriceOutput = document.getElementById('totalPriceOutput');
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
        itemPriceInput.value = '';
        taxRateInput.value = '';
        taxAmountOutput.textContent = 'N/A';
        totalPriceOutput.textContent = 'N/A';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Calculates sales tax and total price.
     */
    const calculateSalesTax = () => {
        const itemPrice = parseFloat(itemPriceInput.value.trim());
        const taxRate = parseFloat(taxRateInput.value.trim());

        // Clear previous output messages and values
        taxAmountOutput.textContent = 'N/A';
        totalPriceOutput.textContent = 'N/A';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';

        if (isNaN(itemPrice) || itemPrice < 0) {
            showMessage(messageBox, 'Please enter a valid item price (a positive number).', true);
            loadingSpinner.style.display = 'none'; // Ensure spinner is hidden
            return;
        }
        if (isNaN(taxRate) || taxRate < 0) {
            showMessage(messageBox, 'Please enter a valid sales tax rate (a positive number or zero).', true);
            loadingSpinner.style.display = 'none'; // Ensure spinner is hidden
            return;
        }

        showMessage(messageBox, 'Calculating sales tax...', false);
        loadingSpinner.style.display = 'block';

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';

            const taxAmount = itemPrice * (taxRate / 100);
            const totalPrice = itemPrice + taxAmount;

            taxAmountOutput.textContent = `$${taxAmount.toFixed(2)}`;
            totalPriceOutput.textContent = `$${totalPrice.toFixed(2)}`;

            showMessage(resultsMessageBox, 'Calculation successful!', false);
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    // Event Listeners
    calculateTaxBtn.addEventListener('click', calculateSalesTax);
    clearAllBtn.addEventListener('click', resetOutputs);

    // Allow Enter key to trigger calculation in input fields
    itemPriceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateSalesTax();
        }
    });
    taxRateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateSalesTax();
        }
    });

    // Initial state setup
    resetOutputs();
});
