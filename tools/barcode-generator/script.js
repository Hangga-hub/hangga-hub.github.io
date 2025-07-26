// tools/barcode-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    const barcodeTextInput = document.getElementById('barcodeTextInput');
    const barcodeTypeSelect = document.getElementById('barcodeTypeSelect');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const barcodeDisplayArea = document.getElementById('barcodeDisplayArea');
    const barcodeImage = document.getElementById('barcodeImage');
    const qrcodeCanvas = document.getElementById('qrcodeCanvas');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const downloadButtonGroup = document.getElementById('downloadButtonGroup');

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
     * Resets all output fields and messages.
     */
    const resetOutputs = () => {
        barcodeTextInput.value = '';
        barcodeTypeSelect.value = 'CODE128'; // Reset to default
        barcodeImage.src = '';
        barcodeImage.classList.add('hidden');
        qrcodeCanvas.classList.add('hidden');
        barcodeDisplayArea.classList.add('hidden');
        downloadBtn.classList.add('hidden');
        downloadButtonGroup.classList.add('hidden'); // Hide the button group as well
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Validates the input data based on the selected barcode type.
     * @param {string} type - The selected barcode type.
     * @param {string} data - The input data.
     * @returns {boolean} True if data is valid, false otherwise.
     */
    const validateBarcodeData = (type, data) => {
        switch (type) {
            case 'EAN13':
                // EAN-13 requires 12 or 13 digits. If 12, JsBarcode adds the checksum.
                if (!/^\d{12,13}$/.test(data)) {
                    showMessage(messageBox, 'EAN-13 requires 12 or 13 digits.', true);
                    return false;
                }
                break;
            case 'UPC':
                // UPC-A requires 11 or 12 digits. If 11, JsBarcode adds the checksum.
                if (!/^\d{11,12}$/.test(data)) {
                    showMessage(messageBox, 'UPC-A requires 11 or 12 digits.', true);
                    return false;
                }
                break;
            case 'CODE39':
                // Code 39 supports alphanumeric characters, some symbols, and space.
                // JsBarcode handles validation internally, but basic check for non-empty.
                if (data.length === 0) {
                    showMessage(messageBox, 'Code 39 cannot be empty.', true);
                    return false;
                }
                break;
            case 'CODE128':
                // Code 128 supports all ASCII characters. Just check for non-empty.
                if (data.length === 0) {
                    showMessage(messageBox, 'Code 128 cannot be empty.', true);
                    return false;
                }
                break;
            case 'QRCODE':
                // QR Code can encode large amounts of data, just check for non-empty.
                if (data.length === 0) {
                    showMessage(messageBox, 'QR Code data cannot be empty.', true);
                    return false;
                }
                break;
            default:
                showMessage(messageBox, 'Invalid barcode type selected.', true);
                return false;
        }
        return true;
    };

    /**
     * Generates and displays the barcode.
     */
    const generateBarcode = () => {
        const data = barcodeTextInput.value.trim();
        const type = barcodeTypeSelect.value;

        if (!validateBarcodeData(type, data)) {
            resetOutputs(); // Clear previous outputs if validation fails
            return;
        }

        // Clear previous results and messages, show loading spinner
        barcodeImage.src = '';
        barcodeImage.classList.add('hidden');
        qrcodeCanvas.classList.add('hidden');
        barcodeDisplayArea.classList.add('hidden');
        downloadBtn.classList.add('hidden');
        downloadButtonGroup.classList.add('hidden');
        showMessage(messageBox, 'Generating barcode...', false);
        loadingSpinner.style.display = 'block';

        // Simulate processing delay
        setTimeout(() => {
            try {
                let generatedDataUrl = '';

                if (type === 'QRCODE') {
                    // For QR Code, use QRious and render to canvas
                    qrcodeCanvas.classList.remove('hidden');
                    const qr = new QRious({
                        element: qrcodeCanvas,
                        value: data,
                        size: 250, // Default size for QR code
                        foreground: '#000000', // Black
                        background: '#ffffff'  // White
                    });
                    generatedDataUrl = qrcodeCanvas.toDataURL('image/png');
                } else {
                    // For 1D barcodes, use JsBarcode and render to a temporary SVG
                    // Then convert SVG to data URL for the <img> tag
                    const tempSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    JsBarcode(tempSvgElement, data, {
                        format: type,
                        lineColor: "#000",
                        width: 2,
                        height: 100,
                        displayValue: true // Show the human-readable text below
                    });
                    // Convert SVG XML to data URL
                    const svgXml = new XMLSerializer().serializeToString(tempSvgElement);
                    generatedDataUrl = 'data:image/svg+xml;base64,' + btoa(svgXml);
                    barcodeImage.classList.remove('hidden');
                }

                barcodeImage.src = generatedDataUrl;
                barcodeDisplayArea.classList.remove('hidden');
                downloadBtn.classList.remove('hidden');
                downloadButtonGroup.classList.remove('hidden'); // Show the button group

                showMessage(resultsMessageBox, 'Barcode generated successfully!', false);
                // Scroll to the result section
                barcodeDisplayArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

            } catch (error) {
                console.error('Barcode generation error:', error);
                showMessage(resultsMessageBox, `Error generating barcode: ${error.message}. Please check your data and type.`, true);
                // Ensure image and download button are hidden on error
                barcodeImage.classList.add('hidden');
                qrcodeCanvas.classList.add('hidden');
                barcodeDisplayArea.classList.add('hidden');
                downloadBtn.classList.add('hidden');
                downloadButtonGroup.classList.add('hidden');
            } finally {
                loadingSpinner.style.display = 'none';
            }
        }, 500); // Simulate processing delay
    };

    /**
     * Handles downloading the generated barcode image.
     */
    const downloadBarcode = () => {
        let imageUrl = '';
        let fileName = 'barcode';

        if (barcodeTypeSelect.value === 'QRCODE') {
            imageUrl = qrcodeCanvas.toDataURL('image/png');
            fileName += '.png';
        } else {
            imageUrl = barcodeImage.src;
            // If it's an SVG data URL, we can suggest .svg, otherwise .png (from onerror fallback)
            fileName += imageUrl.startsWith('data:image/svg+xml') ? '.svg' : '.png';
        }

        if (imageUrl) {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showMessage(resultsMessageBox, 'Barcode download initiated!', false);
        } else {
            showMessage(resultsMessageBox, 'No barcode to download.', true);
        }
    };

    // Event Listeners
    generateBtn.addEventListener('click', generateBarcode);
    clearBtn.addEventListener('click', resetOutputs);
    downloadBtn.addEventListener('click', downloadBarcode);

    // Allow pressing Enter in the input field to trigger generation
    barcodeTextInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateBarcode();
        }
    });
});
