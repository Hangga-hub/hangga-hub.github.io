// script.js for tools/favicon-generator/

document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const generateFaviconsBtn = document.getElementById('generateFaviconsBtn');
    const previewArea = document.getElementById('previewArea');
    const messageBox = document.getElementById('messageBox');
    const downloadAllBtnContainer = document.getElementById('downloadAllBtnContainer'); // Re-added
    const downloadAllFaviconsBtn = document.getElementById('downloadAllFaviconsBtn'); // Re-added

    let uploadedImage = null; // Stores the uploaded image object
    let generatedFaviconsData = {}; // Stores base64 data of generated favicons for zipping

    // Define standard favicon sizes (in pixels)
    // Added sizes for Android, Apple Touch Icon, and ICO target sizes
    const faviconSizes = [16, 32, 48, 64, 192, 512]; // General sizes for PNGs
    const icoSizes = [16, 32, 48, 64]; // Sizes to potentially include in the .ico file
    const androidChromeSizes = [192, 512];
    const appleTouchIconSize = 180; // Standard size for Apple Touch Icon

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
                    // Clear previous previews and hide download button
                    previewArea.innerHTML = ''; // Clear previews
                    previewArea.style.display = 'none'; // Hide preview area
                    downloadAllBtnContainer.style.display = 'none'; // Hide download button
                    // Ensure message box is hidden after new image selection
                    messageBox.style.display = 'none';
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

    // Generate favicons and show download button
    generateFaviconsBtn.addEventListener('click', () => {
        if (!uploadedImage) {
            showMessage('Please upload an image first.', 'error');
            return;
        }

        previewArea.innerHTML = ''; // Clear previous favicons
        previewArea.style.display = 'none'; // Hide the grid, as we're not showing individual images
        generatedFaviconsData = {}; // Reset generated data
        downloadAllBtnContainer.style.display = 'none'; // Hide download button until generation is complete

        let generatedCount = 0;

        const allRequiredSizes = new Set([
            ...faviconSizes,
            ...androidChromeSizes,
            appleTouchIconSize,
            ...icoSizes
        ]);

        allRequiredSizes.forEach(size => {
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

            // Store data for zipping
            let fileName = `favicon-${size}x${size}.png`;
            if (size === 192 && androidChromeSizes.includes(size)) {
                fileName = `android-chrome-${size}x${size}.png`;
            } else if (size === 512 && androidChromeSizes.includes(size)) {
                fileName = `android-chrome-${size}x${size}.png`;
            } else if (size === appleTouchIconSize) {
                fileName = `apple-touch-icon.png`;
            }
            // For the default favicon.ico, we'll use the 48x48 as the primary for now
            // A true .ico would embed multiple sizes. Here we just name a PNG as .ico
            if (size === 48) {
                generatedFaviconsData['favicon.ico'] = dataUrl.split(',')[1];
            }
            generatedFaviconsData[fileName] = dataUrl.split(',')[1];

            // No longer creating individual preview items here
            generatedCount++;
        });

        // Generate site.webmanifest
        const webManifest = {
            "name": "My Website", // Placeholder, ideally user editable
            "short_name": "Website", // Placeholder, ideally user editable
            "icons": [],
            "theme_color": "#ffffff", // Placeholder
            "background_color": "#ffffff", // Placeholder
            "display": "standalone"
        };

        // Add icons to web manifest based on generated data
        androidChromeSizes.forEach(size => {
            if (generatedFaviconsData[`android-chrome-${size}x${size}.png`]) {
                webManifest.icons.push({
                    "src": `android-chrome-${size}x${size}.png`,
                    "sizes": `${size}x${size}`,
                    "type": "image/png"
                });
            }
        });
        if (generatedFaviconsData['apple-touch-icon.png']) {
            webManifest.icons.push({
                "src": `apple-touch-icon.png`,
                "sizes": `${appleTouchIconSize}x${appleTouchIconSize}`,
                "type": "image/png"
            });
        }
        faviconSizes.forEach(size => {
             if (generatedFaviconsData[`favicon-${size}x${size}.png`]) {
                webManifest.icons.push({
                    "src": `favicon-${size}x${size}.png`,
                    "sizes": `${size}x${size}`,
                    "type": "image/png"
                });
            }
        });


        generatedFaviconsData['site.webmanifest'] = btoa(unescape(encodeURIComponent(JSON.stringify(webManifest, null, 2))));


        if (generatedCount > 0) {
            showMessage('Favicons generated! Click "Download All Favicons" to get your package.', 'success');
            downloadAllBtnContainer.style.display = 'flex'; // Show the download all button

            const icoNote = document.createElement('p');
            icoNote.style.marginTop = '20px';
            icoNote.style.fontSize = '0.9rem';
            icoNote.style.color = 'rgba(238,238,238,0.6)';
            icoNote.innerHTML = '<strong>Note:</strong> The `favicon.ico` included is a 48x48 PNG renamed as .ico. For a true multi-resolution `.ico` file, a dedicated tool or server-side process is generally required.';
            previewArea.appendChild(icoNote); // Append note to preview area
            previewArea.style.display = 'block'; // Ensure preview area is visible for the note

        } else {
            showMessage('No favicons could be generated. Please try a different image.', 'error');
            previewArea.style.display = 'none';
            downloadAllBtnContainer.style.display = 'none';
        }
    });

    // Handle download all favicons
    downloadAllFaviconsBtn.addEventListener('click', () => {
        if (Object.keys(generatedFaviconsData).length === 0) {
            showMessage('No favicons to download. Please generate them first.', 'error');
            return;
        }

        const zip = new JSZip();

        for (const fileName in generatedFaviconsData) {
            if (Object.hasOwnProperty.call(generatedFaviconsData, fileName)) {
                zip.file(fileName, generatedFaviconsData[fileName], { base64: true });
            }
        }

        zip.generateAsync({ type: "blob" })
            .then(function(content) {
                saveAs(content, "favicons.zip");
                showMessage('Favicons downloaded successfully!', 'success');
            })
            .catch(e => {
                showMessage('Error creating zip file: ' + e.message, 'error');
                console.error('Error creating zip file:', e);
            });
    });
});
