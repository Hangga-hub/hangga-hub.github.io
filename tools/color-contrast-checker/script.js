// tools/color-contrast-checker/script.js

document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const foregroundColorInput = document.getElementById("foregroundColor");
    const foregroundColorPicker = document.getElementById("foregroundColorPicker");
    const backgroundColorInput = document.getElementById("backgroundColor");
    const backgroundColorPicker = document.getElementById("backgroundColorPicker");
    const swapColorsBtn = document.getElementById("swapColorsBtn");
    const clearBtn = document.getElementById("clearBtn");
    const colorPreview = document.getElementById("colorPreview");
    const previewTextNormal = document.getElementById("previewTextNormal");
    const previewTextLarge = document.getElementById("previewTextLarge");
    const contrastRatioOutput = document.getElementById("contrastRatio");
    const normalTextAA = document.getElementById("normalTextAA");
    const largeTextAA = document.getElementById("largeTextAA");
    const normalTextAAA = document.getElementById("normalTextAAA");
    const largeTextAAA = document.getElementById("largeTextAAA");
    const messageBox = document.getElementById("messageBox");

    /**
     * Displays a message in the message box.
     * @param {string} message The message to display.
     * @param {string} type The type of message (e.g., 'success', 'error').
     */
    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = "block";
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000); // Hide after 3 seconds
    }

    /**
     * Converts a HEX color string to an RGB array [r, g, b].
     * @param {string} hex The HEX color string (e.g., "#RRGGBB" or "RRGGBB").
     * @returns {number[]|null} RGB array or null if invalid.
     */
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    /**
     * Converts an RGB color string (e.g., "rgb(255, 0, 0)") to an RGB array.
     * @param {string} rgb The RGB color string.
     * @returns {number[]|null} RGB array or null if invalid.
     */
    function rgbStringToRgb(rgb) {
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
        return match ? [
            parseInt(match[1], 10),
            parseInt(match[2], 10),
            parseInt(match[3], 10)
        ] : null;
    }

    /**
     * Converts an HSL color string (e.g., "hsl(0, 100%, 50%)") to an RGB array.
     * @param {string} hsl The HSL color string.
     * @returns {number[]|null} RGB array or null if invalid.
     */
    function hslStringToRgb(hsl) {
        const match = hsl.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/i);
        if (!match) return null;

        let h = parseInt(match[1], 10);
        let s = parseInt(match[2], 10) / 100;
        let l = parseInt(match[3], 10) / 100;

        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return [r, g, b];
    }

    /**
     * Converts any valid CSS color string (HEX, RGB, HSL) to an RGB array.
     * @param {string} colorString The CSS color string.
     * @returns {number[]|null} RGB array or null if invalid.
     */
    function parseColorToRgb(colorString) {
        colorString = colorString.trim();
        if (colorString.startsWith("#")) {
            return hexToRgb(colorString);
        } else if (colorString.startsWith("rgb")) {
            return rgbStringToRgb(colorString);
        } else if (colorString.startsWith("hsl")) {
            return hslStringToRgb(colorString);
        }
        // Attempt to use a dummy element for named colors or other valid CSS colors
        const dummy = document.createElement('div');
        dummy.style.color = colorString;
        document.body.appendChild(dummy);
        const computedColor = getComputedStyle(dummy).color;
        document.body.removeChild(dummy);

        if (computedColor.startsWith("rgb")) {
            return rgbStringToRgb(computedColor);
        }
        return null;
    }

    /**
     * Calculates the relative luminance of an RGB color.
     * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
     * Where R, G, B are sRGB values converted to linear RGB.
     * @param {number[]} rgb An array [r, g, b] where r, g, b are 0-255.
     * @returns {number} The relative luminance (0-1).
     */
    function getLuminance(rgb) {
        const [r, g, b] = rgb.map(c => {
            c /= 255; // convert to 0-1 range
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    /**
     * Calculates the contrast ratio between two colors.
     * Formula: (L1 + 0.05) / (L2 + 0.05)
     * Where L1 is the luminance of the lighter color, and L2 is the luminance of the darker color.
     * @param {string} color1 The first color string.
     * @param {string} color2 The second color string.
     * @returns {number|null} The contrast ratio, or null if colors are invalid.
     */
    function calculateContrastRatio(color1, color2) {
        const rgb1 = parseColorToRgb(color1);
        const rgb2 = parseColorToRgb(color2);

        if (!rgb1 || !rgb2) {
            return null; // Invalid color input
        }

        const l1 = getLuminance(rgb1);
        const l2 = getLuminance(rgb2);

        const brighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);

        return (brighter + 0.05) / (darker + 0.05);
    }

    /**
     * Checks WCAG compliance for a given contrast ratio.
     * @param {number} ratio The contrast ratio.
     * @param {string} type 'normal' or 'large' text.
     * @param {string} level 'AA' or 'AAA'.
     * @returns {boolean} True if compliant, false otherwise.
     */
    function checkCompliance(ratio, type, level) {
        if (ratio === null || isNaN(ratio)) return false;

        if (level === 'AA') {
            return type === 'normal' ? ratio >= 4.5 : ratio >= 3;
        } else if (level === 'AAA') {
            return type === 'normal' ? ratio >= 7 : ratio >= 4.5;
        }
        return false;
    }

    /**
     * Updates the compliance status badge.
     * @param {HTMLElement} element The HTML element for the badge.
     * @param {boolean} isCompliant True if compliant, false otherwise.
     */
    function updateComplianceBadge(element, isCompliant) {
        element.textContent = isCompliant ? "Pass" : "Fail";
        element.classList.remove("pass", "fail");
        element.classList.add(isCompliant ? "pass" : "fail");
    }

    /**
     * Updates the UI based on current foreground and background colors.
     */
    function updateUI() {
        const fgColor = foregroundColorInput.value;
        const bgColor = backgroundColorInput.value;

        // Update color pickers
        try {
            foregroundColorPicker.value = rgbToHex(parseColorToRgb(fgColor));
        } catch (e) { /* ignore invalid color for picker */ }
        try {
            backgroundColorPicker.value = rgbToHex(parseColorToRgb(bgColor));
        } catch (e) { /* ignore invalid color for picker */ }


        // Update preview
        colorPreview.style.backgroundColor = bgColor;
        previewTextNormal.style.color = fgColor;
        previewTextLarge.style.color = fgColor;

        const ratio = calculateContrastRatio(fgColor, bgColor);

        if (ratio !== null && !isNaN(ratio)) {
            contrastRatioOutput.textContent = `${ratio.toFixed(2)} : 1`;
            contrastRatioOutput.classList.remove("result-error");
            contrastRatioOutput.classList.add("neon-result"); // Ensure correct styling
        } else {
            contrastRatioOutput.textContent = "-- : 1";
            contrastRatioOutput.classList.add("result-error");
            contrastRatioOutput.classList.remove("neon-result");
            showMessage("Invalid color format. Please use HEX, RGB, or HSL.", "error");
        }

        // Update compliance badges
        updateComplianceBadge(normalTextAA, checkCompliance(ratio, 'normal', 'AA'));
        updateComplianceBadge(largeTextAA, checkCompliance(ratio, 'large', 'AA'));
        updateComplianceBadge(normalTextAAA, checkCompliance(ratio, 'normal', 'AAA'));
        updateComplianceBadge(largeTextAAA, checkCompliance(ratio, 'large', 'AAA'));
    }

    /**
     * Converts an RGB array to a HEX color string.
     * @param {number[]} rgb An array [r, g, b] where r, g, b are 0-255.
     * @returns {string} The HEX color string (e.g., "#RRGGBB").
     */
    function rgbToHex(rgb) {
        if (!rgb || rgb.length !== 3) return "#000000";
        return "#" + rgb.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    /**
     * Swaps the foreground and background colors.
     */
    function swapColors() {
        const currentFg = foregroundColorInput.value;
        const currentBg = backgroundColorInput.value;
        foregroundColorInput.value = currentBg;
        backgroundColorInput.value = currentFg;
        updateUI();
        showMessage("Colors swapped!", "success");
    }

    /**
     * Clears all inputs and resets UI.
     */
    function clearAll() {
        foregroundColorInput.value = "#FFFFFF";
        backgroundColorInput.value = "#000000";
        updateUI();
        showMessage("Cleared all fields.", "success");
    }

    // Event Listeners
    foregroundColorInput.addEventListener("input", updateUI);
    backgroundColorInput.addEventListener("input", updateUI);
    foregroundColorPicker.addEventListener("input", (event) => {
        foregroundColorInput.value = event.target.value;
        updateUI();
    });
    backgroundColorPicker.addEventListener("input", (event) => {
        backgroundColorInput.value = event.target.value;
        updateUI();
    });
    swapColorsBtn.addEventListener("click", swapColors);
    clearBtn.addEventListener("click", clearAll);

    // Initial UI update on page load
    updateUI();
});
