// script.js for tools/password-generator/

document.addEventListener('DOMContentLoaded', () => {
    const passwordLengthInput = document.getElementById('passwordLength');
    const includeUppercaseCheckbox = document.getElementById('includeUppercase');
    const includeLowercaseCheckbox = document.getElementById('includeLowercase');
    const includeNumbersCheckbox = document.getElementById('includeNumbers');
    const includeSymbolsCheckbox = document.getElementById('includeSymbols');
    const generateBtn = document.getElementById('generateBtn');
    const generatedPasswordTextarea = document.getElementById('generatedPassword');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');
    const messageBox = document.getElementById('messageBox');

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_-+=[]{}|;:,.<>?';

    // Function to display messages
    function showMessage(message, type = 'info') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        } else {
            console.warn("Message box element not found.");
        }
    }

    // Function to generate password
    function generatePassword() {
        const length = parseInt(passwordLengthInput.value);
        let characters = '';
        let generatedPassword = '';

        if (includeUppercaseCheckbox.checked) {
            characters += uppercaseChars;
        }
        if (includeLowercaseCheckbox.checked) {
            characters += lowercaseChars;
        }
        if (includeNumbersCheckbox.checked) {
            characters += numberChars;
        }
        if (includeSymbolsCheckbox.checked) {
            characters += symbolChars;
        }

        if (characters.length === 0) {
            showMessage('Please select at least one character type.', 'error');
            return;
        }
        if (length < 4 || length > 128) {
            showMessage('Password length must be between 4 and 128.', 'error');
            return;
        }

        // Ensure at least one character from each selected type is included
        if (includeUppercaseCheckbox.checked) {
            generatedPassword += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        }
        if (includeLowercaseCheckbox.checked) {
            generatedPassword += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        }
        if (includeNumbersCheckbox.checked) {
            generatedPassword += numberChars[Math.floor(Math.random() * numberChars.length)];
        }
        if (includeSymbolsCheckbox.checked) {
            generatedPassword += symbolChars[Math.floor(Math.random() * symbolChars.length)];
        }

        // Fill the rest of the password length
        for (let i = generatedPassword.length; i < length; i++) {
            generatedPassword += characters[Math.floor(Math.random() * characters.length)];
        }

        // Shuffle the generated password to ensure randomness
        generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');

        generatedPasswordTextarea.value = generatedPassword;
        showMessage('Password generated!', 'success');
    }

    // Event listeners
    generateBtn.addEventListener('click', generatePassword);

    copyPasswordBtn.addEventListener('click', () => {
        if (generatedPasswordTextarea.value) {
            generatedPasswordTextarea.select();
            document.execCommand('copy');
            showMessage('Password copied to clipboard!', 'success');
        } else {
            showMessage('No password to copy.', 'info');
        }
    });

    // Generate a password on initial load
    generatePassword();
});
