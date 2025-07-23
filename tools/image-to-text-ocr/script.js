// script.js for Image to Text (OCR)

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const imageUpload = document.getElementById("imageUpload");
    const imagePreview = document.getElementById("imagePreview");
    const imagePlaceholder = document.getElementById("imagePlaceholder");
    const recognizeBtn = document.getElementById("recognizeBtn");
    const clearBtn = document.getElementById("clearBtn");
    const extractedTextarea = document.getElementById("extractedText");
    const copyTextBtn = document.getElementById("copyTextBtn");
    const messageBox = document.getElementById("messageBox");
    const progressBarContainer = document.getElementById("progressBarContainer");
    const progressBar = document.getElementById("progressBar");

    let selectedImageFile = null;
    let worker = null; // Tesseract.js worker instance
    let isWorkerReady = false; // Flag to track if the Tesseract worker is fully loaded and initialized

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("error", "show"); // Reset classes
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");
        // Automatically hide the message after 3 seconds, but keep critical errors visible longer
        const hideDelay = isError ? 5000 : 3000;
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, hideDelay);
    }

    /**
     * Updates the state of the Recognize button based on image selection and worker readiness.
     */
    function updateRecognizeButtonState() {
        recognizeBtn.disabled = !(selectedImageFile && isWorkerReady);
    }

    /**
     * Initializes the Tesseract.js worker.
     * This function now handles all loading and initialization steps.
     */
    async function initializeTesseractWorker() {
        if (worker && isWorkerReady) {
            console.log("Tesseract worker already initialized and ready.");
            return; // Worker already initialized and ready
        }
        if (worker) {
            // Worker exists but might not be fully ready, or was previously failed. Terminate and restart.
            console.warn("Existing Tesseract worker found, terminating and re-initializing.");
            await worker.terminate();
            worker = null;
            isWorkerReady = false;
        }

        showMessage("Loading OCR engine (this may take a moment)...", false);
        progressBarContainer.classList.add("show");
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        updateRecognizeButtonState(); // Disable recognize button during loading

        try {
            // Create worker
            worker = await Tesseract.createWorker('eng', 1, {
                logger: m => {
                    // Log progress messages
                    if (m.status === 'recognizing' || m.status === 'loading tesseract core' || m.status === 'initializing tesseract' || m.status === 'loading language traineddata') {
                        const progress = Math.round(m.progress * 100);
                        progressBar.style.width = `${progress}%`;
                        progressBar.textContent = `${progress}%`;
                        showMessage(`OCR Progress: ${m.status} (${progress}%)`);
                    } else {
                        console.log(m.status); // Log other status messages for debugging
                    }
                }
            });

            // Load language data
            await worker.loadLanguage('eng');
            // Initialize Tesseract
            await worker.initialize('eng');

            isWorkerReady = true;
            showMessage("OCR engine loaded and ready!");
            progressBarContainer.classList.remove("show"); // Hide progress bar on completion
            updateRecognizeButtonState(); // Re-enable if image is selected
        } catch (error) {
            console.error("Failed to load or initialize Tesseract OCR engine:", error);
            showMessage("Failed to load OCR engine. Please check your internet connection and try again.", true);
            progressBarContainer.classList.remove("show");
            worker = null; // Reset worker if initialization fails
            isWorkerReady = false;
            updateRecognizeButtonState(); // Keep disabled
        }
    }

    /**
     * Handles image file selection.
     */
    imageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            // Basic file type validation
            if (!file.type.startsWith('image/')) {
                showMessage("Please upload an image file (e.g., JPG, PNG).", true);
                selectedImageFile = null;
                imageUpload.value = ""; // Clear file input
                imagePreview.src = "#";
                imagePreview.style.display = "none";
                imagePlaceholder.style.display = "block";
                clearBtn.disabled = true;
                updateRecognizeButtonState();
                return;
            }

            selectedImageFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
                imagePlaceholder.style.display = "none";
            };
            reader.readAsDataURL(file);

            clearBtn.disabled = false;
            extractedTextarea.value = ""; // Clear previous text
            copyTextBtn.disabled = true;
            showMessage(`Image selected: ${file.name}`);
            updateRecognizeButtonState(); // Update button state after image selection
        } else {
            selectedImageFile = null;
            imagePreview.src = "#";
            imagePreview.style.display = "none";
            imagePlaceholder.style.display = "block";

            clearBtn.disabled = true;
            extractedTextarea.value = "";
            copyTextBtn.disabled = true;
            showMessage("No image selected.");
            updateRecognizeButtonState(); // Update button state
        }
    });

    /**
     * Performs OCR on the selected image.
     */
    recognizeBtn.addEventListener("click", async () => {
        if (!selectedImageFile) {
            showMessage("Please select an image first.", true);
            return;
        }
        if (!isWorkerReady) {
            showMessage("OCR engine is not ready. Please wait a moment or refresh the page.", true);
            // Attempt to re-initialize if not ready, but don't block the current click handler
            initializeTesseractWorker();
            return;
        }

        recognizeBtn.disabled = true;
        clearBtn.disabled = true;
        copyTextBtn.disabled = true;
        extractedTextarea.value = "Processing image, please wait...";
        progressBarContainer.classList.add("show");
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        showMessage("Starting OCR...", false);

        try {
            const { data: { text } } = await worker.recognize(selectedImageFile);
            extractedTextarea.value = text;
            copyTextBtn.disabled = false;
            showMessage("Text extracted successfully!");
        } catch (error) {
            console.error("OCR Recognition Error:", error);
            extractedTextarea.value = "Error during OCR processing. Please try another image or ensure text is clear.";
            showMessage("OCR failed: " + error.message, true);
        } finally {
            recognizeBtn.disabled = false;
            clearBtn.disabled = false;
            progressBarContainer.classList.remove("show");
            updateRecognizeButtonState(); // Ensure button state is correct after process
        }
    });

    /**
     * Clears the image preview and extracted text.
     */
    clearBtn.addEventListener("click", () => {
        selectedImageFile = null;
        imageUpload.value = ""; // Clear file input
        imagePreview.src = "#";
        imagePreview.style.display = "none";
        imagePlaceholder.style.display = "block";
        extractedTextarea.value = "";
        copyTextBtn.disabled = true;
        progressBarContainer.classList.remove("show");
        showMessage("Cleared image and text.");
        updateRecognizeButtonState(); // Update button state
    });

    /**
     * Copies the extracted text to the clipboard.
     */
    copyTextBtn.addEventListener("click", () => {
        if (extractedTextarea.value) {
            // Use execCommand for broader compatibility within iframes
            extractedTextarea.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'Text copied to clipboard!' : 'Failed to copy text.' + (successful ? '' : ' Please copy manually.');
                showMessage(msg, !successful);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showMessage('Copying not supported or failed in this browser. Please copy manually.', true);
            }
        } else {
            showMessage("No text to copy.", true);
        }
    });

    // Initial setup: Initialize Tesseract worker when the page loads
    initializeTesseractWorker();
    updateRecognizeButtonState(); // Set initial button state
});
