// script.js for tools/image-compressor/

document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const compressionControls = document.getElementById('compressionControls');
    const outputFormatSelect = document.getElementById('outputFormat');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualitySliderValue = document.getElementById('qualitySliderValue');
    const resizeWidthInput = document.getElementById('resizeWidth');
    const resizeHeightInput = document.getElementById('resizeHeight');
    const maintainAspectRatioCheckbox = document.getElementById('maintainAspectRatio');
    const compressBtn = document.getElementById('compressBtn');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const imagePreviews = document.getElementById('imagePreviews');
    const messageBox = document.getElementById('messageBox');
    const loadingOverlay = document.getElementById('loadingOverlay');

    let uploadedImages = []; // Stores objects: { file, originalDataUrl, originalSize, imageElement, compressedDataUrl, compressedSize }

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

    // Format bytes to a human-readable string
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Function to compress a single image
    async function compressImage(imgObj, format, quality, targetWidth, targetHeight, maintainAspect) {
        const image = imgObj.imageElement;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let drawWidth = image.naturalWidth;
        let drawHeight = image.naturalHeight;

        // Apply resizing if specified
        if ((targetWidth && targetWidth > 0) || (targetHeight && targetHeight > 0)) {
            if (maintainAspect) {
                const aspectRatio = image.naturalWidth / image.naturalHeight;
                if (targetWidth && targetHeight) {
                    // Fit within both dimensions
                    if (targetWidth / targetHeight > aspectRatio) {
                        drawWidth = targetHeight * aspectRatio;
                        drawHeight = targetHeight;
                    } else {
                        drawWidth = targetWidth;
                        drawHeight = targetWidth / aspectRatio;
                    }
                } else if (targetWidth) {
                    drawWidth = targetWidth;
                    drawHeight = targetWidth / aspectRatio;
                } else if (targetHeight) {
                    drawHeight = targetHeight;
                    drawWidth = targetHeight * aspectRatio;
                }
            } else {
                // Ignore aspect ratio if not maintained
                if (targetWidth && targetWidth > 0) drawWidth = targetWidth;
                if (targetHeight && targetHeight > 0) drawHeight = targetHeight;
            }
        }

        canvas.width = drawWidth;
        canvas.height = drawHeight;

        // For PNG, ensure transparent background if original was transparent
        if (format === 'image/png' && imgObj.file.type === 'image/png') {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear to transparent
        } else {
            ctx.fillStyle = '#FFFFFF'; // Default background for JPG/WebP
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(image, 0, 0, drawWidth, drawHeight);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const dataUrl = URL.createObjectURL(blob);
                resolve({ dataUrl, blob, size: blob.size });
            }, format, quality);
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
                previewItem.dataset.index = index;

                const imgElement = document.createElement('img');
                imgElement.src = imgObj.compressedDataUrl || imgObj.originalDataUrl; // Show compressed if available
                imgElement.alt = imgObj.file.name;

                const imageInfo = document.createElement('div');
                imageInfo.className = 'image-info';
                imageInfo.innerHTML = `
                    <span class="original-size">Original: ${formatBytes(imgObj.originalSize)}</span>
                    ${imgObj.compressedSize ? `<span class="compressed-size">Compressed: ${formatBytes(imgObj.compressedSize)}</span>` : ''}
                    ${imgObj.compressedSize && imgObj.originalSize ? `<span class="size-reduction">Reduction: ${((1 - imgObj.compressedSize / imgObj.originalSize) * 100).toFixed(2)}%</span>` : ''}
                `;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="ri-close-line"></i>';
                deleteBtn.title = 'Remove image';
                deleteBtn.addEventListener('click', () => removeImage(index));

                const downloadSingleBtn = document.createElement('a');
                downloadSingleBtn.className = 'button button-secondary download-single-btn';
                downloadSingleBtn.textContent = 'Download';
                downloadSingleBtn.style.display = imgObj.compressedDataUrl ? 'block' : 'none'; // Only show if compressed
                downloadSingleBtn.href = imgObj.compressedDataUrl || '#';
                downloadSingleBtn.download = `compressed_${imgObj.file.name.replace(/\.[^/.]+$/, "")}.${outputFormatSelect.value.split('/')[1]}`; // Set dynamic download name

                previewItem.appendChild(imgElement);
                previewItem.appendChild(imageInfo);
                previewItem.appendChild(deleteBtn);
                previewItem.appendChild(downloadSingleBtn);
                imagePreviews.appendChild(previewItem);
            });
        } else {
            imagePreviews.style.display = 'none';
        }
        updateToolState();
    }

    // Remove an image from the array and re-render previews
    function removeImage(indexToRemove) {
        // Revoke Object URLs to free up memory
        if (uploadedImages[indexToRemove].originalDataUrl) {
            URL.revokeObjectURL(uploadedImages[indexToRemove].originalDataUrl);
        }
        if (uploadedImages[indexToRemove].compressedDataUrl) {
            URL.revokeObjectURL(uploadedImages[indexToRemove].compressedDataUrl);
        }

        uploadedImages.splice(indexToRemove, 1);
        renderImagePreviews(); // Re-render all previews
        showMessage('Image removed.', 'info');
    }

    // Update UI state based on whether images are loaded
    function updateToolState() {
        if (uploadedImages.length > 0) {
            compressionControls.style.display = 'block';
            compressBtn.style.display = 'inline-block';
            downloadAllBtn.style.display = 'inline-block';
            fileNameDisplay.textContent = `${uploadedImages.length} image(s) selected.`;
        } else {
            compressionControls.style.display = 'none';
            compressBtn.style.display = 'none';
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
                    originalSize: file.size,
                    imageElement: img,
                    compressedDataUrl: null,
                    compressedSize: null,
                    compressedBlob: null // For ZIP
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

    // Update quality slider value display
    qualitySlider.addEventListener('input', () => {
        qualitySliderValue.textContent = `${Math.round(qualitySlider.value * 100)}%`;
    });

    // Handle quality slider visibility based on format
    outputFormatSelect.addEventListener('change', () => {
        const selectedFormat = outputFormatSelect.value;
        if (selectedFormat === 'image/png') {
            qualitySlider.parentElement.style.display = 'none'; // Hide quality for PNG
        } else {
            qualitySlider.parentElement.style.display = 'flex'; // Show for JPG/WebP
        }
    });
    // Initial call to set visibility
    outputFormatSelect.dispatchEvent(new Event('change'));

    // Compress all uploaded images
    compressBtn.addEventListener('click', async () => {
        if (uploadedImages.length === 0) {
            showMessage('Please upload images first.', 'error');
            return;
        }

        toggleLoading(true);
        const format = outputFormatSelect.value;
        const quality = parseFloat(qualitySlider.value);
        const resizeWidth = parseInt(resizeWidthInput.value) || null;
        const resizeHeight = parseInt(resizeHeightInput.value) || null;
        const maintainAspect = maintainAspectRatioCheckbox.checked;

        let processedCount = 0;
        for (const imgObj of uploadedImages) {
            try {
                const { dataUrl, blob, size } = await compressImage(
                    imgObj.imageElement, format, quality, resizeWidth, resizeHeight, maintainAspect
                );
                imgObj.compressedDataUrl = dataUrl;
                imgObj.compressedSize = size;
                imgObj.compressedBlob = blob;
                processedCount++;
            } catch (error) {
                console.error(`Error compressing ${imgObj.file.name}:`, error);
                showMessage(`Failed to compress: ${imgObj.file.name}.`, 'error');
            }
        }
        renderImagePreviews(); // Update previews with compressed info
        toggleLoading(false);
        showMessage(`Compressed ${processedCount} image(s)!`, 'success');
    });

    // Download all compressed images as a ZIP
    downloadAllBtn.addEventListener('click', async () => {
        if (uploadedImages.length === 0) {
            showMessage('No images to download.', 'info');
            return;
        }

        const imagesToZip = uploadedImages.filter(img => img.compressedBlob);
        if (imagesToZip.length === 0) {
            showMessage('No compressed images available to download. Please compress them first.', 'info');
            return;
        }

        toggleLoading(true);
        const zip = new JSZip();
        const outputExt = outputFormatSelect.value.split('/')[1]; // e.g., 'jpeg', 'png', 'webp'

        imagesToZip.forEach(imgObj => {
            const originalFileName = imgObj.file.name;
            const fileNameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
            const newFileName = `${fileNameWithoutExt}_compressed.${outputExt}`;

            zip.file(newFileName, imgObj.compressedBlob);
        });

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                saveAs(content, `compressed_images_${Date.now()}.${outputExt === 'jpeg' ? 'zip' : outputExt === 'png' ? 'zip' : 'zip'}`); // Fallback to zip
                toggleLoading(false);
                showMessage(`Downloaded ${imagesToZip.length} compressed image(s) as ZIP!`, 'success');
            })
            .catch(error => {
                console.error("Error generating ZIP:", error);
                toggleLoading(false);
                showMessage('Error creating ZIP file.', 'error');
            });
    });

    // Clear all images and reset UI
    clearAllBtn.addEventListener('click', () => {
        uploadedImages.forEach(imgObj => {
            if (imgObj.originalDataUrl) URL.revokeObjectURL(imgObj.originalDataUrl);
            if (imgObj.compressedDataUrl) URL.revokeObjectURL(imgObj.compressedDataUrl);
        });
        uploadedImages = [];
        imageUpload.value = ''; // Clear file input
        fileNameDisplay.textContent = '';
        imagePreviews.innerHTML = '';
        imagePreviews.style.display = 'none';
        outputFormatSelect.value = 'image/jpeg'; // Reset default
        qualitySlider.value = '0.8'; // Reset default
        qualitySliderValue.textContent = '80%'; // Reset display
        resizeWidthInput.value = '';
        resizeHeightInput.value = '';
        maintainAspectRatioCheckbox.checked = true;
        updateToolState(); // Hide controls and buttons
        showMessage('Cleared all images and settings.', 'info');
    });

    // Initial state update
    updateToolState();
});
