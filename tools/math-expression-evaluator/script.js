document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const expressionInput = document.getElementById("expressionInput");
    const variablesInput = document.getElementById("variablesInput");
    const evaluateBtn = document.getElementById("evaluateBtn");
    const resetBtn = document.getElementById("resetBtn");
    const resultOutput = document.getElementById("resultOutput");
    const messageBox = document.getElementById("messageBox");

    // --- Initial State ---
    resultOutput.textContent = "The evaluation result will appear here.";

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("show", "error");
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");

        // Hide message after 5 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 5000);
    }

    /**
     * Evaluates the mathematical expression.
     */
    function evaluateExpression() {
        const expression = expressionInput.value.trim();
        const variablesJson = variablesInput.value.trim();

        resultOutput.textContent = "Evaluating...";
        showMessage(""); // Clear previous messages

        if (!expression) {
            resultOutput.textContent = "Please enter an expression to evaluate.";
            showMessage("Please enter an expression.", true);
            return;
        }

        let scope = {}; // Object to hold variables for math.js
        if (variablesJson) {
            try {
                scope = JSON.parse(variablesJson);
            } catch (e) {
                resultOutput.textContent = "Error: Invalid JSON for variables. Please check syntax.";
                showMessage("Invalid JSON for variables.", true);
                return;
            }
        }

        try {
            // Evaluate the expression using math.js
            const result = math.evaluate(expression, scope);
            resultOutput.textContent = result;
            showMessage("Expression evaluated successfully!");
        } catch (error) {
            console.error("Math.js evaluation error:", error);
            resultOutput.textContent = `Error: ${error.message}`;
            showMessage(`Error evaluating expression: ${error.message}`, true);
        } finally {
            resultOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Resets all inputs and output to their default states.
     */
    function resetTool() {
        expressionInput.value = "(2 * x + 3) / y + sin(pi/2)";
        variablesInput.value = `{
    "x": 5,
    "y": 2
}`;
        resultOutput.textContent = "The evaluation result will appear here.";
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Tool reset.");
    }

    // --- Event Listeners ---
    evaluateBtn.addEventListener("click", evaluateExpression);
    resetBtn.addEventListener("click", resetTool);
});
