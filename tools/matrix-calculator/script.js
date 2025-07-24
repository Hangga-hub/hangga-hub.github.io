document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const matrixAInput = document.getElementById("matrixAInput");
    const matrixBInput = document.getElementById("matrixBInput");
    const scalarInput = document.getElementById("scalarInput");
    const addBtn = document.getElementById("addBtn");
    const subtractBtn = document.getElementById("subtractBtn");
    const multiplyBtn = document.getElementById("multiplyBtn");
    const scalarABtn = document.getElementById("scalarABtn");
    const transposeABtn = document.getElementById("transposeABtn");
    const determinantABtn = document.getElementById("determinantABtn");
    const inverseABtn = document.getElementById("inverseABtn");
    const scalarBBtn = document.getElementById("scalarBBtn");
    const transposeBBtn = document.getElementById("transposeBBtn");
    const determinantBBtn = document.getElementById("determinantBBtn");
    const inverseBBtn = document.getElementById("inverseBBtn");
    const resetBtn = document.getElementById("resetBtn");
    const resultOutput = document.getElementById("resultOutput");
    const messageBox = document.getElementById("messageBox");

    // --- Default Values ---
    const defaultMatrixA = "1 2\n3 4";
    const defaultMatrixB = "5 6\n7 8";
    const defaultScalar = 2;

    matrixAInput.value = defaultMatrixA;
    matrixBInput.value = defaultMatrixB;
    scalarInput.value = defaultScalar;
    resultOutput.textContent = "Result will appear here.";

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
     * Parses a string input from a textarea into a 2D array (matrix).
     * Rows are separated by newlines, columns by spaces or commas.
     * @param {string} text - The input string.
     * @returns {number[][]|null} The parsed matrix or null if invalid format.
     */
    function parseMatrix(text) {
        const rows = text.trim().split('\n');
        if (rows.length === 0) return null;

        const matrix = [];
        let numCols = -1;

        for (const rowStr of rows) {
            // Split by one or more spaces or commas, filter out empty strings
            const row = rowStr.trim().split(/[\s,]+/).filter(Boolean).map(Number);

            // Check for non-numeric values
            if (row.some(isNaN)) {
                return null; // Contains non-numeric values
            }

            if (numCols === -1) {
                numCols = row.length;
            } else if (row.length !== numCols) {
                return null; // Inconsistent number of columns
            }
            matrix.push(row);
        }

        if (matrix.length === 0 || numCols === 0) {
            return null; // Empty matrix or empty rows
        }

        return matrix;
    }

    /**
     * Converts a 2D array (matrix) into a formatted string for display.
     * @param {number[][]} matrix - The matrix to display.
     * @returns {string} Formatted string.
     */
    function displayMatrix(matrix) {
        if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
            return "Empty Matrix";
        }
        // Determine max width for each column for alignment
        const colWidths = Array(matrix[0].length).fill(0);
        matrix.forEach(row => {
            row.forEach((cell, colIndex) => {
                colWidths[colIndex] = Math.max(colWidths[colIndex], String(cell).length);
            });
        });

        return matrix.map(row =>
            row.map((cell, colIndex) => String(cell).padStart(colWidths[colIndex], ' ')).join('  ')
        ).join('\n');
    }

    /**
     * Gets the dimensions [rows, columns] of a matrix.
     * @param {number[][]} matrix - The matrix.
     * @returns {number[]} Array [rows, columns].
     */
    function getMatrixDimensions(matrix) {
        if (!matrix || matrix.length === 0) return [0, 0];
        return [matrix.length, matrix[0].length];
    }

    // --- Matrix Operations ---

    /**
     * Adds two matrices.
     * @param {number[][]} A - Matrix A.
     * @param {number[][]} B - Matrix B.
     * @returns {number[][]|null} Resulting matrix or null if dimensions mismatch.
     */
    function addMatrices(A, B) {
        const [rowsA, colsA] = getMatrixDimensions(A);
        const [rowsB, colsB] = getMatrixDimensions(B);

        if (rowsA !== rowsB || colsA !== colsB) {
            throw new Error("Matrices must have the same dimensions for addition.");
        }

        const result = Array(rowsA).fill(0).map(() => Array(colsA).fill(0));
        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsA; j++) {
                result[i][j] = A[i][j] + B[i][j];
            }
        }
        return result;
    }

    /**
     * Subtracts matrix B from matrix A.
     * @param {number[][]} A - Matrix A.
     * @param {number[][]} B - Matrix B.
     * @returns {number[][]|null} Resulting matrix or null if dimensions mismatch.
     */
    function subtractMatrices(A, B) {
        const [rowsA, colsA] = getMatrixDimensions(A);
        const [rowsB, colsB] = getMatrixDimensions(B);

        if (rowsA !== rowsB || colsA !== colsB) {
            throw new Error("Matrices must have the same dimensions for subtraction.");
        }

        const result = Array(rowsA).fill(0).map(() => Array(colsA).fill(0));
        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsA; j++) {
                result[i][j] = A[i][j] - B[i][j];
            }
        }
        return result;
    }

    /**
     * Multiplies two matrices.
     * @param {number[][]} A - Matrix A.
     * @param {number[][]} B - Matrix B.
     * @returns {number[][]|null} Resulting matrix or null if dimensions mismatch.
     */
    function multiplyMatrices(A, B) {
        const [rowsA, colsA] = getMatrixDimensions(A);
        const [rowsB, colsB] = getMatrixDimensions(B);

        if (colsA !== rowsB) {
            throw new Error("Number of columns in Matrix A must equal number of rows in Matrix B for multiplication.");
        }

        const result = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                let sum = 0;
                for (let k = 0; k < colsA; k++) {
                    sum += A[i][k] * B[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    /**
     * Multiplies a matrix by a scalar.
     * @param {number} scalar - The scalar value.
     * @param {number[][]} matrix - The matrix.
     * @returns {number[][]} Resulting matrix.
     */
    function scalarMultiplyMatrix(scalar, matrix) {
        const [rows, cols] = getMatrixDimensions(matrix);
        const result = Array(rows).fill(0).map(() => Array(cols).fill(0));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j] = scalar * matrix[i][j];
            }
        }
        return result;
    }

    /**
     * Transposes a matrix.
     * @param {number[][]} matrix - The matrix.
     * @returns {number[][]} Transposed matrix.
     */
    function transposeMatrix(matrix) {
        const [rows, cols] = getMatrixDimensions(matrix);
        const result = Array(cols).fill(0).map(() => Array(rows).fill(0));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        return result;
    }

    /**
     * Calculates the determinant of a square matrix.
     * Supports up to 3x3 for direct calculation.
     * @param {number[][]} matrix - The matrix.
     * @returns {number} The determinant.
     */
    function determinantMatrix(matrix) {
        const [rows, cols] = getMatrixDimensions(matrix);
        if (rows !== cols) {
            throw new Error("Determinant can only be calculated for square matrices.");
        }

        if (rows === 1) {
            return matrix[0][0];
        } else if (rows === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        } else if (rows === 3) {
            return (
                matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
                matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
            );
        } else {
            throw new Error("Determinant calculation supported for 1x1, 2x2, and 3x3 matrices only in this tool.");
        }
    }

    /**
     * Calculates the inverse of a 2x2 matrix.
     * @param {number[][]} matrix - The 2x2 matrix.
     * @returns {number[][]|null} The inverse matrix or null if not invertible.
     */
    function inverseMatrix(matrix) {
        const [rows, cols] = getMatrixDimensions(matrix);
        if (rows !== 2 || cols !== 2) {
            throw new Error("Inverse calculation is currently supported for 2x2 matrices only.");
        }

        const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        if (det === 0) {
            throw new Error("Matrix is singular (determinant is zero) and cannot be inverted.");
        }

        const invDet = 1 / det;
        return [
            [matrix[1][1] * invDet, -matrix[0][1] * invDet],
            [-matrix[1][0] * invDet, matrix[0][0] * invDet]
        ];
    }

    /**
     * Generic handler for matrix operations.
     * @param {function} operationFn - The function to perform the matrix operation.
     * @param {string} matrixType - 'A', 'B', or 'AB' for binary operations.
     * @param {boolean} isScalarOp - True if it's a scalar multiplication.
     */
    function handleOperation(operationFn, matrixType, isScalarOp = false) {
        resultOutput.textContent = "Calculating...";
        showMessage(""); // Clear previous messages

        try {
            const matrixA = parseMatrix(matrixAInput.value);
            const matrixB = parseMatrix(matrixBInput.value);
            const scalar = parseFloat(scalarInput.value);

            if (isNaN(scalar) && isScalarOp) {
                showMessage("Invalid scalar value. Please enter a number.", true);
                resultOutput.textContent = "Error: Invalid scalar value.";
                return;
            }

            let result;
            if (matrixType === 'A') {
                if (!matrixA) {
                    showMessage("Invalid format for Matrix A. Please check your input.", true);
                    resultOutput.textContent = "Error: Invalid Matrix A.";
                    return;
                }
                result = isScalarOp ? operationFn(scalar, matrixA) : operationFn(matrixA);
            } else if (matrixType === 'B') {
                if (!matrixB) {
                    showMessage("Invalid format for Matrix B. Please check your input.", true);
                    resultOutput.textContent = "Error: Invalid Matrix B.";
                    return;
                }
                result = isScalarOp ? operationFn(scalar, matrixB) : operationFn(matrixB);
            } else if (matrixType === 'AB') {
                if (!matrixA || !matrixB) {
                    showMessage("Invalid format for Matrix A or Matrix B. Please check your inputs.", true);
                    resultOutput.textContent = "Error: Invalid Matrix A or B.";
                    return;
                }
                result = operationFn(matrixA, matrixB);
            }

            if (typeof result === 'number') {
                resultOutput.textContent = `Result: ${result}`;
            } else if (result) {
                resultOutput.textContent = displayMatrix(result);
            } else {
                resultOutput.textContent = "Operation resulted in an empty or null value.";
            }
            showMessage("Operation successful!");

        } catch (error) {
            console.error("Matrix operation error:", error);
            resultOutput.textContent = `Error: ${error.message}`;
            showMessage(`Error: ${error.message}`, true);
        } finally {
            resultOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Resets all inputs and output to default values.
     */
    function resetAll() {
        matrixAInput.value = defaultMatrixA;
        matrixBInput.value = defaultMatrixB;
        scalarInput.value = defaultScalar;
        resultOutput.textContent = "Result will appear here.";
        showMessage("All inputs reset.");
    }

    // --- Event Listeners ---
    addBtn.addEventListener("click", () => handleOperation(addMatrices, 'AB'));
    subtractBtn.addEventListener("click", () => handleOperation(subtractMatrices, 'AB'));
    multiplyBtn.addEventListener("click", () => handleOperation(multiplyMatrices, 'AB'));
    scalarABtn.addEventListener("click", () => handleOperation(scalarMultiplyMatrix, 'A', true));
    transposeABtn.addEventListener("click", () => handleOperation(transposeMatrix, 'A'));
    determinantABtn.addEventListener("click", () => handleOperation(determinantMatrix, 'A'));
    inverseABtn.addEventListener("click", () => handleOperation(inverseMatrix, 'A'));
    scalarBBtn.addEventListener("click", () => handleOperation(scalarMultiplyMatrix, 'B', true));
    transposeBBtn.addEventListener("click", () => handleOperation(transposeMatrix, 'B'));
    determinantBBtn.addEventListener("click", () => handleOperation(determinantMatrix, 'B'));
    inverseBBtn.addEventListener("click", () => handleOperation(inverseMatrix, 'B'));
    resetBtn.addEventListener("click", resetAll);
});
