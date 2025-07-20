// script.js for CSS Gradient Generator

document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const startColorInput = document.getElementById('startColor');
    const endColorInput = document.getElementById('endColor');
    const gradientTypeSelect = document.getElementById('gradientType');
    const gradientAngleInput = document.getElementById('gradientAngle');
    const angleValueSpan = document.getElementById('angleValue');
    const angleControlGroup = document.getElementById('angleControl'); // To hide/show for radial
    const gradientPreview = document.getElementById('gradientPreview');
    const cssOutputTextarea = document.getElementById('cssOutput');
    const copyCssButton = document.getElementById('copyCssButton');
    const messageBox = document.getElementById('messageBox');

    // Function to generate the CSS gradient string
    function generateGradientCSS() {
        const startColor = startColorInput.value;
        const endColor = endColorInput.value;
        const gradientType = gradientTypeSelect.value;
        const angle = gradientAngleInput.value;

        let cssString = '';

        if (gradientType === 'linear') {
            cssString = `background: linear-gradient(${angle}deg, ${startColor}, ${endColor});`;
            // Ensure angle control is visible for linear gradients
            angleControlGroup.style.display = 'flex';
        } else if (gradientType === 'radial') {
            cssString = `background: radial-gradient(circle, ${startColor}, ${endColor});`;
            // Hide angle control for radial gradients
            angleControlGroup.style.display = 'none';
        }

        // Add vendor prefixes for broader compatibility (though modern browsers mostly don't need them)
        // Note: For simplicity, we apply the standard property to the preview,
        // but provide all prefixes in the copyable CSS.
        let fullCssOutput = cssString;
        if (gradientType === 'linear') {
            fullCssOutput += `\nbackground: -webkit-linear-gradient(${angle}deg, ${startColor}, ${endColor});`;
            fullCssOutput += `\nbackground: -moz-linear-gradient(${angle}deg, ${startColor}, ${endColor});`;
            fullCssOutput += `\nbackground: -o-linear-gradient(${angle}deg, ${startColor}, ${endColor});`;
        } else if (gradientType === 'radial') {
            fullCssOutput += `\nbackground: -webkit-radial-gradient(circle, ${startColor}, ${endColor});`;
            fullCssOutput += `\nbackground: -moz-radial-gradient(circle, ${startColor}, ${endColor});`;
            fullCssOutput += `\nbackground: -o-radial-gradient(circle, ${startColor}, ${endColor});`;
        }

        return fullCssOutput;
    }

    // Function to update the preview and CSS output
    function updateGradient() {
        const css = generateGradientCSS();
        // Apply only the standard CSS property to the preview element
        gradientPreview.style.background = css.split(';')[0].replace('background: ', '');
        cssOutputTextarea.value = css;
    }

    // Event listeners for input changes
    startColorInput.addEventListener('input', updateGradient);
    endColorInput.addEventListener('input', updateGradient);
    gradientTypeSelect.addEventListener('change', updateGradient);

    gradientAngleInput.addEventListener('input', () => {
        angleValueSpan.textContent = gradientAngleInput.value;
        updateGradient();
    });

    // Event listener for copy button
    copyCssButton.addEventListener('click', () => {
        cssOutputTextarea.select();
        cssOutputTextarea.setSelectionRange(0, 99999); // For mobile devices

        try {
            document.execCommand('copy');
            messageBox.textContent = 'CSS copied to clipboard!';
            messageBox.style.color = 'var(--cyber-neon-cyan)';
            messageBox.style.textShadow = '0 0 8px var(--cyber-neon-cyan)';
        } catch (err) {
            messageBox.textContent = 'Failed to copy CSS. Please copy manually.';
            messageBox.style.color = '#ff5555';
            messageBox.style.textShadow = '0 0 8px #ff5555';
            console.error('Copy command failed:', err);
        }

        // Clear message after a few seconds
        setTimeout(() => {
            messageBox.textContent = '';
        }, 3000);
    });

    // Initial gradient generation on page load
    updateGradient();
});
