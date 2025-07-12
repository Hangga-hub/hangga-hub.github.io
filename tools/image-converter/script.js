document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const outputFormat = document.getElementById('outputFormat');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const convertBtn = document.getElementById('convertBtn');
    const downloadLink = document.getElementById('downloadLink');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultSection = document.getElementById('resultSection');
    const imageCanvas = document.getElementById('imageCanvas');
    const convertedImagePreview = document.getElementById('convertedImagePreview');
    const errorMessage = document.getElementById('errorMessage');

    let originalImage = null;
    let conversionTimeoutId = null;

    // --- Debugging Helper ---
    function logState(message) {
        console.log(`%c[ImageConverter] ${new Date().toLocaleTimeString()}: ${message}`, 'color: cyan;');
        console.log(`  Loading visible (class): ${!loadingIndicator.classList.contains('hidden')}`);
        console.log(`  Loading visible (style): ${loadingIndicator.style.display !== 'none'}`);
        console.log(`  Result visible (class): ${!resultSection.classList.contains('hidden')}`);
        console.log(`  Preview visible (class): ${!convertedImagePreview.classList.contains('hidden')}`);
        console.log(`  Preview src: ${convertedImagePreview.src ? 'set' : 'cleared'}`);
        console.log(`  Download visible (class): ${!downloadLink.classList.contains('hidden')}`);
        console.log(`  Error visible (class): ${!errorMessage.classList.contains('hidden')}`);
    }
    // --- End Debugging Helper ---

    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value;
    });

    imageUpload.addEventListener('change', (event) => {
        logState('File input changed: Starting process');
        const file = event.target.files[0];
        if (!file) {
            fileNameDisplay.textContent = '';
            originalImage = null;
            hideAllResultsAndMessages();
            logState('File input changed: No file selected, UI reset');
            return;
        }

        fileNameDisplay.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        hideAllResultsAndMessages(); // Hide all previous results, errors, and loading indicators

        if (!file.type.startsWith('image/')) {
            showError('Please upload a valid image file (JPG, PNG, WebP, GIF, BMP, TIFF).');
            originalImage = null;
            logState('File input changed: Invalid file type');
            return;
        }

        const reader = new FileReader();
        reader.onloadstart = () => {
            showLoading();
            logState('FileReader: Load start');
        };
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                hideLoading();
                logState('Image loaded successfully from FileReader');
            };
            img.onerror = () => {
                showError('Could not load image. It might be corrupted or an unsupported format.');
                originalImage = null;
                hideLoading();
                logState('Image failed to load from FileReader');
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            showError('Error reading file. Please try again.');
            originalImage = null;
            hideLoading();
            logState('FileReader: Error reading file');
        };
        reader.readAsDataURL(file);
    });

    convertBtn.addEventListener('click', () => {
        logState('Convert button clicked: Starting conversion');
        if (!originalImage) {
            showError('Please upload an image first.');
            logState('Convert button clicked: No image uploaded');
            return;
        }

        showLoading();
        hideAllResultsAndMessages(); // Hide all previous results, errors, and loading indicators again

        if (conversionTimeoutId) {
            clearTimeout(conversionTimeoutId);
        }
        conversionTimeoutId = setTimeout(() => {
            showError('Conversion timed out (max 30 seconds). The image may be too large or there was an internal error.');
            hideLoading();
            logState('Conversion Timeout triggered');
        }, 30000); // 30-second timeout

        const format = outputFormat.value;
        const quality = parseFloat(qualitySlider.value) / 100;

        imageCanvas.width = originalImage.naturalWidth;
        imageCanvas.height = originalImage.naturalHeight;

        const ctx = imageCanvas.getContext('2d');
        ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        ctx.drawImage(originalImage, 0, 0);

        try {
            const convertedDataUrl = imageCanvas.toDataURL(format, quality);

            convertedImagePreview.src = convertedDataUrl;
            convertedImagePreview.classList.remove('hidden');
            convertedImagePreview.style.display = ''; // Ensure display is not 'none'

            const baseFileName = imageUpload.files[0].name.split('.').slice(0, -1).join('.');
            let newExtension;
            if (format === 'image/jpeg') {
                newExtension = 'jpg';
            } else {
                newExtension = format.split('/')[1];
            }

            downloadLink.href = convertedDataUrl;
            downloadLink.download = `${baseFileName}.${newExtension}`;
            downloadLink.classList.remove('hidden');
            downloadLink.style.display = ''; // Ensure display is not 'none'

            resultSection.classList.remove('hidden');
            resultSection.style.display = ''; // Ensure display is not 'none'

            clearTimeout(conversionTimeoutId); // Clear the timeout on success
            hideLoading();
            logState('Conversion successful');
        } catch (error) {
            console.error('Image conversion error:', error);
            showError('Error during conversion. Please try a different format or image.');
            clearTimeout(conversionTimeoutId); // Clear the timeout on error
            hideLoading();
            logState('Conversion failed with error');
        }
    });

    // --- Helper Functions for UI State Management ---

    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.style.display = ''; // Ensure display is not 'none'
        convertBtn.disabled = true;
        imageUpload.disabled = true;
        downloadLink.classList.add('hidden');
        logState('showLoading called');
    }

    function hideLoading() {
        loadingIndicator.classList.add('hidden');
        loadingIndicator.style.display = 'none'; // Force hide
        convertBtn.disabled = false;
        imageUpload.disabled = false;
        logState('hideLoading called');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        errorMessage.style.display = ''; // Ensure display is not 'none'
        hideAllResultsAndMessages(true);
        errorMessage.classList.remove('hidden'); // Re-apply for safety
        errorMessage.style.display = ''; // Re-apply style for safety
        logState('showError called');
    }

    function hideAllResultsAndMessages(keepErrorVisible = false) {
        resultSection.classList.add('hidden');
        resultSection.style.display = 'none'; // Force hide

        convertedImagePreview.classList.add('hidden');
        convertedImagePreview.src = '';
        convertedImagePreview.style.display = 'none'; // Force hide

        imageCanvas.classList.add('hidden');
        imageCanvas.style.display = 'none'; // Force hide

        downloadLink.classList.add('hidden');
        downloadLink.style.display = 'none'; // Force hide

        loadingIndicator.classList.add('hidden');
        loadingIndicator.style.display = 'none'; // Force hide

        if (!keepErrorVisible) {
            errorMessage.classList.add('hidden');
            errorMessage.textContent = '';
            errorMessage.style.display = 'none'; // Force hide
        }
        logState('hideAllResultsAndMessages called');
    }

    // Initial state setup when the page loads
    hideAllResultsAndMessages();
    hideLoading();
    logState('DOM Content Loaded: Initialized');
});