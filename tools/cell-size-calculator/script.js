// tools/cell-size-calculator/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const totalWidthInput = document.getElementById('totalWidthInput');
    const totalHeightInput = document.getElementById('totalHeightInput');
    const numColumnsInput = document.getElementById('numColumnsInput');
    const numRowsInput = document.getElementById('numRowsInput');
    const gapInput = document.getElementById('gapInput');

    // Buttons and Messages
    const calculateBtn = document.getElementById('calculateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const cellWidthOutput = document.getElementById('cellWidthOutput');
    const cellHeightOutput = document.getElementById('cellHeightOutput');
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
        totalWidthInput.value = '';
        totalHeightInput.value = '';
        numColumnsInput.value = '';
        numRowsInput.value = '';
        gapInput.value = '';

        cellWidthOutput.textContent = 'N/A';
        cellHeightOutput.textContent = 'N/A';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Calculates the cell size based on grid dimensions and gaps.
     */
    const calculateCellSize = () => {
        const totalWidth = parseFloat(totalWidthInput.value.trim());
        const totalHeight = parseFloat(totalHeightInput.value.trim());
        const numColumns = parseInt(numColumnsInput.value.trim());
        const numRows = parseInt(numRowsInput.value.trim());
        const gap = parseFloat(gapInput.value.trim()) || 0; // Default to 0 if not provided

        // Clear previous output messages and values
        cellWidthOutput.textContent = 'N/A';
        cellHeightOutput.textContent = 'N/A';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';

        // Input validation
        if (isNaN(totalWidth) || totalWidth <= 0) {
            showMessage(messageBox, 'Please enter a valid positive number for Total Width.', true);
            loadingSpinner.style.display = 'none';
            return;
        }
        if (isNaN(totalHeight) || totalHeight <= 0) {
            showMessage(messageBox, 'Please enter a valid positive number for Total Height.', true);
            loadingSpinner.style.display = 'none';
            return;
        }
        if (isNaN(numColumns) || numColumns <= 0 || !Number.isInteger(numColumns)) {
            showMessage(messageBox, 'Please enter a valid positive integer for Number of Columns.', true);
            loadingSpinner.style.display = 'none';
            return;
        }
        if (isNaN(numRows) || numRows <= 0 || !Number.isInteger(numRows)) {
            showMessage(messageBox, 'Please enter a valid positive integer for Number of Rows.', true);
            loadingSpinner.style.display = 'none';
            return;
        }
        if (isNaN(gap) || gap < 0) {
            showMessage(messageBox, 'Please enter a valid non-negative number for Gap/Gutter.', true);
            loadingSpinner.style.display = 'none';
            return;
        }

        // Check if gaps are too large for the total dimensions
        if ((numColumns - 1) * gap >= totalWidth) {
            showMessage(messageBox, 'Gap size is too large for the given total width and number of columns.', true);
            loadingSpinner.style.display = 'none';
            return;
        }
        if ((numRows - 1) * gap >= totalHeight) {
            showMessage(messageBox, 'Gap size is too large for the given total height and number of rows.', true);
            loadingSpinner.style.display = 'none';
            return;
        }

        showMessage(messageBox, 'Calculating cell sizes...', false);
        loadingSpinner.style.display = 'block';

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';

            const availableWidth = totalWidth - (numColumns - 1) * gap;
            const cellWidth = availableWidth / numColumns;

            const availableHeight = totalHeight - (numRows - 1) * gap;
            const cellHeight = availableHeight / numRows;

            cellWidthOutput.textContent = `${cellWidth.toFixed(2)} px`;
            cellHeightOutput.textContent = `${cellHeight.toFixed(2)} px`;

            showMessage(resultsMessageBox, 'Calculation successful!', false);
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    // Event Listeners
    calculateBtn.addEventListener('click', calculateCellSize);
    clearAllBtn.addEventListener('click', resetOutputs);

    // Allow Enter key to trigger calculation in input fields
    const inputFields = [totalWidthInput, totalHeightInput, numColumnsInput, numRowsInput, gapInput];
    inputFields.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateCellSize();
            }
        });
    });

    // Initial state setup
    resetOutputs();
});
