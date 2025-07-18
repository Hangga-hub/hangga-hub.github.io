// script.js for tools/image-watermarker/

document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const imagePreviews = document.getElementById('imagePreviews'); // New element for previews
    const watermarkControls = document.getElementById('watermarkControls');
    const watermarkText = document.getElementById('watermarkText');
    const fontSizeInput = document.getElementById('fontSize');
    const textColorInput = document.getElementById('textColor');
    const textPositionSelect = document.getElementById('textPosition');
    const textOpacityInput = document.getElementById('textOpacity');
    const applyWatermarkBtn = document.getElementById('applyWatermarkBtn');
    const downloadAllBtn = document.getElementById('downloadAllBtn'); // New button for ZIP download
    const clearAllBtn = document.getElementById('clearAllBtn'); // Renamed clear button
    const messageBox = document.getElementById('messageBox');
    const loadingOverlay = document.getElementById('loadingOverlay'); // Loading indicator

    let uploadedImages = []; // Stores objects: { file, originalDataUrl, watermarkedDataUrl }

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

    // Function to draw an image and apply watermark to a given canvas
    // Returns a Promise that resolves with the data URL of the watermarked image
    function applyWatermarkToImage(image, text, fontSize, textColor, position, opacity) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext('2d');

            // Clear canvas and draw the original image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);

            // Apply watermark settings
            ctx.font = `${fontSize}px Arial`; // Using Arial as a common fallback font
            ctx.fillStyle = textColor;
            ctx.globalAlpha = opacity;

            let x, y;
            const padding = 20; // Padding from edges

            // Measure text width to help with positioning
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = fontSize; // Approximate height for positioning

            switch (position) {
                case 'top-left':
                    x = padding;
                    y = padding + textHeight; // Position below the top edge with padding
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'alphabetic';
                    break;
                case 'center':
                    x = canvas.width / 2;
                    y = canvas.height / 2;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    break;
                case 'bottom-right':
                    x = canvas.width - padding;
                    y = canvas.height - padding;
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'alphabetic';
                    break;
                default: // Default to bottom-right if invalid
                    x = canvas.width - padding;
                    y = canvas.height - padding;
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'alphabetic';
            }

            ctx.fillText(text, x, y);

            // Reset globalAlpha for future drawings
            ctx.globalAlpha = 1.0;

            // Resolve with the data URL
            resolve(canvas.toDataURL('image/png'));
        });
    }

    // Render image previews in the grid
    function renderImagePreviews() {
        imagePreviews.innerHTML = ''; // Clear existing previews
        if (uploadedImages.length > 0) {
            imagePreviews.style.display = 'grid';
            uploadedImages.forEach((imgObj, index) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.dataset.index = index; // Store index for deletion

                const imgElement = document.createElement('img');
                imgElement.src = imgObj.originalDataUrl;
                imgElement.alt = imgObj.file.name;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="ri-close-line"></i>';
                deleteBtn.title = 'Remove image';
                deleteBtn.addEventListener('click', () => removeImage(index));

                previewItem.appendChild(imgElement);
                previewItem.appendChild(deleteBtn);
                imagePreviews.appendChild(previewItem);
            });
        } else {
            imagePreviews.style.display = 'none';
        }
        updateToolState();
    }

    // Remove an image from the array and re-render previews
    function removeImage(indexToRemove) {
        uploadedImages.splice(indexToRemove, 1);
        renderImagePreviews(); // Re-render all previews
        showMessage('Image removed.', 'info');
    }

    // Update UI state based on whether images are loaded
    function updateToolState() {
        if (uploadedImages.length > 0) {
            watermarkControls.style.display = 'block';
            applyWatermarkBtn.style.display = 'inline-block';
            downloadAllBtn.style.display = 'inline-block';
            fileNameDisplay.textContent = `${uploadedImages.length} image(s) selected.`;
        } else {
            watermarkControls.style.display = 'none';
            applyWatermarkBtn.style.display = 'none';
            downloadAllBtn.style.display = 'none';
            fileNameDisplay.textContent = '';
        }
    }

    // Event listener for file input change (handles multiple files)
    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) {
            showMessage('No images selected.', 'info');
            return;
        }

        toggleLoading(true);
        const newImages = [];
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                showMessage(`Skipping non-image file: ${file.name}`, 'warning');
                continue;
            }
            try {
                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });

                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = dataUrl;
                });

                newImages.push({
                    file: file,
                    originalDataUrl: dataUrl,
                    imageElement: img, // Store the Image object
                    watermarkedDataUrl: null // Will be populated after watermark application
                });
            } catch (error) {
                console.error(`Error loading ${file.name}:`, error);
                showMessage(`Failed to load image: ${file.name}.`, 'error');
            }
        }

        uploadedImages = uploadedImages.concat(newImages); // Add new images to existing ones
        renderImagePreviews(); // Re-render all previews
        toggleLoading(false);
        showMessage(`${newImages.length} new image(s) loaded. Total: ${uploadedImages.length}.`, 'success');
    });

    // Apply watermark to all uploaded images
    applyWatermarkBtn.addEventListener('click', async () => {
        if (uploadedImages.length === 0) {
            showMessage('Please upload images first.', 'error');
            return;
        }

        toggleLoading(true);
        const text = watermarkText.value;
        const fontSize = parseInt(fontSizeInput.value);
        const textColor = textColorInput.value;
        const position = textPositionSelect.value;
        const opacity = parseFloat(textOpacityInput.value);

        if (!text) {
            showMessage('Watermark text cannot be empty.', 'error');
            toggleLoading(false);
            return;
        }
        if (isNaN(fontSize) || fontSize < 10 || fontSize > 200) {
            showMessage('Font size must be between 10 and 200.', 'error');
            toggleLoading(false);
            return;
        }

        let processedCount = 0;
        for (const imgObj of uploadedImages) {
            try {
                // Apply watermark and update the watermarkedDataUrl
                imgObj.watermarkedDataUrl = await applyWatermarkToImage(
                    imgObj.imageElement, text, fontSize, textColor, position, opacity
                );
                processedCount++;
            } catch (error) {
                console.error(`Error watermarking ${imgObj.file.name}:`, error);
                showMessage(`Failed to watermark: ${imgObj.file.name}.`, 'error');
            }
        }
        toggleLoading(false);
        showMessage(`Watermark applied to ${processedCount} image(s)!`, 'success');
    });

    // Download all watermarked images as a ZIP
    downloadAllBtn.addEventListener('click', async () => {
        if (uploadedImages.length === 0) {
            showMessage('No images to download.', 'info');
            return;
        }

        toggleLoading(true);
        const zip = new JSZip();
        let addedCount = 0;

        for (const imgObj of uploadedImages) {
            if (imgObj.watermarkedDataUrl) {
                // Remove the "data:image/png;base64," prefix
                const base64Data = imgObj.watermarkedDataUrl.split(',')[1];
                const originalFileName = imgObj.file.name;
                const fileNameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
                const newFileName = `${fileNameWithoutExt}_watermarked.png`; // Always save as PNG

                zip.file(newFileName, base64Data, { base64: true });
                addedCount++;
            } else {
                showMessage(`Image "${imgObj.file.name}" was not watermarked. Skipping.`, 'warning');
            }
        }

        if (addedCount > 0) {
            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    const url = URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'watermarked_images.zip';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url); // Clean up
                    toggleLoading(false);
                    showMessage(`Downloaded ${addedCount} watermarked image(s) as ZIP!`, 'success');
                })
                .catch(error => {
                    console.error("Error generating ZIP:", error);
                    toggleLoading(false);
                    showMessage('Error creating ZIP file.', 'error');
                });
        } else {
            toggleLoading(false);
            showMessage('No watermarked images available to download.', 'info');
        }
    });

    // Clear all images and reset UI
    clearAllBtn.addEventListener('click', () => {
        uploadedImages = [];
        imageUpload.value = ''; // Clear file input
        fileNameDisplay.textContent = '';
        imagePreviews.innerHTML = '';
        imagePreviews.style.display = 'none';
        watermarkText.value = 'Hangga Tools'; // Reset default
        fontSizeInput.value = '40'; // Reset default
        textColorInput.value = '#FFFFFF'; // Reset default
        textPositionSelect.value = 'bottom-right'; // Reset default
        textOpacityInput.value = '0.7'; // Reset default
        updateToolState(); // Hide controls and buttons
        showMessage('Cleared all images and settings.', 'info');
    });

    // Event listeners for watermark controls to trigger re-apply on change
    watermarkText.addEventListener('input', () => { if (uploadedImages.length > 0) showMessage('Settings changed. Click "Apply Watermark to All" to update images.', 'info'); });
    fontSizeInput.addEventListener('input', () => { if (uploadedImages.length > 0) showMessage('Settings changed. Click "Apply Watermark to All" to update images.', 'info'); });
    textColorInput.addEventListener('input', () => { if (uploadedImages.length > 0) showMessage('Settings changed. Click "Apply Watermark to All" to update images.', 'info'); });
    textPositionSelect.addEventListener('change', () => { if (uploadedImages.length > 0) showMessage('Settings changed. Click "Apply Watermark to All" to update images.', 'info'); });
    textOpacityInput.addEventListener('input', () => { if (uploadedImages.length > 0) showMessage('Settings changed. Click "Apply Watermark to All" to update images.', 'info'); });

    // Initial state update
    updateToolState();
});
