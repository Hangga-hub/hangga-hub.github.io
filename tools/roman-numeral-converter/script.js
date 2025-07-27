// tools/roman-numeral-converter/script.js

document.addEventListener('DOMContentLoaded', () => {
    const romanInput = document.getElementById('romanInput');
    const integerInput = document.getElementById('integerInput');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultOutput = document.getElementById('resultOutput');
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
        romanInput.value = '';
        integerInput.value = '';
        resultOutput.textContent = 'Result will appear here...';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    // Roman numeral mapping
    const romanMap = {
        'M': 1000, 'CM': 900, 'D': 500, 'CD': 400, 'C': 100,
        'XC': 90, 'L': 50, 'XL': 40, 'X': 10, 'IX': 9,
        'V': 5, 'IV': 4, 'I': 1
    };

    /**
     * Converts Roman numeral to integer.
     * @param {string} roman - Roman numeral string.
     * @returns {number|null} Integer value or null if invalid.
     */
    const romanToInt = (roman) => {
        let num = 0;
        let i = 0;
        const s = roman.toUpperCase(); // Ensure uppercase for consistent matching

        while (i < s.length) {
            // Check for two-character combinations first (e.g., CM, XC)
            if (i + 1 < s.length && romanMap[s.substring(i, i + 2)]) {
                num += romanMap[s.substring(i, i + 2)];
                i += 2;
            } else if (romanMap[s.charAt(i)]) { // Check for single character
                num += romanMap[s.charAt(i)];
                i++;
            } else {
                return null; // Invalid Roman numeral character
            }
        }
        // Basic validation for common Roman numeral rules (e.g., no more than 3 consecutive identical symbols, except M)
        // This is a simplified validation. A full validation is complex.
        if (!/^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(s)) {
             return null; // Fails basic structural validation
        }
        return num;
    };

    /**
     * Converts integer to Roman numeral.
     * @param {number} num - Integer value (1 to 3999).
     * @returns {string|null} Roman numeral string or null if invalid.
     */
    const intToRoman = (num) => {
        if (num < 1 || num > 3999) {
            return null; // Roman numerals typically only represent numbers up to 3999
        }

        let roman = '';
        const numerals = [
            { value: 1000, symbol: 'M' },
            { value: 900, symbol: 'CM' },
            { value: 500, symbol: 'D' },
            { value: 400, symbol: 'CD' },
            { value: 100, symbol: 'C' },
            { value: 90, symbol: 'XC' },
            { value: 50, symbol: 'L' },
            { value: 40, symbol: 'XL' },
            { value: 10, symbol: 'X' },
            { value: 9, symbol: 'IX' },
            { value: 5, symbol: 'V' },
            { value: 4, symbol: 'IV' },
            { value: 1, symbol: 'I' }
        ];

        for (let i = 0; i < numerals.length; i++) {
            while (num >= numerals[i].value) {
                roman += numerals[i].symbol;
                num -= numerals[i].value;
            }
        }
        return roman;
    };

    /**
     * Handles the conversion based on which input field has content.
     */
    const handleConversion = () => {
        const roman = romanInput.value.trim();
        const integer = integerInput.value.trim();

        resultOutput.textContent = 'Result will appear here...'; // Reset output text
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'block';

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';

            if (roman) {
                const num = romanToInt(roman);
                if (num !== null) {
                    resultOutput.textContent = num;
                    showMessage(resultsMessageBox, 'Converted from Roman to Integer!', false);
                } else {
                    resultOutput.textContent = 'Invalid Roman Numeral';
                    showMessage(resultsMessageBox, 'Please enter a valid Roman numeral (e.g., XIV, MCMXCIV).', true);
                }
            } else if (integer) {
                const num = parseInt(integer, 10);
                if (!isNaN(num)) {
                    const romanResult = intToRoman(num);
                    if (romanResult !== null) {
                        resultOutput.textContent = romanResult;
                        showMessage(resultsMessageBox, 'Converted from Integer to Roman!', false);
                    } else {
                        resultOutput.textContent = 'Invalid Integer';
                        showMessage(resultsMessageBox, 'Please enter an integer between 1 and 3999.', true);
                    }
                } else {
                    resultOutput.textContent = 'Invalid Integer';
                    showMessage(resultsMessageBox, 'Please enter a valid integer.', true);
                }
            } else {
                showMessage(messageBox, 'Please enter either a Roman numeral or an integer to convert.', true);
                resultOutput.textContent = 'Result will appear here...'; // Reset if no input
            }
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    // Event Listeners
    convertBtn.addEventListener('click', handleConversion);
    clearBtn.addEventListener('click', resetOutputs);

    // Auto-clear other input when one is typed into, and trigger conversion
    romanInput.addEventListener('input', () => {
        integerInput.value = '';
        if (romanInput.value.trim()) {
            handleConversion();
        } else {
            resetOutputs();
        }
    });

    integerInput.addEventListener('input', () => {
        romanInput.value = '';
        if (integerInput.value.trim()) {
            handleConversion();
        } else {
            resetOutputs();
        }
    });

    // Allow Enter key to trigger conversion in either input field
    romanInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConversion();
        }
    });
    integerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConversion();
        }
    });

    // Initial state setup
    resetOutputs();
});
