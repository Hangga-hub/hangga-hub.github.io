document.addEventListener('DOMContentLoaded', () => {
    // Get references to all necessary DOM elements
    const baseColorInput = document.getElementById('baseColorInput');
    const harmonySelect = document.getElementById('harmonySelect');
    const generatePaletteBtn = document.getElementById('generatePaletteBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const messageBox = document.getElementById('messageBox');
    const resultSection = document.getElementById('resultSection');
    const paletteContainer = document.getElementById('paletteContainer');
    const copyAllBtn = document.getElementById('copyAllBtn');

    /**
     * Shows a message in the message box.
     * @param {string} message - The message to display.
     * @param {string} type - The type of message ('success' or 'error').
     */
    const showMessage = (message, type = 'success') => {
        messageBox.textContent = message;
        messageBox.className = 'message-box show';
        if (type === 'error') {
            messageBox.classList.add('error');
        } else {
            messageBox.classList.remove('error');
        }
        // Hide message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000);
    };

    /**
     * Clears all inputs, results, and messages.
     */
    const clearForm = () => {
        baseColorInput.value = '';
        paletteContainer.innerHTML = '';
        messageBox.textContent = '';
        messageBox.classList.remove('show', 'error');
        // Auto scroll to the top of the card
        document.querySelector('.tool-converter-card').scrollIntoView({ behavior: 'smooth' });
    };

    /**
     * Converts a hex color to an RGB object.
     * @param {string} hex - The hex color code (e.g., #RRGGBB).
     * @returns {object|null} An object with r, g, b properties or null if invalid.
     */
    const hexToRgb = (hex) => {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    /**
     * Converts an RGB object to an HSL object.
     * @param {number} r - Red value (0-255).
     * @param {number} g - Green value (0-255).
     * @param {number} b - Blue value (0-255).
     * @returns {object} An object with h, s, l properties.
     */
    const rgbToHsl = (r, g, b) => {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
        return { h: h * 360, s: s * 100, l: l * 100 };
    };

    /**
     * Converts an HSL object to a hex color.
     * @param {number} h - Hue (0-360).
     * @param {number} s - Saturation (0-100).
     * @param {number} l - Lightness (0-100).
     * @returns {string} The hex color code.
     */
    const hslToHex = (h, s, l) => {
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
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    /**
     * Generates a random hex color code.
     * @returns {string} A random hex color code.
     */
    const getRandomColor = () => {
        const randomR = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const randomG = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const randomB = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        return `#${randomR}${randomG}${randomB}`;
    };

    /**
     * Generates a color palette based on a base color and a color harmony rule.
     * @param {string} baseHex - The base hex color code.
     * @param {string} harmony - The harmony rule ('monochromatic', 'analogous', etc.).
     * @returns {string[]} An array of hex color codes.
     */
    const generatePalette = (baseHex, harmony) => {
        const rgb = hexToRgb(baseHex);
        if (!rgb) {
            return [];
        }
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];

        switch (harmony) {
            case 'monochromatic':
                // Generates a palette with the same hue, but varying lightness
                for (let i = 0; i < 5; i++) {
                    const l = (hsl.l + (i - 2) * 15 + 100) % 100;
                    palette.push(hslToHex(hsl.h, hsl.s, l));
                }
                break;
            case 'analogous':
                // Generates a palette with colors next to each other on the color wheel
                for (let i = -2; i <= 2; i++) {
                    const h = (hsl.h + i * 30 + 360) % 360;
                    palette.push(hslToHex(h, hsl.s, hsl.l));
                }
                break;
            case 'complementary':
                // Generates a palette with the base color and its complement, plus variations
                palette.push(baseHex);
                palette.push(hslToHex((hsl.h + 180 + 360) % 360, hsl.s, hsl.l));
                palette.push(hslToHex((hsl.h + 180 + 360) % 360, hsl.s, (hsl.l + 20) % 100));
                palette.push(hslToHex(hsl.h, hsl.s, (hsl.l - 20 + 100) % 100));
                palette.push(hslToHex((hsl.h + 90 + 360) % 360, hsl.s, hsl.l));
                break;
            case 'triadic':
                // Generates a palette with three colors evenly spaced on the color wheel
                palette.push(baseHex);
                palette.push(hslToHex((hsl.h + 120 + 360) % 360, hsl.s, hsl.l));
                palette.push(hslToHex((hsl.h + 240 + 360) % 360, hsl.s, hsl.l));
                // Add variations
                palette.push(hslToHex((hsl.h + 120 + 360) % 360, hsl.s, (hsl.l + 20) % 100));
                palette.push(hslToHex((hsl.h + 240 + 360) % 360, hsl.s, (hsl.l - 20 + 100) % 100));
                break;
            default:
                return [];
        }
        return palette;
    };

    /**
     * Renders the color palette to the DOM.
     * @param {string[]} colors - An array of hex color codes.
     */
    const renderPalette = (colors) => {
        paletteContainer.innerHTML = '';
        colors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.style.backgroundColor = color;
            colorBox.classList.add('color-box');
            colorBox.innerHTML = `<span class="color-hex">${color}</span>`;

            // Add click event to copy hex code
            colorBox.addEventListener('click', () => {
                copyToClipboard(color);
                showMessage(`Copied: ${color}`, 'success');
            });

            paletteContainer.appendChild(colorBox);
        });

        // Ensure the result section is visible and scroll to it
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    };

    /**
     * Copies a string to the clipboard using the Clipboard API.
     * @param {string} text - The text to copy.
     */
    const copyToClipboard = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Text copied to clipboard successfully.');
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    };

    /**
     * Event handler for the "Generate Palette" button.
     */
    generatePaletteBtn.addEventListener('click', () => {
        let baseColor = baseColorInput.value.trim();
        const harmony = harmonySelect.value;

        // If the input is empty or invalid, generate a random color
        const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (!baseColor || !hexRegex.test(baseColor)) {
            baseColor = getRandomColor();
            baseColorInput.value = baseColor;
        }

        const newPalette = generatePalette(baseColor, harmony);
        renderPalette(newPalette);
    });

    /**
     * Event handler for the "Clear Form" button.
     */
    clearFormBtn.addEventListener('click', clearForm);

    /**
     * Event handler for the "Copy All Hex Codes" button.
     */
    copyAllBtn.addEventListener('click', () => {
        const colors = Array.from(paletteContainer.querySelectorAll('.color-hex')).map(el => el.textContent);
        if (colors.length > 0) {
            copyToClipboard(colors.join(', '));
            showMessage('All hex codes copied to clipboard!', 'success');
        } else {
            showMessage('No colors to copy.', 'error');
        }
    });

    // Initial generation on page load
    generatePaletteBtn.click();
});
