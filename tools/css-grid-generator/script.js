document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const gridRowsInput = document.getElementById("gridRows");
    const gridColumnsInput = document.getElementById("gridColumns");
    const rowGapInput = document.getElementById("rowGap");
    const columnGapInput = document.getElementById("columnGap");
    const alignItemsSelect = document.getElementById("alignItems");
    const justifyItemsSelect = document.getElementById("justifyItems");
    const alignContentSelect = document.getElementById("alignContent");
    const justifyContentSelect = document.getElementById("justifyContent");
    const generateGridBtn = document.getElementById("generateGrid");
    const resetGridBtn = document.getElementById("resetGrid");
    const gridPreview = document.getElementById("gridPreview");
    const generatedCssPre = document.getElementById("generatedCss");
    const copyCssBtn = document.getElementById("copyCss");

    /**
     * Updates the live grid preview and generates the CSS code.
     */
    function updateGrid() {
        // Get values from input fields and select elements
        const rows = gridRowsInput.value.trim();
        const columns = gridColumnsInput.value.trim();
        const rowGap = rowGapInput.value;
        const columnGap = columnGapInput.value;
        const alignItems = alignItemsSelect.value;
        const justifyItems = justifyItemsSelect.value;
        const alignContent = alignContentSelect.value;
        const justifyContent = justifyContentSelect.value;

        // Apply CSS properties to the grid preview element
        gridPreview.style.gridTemplateRows = rows;
        gridPreview.style.gridTemplateColumns = columns;
        gridPreview.style.rowGap = `${rowGap}px`;
        gridPreview.style.columnGap = `${columnGap}px`;
        gridPreview.style.alignItems = alignItems;
        gridPreview.style.justifyItems = justifyItems;
        gridPreview.style.alignContent = alignContent;
        gridPreview.style.justifyContent = justifyContent;

        // Generate the CSS code string
        let cssCode = `.grid-container {\n`;
        cssCode += `  display: grid;\n`;
        if (rows) cssCode += `  grid-template-rows: ${rows};\n`;
        if (columns) cssCode += `  grid-template-columns: ${columns};\n`;
        cssCode += `  gap: ${rowGap}px ${columnGap}px;\n`; // Shorthand for gap
        cssCode += `  align-items: ${alignItems};\n`;
        cssCode += `  justify-items: ${justifyItems};\n`;
        cssCode += `  align-content: ${alignContent};\n`;
        cssCode += `  justify-content: ${justifyContent};\n`;
        cssCode += `}`;

        // Update the generated CSS display area
        generatedCssPre.textContent = cssCode;
    }

    /**
     * Resets all input fields and the grid preview to their default values.
     */
    function resetGrid() {
        // Reset input values
        gridRowsInput.value = "1fr 1fr";
        gridColumnsInput.value = "1fr 1fr";
        rowGapInput.value = "10";
        columnGapInput.value = "10";
        alignItemsSelect.value = "stretch";
        justifyItemsSelect.value = "stretch";
        alignContentSelect.value = "stretch";
        justifyContentSelect.value = "stretch";

        // Update the grid and CSS to reflect the reset values
        updateGrid();
    }

    // Add event listeners
    generateGridBtn.addEventListener("click", updateGrid);
    resetGridBtn.addEventListener("click", resetGrid);

    // Event listeners for real-time updates as user types/changes values
    gridRowsInput.addEventListener("input", updateGrid);
    gridColumnsInput.addEventListener("input", updateGrid);
    rowGapInput.addEventListener("input", updateGrid);
    columnGapInput.addEventListener("input", updateGrid);
    alignItemsSelect.addEventListener("change", updateGrid);
    justifyItemsSelect.addEventListener("change", updateGrid);
    alignContentSelect.addEventListener("change", updateGrid);
    justifyContentSelect.addEventListener("change", updateGrid);

    // Copy CSS to clipboard
    copyCssBtn.addEventListener("click", () => {
        const cssToCopy = generatedCssPre.textContent;
        navigator.clipboard.writeText(cssToCopy).then(() => {
            // Provide user feedback (e.g., a temporary message)
            const originalText = copyCssBtn.textContent;
            copyCssBtn.textContent = "Copied!";
            setTimeout(() => {
                copyCssBtn.textContent = originalText;
            }, 1500);
        }).catch(err => {
            console.error("Failed to copy CSS: ", err);
            // Fallback for older browsers or restricted environments
            const textArea = document.createElement("textarea");
            textArea.value = cssToCopy;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                const originalText = copyCssBtn.textContent;
                copyCssBtn.textContent = "Copied!";
                setTimeout(() => {
                    copyCssBtn.textContent = originalText;
                }, 1500);
            } catch (err) {
                console.error("Fallback copy failed: ", err);
                alert("Failed to copy CSS. Please copy it manually.");
            }
            document.body.removeChild(textArea);
        });
    });

    // Initial grid generation on page load
    updateGrid();
});
