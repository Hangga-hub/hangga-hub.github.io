// script.js for Mortgage Calculator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const loanAmountInput = document.getElementById("loanAmount");
    const interestRateInput = document.getElementById("interestRate");
    const loanTermInput = document.getElementById("loanTerm");
    const downPaymentInput = document.getElementById("downPayment");
    const propertyTaxInput = document.getElementById("propertyTax");
    const homeInsuranceInput = document.getElementById("homeInsurance");

    // Get references to result display elements
    const monthlyPaymentResult = document.getElementById("monthlyPaymentResult");
    const totalPrincipalResult = document.getElementById("totalPrincipalResult");
    const totalInterestResult = document.getElementById("totalInterestResult");
    const totalCostResult = document.getElementById("totalCostResult");

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
     * Calculates the mortgage payments based on user inputs.
     */
    function calculateMortgage() {
        // Get values from inputs, defaulting to 0 if empty or invalid
        const loanAmount = parseFloat(loanAmountInput.value) || 0;
        const interestRate = parseFloat(interestRateInput.value) || 0;
        const loanTermYears = parseFloat(loanTermInput.value) || 0;
        const downPayment = parseFloat(downPaymentInput.value) || 0;
        const annualPropertyTax = parseFloat(propertyTaxInput.value) || 0;
        const annualHomeInsurance = parseFloat(homeInsuranceInput.value) || 0;

        // Input validation
        if (loanAmount <= 0) {
            showMessage("Please enter a valid Loan Amount.", true);
            clearResults();
            return;
        }
        if (loanTermYears <= 0) {
            showMessage("Please enter a valid Loan Term (in years).", true);
            clearResults();
            return;
        }
        if (downPayment >= loanAmount) {
            showMessage("Down Payment cannot be greater than or equal to Loan Amount.", true);
            clearResults();
            return;
        }
        if (interestRate < 0) {
            showMessage("Interest Rate cannot be negative.", true);
            clearResults();
            return;
        }

        // Calculate principal loan amount (after down payment)
        const principalLoanAmount = loanAmount - downPayment;

        // Convert annual interest rate to monthly decimal rate
        const monthlyInterestRate = (interestRate / 100) / 12;
        // Calculate total number of payments
        const numberOfPayments = loanTermYears * 12;

        let monthlyMortgagePayment;

        // Handle zero interest rate separately to avoid division by zero
        if (monthlyInterestRate === 0) {
            monthlyMortgagePayment = principalLoanAmount / numberOfPayments;
        } else {
            // Mortgage payment formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
            monthlyMortgagePayment = principalLoanAmount *
                                     (monthlyInterestRate * Math.pow((1 + monthlyInterestRate), numberOfPayments)) /
                                     (Math.pow((1 + monthlyInterestRate), numberOfPayments) - 1);
        }

        // Calculate monthly property tax and home insurance
        const monthlyPropertyTax = annualPropertyTax / 12;
        const monthlyHomeInsurance = annualHomeInsurance / 12;

        // Calculate total monthly payment (P&I + Tax + Insurance)
        const totalMonthlyPayment = monthlyMortgagePayment + monthlyPropertyTax + monthlyHomeInsurance;

        // Calculate total interest paid over the life of the loan
        const totalInterestPaid = (monthlyMortgagePayment * numberOfPayments) - principalLoanAmount;

        // Calculate total cost of the loan (Principal + Total Interest + Total Tax + Total Insurance)
        const totalCostOfLoan = principalLoanAmount + totalInterestPaid +
                                (annualPropertyTax * loanTermYears) + (annualHomeInsurance * loanTermYears);

        // Display results
        monthlyPaymentResult.textContent = formatCurrency(totalMonthlyPayment);
        totalPrincipalResult.textContent = formatCurrency(principalLoanAmount);
        totalInterestResult.textContent = formatCurrency(totalInterestPaid);
        totalCostResult.textContent = formatCurrency(totalCostOfLoan);

        showMessage("Mortgage calculated successfully!");
    }

    /**
     * Clears all input fields and result displays.
     */
    function clearFields() {
        loanAmountInput.value = "";
        interestRateInput.value = "";
        loanTermInput.value = "";
        downPaymentInput.value = "";
        propertyTaxInput.value = "";
        homeInsuranceInput.value = "";
        clearResults();
        showMessage("All fields cleared.");
    }

    /**
     * Clears only the result display areas.
     */
    function clearResults() {
        monthlyPaymentResult.textContent = "$0.00";
        totalPrincipalResult.textContent = "$0.00";
        totalInterestResult.textContent = "$0.00";
        totalCostResult.textContent = "$0.00";
    }

    /**
     * Copies the calculated results to the clipboard.
     */
    function copyResults() {
        const resultsText = `
Monthly Payment: ${monthlyPaymentResult.textContent}
Total Principal Paid: ${totalPrincipalResult.textContent}
Total Interest Paid: ${totalInterestResult.textContent}
Total Cost of Loan: ${totalCostResult.textContent}
        `.trim();

        if (monthlyPaymentResult.textContent === "$0.00") {
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
    calculateBtn.addEventListener("click", calculateMortgage);
    clearBtn.addEventListener("click", clearFields);
    copyResultsBtn.addEventListener("click", copyResults);

    // Initial state setup
    clearResults(); // Ensure results are cleared on load
});
