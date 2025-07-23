// script.js for Favicon Preview Tool

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const faviconUploadInput = document.getElementById("faviconUpload");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const messageBox = document.getElementById("messageBox");

    // Define the preview elements by their IDs and desired sizes
    const previewElements = [
        { id: "preview16", size: 16 },
        { id: "preview32", size: 32 },
        { id: "previewDark", size: 32 }, // Dark mode simulation
        { id: "previewLight", size: 32 }, // Light mode simulation
        { id: "preview48", size: 48 },
        { id: "preview64", size: 64 },
        { id: "previewiOS57", size: 57 }, // iOS specific sizes
        { id: "previewiOS120", size: 120 },
        { id: "previewiOS180", size: 180 },
    ];

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
     * Renders the uploaded image into all preview containers.
     * @param {string} imageDataUrl - The Data URL of the uploaded image.
     */
    function renderPreviews(imageDataUrl) {
        previewElements.forEach(item => {
            const container = document.getElementById(item.id);
            if (container) {
                // Clear existing image if any
                container.innerHTML = '';

                // Create a new image element
                const img = document.createElement('img');
                img.src = imageDataUrl;
                img.alt = `Favicon Preview ${item.size}x${item.size}`;
                // Set explicit width and height for consistency, CSS will handle scaling within container
                img.style.width = `${item.size}px`;
                img.style.height = `${item.size}px`;

                container.appendChild(img);
            }
        });
        clearAllBtn.disabled = false;
        showMessage("Favicon preview updated!");
    }

    /**
     * Clears the file input, all preview images, and messages.
     */
    function clearAll() {
        faviconUploadInput.value = ''; // Clear the selected file
        previewElements.forEach(item => {
            const container = document.getElementById(item.id);
            if (container) {
                container.innerHTML = ''; // Remove image from container
            }
        });
        clearAllBtn.disabled = true;
        messageBox.classList.remove("show", "error");
        messageBox.textContent = "";
        showMessage("Previews cleared. Upload a new image.", false);
    }

    // --- Event Listeners ---
    faviconUploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        if (!file) {
            clearAll(); // Clear if no file is selected (e.g., user cancels)
            return;
        }

        // Basic file type validation
        if (!file.type.startsWith('image/')) {
            showMessage("Please upload an image file (e.g., PNG, JPG, SVG, ICO).", true);
            clearAllBtn.disabled = true;
            faviconUploadInput.value = ''; // Clear invalid file
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            renderPreviews(e.target.result);
        };

        reader.onerror = () => {
            showMessage("Failed to read file. Please try again.", true);
            clearAllBtn.disabled = true;
        };

        reader.readAsDataURL(file); // Read the file as a Data URL
    });

    clearAllBtn.addEventListener("click", clearAll);

    // Initial state setup
    clearAllBtn.disabled = true;
});
