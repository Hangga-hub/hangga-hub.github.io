// script.js for Random Number Generator & Dice Roller

document.addEventListener('DOMContentLoaded', () => {
    // Random Number Generator Elements
    const minNumberInput = document.getElementById('minNumber');
    const maxNumberInput = document.getElementById('maxNumber');
    const generateNumberButton = document.getElementById('generateNumberButton');
    const randomNumberResult = document.getElementById('randomNumberResult');

    // Dice Roller Elements
    const numDiceInput = document.getElementById('numDice');
    const diceTypeSelect = document.getElementById('diceType');
    const rollDiceButton = document.getElementById('rollDiceButton');
    const diceContainer = document.getElementById('diceContainer');
    const diceRollTotal = document.getElementById('diceRollTotal');
    const individualRolls = document.getElementById('individualRolls');

    const messageBox = document.getElementById('messageBox');

    // --- Random Number Generator Logic ---
    generateNumberButton.addEventListener('click', () => {
        messageBox.textContent = ''; // Clear previous messages
        const min = parseInt(minNumberInput.value);
        const max = parseInt(maxNumberInput.value);

        if (isNaN(min) || isNaN(max)) {
            messageBox.textContent = 'Please enter valid numbers for min and max.';
            randomNumberResult.textContent = '---';
            randomNumberResult.classList.remove('animated'); // Ensure animation class is removed
            return;
        }
        if (min > max) {
            messageBox.textContent = 'Minimum number cannot be greater than maximum number.';
            randomNumberResult.textContent = '---';
            randomNumberResult.classList.remove('animated'); // Ensure animation class is removed
            return;
        }

        // Apply animation class
        randomNumberResult.classList.remove('animated'); // Reset animation
        void randomNumberResult.offsetWidth; // Trigger reflow to restart animation
        randomNumberResult.classList.add('animated');

        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        randomNumberResult.textContent = randomNumber;
    });

    // --- Dice Roller Logic ---
    rollDiceButton.addEventListener('click', () => {
        messageBox.textContent = ''; // Clear previous messages
        const numDice = parseInt(numDiceInput.value);
        const diceSides = parseInt(diceTypeSelect.value);

        if (isNaN(numDice) || numDice < 1 || numDice > 10) {
            messageBox.textContent = 'Number of dice must be between 1 and 10.';
            diceRollTotal.textContent = '---';
            individualRolls.textContent = '';
            diceContainer.innerHTML = '';
            return;
        }
        if (isNaN(diceSides) || diceSides < 4) { // Minimum d4
            messageBox.textContent = 'Invalid dice type selected.';
            diceRollTotal.textContent = '---';
            individualRolls.textContent = '';
            diceContainer.innerHTML = '';
            return;
        }

        diceContainer.innerHTML = ''; // Clear previous dice
        let totalRoll = 0;
        const rolls = [];

        // Create dice elements and add rolling animation
        for (let i = 0; i < numDice; i++) {
            const diceDiv = document.createElement('div');
            diceDiv.classList.add('dice');
            diceDiv.textContent = '?'; // Placeholder during roll
            diceContainer.appendChild(diceDiv);
            // Trigger animation
            setTimeout(() => {
                diceDiv.classList.add('rolling');
            }, i * 100); // Stagger animation start
        }

        // Simulate rolling and display results after animation
        const animationDuration = 1000; // 1 second for the rolling animation
        setTimeout(() => {
            diceContainer.querySelectorAll('.dice').forEach((diceDiv, index) => {
                diceDiv.classList.remove('rolling'); // Stop animation
                const roll = Math.floor(Math.random() * diceSides) + 1;
                diceDiv.textContent = roll;
                rolls.push(roll);
                totalRoll += roll;
            });

            diceRollTotal.textContent = totalRoll;
            individualRolls.textContent = `Individual rolls: [${rolls.join(', ')}]`;

        }, animationDuration);
    });
});
