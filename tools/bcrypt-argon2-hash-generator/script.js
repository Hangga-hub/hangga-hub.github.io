document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const textInput = document.getElementById("textInput");
    const algorithmSelect = document.getElementById("algorithmSelect");
    const bcryptOptions = document.getElementById("bcryptOptions");
    const bcryptRoundsInput = document.getElementById("bcryptRounds");
    const bcryptSaltInput = document.getElementById("bcryptSalt");
    const argon2Options = document.getElementById("argon2Options");
    const argon2MemoryInput = document.getElementById("argon2Memory");
    const argon2IterationsInput = document.getElementById("argon2Iterations");
    const argon2ParallelismInput = document.getElementById("argon2Parallelism");
    const argon2HashLengthInput = document.getElementById("argon2HashLength");
    const argon2TypeSelect = document.getElementById("argon2Type");
    const argon2SaltInput = document.getElementById("argon2Salt");
    const generateHashBtn = document.getElementById("generateHashBtn");
    const resetBtn = document.getElementById("resetBtn");
    const hashOutput = document.getElementById("hashOutput");
    const copyHashBtn = document.getElementById("copyHashBtn");
    const messageBox = document.getElementById("messageBox");

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
     * Generates a random salt string (base64 encoded) of a specified byte length.
     * @param {number} byteLength - The desired byte length of the salt.
     * @returns {string} The base64 encoded salt.
     */
    function generateRandomSalt(byteLength) {
        const saltBytes = new Uint8Array(byteLength);
        crypto.getRandomValues(saltBytes);
        // Convert Uint8Array to a base64 string
        return btoa(String.fromCharCode.apply(null, saltBytes));
    }

    /**
     * Handles the generation of the hash based on the selected algorithm.
     */
    async function generateHash() {
        const textToHash = textInput.value;
        const algorithm = algorithmSelect.value;

        if (!textToHash) {
            showMessage("Please enter text to hash.", true);
            return;
        }

        hashOutput.textContent = "Generating hash...";
        copyHashBtn.disabled = true;
        generateHashBtn.disabled = true;

        try {
            let generatedHash = "";

            if (algorithm === "bcrypt") {
                // Ensure dcodeIO.bcrypt is available
                if (typeof dcodeIO === 'undefined' || typeof dcodeIO.bcrypt === 'undefined') {
                    throw new Error("Bcrypt library not loaded correctly. Please check console for errors.");
                }

                const rounds = parseInt(bcryptRoundsInput.value);
                if (isNaN(rounds) || rounds < 4 || rounds > 31) {
                    showMessage("Bcrypt rounds must be an integer between 4 and 31.", true);
                    return;
                }

                let salt = bcryptSaltInput.value.trim();
                if (salt === "") {
                    // Generate a new salt if not provided
                    salt = dcodeIO.bcrypt.genSaltSync(rounds); // Corrected reference
                } else {
                    // Use provided salt directly if it's valid, otherwise bcrypt will error
                    // For simplicity, we'll let dcodeIO.bcrypt.hash handle salt validation
                }

                generatedHash = await dcodeIO.bcrypt.hash(textToHash, salt); // Corrected reference

            } else if (algorithm === "argon2") {
                // Ensure argon2 is available
                if (typeof argon2 === 'undefined') {
                    throw new Error("Argon2 library not loaded correctly. Please check console for errors.");
                }

                const memory = parseInt(argon2MemoryInput.value);
                const iterations = parseInt(argon2IterationsInput.value);
                const parallelism = parseInt(argon2ParallelismInput.value);
                const hashLength = parseInt(argon2HashLengthInput.value);
                const type = parseInt(argon2TypeSelect.value);

                if (isNaN(memory) || memory < 8) {
                    showMessage("Argon2 memory must be a number (KiB) and at least 8.", true);
                    return;
                }
                if (isNaN(iterations) || iterations < 1) {
                    showMessage("Argon2 iterations must be a number and at least 1.", true);
                    return;
                }
                if (isNaN(parallelism) || parallelism < 1) {
                    showMessage("Argon2 parallelism must be a number and at least 1.", true);
                    return;
                }
                if (isNaN(hashLength) || hashLength < 4) {
                    showMessage("Argon2 hash length must be a number (bytes) and at least 4.", true);
                    return;
                }

                let salt = argon2SaltInput.value.trim();
                let saltBytes;
                if (salt === "") {
                    // Generate a new 16-byte salt if not provided
                    saltBytes = new Uint8Array(16);
                    crypto.getRandomValues(saltBytes);
                } else {
                    // Decode base64 salt to Uint8Array
                    try {
                        saltBytes = new Uint8Array(atob(salt).split('').map(char => char.charCodeAt(0)));
                        if (saltBytes.length < 8) { // Argon2 requires at least 8 bytes for salt
                             showMessage("Provided Argon2 salt must be at least 8 bytes (base64 encoded).", true);
                             return;
                        }
                    } catch (e) {
                        showMessage("Invalid Argon2 salt. Must be a valid base64 string.", true);
                        return;
                    }
                }

                const argon2Options = {
                    memory: memory,
                    iterations: iterations,
                    parallelism: parallelism,
                    hashLength: hashLength,
                    type: type, // 0 = Argon2d, 1 = Argon2i, 2 = Argon2id
                    salt: saltBytes,
                    raw: false // Get the encoded hash string
                };

                // Argon2.hash returns a promise
                const hashResult = await argon2.hash({ pass: textToHash, ...argon2Options });
                generatedHash = hashResult.encoded; // The full encoded hash string
            }

            hashOutput.textContent = generatedHash;
            copyHashBtn.disabled = false;
            showMessage("Hash generated successfully!");

        } catch (error) {
            console.error("Error generating hash:", error);
            showMessage(`Error generating hash: ${error.message || error}`, true);
            hashOutput.textContent = "Error generating hash.";
            copyHashBtn.disabled = true;
        } finally {
            generateHashBtn.disabled = false;
        }
    }

    /**
     * Copies the generated hash to the clipboard.
     */
    function copyHash() {
        const hashText = hashOutput.textContent;
        if (hashText && hashText !== "Your generated hash will appear here." && hashText !== "Generating hash." && hashText !== "Error generating hash.") {
            try {
                // Use document.execCommand('copy') for better compatibility in iframes
                const textArea = document.createElement("textarea");
                textArea.value = hashText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showMessage("Hash copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy hash:", err);
                showMessage("Failed to copy hash. Please copy manually.", true);
            }
        } else {
            showMessage("No hash to copy.", true);
        }
    }

    /**
     * Resets all inputs and output.
     */
    function resetAll() {
        textInput.value = "password123";
        algorithmSelect.value = "bcrypt";
        bcryptRoundsInput.value = "10";
        bcryptSaltInput.value = "";
        argon2MemoryInput.value = "65536";
        argon2IterationsInput.value = "4";
        argon2ParallelismInput.value = "1";
        argon2HashLengthInput.value = "32";
        argon2TypeSelect.value = "0"; // Argon2d
        argon2SaltInput.value = "";
        hashOutput.textContent = "Your generated hash will appear here.";
        copyHashBtn.disabled = true;
        messageBox.classList.remove("show", "error"); // Clear any messages
        updateAlgorithmOptions(); // Ensure correct options are shown
        showMessage("Inputs reset.");
    }

    /**
     * Toggles the visibility of algorithm-specific options.
     */
    function updateAlgorithmOptions() {
        const selectedAlgorithm = algorithmSelect.value;
        if (selectedAlgorithm === "bcrypt") {
            bcryptOptions.style.display = "block";
            argon2Options.style.display = "none";
        } else if (selectedAlgorithm === "argon2") {
            bcryptOptions.style.display = "none";
            argon2Options.style.display = "block";
        }
    }

    // Add event listeners
    generateHashBtn.addEventListener("click", generateHash);
    copyHashBtn.addEventListener("click", copyHash);
    resetBtn.addEventListener("click", resetAll);
    algorithmSelect.addEventListener("change", updateAlgorithmOptions);

    // Initial setup on page load
    updateAlgorithmOptions(); // Show bcrypt options by default
});
