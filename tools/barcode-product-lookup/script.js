// tools/barcode-product-lookup/script.js

document.addEventListener('DOMContentLoaded', () => {
    const barcodeInput = document.getElementById('barcodeInput');
    const lookupBtn = document.getElementById('lookupBtn');
    const clearManualBtn = document.getElementById('clearManualBtn');
    const messageBox = document.getElementById('messageBox'); // For manual input messages

    const startScannerBtn = document.getElementById('startScannerBtn');
    const stopScannerBtn = document.getElementById('stopScannerBtn');
    const scannerArea = document.getElementById('scannerArea');
    const interactiveViewport = document.getElementById('interactive');
    const scannerPlaceholder = document.getElementById('scannerPlaceholder');
    const scannerMessageBox = document.getElementById('scannerMessageBox'); // For scanner messages

    const productResultDiv = document.getElementById('productResult');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsMessageBox = document.getElementById('resultsMessageBox'); // For product lookup messages

    // Product output elements
    const productImage = document.getElementById('productImage');
    const productName = document.getElementById('productName');
    const productBarcode = document.getElementById('productBarcode');
    const productBrand = document.getElementById('productBrand');
    const productCategory = document.getElementById('productCategory');
    const productDescription = document.getElementById('productDescription');

    let scannerRunning = false;

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
     * Resets all product output fields and messages.
     */
    const resetProductOutputs = () => {
        productImage.src = 'https://placehold.co/150x150/333333/FFFFFF?text=Product';
        productImage.classList.add('hidden');
        productName.textContent = '';
        productBarcode.innerHTML = '<strong>Barcode:</strong> N/A';
        productBrand.innerHTML = '<strong>Brand:</strong> N/A';
        productCategory.innerHTML = '<strong>Category:</strong> N/A';
        productDescription.innerHTML = '<strong>Description:</strong> N/A';
        productResultDiv.classList.add('hidden');
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Simulates a product lookup based on a barcode.
     * In a real application, this would call an external product API (e.g., Open Food Facts).
     * @param {string} barcode - The barcode to look up.
     */
    const lookupProduct = async (barcode) => {
        resetProductOutputs();
        showMessage(resultsMessageBox, `Looking up product for barcode: ${barcode}...`, false);
        loadingSpinner.style.display = 'block';

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        loadingSpinner.style.display = 'none';

        // Mock data for demonstration
        const mockProducts = {
            "049000050186": {
                name: "Coca-Cola Classic",
                brand: "Coca-Cola",
                category: "Beverages",
                description: "Refreshing carbonated soft drink.",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Coca-Cola_bottle_cap_logo.svg/1200px-Coca-Cola_bottle_cap_logo.svg.png" // Placeholder image
            },
            "012345678905": {
                name: "Organic Whole Milk",
                brand: "Happy Cow Dairy",
                category: "Dairy & Eggs",
                description: "Fresh organic whole milk, 1 gallon.",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Milk_bottle_with_milk.jpg/800px-Milk_bottle_with_milk.jpg"
            },
            "9780321765723": { // Example ISBN barcode
                name: "The Lord of the Rings: The Fellowship of the Ring",
                brand: "HarperCollins",
                category: "Books",
                description: "The first volume in J.R.R. Tolkien's epic fantasy series.",
                image: "https://upload.wikimedia.org/wikipedia/en/e/e9/The_Fellowship_of_the_Ring_cover.gif"
            }
        };

        const product = mockProducts[barcode];

        if (product) {
            productName.textContent = product.name;
            productBarcode.innerHTML = `<strong>Barcode:</strong> ${barcode}`;
            productBrand.innerHTML = `<strong>Brand:</strong> ${product.brand}`;
            productCategory.innerHTML = `<strong>Category:</strong> ${product.category}`;
            productDescription.innerHTML = `<strong>Description:</strong> ${product.description}`;
            
            if (product.image) {
                productImage.src = product.image;
                productImage.classList.remove('hidden');
            } else {
                productImage.classList.add('hidden'); // Hide if no valid image
            }

            productResultDiv.classList.remove('hidden');
            showMessage(resultsMessageBox, 'Product found!', false);
            productResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            showMessage(resultsMessageBox, 'Product not found for this barcode. Try a different one.', true);
        }
    };

    /**
     * Initializes and starts the barcode scanner.
     */
    const startScanner = async () => {
        if (scannerRunning) {
            showMessage(scannerMessageBox, 'Scanner is already running.', false);
            return;
        }

        resetProductOutputs(); // Clear any previous product results
        barcodeInput.value = ''; // Clear manual input

        scannerPlaceholder.classList.add('hidden');
        interactiveViewport.classList.remove('hidden');
        startScannerBtn.classList.add('hidden');
        stopScannerBtn.classList.remove('hidden');
        showMessage(scannerMessageBox, 'Starting scanner... Please grant camera access.', false);

        try {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: interactiveViewport, // Or '#interactive.viewport'
                    constraints: {
                        width: { min: 640 },
                        height: { min: 480 },
                        facingMode: "environment", // Use rear camera if available
                        aspectRatio: { min: 1, max: 2 }
                    }
                },
                decoder: {
                    readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader", "code_128_reader", "code_39_reader"] // Specify barcode types
                }
            }, function(err) {
                if (err) {
                    console.error("Quagga initialization error:", err);
                    showMessage(scannerMessageBox, `Error starting scanner: ${err.message}. Make sure you have a camera and grant permission.`, true);
                    stopScanner(); // Attempt to stop if init fails
                    return;
                }
                Quagga.start();
                scannerRunning = true;
                showMessage(scannerMessageBox, 'Scanner started. Point your camera at a barcode.', false);
            });

            Quagga.onDetected(function(result) {
                if (result.codeResult && result.codeResult.code) {
                    const barcode = result.codeResult.code;
                    showMessage(scannerMessageBox, `Barcode detected: ${barcode}`, false);
                    barcodeInput.value = barcode; // Populate manual input
                    stopScanner(); // Stop scanner after successful detection
                    lookupProduct(barcode); // Perform product lookup
                }
            });

            Quagga.onProcessed(function(result) {
                // Draw detection boxes (optional, for debugging/visual feedback)
                const drawingCtx = Quagga.canvas.ctx.overlay;
                const drawingCanvas = Quagga.canvas.dom.overlay;

                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.width), parseInt(drawingCanvas.height));

                if (result) {
                    if (result.boxes) {
                        result.boxes.filter(function (box) {
                            return box !== result.box;
                        }).forEach(function (box) {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                        });
                    }

                    if (result.box) {
                        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                    }

                    if (result.codeResult && result.codeResult.code) {
                        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                    }
                }
            });

        } catch (error) {
            console.error("Error accessing camera:", error);
            showMessage(scannerMessageBox, `Failed to access camera: ${error.message}. Please ensure camera permissions are granted.`, true);
            stopScanner();
        }
    };

    /**
     * Stops the barcode scanner.
     */
    const stopScanner = () => {
        if (scannerRunning) {
            Quagga.stop();
            scannerRunning = false;
            interactiveViewport.classList.add('hidden');
            scannerPlaceholder.classList.remove('hidden');
            startScannerBtn.classList.remove('hidden');
            stopScannerBtn.classList.add('hidden');
            showMessage(scannerMessageBox, 'Scanner stopped.', false);
        }
    };

    // Event Listeners
    lookupBtn.addEventListener('click', () => {
        const barcode = barcodeInput.value.trim();
        if (barcode) {
            lookupProduct(barcode);
        } else {
            showMessage(messageBox, 'Please enter a barcode.', true);
        }
    });

    clearManualBtn.addEventListener('click', () => {
        barcodeInput.value = '';
        showMessage(messageBox, 'Manual input cleared.', false);
        resetProductOutputs();
    });

    startScannerBtn.addEventListener('click', startScanner);
    stopScannerBtn.addEventListener('click', stopScanner);

    // Initial state setup
    resetProductOutputs();
});
