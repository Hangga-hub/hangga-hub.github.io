// tools/barcode-product-lookup/script.js

document.addEventListener('DOMContentLoaded', () => {
    const barcodeInput = document.getElementById('barcodeInput');
    const searchProductBtn = document.getElementById('searchProductBtn');
    const scanBarcodeBtn = document.getElementById('scanBarcodeBtn'); // New scan button
    const clearFormBtn = document.getElementById('clearFormBtn');
    const productDetails = document.getElementById('productDetails');
    const productImage = document.getElementById('productImage');
    const productNameOutput = document.getElementById('productNameOutput');
    const productBrandOutput = document.getElementById('productBrandOutput');
    const productQuantityOutput = document.getElementById('productQuantityOutput');
    const productCategoriesOutput = document.getElementById('productCategoriesOutput');
    const productIngredientsOutput = document.getElementById('productIngredientsOutput');
    const nutritionFactsList = document.getElementById('nutritionFactsList');
    const noNutritionMessage = document.getElementById('noNutritionMessage');
    const initialMessage = document.getElementById('initialMessage');
    const messageBox = document.getElementById('messageBox');

    // New elements for scanner feature
    const scannerSection = document.getElementById('scannerSection');
    const scannerVideo = document.getElementById('scannerVideo');
    const scannerCanvas = document.getElementById('scannerCanvas');
    const stopScanBtn = document.getElementById('stopScanBtn');
    const scannerMessageBox = document.getElementById('scannerMessageBox');

    let codeReader = null; // ZXing CodeReader instance
    let videoStream = null; // To hold the media stream

    /**
     * Displays a message in the specified message box.
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
     * Resets all product detail output fields to their default "N/A" state.
     */
    const resetOutputs = () => {
        productDetails.style.display = 'none';
        productImage.src = 'https://placehold.co/250x250/333333/FFFFFF?text=No+Image';
        productImage.alt = 'Product Image';
        productNameOutput.innerHTML = '<strong>Product Name:</strong> N/A';
        productBrandOutput.innerHTML = '<strong>Brand:</strong> N/A';
        productQuantityOutput.innerHTML = '<strong>Quantity:</strong> N/A';
        productCategoriesOutput.innerHTML = '<strong>Categories:</strong> N/A';
        productIngredientsOutput.innerHTML = '<strong>Ingredients:</strong> N/A';
        nutritionFactsList.innerHTML = ''; // Clear existing list items
        nutritionFactsList.appendChild(noNutritionMessage); // Add back the default message
        noNutritionMessage.style.display = 'block'; // Ensure it's visible
        initialMessage.style.display = 'block';
    };

    /**
     * Starts the barcode scanner.
     */
    const startScanner = async () => {
        // Hide initial message and product details
        initialMessage.style.display = 'none';
        productDetails.style.display = 'none';
        showMessage(messageBox, '', false); // Clear main message box

        // Show scanner section
        scannerSection.classList.add('show');
        showMessage(scannerMessageBox, 'Starting camera...');

        try {
            // Request camera access
            videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            scannerVideo.srcObject = videoStream;
            scannerVideo.setAttribute('playsinline', true); // Required for iOS
            await scannerVideo.play();

            // Initialize ZXing CodeReader
            codeReader = new ZXing.BrowserMultiFormatReader();
            showMessage(scannerMessageBox, 'Camera started. Point to a barcode.');

            // Start decoding from video stream
            codeReader.decodeFromVideo(scannerVideo, scannerCanvas, (result, err) => {
                if (result) {
                    // Barcode found!
                    showMessage(scannerMessageBox, `Barcode detected: ${result.text}`, false);
                    barcodeInput.value = result.text;
                    stopScanner(); // Stop scanner once barcode is found
                    searchProductBtn.click(); // Automatically trigger product search
                }
                if (err && !(err instanceof ZXing.NotFoundException)) {
                    // Log other errors, but not NotFoundException (which is expected when no barcode is in view)
                    console.error('ZXing error:', err);
                    showMessage(scannerMessageBox, 'Error scanning barcode. Try again.', true);
                }
            });
        } catch (err) {
            console.error('Error accessing camera:', err);
            showMessage(scannerMessageBox, 'Error accessing camera. Please ensure camera permissions are granted.', true);
            stopScanner(); // Ensure scanner UI is hidden if camera access fails
        }
    };

    /**
     * Stops the barcode scanner.
     */
    const stopScanner = () => {
        if (codeReader) {
            codeReader.reset(); // Stop decoding
            codeReader = null;
        }
        if (scannerVideo.srcObject) {
            scannerVideo.srcObject.getTracks().forEach(track => track.stop()); // Stop video tracks
            scannerVideo.srcObject = null;
        }
        videoStream = null;
        scannerSection.classList.remove('show'); // Hide scanner section
        showMessage(scannerMessageBox, '', false); // Clear scanner message box
    };

    // Initialize the display
    resetOutputs();

    // Event listener for the "Search Product" button
    searchProductBtn.addEventListener('click', async () => {
        const barcode = barcodeInput.value.trim();

        if (!barcode) {
            showMessage(messageBox, 'Please enter a barcode to search.', true);
            resetOutputs();
            return;
        }

        // Basic barcode validation (e.g., only digits)
        if (!/^\d+$/.test(barcode)) {
            showMessage(messageBox, 'Please enter a valid barcode (digits only).', true);
            resetOutputs();
            return;
        }

        showMessage(messageBox, `Searching for product with barcode: ${barcode}...`);
        resetOutputs(); // Clear previous results

        try {
            // Open Food Facts API for product data
            const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.status === 1 && data.product) {
                const product = data.product;

                productDetails.style.display = 'block';
                initialMessage.style.display = 'none';
                noNutritionMessage.style.display = 'none'; // Hide default nutrition message

                // Update product image
                const imageUrl = product.image_front_url || product.image_url || null;
                productImage.src = imageUrl || 'https://placehold.co/250x250/333333/FFFFFF?text=No+Image';
                productImage.alt = `Image of ${product.product_name || 'Unknown Product'}`;

                // Update product details
                productNameOutput.innerHTML = `<strong>Product Name:</strong> ${product.product_name || 'N/A'}`;
                productBrandOutput.innerHTML = `<strong>Brand:</strong> ${product.brands || 'N/A'}`;
                productQuantityOutput.innerHTML = `<strong>Quantity:</strong> ${product.quantity || 'N/A'}`;
                productCategoriesOutput.innerHTML = `<strong>Categories:</strong> ${product.categories || 'N/A'}`;
                productIngredientsOutput.innerHTML = `<strong>Ingredients:</strong> ${product.ingredients_text || 'N/A'}`;

                // Update nutrition facts
                nutritionFactsList.innerHTML = ''; // Clear previous nutrition facts
                if (product.nutriments) {
                    const nutriments = product.nutriments;
                    const nutrientsToShow = [
                        { key: 'energy-kj_100g', label: 'Energy (kJ)' },
                        { key: 'energy-kcal_100g', label: 'Energy (kcal)' },
                        { key: 'fat_100g', label: 'Fat' },
                        { key: 'saturated-fat_100g', label: 'Saturated Fat' },
                        { key: 'carbohydrates_100g', label: 'Carbohydrates' },
                        { key: 'sugars_100g', label: 'Sugars' },
                        { key: 'fiber_100g', label: 'Fiber' },
                        { key: 'proteins_100g', label: 'Proteins' },
                        { key: 'salt_100g', label: 'Salt' },
                    ];

                    let hasNutritionData = false;
                    nutrientsToShow.forEach(nutrient => {
                        if (nutriments[nutrient.key] !== undefined) {
                            hasNutritionData = true;
                            const listItem = document.createElement('li');
                            const unit = nutriments[`${nutrient.key}-unit`] || 'g'; // Default unit
                            listItem.innerHTML = `<strong>${nutrient.label}:</strong> <span>${nutriments[nutrient.key]}${unit}</span>`;
                            nutritionFactsList.appendChild(listItem);
                        }
                    });

                    if (!hasNutritionData) {
                        nutritionFactsList.appendChild(noNutritionMessage);
                        noNutritionMessage.style.display = 'block';
                        noNutritionMessage.textContent = 'No detailed nutrition information available.';
                    }
                } else {
                    nutritionFactsList.appendChild(noNutritionMessage);
                    noNutritionMessage.style.display = 'block';
                    noNutritionMessage.textContent = 'No nutrition information available.';
                }

                showMessage(messageBox, 'Product details loaded!', false);
            } else if (response.ok && data.status === 0) {
                showMessage(messageBox, `Product with barcode "${barcode}" not found in the database.`, true);
                resetOutputs();
            } else {
                showMessage(messageBox, 'Failed to retrieve product information. Please try again later.', true);
                resetOutputs();
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            showMessage(messageBox, 'An error occurred while fetching product data. Please check your network connection or try again later.', true);
            resetOutputs();
        }
    });

    // Event listener for the "Scan Barcode" button
    scanBarcodeBtn.addEventListener('click', startScanner);

    // Event listener for the "Stop Scan" button
    stopScanBtn.addEventListener('click', stopScanner);

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        barcodeInput.value = ''; // Clear the input field
        showMessage(messageBox, '', false); // Clear main message box
        stopScanner(); // Stop scanner if it's running
        resetOutputs(); // Reset all output fields
    });
});
