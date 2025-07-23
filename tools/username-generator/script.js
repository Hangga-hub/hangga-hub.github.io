// script.js for Username Generator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const usernameLengthInput = document.getElementById("usernameLength");
    const includeUppercaseCheckbox = document.getElementById("includeUppercase");
    const includeNumbersCheckbox = document.getElementById("includeNumbers");
    const includeSymbolsCheckbox = document.getElementById("includeSymbols");
    const prefixInput = document.getElementById("prefix");
    const suffixInput = document.getElementById("suffix");
    const numUsernamesInput = document.getElementById("numUsernames");

    // Get references to output and button elements
    const generatedUsernamesList = document.getElementById("generatedUsernamesList");
    const generateBtn = document.getElementById("generateBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyResultsBtn = document.getElementById("copyResultsBtn");
    const messageBox = document.getElementById("messageBox");

    // Define character sets
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()-_+=[]{}|;:,.<>?";

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
        // Automatically hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, 3000);
    }

    /**
     * Generates a single random string of a given length from a character pool.
     * @param {string} charPool - The string of characters to choose from.
     * @param {number} length - The desired length of the string.
     * @returns {string} The generated random string.
     */
    function generateRandomString(charPool, length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += charPool.charAt(Math.floor(Math.random() * charPool.length));
        }
        return result;
    }

    /**
     * Generates usernames based on user-selected criteria.
     */
    function generateUsernames() {
        const length = parseInt(usernameLengthInput.value);
        const includeUppercase = includeUppercaseCheckbox.checked;
        const includeNumbers = includeNumbersCheckbox.checked;
        const includeSymbols = includeSymbolsCheckbox.checked;
        const prefix = prefixInput.value.trim();
        const suffix = suffixInput.value.trim();
        const numUsernames = parseInt(numUsernamesInput.value);

        // Input validation
        if (isNaN(length) || length < 4 || length > 20) {
            showMessage("Please enter a username length between 4 and 20.", true);
            return;
        }
        if (isNaN(numUsernames) || numUsernames < 1 || numUsernames > 50) {
            showMessage("Please enter a number of usernames to generate between 1 and 50.", true);
            return;
        }

        let charPool = lowercaseChars; // Always include lowercase
        if (includeUppercase) {
            charPool += uppercaseChars;
        }
        if (includeNumbers) {
            charPool += numberChars;
        }
        if (includeSymbols) {
            charPool += symbolChars;
        }

        if (charPool.length === 0) {
            showMessage("Please select at least one character type (e.g., Uppercase, Numbers, Symbols) or ensure lowercase is implicitly included.", true);
            return;
        }

        generatedUsernamesList.innerHTML = ""; // Clear previous results
        let generatedCount = 0;

        while (generatedCount < numUsernames) {
            const randomLength = Math.max(1, length - prefix.length - suffix.length); // Ensure positive length for random part
            const randomPart = generateRandomString(charPool, randomLength);
            const newUsername = prefix + randomPart + suffix;

            // Basic check to ensure the generated username meets the minimum length requirement
            // after adding prefix/suffix. If not, regenerate.
            if (newUsername.length < length) {
                // This scenario might occur if prefix + suffix is already longer than or equal to `length`,
                // and randomLength becomes 0 or negative.
                // In such cases, we just use prefix + suffix or ensure minimum length.
                // For simplicity, let's ensure the random part has at least one character if the pool allows.
                // If prefix + suffix already meets or exceeds length, we just use that.
                if ((prefix + suffix).length >= length) {
                    const finalUsername = (prefix + randomPart + suffix).substring(0, length);
                    const listItem = document.createElement("li");
                    listItem.textContent = finalUsername;
                    generatedUsernamesList.appendChild(listItem);
                    generatedCount++;
                } else {
                    // Regenerate if the combined length is still too short,
                    // or adjust randomLength to ensure it fills up to `length`
                    const requiredRandomLength = length - (prefix.length + suffix.length);
                    const newRandomPart = generateRandomString(charPool, requiredRandomLength);
                    const finalUsername = prefix + newRandomPart + suffix;
                    const listItem = document.createElement("li");
                    listItem.textContent = finalUsername;
                    generatedUsernamesList.appendChild(listItem);
                    generatedCount++;
                }
            } else {
                const listItem = document.createElement("li");
                listItem.textContent = newUsername;
                generatedUsernamesList.appendChild(listItem);
                generatedCount++;
            }
        }

        showMessage(`Generated ${generatedCount} usernames.`);
    }

    /**
     * Clears all input fields and generated usernames.
     */
    function clearFields() {
        usernameLengthInput.value = "10";
        includeUppercaseCheckbox.checked = true;
        includeNumbersCheckbox.checked = true;
        includeSymbolsCheckbox.checked = false;
        prefixInput.value = "";
        suffixInput.value = "";
        numUsernamesInput.value = "5";
        generatedUsernamesList.innerHTML = ""; // Clear results list
        showMessage("All fields cleared.");
    }

    /**
     * Copies all generated usernames to the clipboard.
     */
    function copyResults() {
        const usernames = Array.from(generatedUsernamesList.children).map(li => li.textContent).join('\n');

        if (usernames.length === 0) {
            showMessage("No usernames to copy. Please generate some first.", true);
            return;
        }

        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = usernames;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showMessage("Usernames copied to clipboard!");
            } else {
                showMessage("Failed to copy usernames to clipboard.", true);
            }
        } catch (err) {
            console.error('Oops, unable to copy', err);
            showMessage("Copy failed! Your browser might not support this feature.", true);
        } finally {
            document.body.removeChild(tempTextArea); // Clean up
        }
    }

    // Event Listeners
    generateBtn.addEventListener("click", generateUsernames);
    clearBtn.addEventListener("click", clearFields);
    copyResultsBtn.addEventListener("click", copyResults);

    // Initial state setup
    clearFields(); // Clear fields and results on load
});
