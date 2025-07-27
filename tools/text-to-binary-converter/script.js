// tools/text-to-binary-converter/script.js

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const binaryInput = document.getElementById('binaryInput');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultOutput = document.getElementById('resultOutput');
    const outputSection = document.querySelector('.output-section'); // For scrolling

    /**
     * Displays a message in a specified message box.
     * @param {HTMLElement} element - The message box HTML element.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.classList.remove('error');
        if (isError) {
            element.classList.add('error');
        }
        element.classList.add('show');
        setTimeout(() => {
            element.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Resets all input and output fields.
     */
    const resetOutputs = () => {
        textInput.value = '';
        binaryInput.value = '';
        resultOutput.value = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Converts text to binary.
     * @param {string} text - The input text string.
     * @returns {string} Binary representation (space-separated bytes).
     */
    const textToBinary = (text) => {
        return text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    };

    /**
     * Converts binary to text.
     * @param {string} binary - Binary string (space-separated bytes).
     * @returns {string} Text representation.
     */
    const binaryToText = (binary) => {
        // Remove any non-binary characters and split by space
        const binaryChunks = binary.replace(/[^01\s]/g, '').split(' ').filter(chunk => chunk.length > 0);
        
        try {
            return binaryChunks.map(chunk => {
                // Pad chunks to 8 bits if they are shorter (e.g., for single bits or 7-bit ASCII)
                const paddedChunk = chunk.padStart(8, '0');
                if (paddedChunk.length !== 8) {
                    throw new Error(`Invalid binary chunk length: ${chunk}`);
                }
                return String.fromCharCode(parseInt(paddedChunk, 2));
            }).join('');
        } catch (e) {
            console.error("Error converting binary to text:", e);
            return null; // Indicate conversion failure
        }
    };

    /**
     * Handles the conversion based on which input field has content.
     */
    const handleConversion = () => {
        const textVal = textInput.value.trim();
        const binaryVal = binaryInput.value.trim();

        resultOutput.value = ''; // Clear previous output
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';

        let convertedResult = '';
        let conversionType = '';

        if (textVal && !binaryVal) {
            // Convert Text to Binary
            conversionType = 'Text to Binary';
            convertedResult = textToBinary(textVal);
        } else if (binaryVal && !textVal) {
            // Convert Binary to Text
            conversionType = 'Binary to Text';
            convertedResult = binaryToText(binaryVal);
            if (convertedResult === null) {
                showMessage(messageBox, 'Invalid binary format. Please enter space-separated 8-bit binary numbers (e.g., 01001000 01100101).', true);
                loadingSpinner.style.display = 'none';
                return;
            }
        } else if (textVal && binaryVal) {
            showMessage(messageBox, 'Please enter input in ONLY one field (Text or Binary).', true);
            loadingSpinner.style.display = 'none';
            return;
        } else {
            showMessage(messageBox, 'Please enter text or binary to convert.', true);
            loadingSpinner.style.display = 'none';
            return;
        }

        showMessage(messageBox, `Converting ${conversionType}...`, false);
        loadingSpinner.style.display = 'block';

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            resultOutput.value = convertedResult;
            showMessage(resultsMessageBox, 'Conversion successful!', false);
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    // Event Listeners
    convertBtn.addEventListener('click', handleConversion);
    clearBtn.addEventListener('click', resetOutputs);

    // Auto-clear other input when one is typed into
    textInput.addEventListener('input', () => {
        if (textInput.value.trim() !== '') {
            binaryInput.value = '';
        }
        // If the current input is cleared, reset all outputs
        if (textInput.value.trim() === '' && binaryInput.value.trim() === '') {
            resetOutputs();
        }
    });

    binaryInput.addEventListener('input', () => {
        if (binaryInput.value.trim() !== '') {
            textInput.value = '';
        }
        // If the current input is cleared, reset all outputs
        if (textInput.value.trim() === '' && binaryInput.value.trim() === '') {
            resetOutputs();
        }
    });

    // Allow Enter key to trigger conversion in either input field
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault(); // Prevent new line in textarea
            handleConversion();
        }
    });
    binaryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
            e.preventDefault(); // Prevent new line in textarea
            handleConversion();
        }
    });

    // Initial state setup
    resetOutputs();
});
