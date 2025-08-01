document.addEventListener('DOMContentLoaded', () => {
    // Get references to all necessary DOM elements
    const canvas = document.getElementById('rouletteCanvas');
    const ctx = canvas.getContext('2d');
    const optionsInput = document.getElementById('optionsInput');
    const spinBtn = document.getElementById('spinBtn');
    const clearBtn = document.getElementById('clearBtn');
    const addExampleBtn = document.getElementById('addExampleBtn');
    const messageBox = document.getElementById('messageBox');
    const resultOutput = document.getElementById('resultOutput');

    // Initial state variables
    let options = [];
    let totalOptions = 0;
    let spinning = false;
    let currentRotation = 0;
    let spinSpeed = 0;

    // A predefined set of colors for the wheel segments
    const segmentColors = [
        '#6366f1', '#f87171', '#34d399', '#f9a8d4', '#fbbf24',
        '#a78bfa', '#2dd4bf', '#a3e635', '#f472b6', '#e879f9'
    ];

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
     * Renders the roulette wheel on the canvas.
     */
    const drawWheel = () => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentRotation);

        const arcSize = (2 * Math.PI) / totalOptions;
        
        for (let i = 0; i < totalOptions; i++) {
            const startAngle = i * arcSize;
            const endAngle = (i + 1) * arcSize;
            
            // Draw segment
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = segmentColors[i % segmentColors.length];
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.rotate(startAngle + arcSize / 2);
            ctx.fillStyle = 'white';
            ctx.font = '16px Inter';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(options[i], radius - 20, 0);
            ctx.restore();
        }

        ctx.restore();
    };

    /**
     * Animation loop for the spinning wheel.
     */
    const animate = () => {
        if (spinning) {
            currentRotation += spinSpeed;
            spinSpeed *= 0.99; // Deceleration
            
            // Stop the wheel once speed is very low
            if (spinSpeed < 0.005) {
                spinSpeed = 0;
                spinning = false;
                
                // Find the winning option based on the final rotation
                const adjustedRotation = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
                const arcSize = (2 * Math.PI) / totalOptions;
                // Calculate the winning index based on the pointer's position (left side)
                const winningIndex = Math.floor(totalOptions - (adjustedRotation / arcSize));
                const winner = options[winningIndex % totalOptions];
                
                resultOutput.textContent = `Winner: ${winner}!`;
                resultOutput.style.backgroundColor = segmentColors[winningIndex % segmentColors.length];
                resultOutput.style.color = 'white';
            }
        }
        
        drawWheel();
        requestAnimationFrame(animate);
    };

    /**
     * Starts the spinning animation.
     */
    const spinWheel = () => {
        options = optionsInput.value.split('\n').filter(option => option.trim() !== '');
        if (options.length <= 1) {
            showMessage('Please enter at least two options to spin the wheel.', 'error');
            return;
        }

        totalOptions = options.length;
        spinning = true;
        spinSpeed = 0.5 + Math.random() * 0.5; // Random starting speed
        resultOutput.textContent = 'Spinning...';
        resultOutput.style.backgroundColor = 'var(--blue-color)';
        resultOutput.style.color = 'white';
    };

    // Event listeners for the buttons
    spinBtn.addEventListener('click', spinWheel);
    
    clearBtn.addEventListener('click', () => {
        optionsInput.value = '';
        options = [];
        totalOptions = 0;
        resultOutput.textContent = 'Spin to find a winner!';
        resultOutput.style.backgroundColor = 'var(--light-grey-color)';
        resultOutput.style.color = 'var(--text-color)';
        drawWheel();
    });

    addExampleBtn.addEventListener('click', () => {
        const exampleOptions = [
            "Pizza",
            "Tacos",
            "Sushi",
            "Pasta",
            "Burger"
        ].join('\n');
        optionsInput.value = exampleOptions;
        spinWheel(); // Automatically spin with the examples
    });
    
    // Initial setup on page load
    window.onload = () => {
        // Set initial example options and draw the wheel
        optionsInput.value = [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
        ].join('\n');
        options = optionsInput.value.split('\n').filter(option => option.trim() !== '');
        totalOptions = options.length;
        drawWheel();
        animate();
    };
});
