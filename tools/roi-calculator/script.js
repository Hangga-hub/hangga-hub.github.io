// script.js for tools/roi-calculator/

document.addEventListener('DOMContentLoaded', () => {
    const initialInvestmentInput = document.getElementById('initialInvestment');
    const finalValueInput = document.getElementById('finalValue');
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const netProfitResult = document.getElementById('netProfitResult');
    const roiPercentageResult = document.getElementById('roiPercentageResult');
    const resultsContainer = document.getElementById('resultsContainer');
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

    // Function to perform the ROI calculation
    function calculateROI() {
        const initialInvestment = parseFloat(initialInvestmentInput.value);
        const finalValue = parseFloat(finalValueInput.value);

        // Input validation
        if (isNaN(initialInvestment) || initialInvestment < 0) {
            showMessage('Please enter a valid Initial Investment (a non-negative number).', 'error');
            hideResults();
            return;
        }
        if (isNaN(finalValue) || finalValue < 0) {
            showMessage('Please enter a valid Final Value of Investment (a non-negative number).', 'error');
            hideResults();
            return;
        }

        if (initialInvestment === 0) {
            if (finalValue === 0) {
                netProfitResult.textContent = '$0.00';
                roiPercentageResult.textContent = '0.00%';
                showMessage('Initial investment and final value are both zero. ROI is undefined/0%.', 'info');
            } else {
                netProfitResult.textContent = `$${finalValue.toFixed(2)}`;
                roiPercentageResult.textContent = 'Infinite%';
                showMessage('Initial investment is zero. ROI is infinite.', 'info');
            }
            resultsContainer.style.display = 'grid';
            return;
        }

        const netProfit = finalValue - initialInvestment;
        const roi = (netProfit / initialInvestment) * 100;

        netProfitResult.textContent = `$${netProfit.toFixed(2)}`;
        roiPercentageResult.textContent = `${roi.toFixed(2)}%`;

        resultsContainer.style.display = 'grid'; // Show results
        showMessage('ROI calculated successfully!', 'success');
    }

    // Function to hide results container
    function hideResults() {
        resultsContainer.style.display = 'none';
    }

    // Event listeners for calculation
    calculateBtn.addEventListener('click', calculateROI);

    // Also calculate on input changes for a more dynamic experience
    initialInvestmentInput.addEventListener('input', calculateROI);
    finalValueInput.addEventListener('input', calculateROI);

    // Clear all fields and hide results
    clearBtn.addEventListener('click', () => {
        initialInvestmentInput.value = '10000';
        finalValueInput.value = '12000';
        netProfitResult.textContent = '$0.00';
        roiPercentageResult.textContent = '0.00%';
        hideResults();
        showMessage('Cleared all fields.', 'info');
    });

    // Initial calculation on page load with default values
    calculateROI();
});
