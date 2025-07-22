// script.js for Retirement Savings Calculator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const currentAgeInput = document.getElementById("currentAge");
    const retirementAgeInput = document.getElementById("retirementAge");
    const currentSavingsInput = document.getElementById("currentSavings");
    const monthlyContributionInput = document.getElementById("monthlyContribution");
    const annualInvestmentReturnInput = document.getElementById("annualInvestmentReturn");
    const annualInflationRateInput = document.getElementById("annualInflationRate");

    // Get references to result display elements
    const nominalSavingsResult = document.getElementById("nominalSavingsResult");
    const realSavingsResult = document.getElementById("realSavingsResult");
    const totalContributionsResult = document.getElementById("totalContributionsResult");
    const totalInterestResult = document.getElementById("totalInterestResult");

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
     * Calculates the estimated retirement savings.
     */
    function calculateRetirementSavings() {
        // Get values from inputs, defaulting to 0 if empty or invalid
        const currentAge = parseFloat(currentAgeInput.value) || 0;
        const retirementAge = parseFloat(retirementAgeInput.value) || 0;
        const currentSavings = parseFloat(currentSavingsInput.value) || 0;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
        const annualInvestmentReturn = parseFloat(annualInvestmentReturnInput.value) || 0;
        const annualInflationRate = parseFloat(annualInflationRateInput.value) || 0; // Optional, defaults to 0

        // Input validation
        if (currentAge <= 0 || retirementAge <= 0) {
            showMessage("Please enter valid positive ages.", true);
            clearResults();
            return;
        }
        if (retirementAge <= currentAge) {
            showMessage("Retirement Age must be greater than Current Age.", true);
            clearResults();
            return;
        }
        if (currentSavings < 0 || monthlyContribution < 0 || annualInvestmentReturn < 0 || annualInflationRate < 0) {
            showMessage("All monetary values and rates must be non-negative.", true);
            clearResults();
            return;
        }

        const yearsToRetirement = retirementAge - currentAge;
        const totalMonths = yearsToRetirement * 12;

        // Convert annual rates to monthly decimal rates
        const monthlyInvestmentRate = (annualInvestmentReturn / 100) / 12;
        const monthlyInflationRate = (annualInflationRate / 100) / 12;

        let futureValueOfCurrentSavings = currentSavings;
        let futureValueOfContributions = 0;

        // Calculate Future Value of Current Savings
        // FV = PV * (1 + r)^n
        if (monthlyInvestmentRate > 0) {
            futureValueOfCurrentSavings = currentSavings * Math.pow((1 + monthlyInvestmentRate), totalMonths);
        }
        // If monthlyInvestmentRate is 0, futureValueOfCurrentSavings remains currentSavings

        // Calculate Future Value of Monthly Contributions (Future Value of an Ordinary Annuity)
        // FV_annuity = P * [((1 + r)^n - 1) / r]
        if (monthlyInvestmentRate > 0) {
            futureValueOfContributions = monthlyContribution * ((Math.pow((1 + monthlyInvestmentRate), totalMonths) - 1) / monthlyInvestmentRate);
        } else {
            // If interest rate is 0, simply sum up contributions
            futureValueOfContributions = monthlyContribution * totalMonths;
        }

        const nominalTotalSavings = futureValueOfCurrentSavings + futureValueOfContributions;

        let realTotalSavings = nominalTotalSavings;
        // Calculate Inflation-Adjusted (Real) Total Savings
        // Real FV = Nominal FV / (1 + inflation_rate)^years
        if (annualInflationRate > 0) {
            realTotalSavings = nominalTotalSavings / Math.pow((1 + (annualInflationRate / 100)), yearsToRetirement);
        }

        const totalContributionsMade = currentSavings + (monthlyContribution * totalMonths);
        const totalInterestEarned = nominalTotalSavings - totalContributionsMade;

        // Display results
        nominalSavingsResult.textContent = formatCurrency(nominalTotalSavings);
        realSavingsResult.textContent = formatCurrency(realTotalSavings);
        totalContributionsResult.textContent = formatCurrency(totalContributionsMade);
        totalInterestResult.textContent = formatCurrency(totalInterestEarned);

        showMessage("Retirement savings calculated successfully!");
    }

    /**
     * Clears all input fields and result displays.
     */
    function clearFields() {
        currentAgeInput.value = "";
        retirementAgeInput.value = "";
        currentSavingsInput.value = "";
        monthlyContributionInput.value = "";
        annualInvestmentReturnInput.value = "";
        annualInflationRateInput.value = "";
        clearResults();
        showMessage("All fields cleared.");
    }

    /**
     * Clears only the result display areas.
     */
    function clearResults() {
        nominalSavingsResult.textContent = "$0.00";
        realSavingsResult.textContent = "$0.00";
        totalContributionsResult.textContent = "$0.00";
        totalInterestResult.textContent = "$0.00";
    }

    /**
     * Copies the calculated results to the clipboard.
     */
    function copyResults() {
        const resultsText = `
Estimated Retirement Savings (Nominal): ${nominalSavingsResult.textContent}
Estimated Retirement Savings (Inflation-Adjusted): ${realSavingsResult.textContent}
Total Contributions Made: ${totalContributionsResult.textContent}
Total Interest Earned: ${totalInterestResult.textContent}
        `.trim();

        if (nominalSavingsResult.textContent === "$0.00") {
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
    calculateBtn.addEventListener("click", calculateRetirementSavings);
    clearBtn.addEventListener("click", clearFields);
    copyResultsBtn.addEventListener("click", copyResults);

    // Initial state setup
    clearFields(); // Ensure fields are cleared on load
});
