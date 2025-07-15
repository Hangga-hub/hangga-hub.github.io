// tools/jpg-png-to-pdf/script.js

// Ensure jsPDF is loaded before this script runs
// window.jsPDF is available globally after the CDN script loads

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the correct page
    if (!document.querySelector('.tool-image-to-pdf')) {
        return;
    }

    // Get DOM elements
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const uploadButton = dropZone.querySelector('.upload-btn');
    const imagePreviewsContainer = document.getElementById('imagePreviewsContainer');
    const imagePreviewsGrid = document.getElementById('imagePreviewsGrid');
    const pdfSettings = document.getElementById('pdfSettings');
    const outputFilenameInput = document.getElementById('outputFilename');
    const pageSizeSelect = document.getElementById('pageSize');
    const orientationSelect = document.getElementById('orientation');
    const imageMarginInput = document.getElementById('imageMargin');
    const imageScalingSelect = document.getElementById('imageScaling'); // New
    const pdfImageQualitySlider = document.getElementById('pdfImageQuality'); // New
    const pdfImageQualityValueSpan = document.getElementById('pdfImageQualityValue'); // New
    const convertToPdfBtn = document.getElementById('convertToPdfBtn');
    const resetBtn = document.getElementById('resetBtn');
    const conversionProgress = document.getElementById('conversionProgress'); // New
    const progressBar = conversionProgress.querySelector('.progress-bar'); // New
    const progressText = conversionProgress.querySelector('#progressText'); // New

    let uploadedImages = []; // Array to store image data (dataURL and original file)
    let draggedItem = null; // For drag-and-drop reordering

    // Define PDF page dimensions in mm
    const pageSizes = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
        legal: { width: 216, height: 356 }
    };

    // --- Helper Functions ---

    /**
     * Resets the tool to its initial state.
     */
    function resetTool() {
        uploadedImages = [];
        imageInput.value = ''; // Clear file input
        imagePreviewsGrid.innerHTML = ''; // Clear previews
        dropZone.classList.remove('hidden');
        imagePreviewsContainer.classList.add('hidden');
        pdfSettings.classList.add('hidden');
        convertToPdfBtn.classList.add('hidden');
        resetBtn.classList.add('hidden');
        conversionProgress.classList.add('hidden'); // Hide progress bar
        progressBar.style.width = '0%';
        progressText.textContent = '0/0 Images Processed';

        // Reset settings to default
        outputFilenameInput.value = 'document.pdf';
        pageSizeSelect.value = 'a4';
        orientationSelect.value = 'portrait';
        imageMarginInput.value = '10';
        imageScalingSelect.value = 'fit'; // Default scaling
        pdfImageQualitySlider.value = 0.8; // Default quality
        pdfImageQualityValueSpan.textContent = '0.8';
    }

    /**
     * Updates the visibility of sections based on uploaded images.
     */
    function updateVisibility() {
        if (uploadedImages.length > 0) {
            imagePreviewsContainer.classList.remove('hidden');
            pdfSettings.classList.remove('hidden');
            convertToPdfBtn.classList.remove('hidden');
            resetBtn.classList.remove('hidden');
            dropZone.classList.add('hidden'); // Hide drop zone once images are uploaded
        } else {
            resetTool(); // If no images, reset completely
        }
    }

    /**
     * Adds an image to the preview grid.
     * @param {string} dataURL - Data URL of the image.
     * @param {File} file - The original File object.
     */
    function addImageToPreview(dataURL, file) {
        const item = document.createElement('div');
        item.classList.add('image-preview-item');
        item.setAttribute('draggable', 'true'); // Make it draggable

        const img = document.createElement('img');
        img.src = dataURL;
        img.alt = file.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="ri-close-line"></i>';
        deleteBtn.title = 'Remove image';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag start event
            const index = uploadedImages.findIndex(imgData => imgData.dataURL === dataURL);
            if (index > -1) {
                uploadedImages.splice(index, 1);
                item.remove(); // Remove from DOM
                updateVisibility();
            }
        });

        item.appendChild(img);
        item.appendChild(deleteBtn);
        imagePreviewsGrid.appendChild(item);

        // Store dataURL, original file, and a reference to the HTML element
        uploadedImages.push({ dataURL, file, element: item }); 

        updateVisibility();
    }

    /**
     * Handles file processing from input or drag-and-drop.
     * @param {FileList} files - List of files to process.
     */
    async function handleFiles(files) {
        for (const file of files) {
            if (file.type.startsWith('image/jpeg') || file.type.startsWith('image/png')) {
                // Check for duplicates before adding
                const isDuplicate = uploadedImages.some(imgData => 
                    imgData.file.name === file.name && imgData.file.size === file.size
                );
                if (isDuplicate) {
                    console.warn(`Skipping duplicate file: ${file.name}`);
                    continue;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    addImageToPreview(e.target.result, file);
                };
                reader.onerror = () => {
                    alert(`Failed to read file: ${file.name}`);
                };
                reader.readAsDataURL(file);
            } else {
                alert(`Skipping unsupported file: ${file.name}. Only JPG and PNG are supported.`);
            }
        }
    }

    /**
     * Converts uploaded images to a PDF document.
     */
    async function convertToPdf() {
        if (uploadedImages.length === 0) {
            alert('Please upload at least one image to convert.');
            return;
        }

        convertToPdfBtn.disabled = true;
        convertToPdfBtn.innerHTML = 'Converting... <span class="spinner"></span>';
        conversionProgress.classList.remove('hidden'); // Show progress bar

        const outputFilename = outputFilenameInput.value || 'document.pdf';
        const pageSize = pageSizeSelect.value;
        const orientation = orientationSelect.value;
        const imageMargin = parseFloat(imageMarginInput.value); // in mm
        const imageScaling = imageScalingSelect.value; // 'fit', 'fill', 'original'
        const pdfImageQuality = parseFloat(pdfImageQualitySlider.value); // 0.0 to 1.0

        // Initialize jsPDF
        const doc = new window.jspdf.jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: pageSize
        });

        // Get page dimensions based on selected format and orientation
        let pageWidth, pageHeight;
        if (orientation === 'portrait') {
            pageWidth = pageSizes[pageSize].width;
            pageHeight = pageSizes[pageSize].height;
        } else { // landscape
            pageWidth = pageSizes[pageSize].height;
            pageHeight = pageSizes[pageSize].width;
        }

        // Calculate available area for image after margins
        const availableWidth = pageWidth - (imageMargin * 2);
        const availableHeight = pageHeight - (imageMargin * 2);

        // Process images in their current order in the DOM (reflecting user reorder)
        // Ensure uploadedImages array is in sync with DOM order
        const currentOrderedImages = Array.from(imagePreviewsGrid.children).map(item => {
            const imgElement = item.querySelector('img');
            return uploadedImages.find(imgData => imgData.dataURL === imgElement.src);
        }).filter(Boolean); // Filter out any nulls if an image somehow wasn't found

        for (let i = 0; i < currentOrderedImages.length; i++) {
            const imgData = currentOrderedImages[i];
            const img = new Image();
            img.src = imgData.dataURL;

            // Wait for image to load to get natural dimensions
            await new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve; // Resolve even on error to prevent blocking
            });

            if (!img.naturalWidth || !img.naturalHeight) {
                console.warn(`Could not load dimensions for image: ${imgData.file.name}. Skipping.`);
                continue;
            }

            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            let finalImgWidth, finalImgHeight;
            const imgAspectRatio = imgWidth / imgHeight;
            const pageAspectRatio = availableWidth / availableHeight;

            if (imageScaling === 'fit') {
                // Fit to page, maintain aspect ratio
                if (imgAspectRatio > pageAspectRatio) {
                    finalImgWidth = availableWidth;
                    finalImgHeight = availableWidth / imgAspectRatio;
                } else {
                    finalImgHeight = availableHeight;
                    finalImgWidth = availableHeight * imgAspectRatio;
                }
            } else if (imageScaling === 'fill') {
                // Fill page, crop if necessary
                if (imgAspectRatio > pageAspectRatio) {
                    finalImgHeight = availableHeight;
                    finalImgWidth = availableHeight * imgAspectRatio;
                } else {
                    finalImgWidth = availableWidth;
                    finalImgHeight = availableWidth / imgAspectRatio;
                }
            } else { // 'original'
                // Use original size, may clip
                finalImgWidth = imgWidth;
                finalImgHeight = imgHeight;
            }

            // Ensure image dimensions are within available space if 'fit' or 'fill'
            // For 'original', it might exceed, which is expected by the user choosing 'original'
            if (imageScaling !== 'original') {
                if (finalImgWidth > availableWidth) {
                    finalImgWidth = availableWidth;
                    finalImgHeight = availableWidth / imgAspectRatio;
                }
                if (finalImgHeight > availableHeight) {
                    finalImgHeight = availableHeight;
                    finalImgWidth = availableHeight * imgAspectRatio;
                }
            }

            // Center the image on the page
            const x = imageMargin + (availableWidth - finalImgWidth) / 2;
            const y = imageMargin + (availableHeight - finalImgHeight) / 2;

            if (i > 0) {
                doc.addPage(); // Add a new page for each subsequent image
            }
            
            // Add image to PDF with specified quality
            doc.addImage(img.src, 'JPEG', x, y, finalImgWidth, finalImgHeight, null, null, pdfImageQuality);

            // Update progress bar
            const progress = ((i + 1) / currentOrderedImages.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${i + 1}/${currentOrderedImages.length} Images Processed`;
        }

        // Save the PDF
        doc.save(outputFilename);

        convertToPdfBtn.disabled = false;
        convertToPdfBtn.innerHTML = 'Convert to PDF <i class="ri-file-pdf-line"></i>';
        conversionProgress.classList.add('hidden'); // Hide progress bar after conversion
        progressBar.style.width = '0%'; // Reset progress bar
        progressText.textContent = '0/0 Images Processed';
    }


    // --- Drag and Drop Reordering Logic ---
    let dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this; // 'this' is the item being dragged
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML); // Store content for reordering
        this.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDragEnter(e) {
        this.classList.add('drag-over'); // Visual cue for target
    }

    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.stopPropagation(); // Stop propagation to avoid parent listeners
        this.classList.remove('drag-over');

        if (dragSrcEl !== this) {
            // Get the current order of elements
            const items = Array.from(imagePreviewsGrid.children);
            const srcIndex = items.indexOf(dragSrcEl);
            const targetIndex = items.indexOf(this);

            // Reorder the actual DOM elements
            if (srcIndex < targetIndex) {
                imagePreviewsGrid.insertBefore(dragSrcEl, this.nextSibling);
            } else {
                imagePreviewsGrid.insertBefore(dragSrcEl, this);
            }

            // Reorder the uploadedImages array to match DOM
            const [removed] = uploadedImages.splice(srcIndex, 1);
            uploadedImages.splice(targetIndex, 0, removed);
        }
        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        // Remove 'drag-over' from all items in case dragEnd fires without drop
        document.querySelectorAll('.image-preview-item').forEach(item => {
            item.classList.remove('drag-over');
        });
    }

    // Attach drag-and-drop listeners to dynamically added items
    function addDragListeners(item) {
        item.addEventListener('dragstart', handleDragStart, false);
        item.addEventListener('dragenter', handleDragEnter, false);
        item.addEventListener('dragover', handleDragOver, false);
        item.addEventListener('dragleave', handleDragLeave, false);
        item.addEventListener('drop', handleDrop, false);
        item.addEventListener('dragend', handleDragEnd, false);
    }

    // Observe changes in the imagePreviewsGrid to attach drag listeners to new items
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('image-preview-item')) {
                        addDragListeners(node);
                    }
                });
            }
        });
    });
    observer.observe(imagePreviewsGrid, { childList: true });


    // --- Event Listeners ---

    // File input via click
    uploadButton.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    // File input via drag & drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // Update quality value display
    pdfImageQualitySlider.addEventListener('input', () => {
        pdfImageQualityValueSpan.textContent = pdfImageQualitySlider.value;
    });

    // Convert to PDF button
    convertToPdfBtn.addEventListener('click', convertToPdf);

    // Reset button
    resetBtn.addEventListener('click', resetTool);

    // Initial setup on load
    resetTool();
});
