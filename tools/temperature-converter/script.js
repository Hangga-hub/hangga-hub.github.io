// tools/temperature-converter/script.js

document.addEventListener('DOMContentLoaded', () => {
    const celsiusInput = document.getElementById('celsiusInput');
    const fahrenheitInput = document.getElementById('fahrenheitInput');
    const kelvinInput = document.getElementById('kelvinInput');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const outputCelsius = document.getElementById('outputCelsius');
    const outputFahrenheit = document.getElementById('outputFahrenheit');
    const outputKelvin = document.getElementById('outputKelvin');
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
        celsiusInput.value = '';
        fahrenheitInput.value = '';
        kelvinInput.value = '';
        outputCelsius.textContent = 'N/A';
        outputFahrenheit.textContent = 'N/A';
        outputKelvin.textContent = 'N/A';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Converts Celsius to other units.
     * @param {number} c - Temperature in Celsius.
     * @returns {object} Object with Fahrenheit and Kelvin values.
     */
    const convertCelsius = (c) => {
        const f = (c * 9 / 5) + 32;
        const k = c + 273.15;
        return { fahrenheit: f, kelvin: k };
    };

    /**
     * Converts Fahrenheit to other units.
     * @param {number} f - Temperature in Fahrenheit.
     * @returns {object} Object with Celsius and Kelvin values.
     */
    const convertFahrenheit = (f) => {
        const c = (f - 32) * 5 / 9;
        const k = c + 273.15;
        return { celsius: c, kelvin: k };
    };

    /**
     * Converts Kelvin to other units.
     * @param {number} k - Temperature in Kelvin.
     * @returns {object} Object with Celsius and Fahrenheit values.
     */
    const convertKelvin = (k) => {
        const c = k - 273.15;
        const f = (c * 9 / 5) + 32;
        return { celsius: c, fahrenheit: f };
    };

    /**
     * Handles the conversion based on which input field has content.
     */
    const handleConversion = () => {
        const celsiusVal = parseFloat(celsiusInput.value.trim());
        const fahrenheitVal = parseFloat(fahrenheitInput.value.trim());
        const kelvinVal = parseFloat(kelvinInput.value.trim());

        // Reset output displays immediately, but not inputs
        outputCelsius.textContent = 'N/A';
        outputFahrenheit.textContent = 'N/A';
        outputKelvin.textContent = 'N/A';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';

        let converted = null;
        let inputUnit = null;

        if (!isNaN(celsiusVal) && celsiusInput.value.trim() !== '') {
            converted = convertCelsius(celsiusVal);
            outputCelsius.textContent = celsiusVal.toFixed(2) + ' °C';
            inputUnit = 'Celsius';
        } else if (!isNaN(fahrenheitVal) && fahrenheitInput.value.trim() !== '') {
            converted = convertFahrenheit(fahrenheitVal);
            outputFahrenheit.textContent = fahrenheitVal.toFixed(2) + ' °F';
            inputUnit = 'Fahrenheit';
        } else if (!isNaN(kelvinVal) && kelvinInput.value.trim() !== '') {
            converted = convertKelvin(kelvinVal);
            outputKelvin.textContent = kelvinVal.toFixed(2) + ' K';
            inputUnit = 'Kelvin';
        } else {
            showMessage(messageBox, 'Please enter a valid number in one of the fields.', true);
            loadingSpinner.style.display = 'none';
            return;
        }

        showMessage(messageBox, `Converting from ${inputUnit}...`, false);
        loadingSpinner.style.display = 'block';

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';

            if (converted) {
                if (inputUnit !== 'Celsius') {
                    outputCelsius.textContent = converted.celsius.toFixed(2) + ' °C';
                }
                if (inputUnit !== 'Fahrenheit') {
                    outputFahrenheit.textContent = converted.fahrenheit.toFixed(2) + ' °F';
                }
                if (inputUnit !== 'Kelvin') {
                    outputKelvin.textContent = converted.kelvin.toFixed(2) + ' K';
                }
                showMessage(resultsMessageBox, 'Conversion successful!', false);
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                showMessage(resultsMessageBox, 'An unexpected error occurred during conversion.', true);
            }
        }, 500);
    };

    // Event Listeners
    convertBtn.addEventListener('click', handleConversion);
    clearBtn.addEventListener('click', resetOutputs);

    // Auto-clear other inputs and trigger conversion on input change
    const inputFields = [celsiusInput, fahrenheitInput, kelvinInput];
    inputFields.forEach(input => {
        input.addEventListener('input', (e) => {
            // Clear other inputs when one is typed into
            inputFields.forEach(otherInput => {
                if (otherInput !== e.target) {
                    otherInput.value = '';
                }
            });

            // Trigger conversion if the current input is not empty
            if (e.target.value.trim() !== '') {
                handleConversion();
            } else {
                // If the current input is cleared, reset all outputs
                resetOutputs();
            }
        });

        // Allow Enter key to trigger conversion
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                handleConversion();
            }
        });
    });

    // Initial state setup
    resetOutputs();
});
