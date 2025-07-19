// script.js for tools/crypto-converter/

document.addEventListener('DOMContentLoaded', () => {
    const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

    // UI Elements
    const amountInput = document.getElementById('amountInput');
    const fromCurrencySelect = document.getElementById('fromCurrencySelect');
    const toCurrencySelect = document.getElementById('toCurrencySelect');
    const convertedAmountInput = document.getElementById('convertedAmountInput');
    const swapCurrenciesBtn = document.getElementById('swapCurrenciesBtn');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Mapping of common crypto symbols to CoinGecko IDs
    const cryptoSymbols = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'SOL': 'solana',
        'XRP': 'ripple',
        'ADA': 'cardano',
        'DOGE': 'dogecoin',
        'SHIB': 'shiba-inu',
        'DOT': 'polkadot',
        'AVAX': 'avalanche',
        'LINK': 'chainlink',
        'BNB': 'binancecoin',
        'USDT': 'tether',
        'USDC': 'usd-coin',
    };

    // Reverse mapping for display (ID to Symbol)
    const cryptoIdToSymbol = Object.fromEntries(Object.entries(cryptoSymbols).map(([key, value]) => [value, key]));

    let allSupportedCurrencies = []; // Will store a mix of crypto symbols and fiat symbols

    // Function to display messages
    function showMessage(message, type = 'info') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        } else {
            console.warn("Message box element not found.");
        }
    }

    // Show/hide loading overlay
    function toggleLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    // Populates a select element with options from an array of currencies
    function populateDropdown(selectElement, currencies) {
        selectElement.innerHTML = '';
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            selectElement.appendChild(option);
        });
    }

    // Fetches supported vs_currencies from CoinGecko and populates dropdowns
    async function fetchAndPopulateCurrencies() {
        toggleLoading(true);
        try {
            // Fetch supported fiat currencies
            const response = await fetch(`${COINGECKO_API_BASE}/simple/supported_vs_currencies`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} fetching supported currencies.`);
            const fiatVsCurrencies = await response.json();

            // Combine crypto symbols and fiat currencies for dropdowns
            const availableCurrencies = [
                ...Object.keys(cryptoSymbols), // BTC, ETH, etc.
                ...fiatVsCurrencies.map(c => c.toUpperCase()) // USD, EUR, IDR, etc.
            ].sort(); // Sort alphabetically for better UX

            // Filter out any potential duplicates (e.g., if 'USD' is in cryptoSymbols and fiatVsCurrencies)
            allSupportedCurrencies = [...new Set(availableCurrencies)];

            populateDropdown(fromCurrencySelect, allSupportedCurrencies);
            populateDropdown(toCurrencySelect, allSupportedCurrencies);

            // Set default selections
            fromCurrencySelect.value = 'BTC';
            toCurrencySelect.value = 'USD';

            showMessage('Currencies loaded successfully.', 'success');
            // Perform an initial conversion with default values
            performConversion();
        } catch (error) {
            console.error('Error fetching supported currencies:', error);
            showMessage('Failed to load currencies. Please check your internet connection or try again later.', 'error');
        } finally {
            toggleLoading(false);
        }
    }

    // Function to get price for a given crypto ID against a vs_currency
    async function getCryptoPrice(cryptoId, vsCurrency) {
        const url = `${COINGECKO_API_BASE}/simple/price?ids=${cryptoId}&vs_currencies=${vsCurrency}`;
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error fetching price for ${cryptoId} in ${vsCurrency}: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        return data[cryptoId] ? data[cryptoId][vsCurrency] : null;
    }

    // Main conversion logic
    async function performConversion() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            showMessage('Please enter a valid amount greater than zero.', 'info');
            convertedAmountInput.value = '';
            return;
        }

        toggleLoading(true);
        convertedAmountInput.value = 'Calculating...';

        try {
            let convertedValue = 0;

            const isFromCrypto = cryptoSymbols.hasOwnProperty(fromCurrency);
            const isToCrypto = cryptoSymbols.hasOwnProperty(toCurrency);

            if (isFromCrypto && isToCrypto) {
                // Crypto to Crypto (e.g., BTC to ETH)
                const fromId = cryptoSymbols[fromCurrency];
                const toId = cryptoSymbols[toCurrency];

                const priceFromInUsd = await getCryptoPrice(fromId, 'usd');
                const priceToInUsd = await getCryptoPrice(toId, 'usd');

                if (priceFromInUsd === null || priceToInUsd === null) {
                    throw new Error('Could not fetch prices for crypto-to-crypto conversion. Check if both cryptocurrencies are valid.');
                }
                if (priceToInUsd === 0) {
                     throw new Error(`Price of ${toCurrency} is zero, cannot convert.`);
                }
                convertedValue = (amount * priceFromInUsd) / priceToInUsd;

            } else if (isFromCrypto && !isToCrypto) {
                // Crypto to Fiat (e.g., BTC to USD)
                const fromId = cryptoSymbols[fromCurrency];
                const price = await getCryptoPrice(fromId, toCurrency.toLowerCase()); // CoinGecko vs_currencies are lowercase

                if (price === null) {
                    throw new Error(`Could not fetch price for ${fromCurrency} in ${toCurrency}. Ensure ${toCurrency} is a supported fiat currency.`);
                }
                convertedValue = amount * price;

            } else if (!isFromCrypto && isToCrypto) {
                // Fiat to Crypto (e.g., USD to BTC)
                const toId = cryptoSymbols[toCurrency];
                const price = await getCryptoPrice(toId, fromCurrency.toLowerCase()); // CoinGecko vs_currencies are lowercase

                if (price === null) {
                    throw new Error(`Could not fetch price for ${toCurrency} in ${fromCurrency}. Ensure ${fromCurrency} is a supported fiat currency.`);
                }
                if (price === 0) {
                    throw new Error(`Price of ${toCurrency} in ${fromCurrency} is zero, cannot divide.`);
                }
                convertedValue = amount / price;

            } else {
                // Fiat to Fiat (e.g., USD to IDR)
                // CoinGecko API is primarily for crypto prices. Direct fiat-to-fiat is not its main function.
                // We can use a common crypto (like Bitcoin) as an intermediary if needed, but for simplicity,
                // we'll state that at least one currency must be crypto for this tool.
                showMessage('Direct fiat-to-fiat conversion is not supported by this tool. At least one currency must be a cryptocurrency.', 'error');
                convertedAmountInput.value = '';
                return;
            }

            // Format output based on currency type (more precision for crypto)
            if (isToCrypto) {
                convertedAmountInput.value = convertedValue.toFixed(8); // More decimals for crypto
            } else {
                convertedAmountInput.value = convertedValue.toFixed(2); // Standard for fiat
            }
            showMessage('Conversion successful!', 'success');

        } catch (error) {
            console.error('Conversion error:', error);
            showMessage(`Conversion failed: ${error.message}. Please check inputs and try again.`, 'error');
            convertedAmountInput.value = '';
        } finally {
            toggleLoading(false);
        }
    }

    // --- Event Listeners ---
    swapCurrenciesBtn.addEventListener('click', () => {
        const fromValue = fromCurrencySelect.value;
        const toValue = toCurrencySelect.value;
        fromCurrencySelect.value = toValue;
        toCurrencySelect.value = fromValue;
        performConversion(); // Re-calculate after swap
    });

    convertBtn.addEventListener('click', performConversion);

    // Also trigger conversion on input/select changes for a more dynamic experience
    amountInput.addEventListener('input', performConversion);
    fromCurrencySelect.addEventListener('change', performConversion);
    toCurrencySelect.addEventListener('change', performConversion);

    clearBtn.addEventListener('click', () => {
        amountInput.value = '1';
        fromCurrencySelect.value = 'BTC';
        toCurrencySelect.value = 'USD';
        convertedAmountInput.value = '';
        showMessage('Cleared all fields.', 'info');
        performConversion(); // Perform initial conversion after clearing
    });

    // Initial fetch and populate on page load
    fetchAndPopulateCurrencies();
});
