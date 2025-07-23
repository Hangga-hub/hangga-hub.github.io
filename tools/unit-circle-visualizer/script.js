// script.js for Unit Circle Visualizer

document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const canvas = document.getElementById("unitCircleCanvas");
    const ctx = canvas.getContext("2d");
    const angleInput = document.getElementById("angleInput");
    const angleUnitRadios = document.querySelectorAll('input[name="angleUnit"]');
    const visualizeBtn = document.getElementById("visualizeBtn");
    const clearBtn = document.getElementById("clearBtn");
    const sineValueSpan = document.getElementById("sineValue");
    const cosineValueSpan = document.getElementById("cosineValue");
    const tangentValueSpan = document.getElementById("tangentValue");
    const messageBox = document.getElementById("messageBox");

    // Canvas properties
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150; // Radius of the unit circle

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
        // Automatically hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, 3000);
    }

    /**
     * Draws the unit circle, axes, and quadrant labels.
     */
    function drawUnitCircle() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background circle (optional, for visual flair)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#1a1a1f'; // Slightly darker background for the circle area
        ctx.fill();

        // Draw the main unit circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'var(--cyber-neon-cyan)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw X-axis
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.strokeStyle = 'rgba(238, 238, 238, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw Y-axis
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.strokeStyle = 'rgba(238, 238, 238, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--cyber-neon-pink)';
        ctx.fill();

        // Add axis labels (0, 90, 180, 270 degrees)
        ctx.font = '14px Arial';
        ctx.fillStyle = 'var(--text)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText('0°/360°', centerX + radius + 30, centerY);
        ctx.fillText('90°', centerX, centerY - radius - 20);
        ctx.fillText('180°', centerX - radius - 30, centerY);
        ctx.fillText('270°', centerX, centerY + radius + 20);
    }

    /**
     * Visualizes the given angle on the unit circle and displays trigonometric values.
     */
    function visualizeAngle() {
        let angleValue = parseFloat(angleInput.value);
        if (isNaN(angleValue)) {
            showMessage("Please enter a valid number for the angle.", true);
            return;
        }

        let isDegrees = document.querySelector('input[name="angleUnit"]:checked').value === 'degrees';
        let angleRadians;
        let angleDegreesForDisplay = angleValue;

        if (isDegrees) {
            angleRadians = angleValue * (Math.PI / 180);
        } else {
            angleRadians = angleValue;
            angleDegreesForDisplay = angleValue * (180 / Math.PI);
        }

        // Normalize angle to be within 0 to 360 degrees for consistent visualization
        let normalizedDegrees = angleDegreesForDisplay % 360;
        if (normalizedDegrees < 0) {
            normalizedDegrees += 360;
        }
        let normalizedRadians = normalizedDegrees * (Math.PI / 180);

        drawUnitCircle(); // Redraw base circle

        // Calculate coordinates on the circle
        const x = centerX + radius * Math.cos(normalizedRadians);
        const y = centerY - radius * Math.sin(normalizedRadians); // Y-axis is inverted in canvas

        // Draw the radius line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'var(--cyber-neon-pink)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the point on the circle
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--cyber-neon-yellow)';
        ctx.fill();

        // Draw the angle arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius / 4, 0, -normalizedRadians, true); // Start from 0, go counter-clockwise if angle is positive
        ctx.strokeStyle = 'rgba(0, 255, 247, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the right-angled triangle (if not on an axis)
        if (Math.abs(Math.cos(normalizedRadians)) > 1e-9 && Math.abs(Math.sin(normalizedRadians)) > 1e-9) {
            // Draw horizontal line (adjacent side / cosine)
            ctx.beginPath();
            ctx.moveTo(centerX, y);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)'; // Yellow for cosine
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Draw vertical line (opposite side / sine)
            ctx.beginPath();
            ctx.moveTo(x, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)'; // Green for sine
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Calculate and display trigonometric values
        const sinVal = Math.sin(normalizedRadians);
        const cosVal = Math.cos(normalizedRadians);
        let tanVal = sinVal / cosVal;

        sineValueSpan.textContent = sinVal.toFixed(4);
        cosineValueSpan.textContent = cosVal.toFixed(4);

        // Handle tangent for angles where cosine is zero (90, 270 degrees)
        if (Math.abs(cosVal) < 1e-9) { // Check for near zero cosine
            tangentValueSpan.textContent = "Undefined";
            tangentValueSpan.style.color = 'var(--cyber-neon-pink)';
        } else {
            tangentValueSpan.textContent = tanVal.toFixed(4);
            tangentValueSpan.style.color = 'var(--text)';
        }

        showMessage(`Visualized angle: ${angleValue}${isDegrees ? '°' : ' rad'}`);
    }

    /**
     * Clears the canvas and resets output values.
     */
    function clearCanvas() {
        drawUnitCircle(); // Redraw only the base circle
        sineValueSpan.textContent = "0.000";
        cosineValueSpan.textContent = "0.000";
        tangentValueSpan.textContent = "0.000";
        tangentValueSpan.style.color = 'var(--text)'; // Reset color
        angleInput.value = "45"; // Reset input to default
        document.querySelector('input[name="angleUnit"][value="degrees"]').checked = true;
        showMessage("Canvas cleared and values reset.");
    }

    // Event Listeners
    visualizeBtn.addEventListener("click", visualizeAngle);
    clearBtn.addEventListener("click", clearCanvas);

    // Initial visualization on load
    clearCanvas(); // Draw empty circle initially
    visualizeAngle(); // Visualize default 45 degrees
});
