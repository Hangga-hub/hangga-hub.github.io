// script.js for Savings Goal Tracker

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const goalNameInput = document.getElementById("goalName");
    const targetAmountInput = document.getElementById("targetAmount");
    const currentSavingsInput = document.getElementById("currentSavings");
    const monthlyContributionInput = document.getElementById("monthlyContribution");

    // Get references to result display elements
    const amountNeededResult = document.getElementById("amountNeededResult");
    const timeToGoalResult = document.getElementById("timeToGoalResult");
    const dateToGoalResult = document.getElementById("dateToGoalResult");

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
     * Calculates the savings goal progress and estimated time/date.
     */
    function calculateSavingsGoal() {
        // Get values from inputs, defaulting to 0 if empty or invalid
        const goalName = goalNameInput.value.trim();
        const targetAmount = parseFloat(targetAmountInput.value) || 0;
        const currentSavings = parseFloat(currentSavingsInput.value) || 0;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;

        // Input validation
        if (targetAmount <= 0) {
            showMessage("Please enter a valid Target Amount (must be greater than 0).", true);
            clearResults();
            return;
        }
        if (currentSavings < 0 || monthlyContribution < 0) {
            showMessage("Current Savings and Monthly Contribution cannot be negative.", true);
            clearResults();
            return;
        }

        const amountNeeded = targetAmount - currentSavings;

        // Display Amount Needed
        amountNeededResult.textContent = formatCurrency(amountNeeded);

        if (amountNeeded <= 0) {
            timeToGoalResult.textContent = "Goal already met!";
            dateToGoalResult.textContent = "Today!";
            showMessage(`Congratulations! Your goal "${goalName}" is already met.`);
            return;
        }

        if (monthlyContribution <= 0) {
            timeToGoalResult.textContent = "N/A (No contributions)";
            dateToGoalResult.textContent = "N/A (No contributions)";
            showMessage("To estimate time, please enter a monthly contribution.", true);
            return;
        }

        const monthsToReachGoal = amountNeeded / monthlyContribution;
        const years = Math.floor(monthsToReachGoal / 12);
        const months = Math.ceil(monthsToReachGoal % 12); // Round up to nearest month

        timeToGoalResult.textContent = `${years} years, ${months} months`;

        // Calculate estimated date to reach goal
        const currentDate = new Date();
        const estimatedDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthsToReachGoal, currentDate.getDate());
        dateToGoalResult.textContent = estimatedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        showMessage(`Goal "${goalName}" tracking updated!`);
    }

    /**
     * Clears all input fields and result displays.
     */
    function clearFields() {
        goalNameInput.value = "";
        targetAmountInput.value = "";
        currentSavingsInput.value = "";
        monthlyContributionInput.value = "";
        clearResults();
        showMessage("All fields cleared.");
    }

    /**
     * Clears only the result display areas.
     */
    function clearResults() {
        amountNeededResult.textContent = "$0.00";
        timeToGoalResult.textContent = "0 years, 0 months";
        dateToGoalResult.textContent = "N/A";
    }

    /**
     * Copies the calculated results to the clipboard.
     */
    function copyResults() {
        const resultsText = `
Goal Name: ${goalNameInput.value.trim() || "N/A"}
Target Amount: ${formatCurrency(parseFloat(targetAmountInput.value) || 0)}
Current Savings: ${formatCurrency(parseFloat(currentSavingsInput.value) || 0)}
Monthly Contribution: ${formatCurrency(parseFloat(monthlyContributionInput.value) || 0)}

Amount Still Needed: ${amountNeededResult.textContent}
Estimated Time to Goal: ${timeToGoalResult.textContent}
Estimated Date to Reach Goal: ${dateToGoalResult.textContent}
        `.trim();

        if (amountNeededResult.textContent === "$0.00" && parseFloat(targetAmountInput.value) > 0) {
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
    calculateBtn.addEventListener("click", calculateSavingsGoal);
    clearBtn.addEventListener("click", clearFields);
    copyResultsBtn.addEventListener("click", copyResults);

    // Initial state setup
    clearFields(); // Ensure fields are cleared on load
});
