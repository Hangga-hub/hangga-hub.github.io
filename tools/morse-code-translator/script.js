// script.js for Morse Code Translator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const englishInput = document.getElementById("englishInput");
    const morseInput = document.getElementById("morseInput");

    // Get references to button elements
    const toMorseBtn = document.getElementById("toMorseBtn");
    const toEnglishBtn = document.getElementById("toEnglishBtn");
    const clearBtn = document.getElementById("clearBtn");
    const messageBox = document.getElementById("messageBox");

    // Morse Code Mapping
    // Maps characters to their Morse code representation
    const morseMap = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
        'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
        'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
        'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
        'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
        'Z': '--..',

        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',

        '.': '.-.-.-', ',': '--..--', '?': '..-..', "'": '.----.',
        '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
        '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
        '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
        '$': '...-..-', '@': '.--.-.',
        ' ': '/' // Special case for space between words in English text
    };

    // Reverse Morse Map (for Morse to English translation)
    // Generated from morseMap for efficient lookup
    const reverseMorseMap = {};
    for (const char in morseMap) {
        if (morseMap.hasOwnProperty(char)) {
            reverseMorseMap[morseMap[char]] = char;
        }
    }

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
     * Translates English text to Morse code.
     */
    function translateToMorse() {
        const text = englishInput.value.trim();
        if (!text) {
            showMessage("Please enter English text to translate.", true);
            morseInput.value = "";
            return;
        }

        let morseCode = [];
        // Split by words first to handle spaces correctly
        const words = text.toUpperCase().split(' ');

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            let morseWord = [];
            for (let j = 0; j < word.length; j++) {
                const char = word[j];
                if (morseMap[char]) {
                    morseWord.push(morseMap[char]);
                } else if (char === ' ') {
                    // This case is already handled by splitting words, but good for robustness
                    morseWord.push('/'); // Word separator
                } else {
                    // Handle characters not in the map (e.g., special symbols not defined)
                    showMessage(`Character '${char}' not supported in Morse code. Skipping.`, true);
                }
            }
            morseCode.push(morseWord.join(' ')); // Join characters within a word with single space
        }

        morseInput.value = morseCode.join('   '); // Join words with triple space
        showMessage("Translated to Morse code.");
    }

    /**
     * Translates Morse code to English text.
     */
    function translateToEnglish() {
        const morse = morseInput.value.trim();
        if (!morse) {
            showMessage("Please enter Morse code to translate.", true);
            englishInput.value = "";
            return;
        }

        let englishText = [];
        // Normalize multiple spaces to triple spaces for consistent word separation
        const normalizedMorse = morse.replace(/\s{2,}/g, '   ');
        const words = normalizedMorse.split('   '); // Split by triple spaces for words

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            let englishWord = [];
            const characters = word.split(' '); // Split by single space for characters

            for (let j = 0; j < characters.length; j++) {
                const morseChar = characters[j];
                if (reverseMorseMap[morseChar]) {
                    englishWord.push(reverseMorseMap[morseChar]);
                } else if (morseChar === '') {
                    // Ignore empty strings that might result from extra spaces
                    continue;
                } else {
                    // Handle invalid Morse sequences
                    showMessage(`Invalid Morse sequence: '${morseChar}'. Skipping.`, true);
                }
            }
            englishText.push(englishWord.join('')); // Join characters within a word without space
        }

        englishInput.value = englishText.join(' '); // Join words with single space
        showMessage("Translated to English text.");
    }

    /**
     * Clears both input/output text areas.
     */
    function clearAll() {
        englishInput.value = "";
        morseInput.value = "";
        showMessage("Cleared both text areas.");
    }

    // Event Listeners
    toMorseBtn.addEventListener("click", translateToMorse);
    toEnglishBtn.addEventListener("click", translateToEnglish);
    clearBtn.addEventListener("click", clearAll);

    // Initial state setup
    clearAll(); // Clear fields on load
});
