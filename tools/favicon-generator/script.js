// script.js for tools/favicon-generator/

document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const generateFaviconsBtn = document.getElementById('generateFaviconsBtn');
    const previewArea = document.getElementById('previewArea');
    const messageBox = document.getElementById('messageBox');

    let uploadedImage = null; // Stores the uploaded image object

    // Define standard favicon sizes (in pixels)
    const faviconSizes = [16, 32, 48, 64, 192, 512];

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

    // Trigger file input click when upload button is clicked
    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    // Handle image file selection
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            fileNameDisplay.textContent = `Selected: ${file.name}`;
            showMessage('Image selected. Click "Generate Favicons" to proceed.', 'info');
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    uploadedImage = img;
                    // Clear previous previews if any
                    previewArea.innerHTML = '';
                    previewArea.style.display = 'none';
                };
                img.onerror = () => {
                    showMessage('Could not load image. Please try another file.', 'error');
                    uploadedImage = null;
                    fileNameDisplay.textContent = '';
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                showMessage('Error reading file.', 'error');
                uploadedImage = null;
                fileNameDisplay.textContent = '';
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = '';
            uploadedImage = null;
            showMessage('No image selected.', 'info');
        }
    });

    // Generate favicons
    generateFaviconsBtn.addEventListener('click', () => {
        if (!uploadedImage) {
            showMessage('Please upload an image first.', 'error');
            return;
        }

        previewArea.innerHTML = ''; // Clear previous favicons
        previewArea.style.display = 'grid'; // Show the grid

        let generatedCount = 0;
        faviconSizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Draw image centered and scaled to fit without distortion
            const aspectRatio = uploadedImage.width / uploadedImage.height;
            let drawWidth = size;
            let drawHeight = size;
            let offsetX = 0;
            let offsetY = 0;

            if (aspectRatio > 1) { // Image is wider than tall
                drawHeight = size / aspectRatio;
                offsetY = (size - drawHeight) / 2;
            } else if (aspectRatio < 1) { // Image is taller than wide
                drawWidth = size * aspectRatio;
                offsetX = (size - drawWidth) / 2;
            }
            // Fill background with white for transparent images
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);

            ctx.drawImage(uploadedImage, offsetX, offsetY, drawWidth, drawHeight);

            const dataUrl = canvas.toDataURL('image/png');

            // Create preview item
            const previewItem = document.createElement('div');
            previewItem.className = 'favicon-preview-item';

            const imgElement = document.createElement('img');
            imgElement.src = dataUrl;
            imgElement.alt = `Favicon ${size}x${size}`;
            imgElement.width = size;
            imgElement.height = size;

            const sizeText = document.createElement('p');
            sizeText.textContent = `${size}x${size} px`;

            const downloadBtn = document.createElement('a');
            downloadBtn.href = dataUrl;
            downloadBtn.download = `favicon-${size}x${size}.png`;
            downloadBtn.className = 'button button-secondary';
            downloadBtn.textContent = 'Download PNG';

            previewItem.appendChild(imgElement);
            previewItem.appendChild(sizeText);
            previewItem.appendChild(downloadBtn);
            previewArea.appendChild(previewItem);
            generatedCount++;
        });

        if (generatedCount > 0) {
            showMessage('Favicons generated! Download individual PNGs below.', 'success');
            // Add a note about .ico files
            const icoNote = document.createElement('p');
            icoNote.style.marginTop = '20px';
            icoNote.style.fontSize = '0.9rem';
            icoNote.style.color = 'rgba(238,238,238,0.6)';
            icoNote.innerHTML = '<strong>Note:</strong> For full browser compatibility, a single `.ico` file containing multiple sizes is ideal. This tool generates individual PNGs. You may need an external tool to combine these PNGs into a multi-resolution `.ico` file.';
            previewArea.appendChild(icoNote);
        } else {
            showMessage('No favicons could be generated. Please try a different image.', 'error');
            previewArea.style.display = 'none';
        }
    });
});
