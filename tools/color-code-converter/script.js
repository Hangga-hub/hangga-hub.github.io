// tools/color-code-converter/script.js

document.addEventListener('DOMContentLoaded', () => {
    const hexInput = document.getElementById('hexInput');
    const rgbInput = document.getElementById('rgbInput');
    const hslInput = document.getElementById('hslInput');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const colorPreview = document.getElementById('colorPreview');
    const outputHex = document.getElementById('outputHex');
    const outputRgb = document.getElementById('outputRgb');
    const outputHsl = document.getElementById('outputHsl');
    const outputSection = document.querySelector('.output-section'); // For scrolling

    /**
     * Displays a message in a specified message box.
     * @param {HTMLElement} element - The message box HTML element.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.classList.remove('error');
        if (isError) {
            element.classList.add('error');
        }
        element.classList.add('show');
        setTimeout(() => {
            element.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Resets all input and output fields.
     */
    const resetOutputs = () => {
        hexInput.value = '';
        rgbInput.value = '';
        hslInput.value = '';
        outputHex.textContent = 'N/A';
        outputRgb.textContent = 'N/A';
        outputHsl.textContent = 'N/A';
        colorPreview.style.backgroundColor = 'transparent';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    /**
     * Converts Hex to RGB.
     * @param {string} hex - Hex color string (e.g., "#FF00FF" or "FF00FF").
     * @returns {Array|null} [r, g, b] array or null if invalid.
     */
    const hexToRgb = (hex) => {
        let hexValue = hex.startsWith('#') ? hex.slice(1) : hex;

        // Handle 3-digit hex (e.g., #F0F -> #FF00FF)
        if (hexValue.length === 3) {
            hexValue = hexValue.split('').map(char => char + char).join('');
        }

        if (!/^[0-9A-Fa-f]{6}$/.test(hexValue)) {
            return null; // Invalid hex format (neither 3 nor 6 valid digits)
        }

        const r = parseInt(hexValue.substring(0, 2), 16);
        const g = parseInt(hexValue.substring(2, 4), 16);
        const b = parseInt(hexValue.substring(4, 6), 16);
        return [r, g, b];
    };

    /**
     * Converts RGB to Hex.
     * @param {number} r - Red value (0-255).
     * @param {number} g - Green value (0-255).
     * @param {number} b - Blue value (0-255).
     * @returns {string} Hex color string (e.g., "#FF00FF").
     */
    const rgbToHex = (r, g, b) => {
        const toHex = (c) => {
            const hex = Math.round(c).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    /**
     * Converts RGB to HSL.
     * @param {number} r - Red value (0-255).
     * @param {number} g - Green value (0-255).
     * @param {number} b - Blue value (0-255).
     * @returns {Array} [h, s, l] array (h: 0-360, s: 0-100, l: 0-100).
     */
    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    };

    /**
     * Converts HSL to RGB.
     * @param {number} h - Hue value (0-360).
     * @param {number} s - Saturation value (0-100).
     * @param {number} l - Lightness value (0-100).
     * @returns {Array} [r, g, b] array (0-255).
     */
    const hslToRgb = (h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    /**
     * Parses RGB string to array.
     * @param {string} rgbStr - RGB string (e.g., "255,0,255" or "rgb(255,0,255)").
     * @returns {Array|null} [r, g, b] array or null if invalid.
     */
    const parseRgbString = (rgbStr) => {
        const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/i) ||
                      rgbStr.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (match && match.length >= 4) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
                return [r, g, b];
            }
        }
        return null;
    };

    /**
     * Parses HSL string to array.
     * @param {string} hslStr - HSL string (e.g., "300,100%,50%" or "hsl(300,100%,50%)").
     * @returns {Array|null} [h, s, l] array or null if invalid.
     */
    const parseHslString = (hslStr) => {
        const match = hslStr.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*(\d*\.?\d+))?\)/i) ||
                      hslStr.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
        if (match && match.length >= 4) {
            const h = parseInt(match[1]);
            const s = parseInt(match[2]);
            const l = parseInt(match[3]);
            if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
                return [h, s, l];
            }
        }
        return null;
    };

    /**
     * Handles the color conversion based on the input provided.
     */
    const handleConversion = () => {
        const hex = hexInput.value.trim();
        const rgb = rgbInput.value.trim();
        const hsl = hslInput.value.trim();

        // Check if any input is present first
        if (!hex && !rgb && !hsl) {
            showMessage(messageBox, 'Please enter a color code in Hex, RGB, or HSL format.', true);
            // No need to hide spinner as it wasn't shown
            return;
        }

        // Now, clear previous outputs and show loading state
        // (but don't clear the *current* input values yet)
        outputHex.textContent = 'N/A';
        outputRgb.textContent = 'N/A';
        outputHsl.textContent = 'N/A';
        colorPreview.style.backgroundColor = 'transparent';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        
        showMessage(messageBox, 'Converting...', false);
        loadingSpinner.style.display = 'block';

        let r, g, b, h, s, l;
        let inputType = null;

        // Determine input type and convert to RGB (central format)
        if (hex) {
            const rgbArr = hexToRgb(hex);
            if (rgbArr) {
                [r, g, b] = rgbArr;
                inputType = 'hex';
            } else {
                showMessage(messageBox, 'Invalid Hex code format.', true);
                loadingSpinner.style.display = 'none';
                return;
            }
        } else if (rgb) {
            const rgbArr = parseRgbString(rgb);
            if (rgbArr) {
                [r, g, b] = rgbArr;
                inputType = 'rgb';
            } else {
                showMessage(messageBox, 'Invalid RGB code format. Use R,G,B or rgb(R,G,B).', true);
                loadingSpinner.style.display = 'none';
                return;
            }
        } else if (hsl) {
            const hslArr = parseHslString(hsl);
            if (hslArr) {
                [h, s, l] = hslArr;
                [r, g, b] = hslToRgb(h, s, l);
                inputType = 'hsl';
            } else {
                showMessage(messageBox, 'Invalid HSL code format. Use H,S%,L% or hsl(H,S%,L%).', true);
                loadingSpinner.style.display = 'none';
                return;
            }
        }
        // No 'else' needed here, as the initial check handles empty inputs.

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';

            if (inputType) {
                // Convert to all formats from the central RGB
                const convertedHex = rgbToHex(r, g, b);
                const convertedRgb = `rgb(${r},${g},${b})`;
                const convertedHslArr = rgbToHsl(r, g, b);
                const convertedHsl = `hsl(${convertedHslArr[0]},${convertedHslArr[1]}%,${convertedHslArr[2]}%)`;

                // Update outputs
                outputHex.textContent = convertedHex.toUpperCase();
                outputRgb.textContent = convertedRgb;
                outputHsl.textContent = convertedHsl;
                colorPreview.style.backgroundColor = convertedRgb; // Use RGB for preview

                showMessage(resultsMessageBox, 'Conversion successful!', false);
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // This else block should ideally not be reached if inputType is determined
                showMessage(resultsMessageBox, 'An unexpected error occurred during conversion.', true);
            }
        }, 500);
    };

    // Event Listeners
    convertBtn.addEventListener('click', handleConversion);
    clearBtn.addEventListener('click', resetOutputs);

    // Add event listeners to input fields for real-time conversion (optional, but good UX)
    // You might want to debounce this for performance on very fast typing
    const inputFields = [hexInput, rgbInput, hslInput];
    inputFields.forEach(input => {
        input.addEventListener('input', (e) => {
            // Clear other inputs when one is typed into
            if (e.target.id === 'hexInput') {
                rgbInput.value = '';
                hslInput.value = '';
            } else if (e.target.id === 'rgbInput') {
                hexInput.value = '';
                hslInput.value = '';
            } else if (e.target.id === 'hslInput') {
                hexInput.value = '';
                rgbInput.value = '';
            }
            // Trigger conversion on input change, but only if there's content
            if (e.target.value.trim()) {
                handleConversion();
            } else {
                // If input is cleared, reset outputs
                resetOutputs();
            }
        });
        // Also allow Enter key to trigger conversion
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission if in a form
                handleConversion();
            }
        });
    });

    // Initial state setup
    resetOutputs();
});
