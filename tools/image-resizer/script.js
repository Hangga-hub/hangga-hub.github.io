// image-resizer.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the image-resizer.html page
    if (!document.querySelector('.tool-image-resizer')) {
        return; // Exit if not on the correct page
    }

    // Get DOM elements
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const uploadButton = dropZone.querySelector('.upload-btn');
    const imageControls = document.getElementById('imageControls');
    const originalDimsSpan = document.getElementById('originalDims');
    const originalFileSizeSpan = document.getElementById('originalFileSize');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const lockAspectCheckbox = document.getElementById('lockAspect');
    const unitToggles = document.querySelectorAll('.unit-toggle'); // px/% toggles
    const outputFormatSelect = document.getElementById('outputFormat');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValueSpan = document.getElementById('qualityValue');
    const backgroundColorGroup = document.getElementById('backgroundColorGroup');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const imagePreview = document.getElementById('imagePreview');
    const previewDims = document.getElementById('previewDims');
    const previewFileSize = document.getElementById('previewFileSize');
    const resizeAndDownloadBtn = document.getElementById('resizeAndDownloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let originalImage = null; // Stores the original Image object
    let originalWidth = 0;
    let originalHeight = 0;
    let currentUnit = 'px'; // 'px' or '%'

    // --- Helper Functions ---

    /**
     * Formats bytes into a human-readable file size string.
     * @param {number} bytes - The number of bytes.
     * @param {number} decimals - Number of decimal places.
     * @returns {string} Formatted file size.
     */
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Resets the tool to its initial state.
     */
    function resetTool() {
        originalImage = null;
        originalWidth = 0;
        originalHeight = 0;
        imageInput.value = ''; // Clear file input
        dropZone.classList.remove('hidden');
        imageControls.classList.add('hidden');
        resizeAndDownloadBtn.classList.add('hidden');
        resetBtn.classList.add('hidden');
        imagePreview.classList.add('hidden');
        updatePreviewInfo(0, 0, 0); // Clear preview info
        
        // Reset default values for inputs/settings
        widthInput.value = '';
        heightInput.value = '';
        lockAspectCheckbox.checked = true;
        
        // Reset unit toggles to 'px'
        unitToggles.forEach(toggle => {
            if (toggle.dataset.unit === 'px') toggle.classList.add('active');
            else toggle.classList.remove('active');
        });
        currentUnit = 'px';

        outputFormatSelect.value = 'image/jpeg';
        qualitySlider.value = 80;
        qualityValueSpan.textContent = '80';
        backgroundColorGroup.style.display = 'none'; // Hide background color for non-JPG
        backgroundColorInput.value = '#ffffff';
    }

    /**
     * Updates the preview image information (dimensions and file size).
     * @param {number} width - The width of the preview image.
     * @param {number} height - The height of the preview image.
     * @param {number} fileSize - The file size of the preview image in bytes.
     */
    function updatePreviewInfo(width, height, fileSize) {
        if (width && height) {
            previewDims.textContent = `Preview Dims: ${Math.round(width)}x${Math.round(height)}px`;
            previewDims.classList.remove('hidden');
        } else {
            previewDims.classList.add('hidden');
        }
        if (fileSize) {
            previewFileSize.textContent = `Preview File Size: ${formatBytes(fileSize)}`;
            previewFileSize.classList.remove('hidden');
        } else {
            previewFileSize.classList.add('hidden');
        }
    }

    /**
     * Processes the uploaded image, sets original dimensions, and displays controls.
     * @param {File} file - The image file to process.
     */
    async function processImage(file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                alert('Please upload a valid image file.');
                resetTool();
                reject('Invalid file type');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img;
                    originalWidth = img.width;
                    originalHeight = img.height;

                    originalDimsSpan.textContent = `${originalWidth}x${originalHeight}px`;
                    originalFileSizeSpan.textContent = formatBytes(file.size);

                    // Set initial dimensions to original width/height
                    widthInput.value = originalWidth;
                    heightInput.value = originalHeight;
                    
                    dropZone.classList.add('hidden');
                    imageControls.classList.remove('hidden');
                    resizeAndDownloadBtn.classList.remove('hidden');
                    resetBtn.classList.remove('hidden');
                    
                    // Immediately generate a preview with current settings
                    renderPreview();
                    resolve();
                };
                img.onerror = () => {
                    alert('Could not load image. Please try another file.');
                    resetTool();
                    reject('Image load error');
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                alert('Error reading file. Please try again.');
                resetTool();
                reject('File read error');
            };
            reader.readAsDataURL(file);
        });
    }

    /**
     * Renders the image preview based on current settings.
     */
    function renderPreview() {
        if (!originalImage) {
            imagePreview.classList.add('hidden');
            updatePreviewInfo(0, 0, 0);
            return;
        }

        let targetWidth = parseFloat(widthInput.value);
        let targetHeight = parseFloat(heightInput.value);

        // Handle percentage resizing
        if (currentUnit === '%') {
            if (isNaN(targetWidth) || targetWidth <= 0) targetWidth = 100;
            if (isNaN(targetHeight) || targetHeight <= 0) targetHeight = 100;

            targetWidth = originalWidth * (targetWidth / 100);
            targetHeight = originalHeight * (targetHeight / 100);
        }

        // Handle aspect ratio lock
        if (lockAspectCheckbox.checked) {
            if (isNaN(targetWidth) && isNaN(targetHeight)) {
                targetWidth = originalWidth;
                targetHeight = originalHeight;
            } else if (isNaN(targetWidth) || targetWidth <= 0) { // Only height is valid
                targetWidth = (targetHeight / originalHeight) * originalWidth;
            } else if (isNaN(targetHeight) || targetHeight <= 0) { // Only width is valid
                targetHeight = (targetWidth / originalWidth) * originalHeight;
            } else { // Both width and height provided, but aspect ratio locked
                // Prioritize width and adjust height
                targetHeight = (targetWidth / originalWidth) * originalHeight;
            }
            // Update input fields to reflect calculated dimensions
            widthInput.value = Math.round(targetWidth);
            heightInput.value = Math.round(targetHeight);
        } else { // Aspect ratio not locked
             if (isNaN(targetWidth) || targetWidth <= 0) targetWidth = originalWidth;
             if (isNaN(targetHeight) || targetHeight <= 0) targetHeight = originalHeight;
        }

        // Ensure dimensions are positive integers
        targetWidth = Math.max(1, Math.round(targetWidth));
        targetHeight = Math.max(1, Math.round(targetHeight));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw image (handle background for transparent images to JPG)
        if (outputFormatSelect.value === 'image/jpeg') {
            ctx.fillStyle = backgroundColorInput.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);

        // Get image data URL and update preview
        const quality = parseFloat(qualitySlider.value) / 100;
        const dataUrl = canvas.toDataURL(outputFormatSelect.value, quality);
        imagePreview.src = dataUrl;
        imagePreview.classList.remove('hidden');

        // Update preview info (file size requires converting to Blob)
        canvas.toBlob(blob => {
            updatePreviewInfo(targetWidth, targetHeight, blob ? blob.size : 0);
        }, outputFormatSelect.value, quality);
    }

    /**
     * Handles the download of the resized image.
     */
    function downloadResizedImage() {
        if (!originalImage) {
            alert('Please upload an image first!');
            return;
        }

        // Re-calculate dimensions for final output, ensuring consistency
        let targetWidth = parseFloat(widthInput.value);
        let targetHeight = parseFloat(heightInput.value);

        if (currentUnit === '%') {
            targetWidth = originalWidth * (targetWidth / 100);
            targetHeight = originalHeight * (targetHeight / 100);
        }

        if (lockAspectCheckbox.checked) {
            if (isNaN(targetWidth) && isNaN(targetHeight)) {
                targetWidth = originalWidth;
                targetHeight = originalHeight;
            } else if (isNaN(targetWidth) || targetWidth <= 0) {
                targetWidth = (targetHeight / originalHeight) * originalWidth;
            } else if (isNaN(targetHeight) || targetHeight <= 0) {
                targetHeight = (targetWidth / originalWidth) * originalHeight;
            } else {
                targetHeight = (targetWidth / originalWidth) * originalHeight;
            }
        } else {
             if (isNaN(targetWidth) || targetWidth <= 0) targetWidth = originalWidth;
             if (isNaN(targetHeight) || targetHeight <= 0) targetHeight = originalHeight;
        }

        targetWidth = Math.max(1, Math.round(targetWidth));
        targetHeight = Math.max(1, Math.round(targetHeight));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        if (outputFormatSelect.value === 'image/jpeg') {
            ctx.fillStyle = backgroundColorInput.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);

        const quality = parseFloat(qualitySlider.value) / 100;
        const format = outputFormatSelect.value;
        const extension = format.split('/')[1] === 'jpeg' ? 'jpg' : format.split('/')[1];
        const filename = `hangga_resized.${extension}`;

        canvas.toBlob(function(blob) {
            if (!blob) {
                alert('Failed to generate image for download.');
                return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up the object URL
        }, format, quality);
    }


    // --- Event Listeners ---

    // File input via click
    uploadButton.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            processImage(e.target.files[0]);
        }
    });

    // File input via drag & drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Prevent default to allow drop
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault(); // Prevent default to allow drop
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            processImage(e.dataTransfer.files[0]);
        }
    });

    // Dimension and Aspect Ratio changes
    widthInput.addEventListener('input', () => {
        if (lockAspectCheckbox.checked && originalWidth > 0) {
            const newWidth = parseFloat(widthInput.value);
            if (!isNaN(newWidth) && newWidth > 0) {
                heightInput.value = Math.round((newWidth / originalWidth) * originalHeight);
            }
        }
        renderPreview();
    });

    heightInput.addEventListener('input', () => {
        if (lockAspectCheckbox.checked && originalHeight > 0) {
            const newHeight = parseFloat(heightInput.value);
            if (!isNaN(newHeight) && newHeight > 0) {
                widthInput.value = Math.round((newHeight / originalHeight) * originalWidth);
            }
        }
        renderPreview();
    });

    lockAspectCheckbox.addEventListener('change', renderPreview);

    // Unit Toggles (px/%)
    unitToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Remove active from all, add to clicked
            unitToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            const newUnit = toggle.dataset.unit;
            if (newUnit === currentUnit) return; // No change needed if same unit
            
            currentUnit = newUnit;

            // Convert current input values if an image is loaded
            if (originalImage && widthInput.value && heightInput.value) {
                const currentWidth = parseFloat(widthInput.value);
                const currentHeight = parseFloat(heightInput.value);

                if (currentUnit === '%') {
                    // Convert px to %
                    widthInput.value = ((currentWidth / originalWidth) * 100).toFixed(2);
                    heightInput.value = ((currentHeight / originalHeight) * 100).toFixed(2);
                } else { // 'px'
                    // Convert % to px
                    widthInput.value = Math.round(originalWidth * (currentWidth / 100));
                    heightInput.value = Math.round(originalHeight * (currentHeight / 100));
                }
            }
            renderPreview();
        });
    });

    // Output settings changes
    outputFormatSelect.addEventListener('change', () => {
        // Show/hide background color input for JPG
        backgroundColorGroup.style.display = (outputFormatSelect.value === 'image/jpeg') ? 'flex' : 'none';
        renderPreview();
    });
    
    qualitySlider.addEventListener('input', () => {
        qualityValueSpan.textContent = qualitySlider.value;
        renderPreview();
    });

    backgroundColorInput.addEventListener('input', renderPreview);


    // Resize and Download Button
    resizeAndDownloadBtn.addEventListener('click', downloadResizedImage);

    // Reset Button
    resetBtn.addEventListener('click', resetTool);

    // Initial setup on load
    resetTool(); // Hide controls until image is loaded and reset all values
});
