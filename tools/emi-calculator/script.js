// script.js for EMI Calculator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const loanAmountInput = document.getElementById("loanAmount");
    const annualInterestRateInput = document.getElementById("annualInterestRate");
    const loanTermYearsInput = document.getElementById("loanTermYears");

    // Get references to result display elements
    const emiResult = document.getElementById("emiResult");
    const totalInterestResult = document.getElementById("totalInterestResult");
    const totalPaymentResult = document.getElementById("totalPaymentResult");

    // Get references to buttons and message box
    const calculateBtn = document.getElementById("calculateBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyResultsBtn = document.getElementById("copyResultsBtn");
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
        // Automatically hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, 3000);
    }

    /**
     * Formats a number as a currency string.
     * @param {number} amount - The number to format.
     * @returns {string} The formatted currency string.
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    /**
     * Calculates the EMI (Equated Monthly Installment).
     */
    function calculateEMI() {
        // Get values from inputs, defaulting to 0 if empty or invalid
        const P = parseFloat(loanAmountInput.value) || 0; // Principal Loan Amount
        const annualRate = parseFloat(annualInterestRateInput.value) || 0; // Annual Interest Rate (%)
        const termYears = parseFloat(loanTermYearsInput.value) || 0; // Loan Term (Years)

        // Input validation
        if (P <= 0) {
            showMessage("Please enter a valid Loan Amount (must be greater than 0).", true);
            clearResults();
            return;
        }
        if (annualRate < 0) {
            showMessage("Annual Interest Rate cannot be negative.", true);
            clearResults();
            return;
        }
        if (termYears <= 0) {
            showMessage("Please enter a valid Loan Term (in years, must be greater than 0).", true);
            clearResults();
            return;
        }

        // Convert annual interest rate to monthly decimal rate
        const r_monthly = (annualRate / 100) / 12;
        // Convert loan term from years to months
        const n_months = termYears * 12;

        let emi = 0;

        // EMI formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
        // Where:
        // P = Principal Loan Amount
        // i = Monthly interest rate (annual interest rate / 12 / 100)
        // n = Loan term in months (loan term in years * 12)

        if (r_monthly === 0) {
            // If interest rate is 0, EMI is simply Principal / Number of Months
            emi = P / n_months;
        } else {
            const numerator = r_monthly * Math.pow((1 + r_monthly), n_months);
            const denominator = Math.pow((1 + r_monthly), n_months) - 1;
            emi = P * (numerator / denominator);
        }

        const totalPayment = emi * n_months;
        const totalInterestPayable = totalPayment - P;

        // Display results
        emiResult.textContent = formatCurrency(emi);
        totalInterestResult.textContent = formatCurrency(totalInterestPayable);
        totalPaymentResult.textContent = formatCurrency(totalPayment);

        showMessage("EMI calculated successfully!");
    }

    /**
     * Clears all input fields and result displays.
     */
    function clearFields() {
        loanAmountInput.value = "";
        annualInterestRateInput.value = "";
        loanTermYearsInput.value = "";
        clearResults();
        showMessage("All fields cleared.");
    }

    /**
     * Clears only the result display areas.
     */
    function clearResults() {
        emiResult.textContent = "$0.00";
        totalInterestResult.textContent = "$0.00";
        totalPaymentResult.textContent = "$0.00";
    }

    /**
     * Copies the calculated results to the clipboard.
     */
    function copyResults() {
        const resultsText = `
Equated Monthly Installment (EMI): ${emiResult.textContent}
Total Interest Payable: ${totalInterestResult.textContent}
Total Payment: ${totalPaymentResult.textContent}
        `.trim();

        if (emiResult.textContent === "$0.00") {
            showMessage("No results to copy. Please calculate first.", true);
            return;
        }

        // Create a temporary textarea to copy text from
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = resultsText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showMessage("Results copied to clipboard!");
            } else {
                showMessage("Failed to copy results to clipboard.", true);
            }
        } catch (err) {
            console.error('Oops, unable to copy', err);
            showMessage("Copy failed! Your browser might not support this feature.", true);
        } finally {
            document.body.removeChild(tempTextArea); // Clean up the temporary textarea
        }
    }

    // Event Listeners
    calculateBtn.addEventListener("click", calculateEMI);
    clearBtn.addEventListener("click", clearFields);
    copyResultsBtn.addEventListener("click", copyResults);

    // Initial state setup
    clearFields(); // Ensure fields are cleared on load
});
