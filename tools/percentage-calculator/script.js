// script.js for tools/percentage-calculator/

document.addEventListener('DOMContentLoaded', () => {
    // "What is X% of Y?" elements
    const percentOfXInput = document.getElementById('percentOfX');
    const percentOfYInput = document.getElementById('percentOfY');
    const calculatePercentOfBtn = document.getElementById('calculatePercentOfBtn');
    const percentOfResultInput = document.getElementById('percentOfResult');

    // "X is what % of Y?" elements
    const whatPercentXInput = document.getElementById('whatPercentX');
    const whatPercentYInput = document.getElementById('whatPercentY');
    const calculateWhatPercentBtn = document.getElementById('calculateWhatPercentBtn');
    const whatPercentResultInput = document.getElementById('whatPercentResult');

    // "Percentage Increase/Decrease" elements
    const changeOriginalInput = document.getElementById('changeOriginal');
    const changeNewInput = document.getElementById('changeNew');
    const calculateChangeBtn = document.getElementById('calculateChangeBtn');
    const changeResultInput = document.getElementById('changeResult');

    // General elements
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

    // --- What is X% of Y? ---
    calculatePercentOfBtn.addEventListener('click', () => {
        const x = parseFloat(percentOfXInput.value);
        const y = parseFloat(percentOfYInput.value);

        if (isNaN(x) || isNaN(y)) {
            showMessage('Please enter valid numbers for X and Y.', 'error');
            percentOfResultInput.value = '';
            return;
        }

        const result = (x / 100) * y;
        percentOfResultInput.value = result.toFixed(2); // Format to 2 decimal places
        showMessage(`Calculated ${x}% of ${y}!`, 'success');
    });

    // --- X is what % of Y? ---
    calculateWhatPercentBtn.addEventListener('click', () => {
        const x = parseFloat(whatPercentXInput.value);
        const y = parseFloat(whatPercentYInput.value);

        if (isNaN(x) || isNaN(y)) {
            showMessage('Please enter valid numbers for X and Y.', 'error');
            whatPercentResultInput.value = '';
            return;
        }
        if (y === 0) {
            showMessage('Y cannot be zero for this calculation.', 'error');
            whatPercentResultInput.value = '';
            return;
        }

        const result = (x / y) * 100;
        whatPercentResultInput.value = `${result.toFixed(2)}%`; // Format to 2 decimal places with %
        showMessage(`${x} is what % of ${y} calculated!`, 'success');
    });

    // --- Percentage Increase/Decrease ---
    calculateChangeBtn.addEventListener('click', () => {
        const original = parseFloat(changeOriginalInput.value);
        const newValue = parseFloat(changeNewInput.value);

        if (isNaN(original) || isNaN(newValue)) {
            showMessage('Please enter valid numbers for original and new values.', 'error');
            changeResultInput.value = '';
            return;
        }
        if (original === 0) {
            showMessage('Original value cannot be zero for percentage change.', 'error');
            changeResultInput.value = '';
            return;
        }

        const change = newValue - original;
        const percentageChange = (change / original) * 100;

        let resultText;
        if (percentageChange > 0) {
            resultText = `Increase: ${percentageChange.toFixed(2)}%`;
        } else if (percentageChange < 0) {
            resultText = `Decrease: ${Math.abs(percentageChange).toFixed(2)}%`;
        } else {
            resultText = 'No change (0%)';
        }

        changeResultInput.value = resultText;
        showMessage('Percentage change calculated!', 'success');
    });

    // --- Clear All ---
    clearAllBtn.addEventListener('click', () => {
        percentOfXInput.value = '10';
        percentOfYInput.value = '100';
        percentOfResultInput.value = '';

        whatPercentXInput.value = '25';
        whatPercentYInput.value = '200';
        whatPercentResultInput.value = '';

        changeOriginalInput.value = '100';
        changeNewInput.value = '120';
        changeResultInput.value = '';

        showMessage('Cleared all fields.', 'info');
    });

    // Trigger initial calculations on page load
    calculatePercentOfBtn.click();
    calculateWhatPercentBtn.click();
    calculateChangeBtn.click();
});
