// script.js for JSON Merge Tool

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const jsonInputA = document.getElementById("jsonInputA");
    const jsonInputB = document.getElementById("jsonInputB");
    const mergeJsonBtn = document.getElementById("mergeJsonBtn");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const mergedJsonOutput = document.getElementById("mergedJsonOutput");
    const copyOutputBtn = document.getElementById("copyOutputBtn");
    const messageBox = document.getElementById("messageBox");

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
     * Attempts to parse a JSON string.
     * @param {string} jsonString - The string to parse.
     * @param {string} inputName - A name for the input (e.g., "JSON A") for error messages.
     * @returns {Object|Array|null} The parsed JSON object/array, or null if parsing fails.
     */
    function validateAndParseJson(jsonString, inputName) {
        if (!jsonString.trim()) {
            showMessage(`${inputName} is empty.`, true);
            return null;
        }
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            showMessage(`Invalid JSON in ${inputName}: ${e.message}`, true);
            return null;
        }
    }

    /**
     * Deep merges two JSON objects. Properties in objB overwrite properties in objA.
     * Arrays are concatenated.
     * @param {Object|Array} objA - The first JSON object or array.
     * @param {Object|Array} objB - The second JSON object or array.
     * @returns {Object|Array} The merged JSON.
     */
    function deepMerge(objA, objB) {
        // If both are arrays, concatenate them
        if (Array.isArray(objA) && Array.isArray(objB)) {
            return [...objA, ...objB];
        }

        // If both are objects, deep merge their properties
        if (typeof objA === 'object' && objA !== null &&
            typeof objB === 'object' && objB !== null &&
            !Array.isArray(objA) && !Array.isArray(objB)) {

            const merged = { ...objA }; // Start with properties from A
            for (const key in objB) {
                if (Object.prototype.hasOwnProperty.call(objB, key)) {
                    if (Object.prototype.hasOwnProperty.call(merged, key) &&
                        typeof merged[key] === 'object' && merged[key] !== null &&
                        typeof objB[key] === 'object' && objB[key] !== null) {
                        // Recursively merge if both are objects/arrays
                        merged[key] = deepMerge(merged[key], objB[key]);
                    } else {
                        // Otherwise, B's value overwrites A's value
                        merged[key] = objB[key];
                    }
                }
            }
            return merged;
        }

        // If types are different or not mergeable (e.g., one is primitive, one is object),
        // B's value takes precedence.
        return objB;
    }


    /**
     * Event listener for the Merge JSON button.
     */
    mergeJsonBtn.addEventListener("click", () => {
        const jsonAString = jsonInputA.value;
        const jsonBString = jsonInputB.value;

        // Clear previous output and messages
        mergedJsonOutput.value = "";
        copyOutputBtn.disabled = true;
        messageBox.classList.remove("show", "error");
        messageBox.textContent = "";

        // Validate and parse JSON inputs
        const parsedA = validateAndParseJson(jsonAString, "JSON A");
        const parsedB = validateAndParseJson(jsonBString, "JSON B");

        if (parsedA === null && parsedB === null) {
            showMessage("Please provide at least one valid JSON input.", true);
            return;
        }

        let mergedResult;

        // Handle cases where one input is empty or invalid
        if (parsedA === null) {
            mergedResult = parsedB;
            showMessage("JSON A is invalid or empty. Displaying JSON B.", parsedB === null);
        } else if (parsedB === null) {
            mergedResult = parsedA;
            showMessage("JSON B is invalid or empty. Displaying JSON A.", parsedA === null);
        } else {
            // Both are valid, proceed with merging
            const typeA = Array.isArray(parsedA) ? 'array' : typeof parsedA;
            const typeB = Array.isArray(parsedB) ? 'array' : typeof parsedB;

            if (typeA !== typeB) {
                showMessage(`Cannot merge JSON of different root types (${typeA} and ${typeB}). Displaying JSON B.`, true);
                mergedResult = parsedB; // Or choose A, or show explicit error without result
            } else {
                try {
                    mergedResult = deepMerge(parsedA, parsedB);
                    showMessage("JSON merged successfully!");
                } catch (e) {
                    showMessage(`Error during merge: ${e.message}`, true);
                    console.error("Merge error:", e);
                    mergedResult = null;
                }
            }
        }

        if (mergedResult !== null) {
            try {
                mergedJsonOutput.value = JSON.stringify(mergedResult, null, 2);
                copyOutputBtn.disabled = false;
            } catch (e) {
                showMessage("Failed to format merged JSON: " + e.message, true);
                mergedJsonOutput.value = "Error: Could not format merged JSON.";
            }
        } else {
            mergedJsonOutput.value = ""; // Ensure output is empty on error
        }
    });

    /**
     * Event listener for the Clear All button.
     */
    clearAllBtn.addEventListener("click", () => {
        jsonInputA.value = "";
        jsonInputB.value = "";
        mergedJsonOutput.value = "";
        copyOutputBtn.disabled = true;
        showMessage("All inputs and output cleared.");
    });

    /**
     * Event listener for the Copy Output button.
     */
    copyOutputBtn.addEventListener("click", () => {
        if (mergedJsonOutput.value) {
            mergedJsonOutput.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'Merged JSON copied to clipboard!' : 'Failed to copy text. Please copy manually.';
                showMessage(msg, !successful);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showMessage('Copying not supported or failed in this browser. Please copy manually.', true);
            }
        } else {
            showMessage("No merged JSON to copy.", true);
        }
    });

    // Initial state setup
    mergedJsonOutput.value = "";
    copyOutputBtn.disabled = true;
});
