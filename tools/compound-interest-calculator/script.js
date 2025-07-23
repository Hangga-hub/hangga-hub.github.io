// script.js for Compound Interest Calculator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const initialInvestmentInput = document.getElementById("initialInvestment");
    const annualAdditionInput = document.getElementById("annualAddition");
    const yearsToGrowInput = document.getElementById("yearsToGrow");
    const annualInterestRateInput = document.getElementById("annualInterestRate");
    const compoundingFrequencySelect = document.getElementById("compoundingFrequency");

    // Get references to result display elements
    const futureValueResult = document.getElementById("futureValueResult");
    const totalPrincipalInvestedResult = document.getElementById("totalPrincipalInvestedResult");
    const totalInterestEarnedResult = document.getElementById("totalInterestEarnedResult");

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
     * Calculates the future value of an investment with compound interest.
     */
    function calculateCompoundInterest() {
        // Get values from inputs, defaulting to 0 if empty or invalid
        const P = parseFloat(initialInvestmentInput.value) || 0; // Principal (initial investment)
        const PMT_annual = parseFloat(annualAdditionInput.value) || 0; // Annual Addition
        const t = parseFloat(yearsToGrowInput.value) || 0; // Years to Grow
        const r_annual = parseFloat(annualInterestRateInput.value) || 0; // Annual Interest Rate (%)
        const n = parseFloat(compoundingFrequencySelect.value) || 1; // Compounding Frequency per year

        // Input validation
        if (P < 0 || PMT_annual < 0 || t <= 0 || r_annual < 0) {
            showMessage("Please enter valid non-negative numbers for investments/additions/rate, and positive years to grow.", true);
            clearResults();
            return;
        }

        // Convert annual interest rate to decimal and then to rate per compounding period
        const r_decimal = r_annual / 100;
        const ratePerPeriod = r_decimal / n;

        // Total number of compounding periods
        const totalPeriods = t * n;

        let futureValue = 0;
        let futureValueOfLumpSum = 0;
        let futureValueOfAdditions = 0;

        // Calculate Future Value of the Initial Investment (Lump Sum)
        // FV_lump = P * (1 + r/n)^(nt)
        futureValueOfLumpSum = P * Math.pow((1 + ratePerPeriod), totalPeriods);

        // Calculate Future Value of Annual Additions (as an Ordinary Annuity)
        // PMT needs to be converted to amount per compounding period
        const PMT_per_period = PMT_annual / n;

        // FV_annuity = PMT_per_period * [((1 + r/n)^(nt) - 1) / (r/n)]
        if (ratePerPeriod === 0) {
            // If interest rate is 0, simply sum up additions
            futureValueOfAdditions = PMT_per_period * totalPeriods;
        } else {
            futureValueOfAdditions = PMT_per_period * ((Math.pow((1 + ratePerPeriod), totalPeriods) - 1) / ratePerPeriod);
        }

        futureValue = futureValueOfLumpSum + futureValueOfAdditions;

        // Calculate total principal invested (initial + all additions)
        const totalPrincipalInvested = P + (PMT_annual * t);

        // Calculate total interest earned
        const totalInterestEarned = futureValue - totalPrincipalInvested;

        // Display results
        futureValueResult.textContent = formatCurrency(futureValue);
        totalPrincipalInvestedResult.textContent = formatCurrency(totalPrincipalInvested);
        totalInterestEarnedResult.textContent = formatCurrency(totalInterestEarned);

        showMessage("Compound interest calculated successfully!");
    }

    /**
     * Clears all input fields and result displays.
     */
    function clearFields() {
        initialInvestmentInput.value = "";
        annualAdditionInput.value = "";
        yearsToGrowInput.value = "";
        annualInterestRateInput.value = "";
        compoundingFrequencySelect.value = "12"; // Reset to Monthly
        clearResults();
        showMessage("All fields cleared.");
    }

    /**
     * Clears only the result display areas.
     */
    function clearResults() {
        futureValueResult.textContent = "$0.00";
        totalPrincipalInvestedResult.textContent = "$0.00";
        totalInterestEarnedResult.textContent = "$0.00";
    }

    /**
     * Copies the calculated results to the clipboard.
     */
    function copyResults() {
        const resultsText = `
Future Value: ${futureValueResult.textContent}
Total Principal Invested: ${totalPrincipalInvestedResult.textContent}
Total Interest Earned: ${totalInterestEarnedResult.textContent}
        `.trim();

        if (futureValueResult.textContent === "$0.00") {
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
    calculateBtn.addEventListener("click", calculateCompoundInterest);
    clearBtn.addEventListener("click", clearFields);
    copyResultsBtn.addEventListener("click", copyResults);

    // Initial state setup
    clearFields(); // Ensure fields are cleared on load
});
