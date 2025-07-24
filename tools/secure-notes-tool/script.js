document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const noteContentTextarea = document.getElementById("noteContent");
    const encryptionKeyInput = document.getElementById("encryptionKey");
    const encryptSaveBtn = document.getElementById("encryptSaveBtn");
    const decryptBtn = document.getElementById("decryptBtn");
    const clearCurrentBtn = document.getElementById("clearCurrentBtn");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const messageBox = document.getElementById("messageBox");
    const storageStatusSpan = document.getElementById("storageStatus");

    // Modal elements
    const confirmationModal = document.getElementById("confirmationModal");
    const modalMessage = document.getElementById("modalMessage");
    const confirmYesBtn = document.getElementById("confirmYes");
    const confirmNoBtn = document.getElementById("confirmNo");

    const LOCAL_STORAGE_KEY = "hangga_secure_note";

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("show", "error");
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");

        // Hide message after 5 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 5000);
    }

    /**
     * Shows the confirmation modal.
     * @param {string} message - The message to display in the modal.
     * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise.
     */
    function showConfirmationModal(message) {
        return new Promise((resolve) => {
            modalMessage.textContent = message;
            confirmationModal.classList.add("show");

            const handleYes = () => {
                confirmationModal.classList.remove("show");
                confirmYesBtn.removeEventListener("click", handleYes);
                confirmNoBtn.removeEventListener("click", handleNo);
                resolve(true);
            };

            const handleNo = () => {
                confirmationModal.classList.remove("show");
                confirmYesBtn.removeEventListener("click", handleYes);
                confirmNoBtn.removeEventListener("click", handleNo);
                resolve(false);
            };

            confirmYesBtn.addEventListener("click", handleYes);
            confirmNoBtn.addEventListener("click", handleNo);
        });
    }

    /**
     * Encrypts the note content and saves it to local storage.
     */
    function encryptAndSaveNote() {
        const note = noteContentTextarea.value.trim();
        const key = encryptionKeyInput.value;

        if (!note) {
            showMessage("Please write a note to encrypt.", true);
            return;
        }
        if (!key) {
            showMessage("Please enter an encryption password.", true);
            return;
        }

        try {
            // Encrypt the note using AES
            const encrypted = CryptoJS.AES.encrypt(note, key).toString();
            localStorage.setItem(LOCAL_STORAGE_KEY, encrypted);
            noteContentTextarea.value = ""; // Clear textarea after saving
            encryptionKeyInput.value = ""; // Clear password for security
            showMessage("Note encrypted and saved successfully!");
            updateStorageStatus();
        } catch (error) {
            console.error("Encryption failed:", error);
            showMessage("Failed to encrypt and save note. Check console for details.", true);
        }
    }

    /**
     * Decrypts the note from local storage and displays it.
     */
    function decryptNote() {
        const encryptedNote = localStorage.getItem(LOCAL_STORAGE_KEY);
        const key = encryptionKeyInput.value;

        if (!encryptedNote) {
            showMessage("No encrypted note found in local storage.", true);
            return;
        }
        if (!key) {
            showMessage("Please enter the decryption password.", true);
            return;
        }

        try {
            // Decrypt the note using AES
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedNote, key);
            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

            if (decryptedText === "") {
                // This usually means incorrect password or corrupted data
                showMessage("Decryption failed. Incorrect password or corrupted note.", true);
                noteContentTextarea.value = ""; // Clear any partial or incorrect display
            } else {
                noteContentTextarea.value = decryptedText;
                showMessage("Note decrypted successfully!");
            }
            encryptionKeyInput.value = ""; // Clear password for security
        } catch (error) {
            console.error("Decryption failed:", error);
            showMessage("Decryption failed. Incorrect password or corrupted note.", true);
            noteContentTextarea.value = ""; // Clear any partial or incorrect display
        }
    }

    /**
     * Clears the content of the current note textarea and message box,
     * but does NOT remove the encrypted note from local storage.
     */
    function clearCurrentNote() {
        noteContentTextarea.value = "";
        encryptionKeyInput.value = "";
        showMessage("Current note cleared from editor.");
        updateStorageStatus();
    }

    /**
     * Clears all encrypted notes from local storage after confirmation.
     */
    async function clearAllNotes() {
        const confirmed = await showConfirmationModal(
            "This will PERMANENTLY delete your encrypted note from this browser. Are you sure?"
        );

        if (confirmed) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            noteContentTextarea.value = "";
            encryptionKeyInput.value = "";
            showMessage("All encrypted notes cleared from local storage.", false);
            updateStorageStatus();
        } else {
            showMessage("Action cancelled.", false);
        }
    }

    /**
     * Updates the status message indicating if a note is stored.
     */
    function updateStorageStatus() {
        const encryptedNote = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (encryptedNote) {
            storageStatusSpan.innerHTML = '<i class="ri-check-line"></i> An encrypted note is saved in this browser.';
            storageStatusSpan.style.color = 'var(--cyber-neon-cyan)';
            storageStatusSpan.style.textShadow = '0 0 8px rgba(0, 255, 247, 0.5)';
        } else {
            storageStatusSpan.innerHTML = '<i class="ri-alert-line"></i> No encrypted note found in local storage.';
            storageStatusSpan.style.color = 'var(--cyber-neon-pink)';
            storageStatusSpan.style.textShadow = '0 0 8px rgba(255, 0, 204, 0.5)';
        }
    }

    // Add event listeners
    encryptSaveBtn.addEventListener("click", encryptAndSaveNote);
    decryptBtn.addEventListener("click", decryptNote);
    clearCurrentBtn.addEventListener("click", clearCurrentNote);
    clearAllBtn.addEventListener("click", clearAllNotes);

    // Initial check for existing notes on page load
    updateStorageStatus();
});
