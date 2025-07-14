document.addEventListener('DOMContentLoaded', () => {
    // Dynamically load JSZip if not present
    function loadJSZip(callback) {
        if (window.JSZip) return callback();
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }
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

    // Bulk download container
    let bulkDownloadContainer = document.getElementById('bulkDownloadContainer');
    if (!bulkDownloadContainer) {
        bulkDownloadContainer = document.createElement('div');
        bulkDownloadContainer.id = 'bulkDownloadContainer';
        bulkDownloadContainer.style.marginTop = '1.5rem';
        bulkDownloadContainer.style.display = 'none';
        resultSection.parentNode.insertBefore(bulkDownloadContainer, resultSection.nextSibling);
    }

    let originalImages = [];
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
        const files = Array.from(event.target.files);
        if (!files.length) {
            fileNameDisplay.textContent = '';
            originalImages = [];
            hideAllResultsAndMessages();
            logState('File input changed: No file selected, UI reset');
            return;
        }

        fileNameDisplay.textContent = `Selected: ${files.length} file(s)`;
        hideAllResultsAndMessages();

        originalImages = [];
        let loadedCount = 0;
        let errorOccurred = false;
        showLoading();
        files.forEach((file, idx) => {
            if (!file.type.startsWith('image/')) {
                showError('Please upload only valid image files (JPG, PNG, WebP, GIF, BMP, TIFF).');
                errorOccurred = true;
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    originalImages[idx] = { img, file };
                    loadedCount++;
                    if (loadedCount === files.length && !errorOccurred) {
                        hideLoading();
                        logState('All images loaded successfully');
                    }
                };
                img.onerror = () => {
                    showError('Could not load one of the images. It might be corrupted or an unsupported format.');
                    errorOccurred = true;
                    hideLoading();
                    logState('Image failed to load from FileReader');
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                showError('Error reading one of the files. Please try again.');
                errorOccurred = true;
                hideLoading();
                logState('FileReader: Error reading file');
            };
            reader.readAsDataURL(file);
        });
    });

    convertBtn.addEventListener('click', () => {
        logState('Convert button clicked: Starting conversion');
        if (!originalImages.length) {
            showError('Please upload image(s) first.');
            logState('Convert button clicked: No images uploaded');
            return;
        }

        showLoading();
        hideAllResultsAndMessages();

        if (conversionTimeoutId) {
            clearTimeout(conversionTimeoutId);
        }
        conversionTimeoutId = setTimeout(() => {
            showError('Conversion timed out (max 30 seconds). The image(s) may be too large or there was an internal error.');
            hideLoading();
            logState('Conversion Timeout triggered');
        }, 30000);

        const format = outputFormat.value;
        const quality = parseFloat(qualitySlider.value) / 100;

        // Bulk conversion logic
        let convertedLinks = [];
        let errorOccurred = false;
        let completedCount = 0;

        originalImages.forEach(({ img, file }, idx) => {
            imageCanvas.width = img.naturalWidth;
            imageCanvas.height = img.naturalHeight;
            const ctx = imageCanvas.getContext('2d');
            ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
            ctx.drawImage(img, 0, 0);
            try {
                const convertedDataUrl = imageCanvas.toDataURL(format, quality);
                let baseFileName = file.name.split('.').slice(0, -1).join('.') || 'converted-image';
                let newExtension = format === 'image/jpeg' ? 'jpg' : format.split('/')[1];
                // For single image, show preview as before
                if (originalImages.length === 1) {
                    convertedImagePreview.src = convertedDataUrl;
                    convertedImagePreview.classList.remove('hidden');
                    convertedImagePreview.style.display = '';
                    downloadLink.href = convertedDataUrl;
                    downloadLink.download = `${baseFileName}.${newExtension}`;
                    downloadLink.classList.remove('hidden');
                    downloadLink.style.display = '';
                    resultSection.classList.remove('hidden');
                    resultSection.style.display = '';
                } else {
                    // For bulk, add to download links
                    convertedLinks.push({
                        url: convertedDataUrl,
                        name: `${baseFileName}.${newExtension}`
                    });
                }
                completedCount++;
                if (completedCount === originalImages.length && !errorOccurred) {
                    if (originalImages.length > 1) {
                        // Add ZIP download button
                        bulkDownloadContainer.innerHTML = '<h3>Converted Images:</h3>' +
                            convertedLinks.map(link => `<a href="${link.url}" download="${link.name}" class="tool-button" style="margin:0.5rem 0.5rem 0 0;">${link.name}</a>`).join('') +
                            `<button id="downloadZipBtn" class="tool-button" style="margin:0.5rem 0 0 0; background:#00c3ff; color:#18181b;">Download All as ZIP</button>`;
                        bulkDownloadContainer.style.display = '';
                        // Attach ZIP download handler
                        document.getElementById('downloadZipBtn').onclick = function() {
                            loadJSZip(() => {
                                const zip = new JSZip();
                                let addCount = 0;
                                convertedLinks.forEach(link => {
                                    // Remove data URL prefix
                                    const base64Data = link.url.split(',')[1];
                                    let mime = link.url.split(';')[0].replace('data:', '');
                                    zip.file(link.name, base64Data, {base64: true});
                                    addCount++;
                                    if (addCount === convertedLinks.length) {
                                        zip.generateAsync({type: 'blob'}).then(function(content) {
                                            const zipUrl = URL.createObjectURL(content);
                                            const a = document.createElement('a');
                                            a.href = zipUrl;
                                            a.download = 'converted-images.zip';
                                            document.body.appendChild(a);
                                            a.click();
                                            setTimeout(() => {
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(zipUrl);
                                            }, 1000);
                                        });
                                    }
                                });
                            });
                        };
                    } else {
                        bulkDownloadContainer.style.display = 'none';
                    }
                    clearTimeout(conversionTimeoutId);
                    hideLoading();
                    logState('Bulk conversion successful');
                }
            } catch (error) {
                errorOccurred = true;
                showError('Error during conversion. Please try a different format or image.');
                clearTimeout(conversionTimeoutId);
                hideLoading();
                logState('Bulk conversion failed with error');
            }
        });
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
        resultSection.style.display = 'none';
        convertedImagePreview.classList.add('hidden');
        convertedImagePreview.src = '';
        convertedImagePreview.style.display = 'none';
        imageCanvas.classList.add('hidden');
        imageCanvas.style.display = 'none';
        downloadLink.classList.add('hidden');
        downloadLink.style.display = 'none';
        loadingIndicator.classList.add('hidden');
        loadingIndicator.style.display = 'none';
        bulkDownloadContainer.style.display = 'none';
        bulkDownloadContainer.innerHTML = '';
        if (!keepErrorVisible) {
            errorMessage.classList.add('hidden');
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
        }
        logState('hideAllResultsAndMessages called');
    }

    // Initial state setup when the page loads
    hideAllResultsAndMessages();
    hideLoading();
    logState('DOM Content Loaded: Initialized');
});