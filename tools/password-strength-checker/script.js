// script.js for Password Strength Checker

document.addEventListener('DOMContentLoaded', () => {
    console.log("Password Strength Checker script loaded.");

    // --- Get references to elements ---
    const passwordInput = document.getElementById('passwordInput');
    const togglePassword = document.getElementById('togglePassword');
    const strengthBarFill = document.getElementById('strengthBarFill');
    const strengthText = document.getElementById('strengthText');
    const feedbackList = document.getElementById('feedbackList');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');

    // --- References to individual feedback list items ---
    const lengthCheck = document.getElementById('lengthCheck');
    const uppercaseCheck = document.getElementById('uppercaseCheck');
    const lowercaseCheck = document.getElementById('lowercaseCheck');
    const numberCheck = document.getElementById('numberCheck');
    const symbolCheck = document.getElementById('symbolCheck');
    const commonPatternCheck = document.getElementById('commonPatternCheck');

    // --- Helper function to show messages to the user ---
    function showMessage(message, isError = false) {
        if (!messageBox) {
            console.error("Error: Message box element (#messageBox) not found in HTML.");
            return;
        }

        messageBox.textContent = message;
        messageBox.classList.remove('error');
        messageBox.classList.add('show');

        if (isError) {
            messageBox.classList.add('error');
            messageBox.style.color = 'var(--cyber-neon-pink)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-pink)';
            console.error("Message (Error):", message);
        } else {
            messageBox.style.color = 'var(--cyber-neon-cyan)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-cyan)';
            console.log("Message (Success/Info):", message);
        }

        // Hide message after a few seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
            messageBox.textContent = '';
        }, 3000);
    }

    // --- Function to update feedback list item status ---
    function updateFeedbackItem(element, passed) {
        if (element) {
            element.classList.remove('passed', 'failed');
            if (passed) {
                element.classList.add('passed');
            } else {
                element.classList.add('failed');
            }
        }
    }

    // --- Password Strength Logic ---
    function checkPasswordStrength() {
        const password = passwordInput.value;
        let score = 0;
        const feedback = {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            symbol: false,
            common: true, // Assume true until a common pattern is found
        };

        // 1. Length Check (min 8 characters)
        if (password.length >= 8) {
            score += 1;
            feedback.length = true;
        }
        if (password.length >= 12) { // Bonus for longer passwords
            score += 1;
        }
        if (password.length >= 16) { // Another bonus
            score += 1;
        }

        // 2. Character Type Checks
        if (/[A-Z]/.test(password)) {
            score += 1;
            feedback.uppercase = true;
        }
        if (/[a-z]/.test(password)) {
            score += 1;
            feedback.lowercase = true;
        }
        if (/[0-9]/.test(password)) {
            score += 1;
            feedback.number = true;
        }
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
            score += 1;
            feedback.symbol = true;
        }

        // 3. Common Patterns Check (simple examples)
        const commonPatterns = [
            'password', '123456', 'qwerty', 'admin', '12345678', 'abcdef',
            '123456789', '111111', '000000', password.toLowerCase().substring(0, 3) + '123',
            'hangga', 'tools' // Example: include site-specific common words
        ];
        for (const pattern of commonPatterns) {
            if (password.toLowerCase().includes(pattern)) {
                score -= 2; // Deduct points for common patterns
                feedback.common = false;
                break;
            }
        }

        // Ensure score doesn't go below zero
        score = Math.max(0, score);

        // Update UI based on score and feedback
        updateStrengthUI(score, feedback);
    }

    // --- Function to update the strength bar and text ---
    function updateStrengthUI(score, feedback) {
        let strength = "Very Weak";
        let barWidth = 0;
        let barColor = "#ff0000"; // Red

        if (score >= 7) {
            strength = "Very Strong";
            barWidth = 100;
            barColor = "#00ff00"; // Green
        } else if (score >= 5) {
            strength = "Strong";
            barWidth = 75;
            barColor = "#00ff7f"; // Spring Green
        } else if (score >= 3) {
            strength = "Medium";
            barWidth = 50;
            barColor = "#ffff00"; // Yellow
        } else if (score >= 1) {
            strength = "Weak";
            barWidth = 25;
            barColor = "#ff8c00"; // Dark Orange
        }

        strengthBarFill.style.width = `${barWidth}%`;
        strengthBarFill.style.backgroundColor = barColor;
        strengthText.textContent = strength;
        strengthText.style.color = barColor; // Match text color to bar color

        // Update individual feedback items
        updateFeedbackItem(lengthCheck, feedback.length);
        updateFeedbackItem(uppercaseCheck, feedback.uppercase);
        updateFeedbackItem(lowercaseCheck, feedback.lowercase);
        updateFeedbackItem(numberCheck, feedback.number);
        updateFeedbackItem(symbolCheck, feedback.symbol);
        updateFeedbackItem(commonPatternCheck, feedback.common);

        if (passwordInput.value.length === 0) {
            strengthText.textContent = "Type to check strength";
            strengthText.style.color = 'var(--text)';
            strengthBarFill.style.width = '0%';
            // Reset feedback items to default state
            [lengthCheck, uppercaseCheck, lowercaseCheck, numberCheck, symbolCheck, commonPatternCheck].forEach(item => {
                if (item) item.classList.remove('passed', 'failed');
            });
        }
    }

    // --- Toggle Password Visibility ---
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.classList.toggle('ri-eye-line');
            togglePassword.classList.toggle('ri-eye-off-line');
        });
        console.log("Toggle password icon event listener attached.");
    } else {
        console.error("Error: Toggle password icon or input not found.");
    }

    // --- Clear Password ---
    if (clearBtn && passwordInput) {
        clearBtn.addEventListener('click', () => {
            passwordInput.value = '';
            checkPasswordStrength(); // Recalculate strength for empty input
            showMessage("Password cleared.", false);
        });
        console.log("Clear button event listener attached.");
    } else {
        console.error("Error: Clear button or password input not found.");
    }

    // --- Real-time Strength Check on Input ---
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
        console.log("Password input event listener attached.");
    } else {
        console.error("Error: Password input (#passwordInput) not found.");
    }

    // Initial check on page load (for empty input)
    checkPasswordStrength();
    console.log("Initial password strength check performed.");
});
