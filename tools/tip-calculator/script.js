// script.js for tools/tip-calculator/

document.addEventListener('DOMContentLoaded', () => {
    const billAmountInput = document.getElementById('billAmount');
    const tipPercentageInput = document.getElementById('tipPercentage');
    const tipPercentageValueSpan = document.getElementById('tipPercentageValue');
    const numPeopleInput = document.getElementById('numPeople');
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const tipAmountResult = document.getElementById('tipAmountResult');
    const totalBillResult = document.getElementById('totalBillResult');
    const amountPerPersonResult = document.getElementById('amountPerPersonResult');
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

    // Function to perform the tip calculation
    function calculateTip() {
        const billAmount = parseFloat(billAmountInput.value);
        const tipPercentage = parseFloat(tipPercentageInput.value);
        const numPeople = parseInt(numPeopleInput.value);

        // Input validation
        if (isNaN(billAmount) || billAmount < 0) {
            showMessage('Please enter a valid Bill Amount (a non-negative number).', 'error');
            hideResults();
            return;
        }
        if (isNaN(tipPercentage) || tipPercentage < 0 || tipPercentage > 100) {
            showMessage('Please enter a valid Tip Percentage (0-100).', 'error');
            hideResults();
            return;
        }
        if (isNaN(numPeople) || numPeople < 1) {
            showMessage('Please enter a valid Number of People (at least 1).', 'error');
            hideResults();
            return;
        }

        const tipAmount = (billAmount * tipPercentage) / 100;
        const totalBill = billAmount + tipAmount;
        const amountPerPerson = totalBill / numPeople;

        tipAmountResult.textContent = `$${tipAmount.toFixed(2)}`;
        totalBillResult.textContent = `$${totalBill.toFixed(2)}`;
        amountPerPersonResult.textContent = `$${amountPerPerson.toFixed(2)}`;

        resultsContainer.style.display = 'grid'; // Show results
        showMessage('Tip calculated successfully!', 'success');
    }

    // Function to hide results container
    function hideResults() {
        resultsContainer.style.display = 'none';
    }

    // Update tip percentage value display as slider moves
    tipPercentageInput.addEventListener('input', () => {
        tipPercentageValueSpan.textContent = `${tipPercentageInput.value}%`;
    });

    // Event listeners for calculation
    calculateBtn.addEventListener('click', calculateTip);

    // Also calculate on input changes for a more dynamic experience
    billAmountInput.addEventListener('input', calculateTip);
    tipPercentageInput.addEventListener('input', calculateTip);
    numPeopleInput.addEventListener('input', calculateTip);

    // Clear all fields and hide results
    clearBtn.addEventListener('click', () => {
        billAmountInput.value = '0.00';
        tipPercentageInput.value = '15';
        tipPercentageValueSpan.textContent = '15%';
        numPeopleInput.value = '1';
        tipAmountResult.textContent = '$0.00';
        totalBillResult.textContent = '$0.00';
        amountPerPersonResult.textContent = '$0.00';
        hideResults();
        showMessage('Cleared all fields.', 'info');
    });

    // Initial calculation on page load with default values
    calculateTip();
});
