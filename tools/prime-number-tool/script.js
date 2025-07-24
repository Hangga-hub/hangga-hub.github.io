document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const numberToCheckInput = document.getElementById("numberToCheck");
    const checkPrimeBtn = document.getElementById("checkPrimeBtn");
    const checkResultOutput = document.getElementById("checkResult");
    const limitToGenerateInput = document.getElementById("limitToGenerate");
    const generatePrimesBtn = document.getElementById("generatePrimesBtn");
    const generateResultOutput = document.getElementById("generateResult");
    const resetBtn = document.getElementById("resetBtn");
    const messageBox = document.getElementById("messageBox");

    // --- Initial State ---
    checkResultOutput.textContent = "Enter a number and click 'Check Primality'.";
    generateResultOutput.textContent = "Primes will appear here after clicking 'Generate Primes'.";

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("show", "error");
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");

        // Hide message after 5 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 5000);
    }

    /**
     * Checks if a given number is prime.
     * @param {number} num - The number to check.
     * @returns {boolean} True if prime, false otherwise.
     */
    function isPrime(num) {
        if (num <= 1) return false; // Numbers less than or equal to 1 are not prime
        if (num <= 3) return true;  // 2 and 3 are prime
        if (num % 2 === 0 || num % 3 === 0) return false; // Divisible by 2 or 3

        // Check for primes of the form 6k +/- 1
        for (let i = 5; i * i <= num; i = i + 6) {
            if (num % i === 0 || num % (i + 2) === 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Generates prime numbers up to a specified limit using the Sieve of Eratosthenes.
     * @param {number} limit - The upper limit (inclusive) for prime generation.
     * @returns {number[]} An array of prime numbers.
     */
    function generatePrimesUpTo(limit) {
        if (limit < 2) return [];

        const primes = [];
        const sieve = new Array(limit + 1).fill(true); // Initialize all as potentially prime
        sieve[0] = false; // 0 is not prime
        sieve[1] = false; // 1 is not prime

        for (let p = 2; p * p <= limit; p++) {
            // If sieve[p] is still true, then it is a prime
            if (sieve[p]) {
                // Mark all multiples of p as not prime
                for (let i = p * p; i <= limit; i += p) {
                    sieve[i] = false;
                }
            }
        }

        // Collect all prime numbers
        for (let i = 2; i <= limit; i++) {
            if (sieve[i]) {
                primes.push(i);
            }
        }
        return primes;
    }

    /**
     * Handles the primality check button click.
     */
    function handleCheckPrime() {
        const num = parseInt(numberToCheckInput.value);

        if (isNaN(num) || num < 1) {
            checkResultOutput.textContent = "Please enter a valid positive number.";
            showMessage("Please enter a valid positive number for primality check.", true);
            return;
        }

        checkResultOutput.textContent = `Checking if ${num} is prime...`;
        showMessage("Checking primality...");

        setTimeout(() => { // Use setTimeout to allow UI to update
            if (isPrime(num)) {
                checkResultOutput.textContent = `${num} is a PRIME number.`;
                showMessage(`${num} is prime!`);
            } else {
                checkResultOutput.textContent = `${num} is NOT a prime number.`;
                showMessage(`${num} is not prime.`, true);
            }
            // Scroll to the nearest output section for smoother experience
            checkResultOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    }

    /**
     * Handles the generate primes button click.
     */
    function handleGeneratePrimes() {
        const limit = parseInt(limitToGenerateInput.value);

        if (isNaN(limit) || limit < 2) {
            generateResultOutput.textContent = "Please enter a limit of 2 or greater.";
            showMessage("Please enter a limit of 2 or greater for prime generation.", true);
            return;
        }

        generateResultOutput.textContent = `Generating primes up to ${limit}... This may take a moment for large numbers.`;
        showMessage("Generating primes...");

        // Use setTimeout to avoid blocking UI for large calculations
        setTimeout(() => {
            try {
                const primes = generatePrimesUpTo(limit);
                if (primes.length > 0) {
                    generateResultOutput.textContent = primes.join(', ');
                    showMessage(`Generated ${primes.length} primes up to ${limit}.`);
                } else {
                    generateResultOutput.textContent = `No primes found up to ${limit}.`;
                    showMessage(`No primes found up to ${limit}.`);
                }
            } catch (error) {
                console.error("Error generating primes:", error);
                generateResultOutput.textContent = `Error generating primes: ${error.message}`;
                showMessage(`Error generating primes: ${error.message}`, true);
            } finally {
                // Scroll to the nearest output section for smoother experience
                generateResultOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 50); // Small delay to allow "Generating..." message to show
    }

    /**
     * Resets all inputs and outputs to their default states.
     */
    function resetAll() {
        numberToCheckInput.value = "17";
        limitToGenerateInput.value = "100";
        checkResultOutput.textContent = "Enter a number and click 'Check Primality'.";
        generateResultOutput.textContent = "Primes will appear here after clicking 'Generate Primes'.";
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Tool reset.");
    }

    // --- Event Listeners ---
    checkPrimeBtn.addEventListener("click", handleCheckPrime);
    generatePrimesBtn.addEventListener("click", handleGeneratePrimes);
    resetBtn.addEventListener("click", resetAll);
});
