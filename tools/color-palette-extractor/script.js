// script.js for Color Palette Extractor

document.addEventListener('DOMContentLoaded', () => {
    console.log("Color Palette Extractor script loaded.");

    // --- Get references to elements ---
    const imageUploadInput = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const hiddenCanvas = document.getElementById('hiddenCanvas');
    const ctx = hiddenCanvas.getContext('2d');
    const extractPaletteBtn = document.getElementById('extractPaletteBtn');
    const clearBtn = document.getElementById('clearBtn');
    const colorPaletteDisplay = document.getElementById('colorPaletteDisplay');
    const hexCodesOutput = document.getElementById('hexCodesOutput');
    const copyHexBtn = document.getElementById('copyHexBtn');
    const messageBox = document.getElementById('messageBox');
    const outputSection = document.querySelector('.output-section');

    // --- Configuration ---
    const MAX_PALETTE_COLORS = 20; // Maximum number of colors to display in the palette
    const PIXEL_SAMPLE_INTERVAL = 10; // Sample every Nth pixel (e.g., 10 for every 10th pixel)
    const MAX_IMAGE_DIMENSION = 800; // Max width/height for image before scaling down for canvas processing

    // --- Helper function to show messages to the user ---
    function showMessage(message, isError = false) {
        if (!messageBox) {
            console.error("Error: Message box element (#messageBox) not found in HTML.");
            return;
        }

        messageBox.textContent = message;
        messageBox.classList.remove('error');
        messageBox.classList.add('show');

        if (isError) {
            messageBox.classList.add('error');
            messageBox.style.color = 'var(--cyber-neon-pink)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-pink)';
            console.error("Message (Error):", message);
        } else {
            messageBox.style.color = 'var(--cyber-neon-cyan)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-cyan)';
            console.log("Message (Success/Info):", message);
        }

        // Hide message after a few seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
            messageBox.textContent = '';
        }, 3000);
    }

    // --- Helper function to scroll to results ---
    function scrollToResults() {
        if (outputSection) {
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // --- Function to convert RGB to HEX ---
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    // --- Function to determine if text color should be light or dark based on background ---
    function getContrastTextColor(hexColor) {
        if (!hexColor || hexColor.length !== 7) return '#FFFFFF'; // Default to white for invalid hex

        const r = parseInt(hexColor.substring(1, 3), 16);
        const g = parseInt(hexColor.substring(3, 5), 16);
        const b = parseInt(hexColor.substring(5, 7), 16);

        // Calculate luminance (Y = 0.299 R + 0.587 G + 0.114 B)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Use a threshold (e.g., 0.5) to decide between black and white text
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    // --- Main function to extract color palette ---
    function extractColorPalette(imgElement) {
        console.log("extractColorPalette() called.");
        clearResults(false); // Clear previous results but keep image preview

        if (!imgElement || !imgElement.src || imgElement.src === '#') {
            showMessage("No image loaded for extraction.", true);
            scrollToResults();
            return;
        }

        // Create a new Image object to ensure it's fully loaded before drawing to canvas
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Important for handling some image sources, though not strictly needed for data URLs

        img.onload = () => {
            // Scale image down if it's too large to avoid performance issues on canvas
            let width = img.width;
            let height = img.height;

            if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
                if (width > height) {
                    height = height * (MAX_IMAGE_DIMENSION / width);
                    width = MAX_IMAGE_DIMENSION;
                } else {
                    width = width * (MAX_IMAGE_DIMENSION / height);
                    height = MAX_IMAGE_DIMENSION;
                }
            }

            hiddenCanvas.width = width;
            hiddenCanvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            try {
                const imageData = ctx.getImageData(0, 0, width, height);
                const pixels = imageData.data;
                const colorCounts = {}; // Store color counts to find dominant colors

                // Iterate through pixels, sampling at intervals
                for (let i = 0; i < pixels.length; i += 4 * PIXEL_SAMPLE_INTERVAL) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];

                    const hex = rgbToHex(r, g, b);
                    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
                }

                // Sort colors by their frequency (most dominant first)
                const sortedColors = Object.entries(colorCounts)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .map(([hex]) => hex);

                const palette = sortedColors.slice(0, MAX_PALETTE_COLORS); // Limit to MAX_PALETTE_COLORS

                if (palette.length === 0) {
                    showMessage("No distinct colors could be extracted from the image. It might be a monochrome image or too small.", true);
                    scrollToResults();
                    return;
                }

                displayPalette(palette);
                showMessage(`Extracted ${palette.length} dominant colors.`, false);
                scrollToResults();
            } catch (error) {
                console.error("Error processing image data on canvas:", error);
                showMessage("Error extracting colors. The image might be corrupted or too complex for processing.", true);
                scrollToResults();
            } finally {
                extractPaletteBtn.disabled = true; // Disable after extraction
                copyHexBtn.disabled = false; // Enable copy button
            }
        };

        img.onerror = () => {
            showMessage("Failed to load image into canvas. Please ensure it's a valid image file and not corrupted.", true);
            scrollToResults();
            extractPaletteBtn.disabled = true;
            copyHexBtn.disabled = true;
        };

        img.src = imgElement.src; // Set the source to trigger loading
    }

    // --- Function to display the extracted palette ---
    function displayPalette(palette) {
        colorPaletteDisplay.innerHTML = ''; // Clear previous swatches
        hexCodesOutput.value = ''; // Clear previous HEX codes

        const hexCodes = [];

        palette.forEach(hex => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = hex;
            swatch.textContent = hex; // Display HEX code on swatch
            swatch.style.color = getContrastTextColor(hex); // Set text color for contrast
            swatch.title = `Click to copy ${hex}`;

            swatch.addEventListener('click', () => {
                copyToClipboard(hex);
                showMessage(`Copied ${hex} to clipboard!`, false);
            });

            colorPaletteDisplay.appendChild(swatch);
            hexCodes.push(hex);
        });

        hexCodesOutput.value = hexCodes.join('\n');
    }

    // --- Function to copy text to clipboard ---
    function copyToClipboard(text) {
        if (!text) {
            showMessage('Nothing to copy!', true);
            return;
        }
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            // Message for individual swatches is handled by their click listener
        } catch (err) {
            console.error('Failed to copy text: ', err);
            showMessage('Failed to copy! Please try manually.', true);
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // --- Function to clear all input fields and the output ---
    function clearResults(clearImage = true) {
        if (clearImage) {
            imageUploadInput.value = ''; // Clear file input
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
        }
        colorPaletteDisplay.innerHTML = '';
        hexCodesOutput.value = '';
        extractPaletteBtn.disabled = true;
        copyHexBtn.disabled = true;
        ctx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height); // Clear canvas
        if (clearImage) { // Only show message if clearing everything
            showMessage('Cleared all.', false);
        }
        console.log("All results cleared.");
    }

    // --- Event Listeners ---

    // Image upload input change
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    showMessage("Please upload a valid image file (JPG, PNG, GIF, etc.).", true);
                    clearResults();
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    extractPaletteBtn.disabled = false; // Enable extract button once image is loaded
                    hexCodesOutput.value = ''; // Clear previous HEX codes
                    colorPaletteDisplay.innerHTML = ''; // Clear previous swatches
                    copyHexBtn.disabled = true; // Disable copy until new palette is extracted
                    showMessage("Image loaded. Click 'Extract Palette' to get colors.", false);
                };
                reader.onerror = () => {
                    showMessage("Error reading file.", true);
                    clearResults();
                };
                reader.readAsDataURL(file);
            } else {
                clearResults();
            }
        });
        console.log("Image upload input event listener attached.");
    } else {
        console.error("Error: Image upload input (#imageUpload) not found.");
    }

    // Extract Palette button click
    if (extractPaletteBtn) {
        extractPaletteBtn.addEventListener('click', () => extractColorPalette(imagePreview));
        console.log("Extract Palette button event listener attached.");
    } else {
        console.error("Error: Extract Palette button (#extractPaletteBtn) not found.");
    }

    // Copy All HEX Codes button click
    if (copyHexBtn) {
        copyHexBtn.addEventListener('click', () => {
            if (hexCodesOutput.value) {
                copyToClipboard(hexCodesOutput.value);
                showMessage('All HEX codes copied to clipboard!', false);
            } else {
                showMessage('No HEX codes to copy!', true);
            }
        });
        console.log("Copy HEX button event listener attached.");
    } else {
        console.error("Error: Copy HEX button (#copyHexBtn) not found.");
    }

    // Clear button click
    if (clearBtn) {
        clearBtn.addEventListener('click', () => clearResults(true));
        console.log("Clear button event listener attached.");
    } else {
        console.error("Error: Clear button (#clearBtn) not found.");
    }

    // Initial state: disable buttons until image is loaded
    extractPaletteBtn.disabled = true;
    copyHexBtn.disabled = true;
    console.log("Initial button states set.");
});
