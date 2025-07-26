// tools/currency-exchange-rate-viewer/script.js

document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amountInput');
    const fromCurrencySelect = document.getElementById('fromCurrencySelect');
    const toCurrencySelect = document.getElementById('toCurrencySelect');
    const swapCurrenciesBtn = document.getElementById('swapCurrenciesBtn');
    const convertBtn = document.getElementById('convertBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const convertedAmountOutput = document.getElementById('convertedAmountOutput');
    const lastUpdatedOutput = document.getElementById('lastUpdatedOutput');
    const popularRatesGrid = document.getElementById('popularRatesGrid');
    const noRatesMessage = document.getElementById('noRatesMessage');
    const messageBox = document.getElementById('messageBox');

    // List of common currencies to populate the dropdowns
    const commonCurrencies = [
        { code: 'USD', name: 'United States Dollar' },
        { code: 'EUR', name: 'Euro' },
        { code: 'GBP', name: 'British Pound Sterling' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'INR', name: 'Indian Rupee' },
        { code: 'BRL', name: 'Brazilian Real' },
        { code: 'RUB', name: 'Russian Ruble' },
        { code: 'SGD', name: 'Singapore Dollar' },
        { code: 'NZD', name: 'New Zealand Dollar' },
        { code: 'MXN', name: 'Mexican Peso' },
        { code: 'IDR', name: 'Indonesian Rupiah' },
        { code: 'KRW', name: 'South Korean Won' },
        { code: 'THB', name: 'Thai Baht' },
        { code: 'SEK', name: 'Swedish Krona' },
        { code: 'NOK', name: 'Norwegian Krone' },
        { code: 'DKK', name: 'Danish Krone' },
        { code: 'ZAR', name: 'South African Rand' },
        { code: 'HKD', name: 'Hong Kong Dollar' },
        { code: 'TRY', name: 'Turkish Lira' },
        { code: 'PLN', name: 'Polish Złoty' },
        { code: 'PHP', name: 'Philippine Peso' },
        { code: 'MYR', name: 'Malaysian Ringgit' },
        { code: 'CZK', name: 'Czech Koruna' },
        { code: 'HUF', name: 'Hungarian Forint' },
        { code: 'ILS', name: 'Israeli New Shekel' },
        { code: 'CLP', name: 'Chilean Peso' },
        { code: 'SAR', name: 'Saudi Riyal' },
        { code: 'AED', name: 'UAE Dirham' },
        { code: 'EGP', name: 'Egyptian Pound' },
        { code: 'VND', name: 'Vietnamese Dong' },
        { code: 'BDT', name: 'Bangladeshi Taka' },
        { code: 'PKR', name: 'Pakistani Rupee' },
        { code: 'NGN', name: 'Nigerian Naira' },
        { code: 'KES', name: 'Kenyan Shilling' },
        { code: 'GHS', name: 'Ghanaian Cedi' },
        { code: 'ARS', name: 'Argentine Peso' },
        { code: 'COP', name: 'Colombian Peso' },
        { code: 'PEN', name: 'Peruvian Sol' },
        { code: 'UAH', name: 'Ukrainian Hryvnia' },
        { code: 'ISK', name: 'Icelandic Króna' },
        { code: 'HRK', name: 'Croatian Kuna' },
        { code: 'RON', name: 'Romanian Leu' },
    ];

    /**
     * Populates the currency select dropdowns.
     */
    const populateCurrencySelects = () => {
        fromCurrencySelect.innerHTML = '';
        toCurrencySelect.innerHTML = '';

        commonCurrencies.forEach(currency => {
            const optionFrom = document.createElement('option');
            optionFrom.value = currency.code;
            optionFrom.textContent = `${currency.code} - ${currency.name}`;
            fromCurrencySelect.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = currency.code;
            optionTo.textContent = `${currency.code} - ${currency.name}`;
            toCurrencySelect.appendChild(optionTo);
        });

        // Set default selections
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'IDR'; // Default to Indonesian Rupiah
    };

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (message, isError = false) => {
        messageBox.textContent = message;
        messageBox.classList.remove('error');
        if (isError) {
            messageBox.classList.add('error');
        }
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Resets all output fields to their default state.
     */
    const resetOutputs = () => {
        convertedAmountOutput.textContent = 'N/A';
        lastUpdatedOutput.textContent = 'N/A';
        popularRatesGrid.innerHTML = '';
        popularRatesGrid.appendChild(noRatesMessage);
        noRatesMessage.style.display = 'block';
    };

    // Initialize dropdowns and outputs
    populateCurrencySelects();
    resetOutputs();

    // Event listener for the "Swap Currencies" button
    swapCurrenciesBtn.addEventListener('click', () => {
        const fromValue = fromCurrencySelect.value;
        const toValue = toCurrencySelect.value;
        fromCurrencySelect.value = toValue;
        toCurrencySelect.value = fromValue;
        showMessage('Currencies swapped!', false);
    });

    // Event listener for the "Convert" button
    convertBtn.addEventListener('click', async () => {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            showMessage('Please enter a valid amount.', true);
            resetOutputs();
            return;
        }
        if (!fromCurrency || !toCurrency) {
            showMessage('Please select both "From" and "To" currencies.', true);
            resetOutputs();
            return;
        }
        if (fromCurrency === toCurrency) {
            showMessage('Please select different currencies for conversion.', true);
            convertedAmountOutput.textContent = `${amount.toFixed(2)} ${fromCurrency}`;
            lastUpdatedOutput.textContent = 'N/A';
            popularRatesGrid.innerHTML = '';
            popularRatesGrid.appendChild(noRatesMessage);
            noRatesMessage.textContent = 'No conversion needed for same currencies.';
            noRatesMessage.style.display = 'block';
            return;
        }

        showMessage(`Converting ${amount} ${fromCurrency} to ${toCurrency}...`);
        resetOutputs(); // Clear previous results

        try {
            // Fetch exchange rates from exchangerate.host
            const apiUrl = `https://api.exchangerate.host/latest?base=${fromCurrency}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.rates) {
                const rate = data.rates[toCurrency];
                if (rate) {
                    const convertedAmount = amount * rate;
                    convertedAmountOutput.textContent = `${convertedAmount.toFixed(2)} ${toCurrency}`;
                    lastUpdatedOutput.textContent = new Date(data.date).toLocaleString();
                    showMessage('Conversion successful!', false);

                    // Display popular rates against the base currency
                    popularRatesGrid.innerHTML = ''; // Clear previous popular rates
                    noRatesMessage.style.display = 'none'; // Hide the "No rates" message

                    const popularTargets = ['USD', 'EUR', 'GBP', 'JPY', 'IDR', 'CAD', 'AUD', 'CNY'];
                    // Ensure the 'to' currency is also included if not in popular targets
                    if (!popularTargets.includes(toCurrency)) {
                        popularTargets.push(toCurrency);
                    }
                    // Filter out the base currency itself
                    const ratesToShow = popularTargets.filter(code => code !== fromCurrency);

                    ratesToShow.forEach(targetCode => {
                        const targetRate = data.rates[targetCode];
                        if (targetRate) {
                            const rateItem = document.createElement('div');
                            rateItem.className = 'rate-item';
                            rateItem.innerHTML = `
                                <div class="currency-code">${targetCode}</div>
                                <div class="exchange-value">1 ${fromCurrency} = ${targetRate.toFixed(4)} ${targetCode}</div>
                            `;
                            popularRatesGrid.appendChild(rateItem);
                        }
                    });
                     if (popularRatesGrid.innerHTML === '') {
                        popularRatesGrid.appendChild(noRatesMessage);
                        noRatesMessage.textContent = 'No popular rates to display for this base currency.';
                        noRatesMessage.style.display = 'block';
                    }

                } else {
                    showMessage(`Exchange rate for ${toCurrency} not found.`, true);
                    resetOutputs();
                }
            } else {
                showMessage('Failed to retrieve exchange rates. Please try again later.', true);
                resetOutputs();
            }
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            showMessage('An error occurred while fetching exchange rates. Please check your network connection or try again later.', true);
            resetOutputs();
        }
    });

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        amountInput.value = '1'; // Reset amount to 1
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'IDR';
        showMessage('', false); // Clear any active message
        resetOutputs(); // Reset all output fields
    });
});
