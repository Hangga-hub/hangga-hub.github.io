// script.js for Glassmorphism Generator

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const blurAmountInput = document.getElementById("blurAmount");
    const blurValueDisplay = document.getElementById("blurValue");
    const bgColorInput = document.getElementById("bgColor");
    const bgOpacityInput = document.getElementById("bgOpacity");
    const bgOpacityValueDisplay = document.getElementById("bgOpacityValue");
    const borderColorInput = document.getElementById("borderColor");
    const borderOpacityInput = document.getElementById("borderOpacity");
    const borderOpacityValueDisplay = document.getElementById("borderOpacityValue");
    const borderRadiusInput = document.getElementById("borderRadius");
    const borderRadiusValueDisplay = document.getElementById("borderRadiusValue");
    const shadowToggle = document.getElementById("shadowToggle");
    const shadowControls = document.getElementById("shadowControls");
    const shadowColorInput = document.getElementById("shadowColor");
    const shadowOpacityInput = document.getElementById("shadowOpacity");
    const shadowOpacityValueDisplay = document.getElementById("shadowOpacityValue");
    const shadowBlurInput = document.getElementById("shadowBlur");
    const shadowBlurValueDisplay = document.getElementById("shadowBlurValue");
    const shadowSpreadInput = document.getElementById("shadowSpread");
    const shadowSpreadValueDisplay = document.getElementById("shadowSpreadValue");

    const glassElement = document.getElementById("glassElement");
    const cssOutput = document.getElementById("cssOutput");
    const copyCssBtn = document.getElementById("copyCssBtn");
    const resetBtn = document.getElementById("resetBtn");
    const messageBox = document.getElementById("messageBox");

    // --- Default Values ---
    const defaultValues = {
        blur: 5,
        bgColor: "#ffffff",
        bgOpacity: 10,
        borderColor: "#ffffff",
        borderOpacity: 30,
        borderRadius: 16,
        shadowEnabled: true,
        shadowColor: "#000000",
        shadowOpacity: 10,
        shadowBlur: 30,
        shadowSpread: 0
    };

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
        // Automatically hide the message after 3 seconds, but keep critical errors visible longer
        const hideDelay = isError ? 5000 : 3000;
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, hideDelay);
    }

    /**
     * Converts a hex color string to an RGB object.
     * @param {string} hex - The hex color string (e.g., "#RRGGBB").
     * @returns {object} An object with r, g, b properties.
     */
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    /**
     * Updates the glassmorphism effect on the preview element and generates CSS.
     */
    function updateGlassmorphism() {
        const blur = blurAmountInput.value;
        const bgColor = bgColorInput.value;
        const bgOpacity = bgOpacityInput.value / 100; // Convert to 0-1 range
        const borderColor = borderColorInput.value;
        const borderOpacity = borderOpacityInput.value / 100; // Convert to 0-1 range
        const borderRadius = borderRadiusInput.value;
        const shadowEnabled = shadowToggle.checked;
        const shadowColor = shadowColorInput.value;
        const shadowOpacity = shadowOpacityInput.value / 100;
        const shadowBlur = shadowBlurInput.value;
        const shadowSpread = shadowSpreadInput.value;

        // Update value displays
        blurValueDisplay.textContent = `${blur}px`;
        bgOpacityValueDisplay.textContent = `${bgOpacity * 100}%`;
        borderOpacityValueDisplay.textContent = `${borderOpacity * 100}%`;
        borderRadiusValueDisplay.textContent = `${borderRadius}px`;
        shadowOpacityValueDisplay.textContent = `${shadowOpacity * 100}%`;
        shadowBlurValueDisplay.textContent = `${shadowBlur}px`;
        shadowSpreadValueDisplay.textContent = `${shadowSpread}px`;

        // Convert hex colors to RGB for rgba()
        const rgbBg = hexToRgb(bgColor);
        const rgbBorder = hexToRgb(borderColor);
        const rgbShadow = hexToRgb(shadowColor);

        // Apply styles to the preview element
        glassElement.style.backdropFilter = `blur(${blur}px)`;
        glassElement.style.webkitBackdropFilter = `blur(${blur}px)`; // For Safari compatibility
        glassElement.style.backgroundColor = `rgba(${rgbBg.r}, ${rgbBg.g}, ${rgbBg.b}, ${bgOpacity.toFixed(2)})`;
        glassElement.style.border = `1px solid rgba(${rgbBorder.r}, ${rgbBorder.g}, ${rgbBorder.b}, ${borderOpacity.toFixed(2)})`;
        glassElement.style.borderRadius = `${borderRadius}px`;

        if (shadowEnabled) {
            shadowControls.style.display = 'block';
            glassElement.style.boxShadow = `0 4px ${shadowBlur}px ${shadowSpread}px rgba(${rgbShadow.r}, ${rgbShadow.g}, ${rgbShadow.b}, ${shadowOpacity.toFixed(2)})`;
        } else {
            shadowControls.style.display = 'none';
            glassElement.style.boxShadow = 'none';
        }

        // Generate CSS code
        let cssCode = `backdrop-filter: blur(${blur}px);\n`;
        cssCode += `-webkit-backdrop-filter: blur(${blur}px); /* Safari compatibility */\n`;
        cssCode += `background-color: rgba(${rgbBg.r}, ${rgbBg.g}, ${rgbBg.b}, ${bgOpacity.toFixed(2)});\n`;
        cssCode += `border: 1px solid rgba(${rgbBorder.r}, ${rgbBorder.g}, ${rgbBorder.b}, ${borderOpacity.toFixed(2)});\n`;
        cssCode += `border-radius: ${borderRadius}px;\n`;
        if (shadowEnabled) {
            cssCode += `box-shadow: 0 4px ${shadowBlur}px ${shadowSpread}px rgba(${rgbShadow.r}, ${rgbShadow.g}, ${rgbShadow.b}, ${shadowOpacity.toFixed(2)});\n`;
        }

        cssOutput.value = cssCode;
        copyCssBtn.disabled = !cssCode;
    }

    /**
     * Resets all controls to their default values.
     */
    function resetToDefaults() {
        blurAmountInput.value = defaultValues.blur;
        bgColorInput.value = defaultValues.bgColor;
        bgOpacityInput.value = defaultValues.bgOpacity;
        borderColorInput.value = defaultValues.borderColor;
        borderOpacityInput.value = defaultValues.borderOpacity;
        borderRadiusInput.value = defaultValues.borderRadius;
        shadowToggle.checked = defaultValues.shadowEnabled;
        shadowColorInput.value = defaultValues.shadowColor;
        shadowOpacityInput.value = defaultValues.shadowOpacity;
        shadowBlurInput.value = defaultValues.shadowBlur;
        shadowSpreadInput.value = defaultValues.shadowSpread;

        updateGlassmorphism(); // Apply the default values to preview and code
        showMessage("Settings reset to defaults.");
    }

    /**
     * Copies the generated CSS to the clipboard.
     */
    copyCssBtn.addEventListener("click", () => {
        if (cssOutput.value) {
            cssOutput.select();
            try {
                const successful = document.execCommand('copy');
                const msg = successful ? 'CSS copied to clipboard!' : 'Failed to copy text. Please copy manually.';
                showMessage(msg, !successful);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showMessage('Copying not supported or failed in this browser. Please copy manually.', true);
            }
        } else {
            showMessage("No CSS to copy.", true);
        }
    });

    // --- Event Listeners for controls ---
    blurAmountInput.addEventListener("input", updateGlassmorphism);
    bgColorInput.addEventListener("input", updateGlassmorphism);
    bgOpacityInput.addEventListener("input", updateGlassmorphism);
    borderColorInput.addEventListener("input", updateGlassmorphism);
    borderOpacityInput.addEventListener("input", updateGlassmorphism);
    borderRadiusInput.addEventListener("input", updateGlassmorphism);
    shadowToggle.addEventListener("change", updateGlassmorphism);
    shadowColorInput.addEventListener("input", updateGlassmorphism);
    shadowOpacityInput.addEventListener("input", updateGlassmorphism);
    shadowBlurInput.addEventListener("input", updateGlassmorphism);
    shadowSpreadInput.addEventListener("input", updateGlassmorphism);

    resetBtn.addEventListener("click", resetToDefaults);

    // Initial update to set default styles and generate initial CSS
    updateGlassmorphism();
});
