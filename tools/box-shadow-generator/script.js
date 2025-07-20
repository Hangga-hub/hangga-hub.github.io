// script.js for Box Shadow Generator

document.addEventListener('DOMContentLoaded', () => {
    // Get all input elements
    const offsetXInput = document.getElementById('offsetX');
    const offsetYInput = document.getElementById('offsetY');
    const blurRadiusInput = document.getElementById('blurRadius');
    const spreadRadiusInput = document.getElementById('spreadRadius');
    const shadowColorInput = document.getElementById('shadowColor');
    const opacityInput = document.getElementById('opacity');
    const insetShadowCheckbox = document.getElementById('insetShadow');

    // Get value display spans
    const offsetXValueSpan = document.getElementById('offsetXValue');
    const offsetYValueSpan = document.getElementById('offsetYValue');
    const blurRadiusValueSpan = document.getElementById('blurRadiusValue');
    const spreadRadiusValueSpan = document.getElementById('spreadRadiusValue');
    const opacityValueSpan = document.getElementById('opacityValue');

    // Get output elements
    const previewBox = document.getElementById('previewBox');
    const cssOutput = document.getElementById('cssOutput');
    const copyCssButton = document.getElementById('copyCssButton');
    const messageBox = document.getElementById('messageBox');

    // Function to update the shadow and CSS code
    function updateShadow() {
        const offsetX = offsetXInput.value;
        const offsetY = offsetYInput.value;
        const blurRadius = blurRadiusInput.value;
        const spreadRadius = spreadRadiusInput.value;
        const shadowColor = shadowColorInput.value; // e.g., #RRGGBB
        const opacity = opacityInput.value;
        const inset = insetShadowCheckbox.checked ? 'inset' : '';

        // Update value displays
        offsetXValueSpan.textContent = offsetX;
        offsetYValueSpan.textContent = offsetY;
        blurRadiusValueSpan.textContent = blurRadius;
        spreadRadiusValueSpan.textContent = spreadRadius;
        opacityValueSpan.textContent = opacity;

        // Convert hex color to RGBA for opacity
        const hexToRgb = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `${r}, ${g}, ${b}`;
        };

        const rgbaColor = `rgba(${hexToRgb(shadowColor)}, ${opacity})`;

        // Construct the box-shadow CSS string
        const boxShadowCss = `${inset} ${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`.trim();

        // Apply to preview box
        previewBox.style.boxShadow = boxShadowCss;

        // Update CSS output textarea
        cssOutput.value = `box-shadow: ${boxShadowCss};`;
    }

    // Add event listeners to all controls
    offsetXInput.addEventListener('input', updateShadow);
    offsetYInput.addEventListener('input', updateShadow);
    blurRadiusInput.addEventListener('input', updateShadow);
    spreadRadiusInput.addEventListener('input', updateShadow);
    shadowColorInput.addEventListener('input', updateShadow);
    opacityInput.addEventListener('input', updateShadow);
    insetShadowCheckbox.addEventListener('change', updateShadow); // 'change' for checkboxes

    // Copy CSS to clipboard
    copyCssButton.addEventListener('click', () => {
        cssOutput.select();
        try {
            document.execCommand('copy');
            messageBox.textContent = 'CSS copied to clipboard!';
            messageBox.style.color = 'var(--cyber-neon-cyan)';
            messageBox.style.textShadow = '0 0 8px var(--cyber-neon-cyan)';
        } catch (err) {
            messageBox.textContent = 'Failed to copy CSS!';
            messageBox.style.color = '#ff5555';
            messageBox.style.textShadow = '0 0 8px #ff5555';
            console.error('Failed to copy text: ', err);
        }
        setTimeout(() => {
            messageBox.textContent = '';
        }, 3000); // Clear message after 3 seconds
    });

    // Initial update to set default shadow on load
    updateShadow();
});
