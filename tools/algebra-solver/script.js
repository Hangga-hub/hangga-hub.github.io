document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const equationInput = document.getElementById("equationInput");
    const variableInput = document.getElementById("variableInput");
    const solveBtn = document.getElementById("solveBtn");
    const resetBtn = document.getElementById("resetBtn");
    const solutionOutput = document.getElementById("solutionOutput");
    const messageBox = document.getElementById("messageBox");

    // Initial state
    solutionOutput.textContent = "Enter an equation and variable, then click 'Solve Equation'.";

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
     * Parses a simple linear expression (e.g., "2x+5", "x-3", "7").
     * Returns an object { coefficient, constant } for the given variable.
     * @param {string} expression - The algebraic expression string.
     * @param {string} variable - The variable character (e.g., 'x').
     * @returns {object|null} An object with 'coefficient' and 'constant', or null if parsing fails.
     */
    function parseExpression(expression, variable) {
        // Remove all spaces for easier parsing
        expression = expression.replace(/\s/g, '');

        let coefficient = 0;
        let constant = 0;
        let terms = [];

        // Split by '+' and '-' while preserving the sign
        // Regex: /(?=[+-])/ splits before any + or - that is not at the beginning
        // or not part of a number (e.g., -5)
        const parts = expression.match(/([+-]?\d*\.?\d*[a-zA-Z]?)/g).filter(Boolean);

        for (const part of parts) {
            if (part.includes(variable)) {
                // This is a variable term
                const coeffStr = part.replace(variable, '');
                if (coeffStr === '' || coeffStr === '+') {
                    coefficient += 1;
                } else if (coeffStr === '-') {
                    coefficient -= 1;
                } else {
                    coefficient += parseFloat(coeffStr);
                }
            } else {
                // This is a constant term
                constant += parseFloat(part);
            }
        }

        return { coefficient, constant };
    }

    /**
     * Solves a linear equation and provides step-by-step explanations.
     */
    function solveEquation() {
        const equationStr = equationInput.value.trim();
        const variable = variableInput.value.trim();

        solutionOutput.innerHTML = ""; // Clear previous output
        solutionOutput.classList.remove("error-output"); // Clear error styling if any

        if (!equationStr.includes('=')) {
            showMessage("Equation must contain an '=' sign.", true);
            solutionOutput.textContent = "Invalid equation format.";
            return;
        }
        if (!variable || variable.length !== 1 || !/[a-zA-Z]/.test(variable)) {
            showMessage("Please enter a single letter for the variable (e.g., 'x', 'y').", true);
            solutionOutput.textContent = "Invalid variable.";
            return;
        }

        const sides = equationStr.split('=');
        if (sides.length !== 2) {
            showMessage("Equation must have exactly one '=' sign.", true);
            solutionOutput.textContent = "Invalid equation format.";
            return;
        }

        const leftSideStr = sides[0];
        const rightSideStr = sides[1];

        let steps = [];
        let finalSolution = "";

        try {
            const leftParsed = parseExpression(leftSideStr, variable);
            const rightParsed = parseExpression(rightSideStr, variable);

            if (leftParsed === null || rightParsed === null) {
                throw new Error("Could not parse equation. Please ensure it's a simple linear form.");
            }

            let a = leftParsed.coefficient - rightParsed.coefficient; // Coefficient of variable on left
            let b = leftParsed.constant; // Constant on left
            let c = rightParsed.constant; // Constant on right

            // Rearrange to form ax = d
            let d = c - b;

            steps.push(`Given equation: <strong>${equationStr}</strong>`);

            // Step 1: Move constants to the right side
            if (b !== 0) {
                const operation = b > 0 ? "Subtract" : "Add";
                const absB = Math.abs(b);
                steps.push(`1. ${operation} ${absB} from both sides:`);
                steps.push(`   ${a}${variable} + ${b} ${operation === "Subtract" ? "-" : "+"} ${absB} = ${c} ${operation === "Subtract" ? "-" : "+"} ${absB}`);
                steps.push(`   ${a}${variable} = ${d}`);
            } else {
                steps.push(`1. Equation is already in the form ${a}${variable} = ${d}.`);
            }


            // Step 2: Divide by coefficient of variable
            if (a === 0) {
                if (d === 0) {
                    finalSolution = "Infinite solutions (e.g., 0 = 0)";
                    steps.push("2. All terms with the variable cancelled out, resulting in 0 = 0. This means there are infinite solutions.");
                } else {
                    finalSolution = "No solution (e.g., 0 = 5)";
                    steps.push(`2. All terms with the variable cancelled out, resulting in ${d} = 0. This is a false statement, so there is no solution.`);
                }
            } else {
                steps.push(`2. Divide both sides by ${a} to isolate ${variable}:`);
                steps.push(`   ${a}${variable} / ${a} = ${d} / ${a}`);
                finalSolution = `${variable} = ${d / a}`;
                steps.push(`   ${finalSolution}`);
            }

            let outputHtml = `<ul>`;
            steps.forEach(step => {
                outputHtml += `<li>${step}</li>`;
            });
            outputHtml += `</ul>`;
            outputHtml += `<p><strong>Final Solution: ${finalSolution}</strong></p>`;
            solutionOutput.innerHTML = outputHtml;
            showMessage("Equation solved successfully!");

        } catch (error) {
            console.error("Error solving equation:", error);
            solutionOutput.innerHTML = `<p style="color: var(--cyber-neon-pink);">Error: ${error.message || "Could not solve the equation. Please check the format."}</p>`;
            solutionOutput.classList.add("error-output");
            showMessage("Error solving equation. See output for details.", true);
        } finally {
            // Scroll to the output section
            solutionOutput.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    /**
     * Resets all inputs and outputs to their default states.
     */
    function resetTool() {
        equationInput.value = "2x + 5 = 15";
        variableInput.value = "x";
        solutionOutput.textContent = "Enter an equation and variable, then click 'Solve Equation'.";
        solutionOutput.classList.remove("error-output");
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Tool reset.");
    }

    // Add event listeners
    solveBtn.addEventListener("click", solveEquation);
    resetBtn.addEventListener("click", resetTool);

    // Initial setup (optional: solve on load with default values)
    // solveEquation();
});
