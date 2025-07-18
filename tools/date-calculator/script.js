// script.js for tools/date-calculator/

document.addEventListener('DOMContentLoaded', () => {
    // Date Difference Elements
    const startDateDiffInput = document.getElementById('startDateDiff');
    const endDateDiffInput = document.getElementById('endDateDiff');
    const calculateDiffBtn = document.getElementById('calculateDiffBtn');
    const diffResultTextarea = document.getElementById('diffResult');

    // Add/Subtract Time Elements
    const baseDateAddSubInput = document.getElementById('baseDateAddSub');
    const quantityAddSubInput = document.getElementById('quantityAddSub');
    const unitAddSubSelect = document.getElementById('unitAddSub');
    const addTimeBtn = document.getElementById('addTimeBtn');
    const subtractTimeBtn = document.getElementById('subtractTimeBtn');
    const getCurrentDateBtn = document.getElementById('getCurrentDateBtn');
    const resultDateAddSubInput = document.getElementById('resultDateAddSub');

    // General Elements
    const clearAllBtn = document.getElementById('clearAllBtn');
    const messageBox = document.getElementById('messageBox');

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

    // Helper to format a Date object to YYYY-MM-DD string for input[type="date"]
    function formatDateToInput(date) {
        if (!date || isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- Date Difference Calculation ---
    calculateDiffBtn.addEventListener('click', () => {
        const startDateStr = startDateDiffInput.value;
        const endDateStr = endDateDiffInput.value;

        if (!startDateStr || !endDateStr) {
            showMessage('Please select both start and end dates for difference calculation.', 'info');
            diffResultTextarea.value = '';
            return;
        }

        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        // Ensure valid dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            showMessage('Invalid date format. Please use valid dates.', 'error');
            diffResultTextarea.value = '';
            return;
        }

        // Calculate total difference in milliseconds
        const diffMs = Math.abs(endDate.getTime() - startDate.getTime());

        // Calculate difference in days
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // Calculate difference in years and months (approximate, but more intuitive)
        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let remainingDays = endDate.getDate() - startDate.getDate();

        if (remainingDays < 0) {
            months--;
            // Go to the last day of the previous month of endDate
            const tempDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
            remainingDays = tempDate.getDate() - startDate.getDate() + endDate.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        let resultText = `Total difference: ${days} days.\n`;
        resultText += `Approximate: ${years} years, ${months} months, ${remainingDays} days.`;

        diffResultTextarea.value = resultText;
        showMessage('Date difference calculated!', 'success');
    });

    // --- Add/Subtract Time Operations ---
    function performDateOperation(operationType) { // 'add' or 'subtract'
        const baseDateStr = baseDateAddSubInput.value;
        const quantity = parseInt(quantityAddSubInput.value);
        const unit = unitAddSubSelect.value;

        if (!baseDateStr) {
            showMessage('Please select a base date.', 'info');
            resultDateAddSubInput.value = '';
            return;
        }
        if (isNaN(quantity) || quantity < 1) {
            showMessage('Please enter a valid quantity (number greater than 0).', 'error');
            resultDateAddSubInput.value = '';
            return;
        }

        const baseDate = new Date(baseDateStr);
        if (isNaN(baseDate.getTime())) {
            showMessage('Invalid base date format. Please use a valid date.', 'error');
            resultDateAddSubInput.value = '';
            return;
        }

        let newDate = new Date(baseDate); // Create a copy to modify

        const actualQuantity = operationType === 'subtract' ? -quantity : quantity;

        switch (unit) {
            case 'days':
                newDate.setDate(newDate.getDate() + actualQuantity);
                break;
            case 'months':
                newDate.setMonth(newDate.getMonth() + actualQuantity);
                // Handle month overflow/underflow (e.g., Feb 30 -> March 2)
                // setMonth automatically handles this by clamping to the last day of the month
                // if the target day doesn't exist (e.g., adding 1 month to Jan 31 -> Feb 28/29)
                break;
            case 'years':
                newDate.setFullYear(newDate.getFullYear() + actualQuantity);
                break;
            default:
                showMessage('Invalid time unit selected.', 'error');
                resultDateAddSubInput.value = '';
                return;
        }

        resultDateAddSubInput.value = formatDateToInput(newDate);
        showMessage(`${operationType === 'add' ? 'Added' : 'Subtracted'} ${quantity} ${unit}!`, 'success');
    }

    addTimeBtn.addEventListener('click', () => performDateOperation('add'));
    subtractTimeBtn.addEventListener('click', () => performDateOperation('subtract'));

    // Get Current Date
    getCurrentDateBtn.addEventListener('click', () => {
        const today = new Date();
        const formattedToday = formatDateToInput(today);
        baseDateAddSubInput.value = formattedToday;
        startDateDiffInput.value = formattedToday; // Also set for difference section
        showMessage('Current date set!', 'success');
    });

    // --- Clear All ---
    clearAllBtn.addEventListener('click', () => {
        startDateDiffInput.value = '';
        endDateDiffInput.value = '';
        diffResultTextarea.value = '';
        baseDateAddSubInput.value = '';
        quantityAddSubInput.value = '1';
        unitAddSubSelect.value = 'days';
        resultDateAddSubInput.value = '';
        showMessage('Cleared all fields.', 'info');
    });

    // Initial load: Set current date in the add/subtract section
    getCurrentDateBtn.click();
});
