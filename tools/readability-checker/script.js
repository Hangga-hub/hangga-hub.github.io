// script.js for Readability Checker

document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const clearBtn = document.getElementById("clearBtn");
    const messageBox = document.getElementById("messageBox");
    const copyButtons = document.querySelectorAll(".copy-btn");

    const fleschReadingEaseOutput = document.getElementById("fleschReadingEase");
    const fleschKincaidGradeOutput = document.getElementById("fleschKincaidGrade");
    const gunningFogIndexOutput = document.getElementById("gunningFogIndex");
    const smogIndexOutput = document.getElementById("smogIndex");
    const ariScoreOutput = document.getElementById("ariScore");
    const colemanLiauIndexOutput = document.getElementById("colemanLiauIndex");
    const lixScoreOutput = document.getElementById("lixScore");

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
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 3000); // Message disappears after 3 seconds
    }

    /**
     * Counts words in a given text.
     * @param {string} text - The input text.
     * @returns {number} The number of words.
     */
    function countWords(text) {
        const words = text.match(/\b\w+\b/g);
        return words ? words.length : 0;
    }

    /**
     * Counts sentences in a given text.
     * @param {string} text - The input text.
     * @returns {number} The number of sentences.
     */
    function countSentences(text) {
        // Count sentences ending with ., !, ? followed by space or end of string
        const sentences = text.match(/[^.!?]+[.!?]+/g);
        return sentences ? sentences.length : 0;
    }

    /**
     * Estimates the number of syllables in a word using a simplified heuristic.
     * This is an approximation and may not be perfectly accurate for all words.
     * @param {string} word - The word to count syllables for.
     * @returns {number} The estimated number of syllables.
     */
    function countSyllables(word) {
        word = word.toLowerCase();
        if (word.length === 0) return 0;

        // Remove common silent endings
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        // Remove double vowels
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        let syllables = matches ? matches.length : 0;

        // Handle specific cases
        if (word.endsWith('le') && word.length > 2 && !'aeiouy'.includes(word[word.length - 3])) {
            syllables++;
        }
        if (syllables === 0 && word.length > 0) {
            syllables = 1; // Ensure at least one syllable for non-empty words
        }
        return syllables;
    }

    /**
     * Counts characters in a given text (excluding spaces).
     * @param {string} text - The input text.
     * @returns {number} The number of characters.
     */
    function countCharacters(text) {
        return text.replace(/\s/g, '').length;
    }

    /**
     * Counts words with 3 or more syllables (polysyllables).
     * @param {string} text - The input text.
     * @returns {number} The number of polysyllables.
     */
    function countPolysyllables(text) {
        const words = text.match(/\b\w+\b/g);
        if (!words) return 0;
        let polysyllables = 0;
        for (const word of words) {
            if (countSyllables(word) >= 3) {
                polysyllables++;
            }
        }
        return polysyllables;
    }

    /**
     * Counts words with more than 6 characters (long words for LIX).
     * @param {string} text - The input text.
     * @returns {number} The number of long words.
     */
    function countLongWords(text) {
        const words = text.match(/\b\w+\b/g);
        if (!words) return 0;
        let longWords = 0;
        for (const word of words) {
            if (word.length > 6) {
                longWords++;
            }
        }
        return longWords;
    }

    /**
     * Calculates all readability scores and updates the UI.
     */
    function analyzeReadability() {
        const text = textInput.value.trim();

        if (text === "") {
            showMessage("Please enter some text to analyze.", true);
            clearOutputs();
            return;
        }

        const words = countWords(text);
        const sentences = countSentences(text);
        const characters = countCharacters(text);
        const polysyllables = countPolysyllables(text);
        const longWords = countLongWords(text);

        if (words === 0 || sentences === 0) {
            showMessage("Please enter more text with at least one sentence to calculate scores.", true);
            clearOutputs();
            return;
        }

        // Flesch Reading Ease
        // 206.835 - (1.015 × ASL) - (84.6 × ASW)
        // ASL = Average Sentence Length (total words / total sentences)
        // ASW = Average Syllables per Word (total syllables / total words)
        let totalSyllables = 0;
        const allWords = text.match(/\b\w+\b/g) || [];
        for (const word of allWords) {
            totalSyllables += countSyllables(word);
        }

        const ASL = words / sentences;
        const ASW = totalSyllables / words;
        const fleschReadingEase = 206.835 - (1.015 * ASL) - (84.6 * ASW);
        fleschReadingEaseOutput.value = fleschReadingEase.toFixed(2);

        // Flesch-Kincaid Grade Level
        // (0.39 × ASL) + (11.8 × ASW) - 15.59
        const fleschKincaidGrade = (0.39 * ASL) + (11.8 * ASW) - 15.59;
        fleschKincaidGradeOutput.value = fleschKincaidGrade.toFixed(2);

        // Gunning Fog Index
        // 0.4 * ((words / sentences) + 100 * (complex words / words))
        const gunningFogIndex = 0.4 * (ASL + (100 * (polysyllables / words)));
        gunningFogIndexOutput.value = gunningFogIndex.toFixed(2);

        // SMOG Index
        // 1.0430 * sqrt(polysyllables * (30 / sentences)) + 3.1291
        const smogIndex = 1.0430 * Math.sqrt(polysyllables * (30 / sentences)) + 3.1291;
        smogIndexOutput.value = smogIndex.toFixed(2);

        // Automated Readability Index (ARI)
        // 4.71 * (characters / words) + 0.5 * (words / sentences) - 21.43
        const ariScore = (4.71 * (characters / words)) + (0.5 * ASL) - 21.43;
        ariScoreOutput.value = ariScore.toFixed(2);

        // Coleman-Liau Index
        // 5.88 * L - 29.6 * S - 15.8
        // L = Average number of characters per 100 words (characters / words * 100)
        // S = Average number of sentences per 100 words (sentences / words * 100)
        const L = (characters / words) * 100;
        const S = (sentences / words) * 100;
        const colemanLiauIndex = (5.88 * L) - (29.6 * S) - 15.8;
        colemanLiauIndexOutput.value = colemanLiauIndex.toFixed(2);

        // LIX Score
        // (words / sentences) + (long words * 100 / words)
        const lixScore = ASL + ((longWords * 100) / words);
        lixScoreOutput.value = lixScore.toFixed(2);

        showMessage("Readability scores calculated!");
    }

    /**
     * Clears all input and output fields.
     */
    function clearOutputs() {
        fleschReadingEaseOutput.value = "";
        fleschKincaidGradeOutput.value = "";
        gunningFogIndexOutput.value = "";
        smogIndexOutput.value = "";
        ariScoreOutput.value = "";
        colemanLiauIndexOutput.value = "";
        lixScoreOutput.value = "";
    }

    function clearAll() {
        textInput.value = "";
        clearOutputs();
        showMessage("All fields cleared.");
    }

    /**
     * Copies the content of a specified input field to the clipboard.
     * @param {string} targetId - The ID of the input field whose content should be copied.
     */
    function copyToClipboard(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement && targetElement.value) {
            targetElement.select(); // Select the text
            targetElement.setSelectionRange(0, 99999); // For mobile devices

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showMessage("Copied to clipboard!");
                } else {
                    showMessage("Failed to copy to clipboard.", true);
                }
            } catch (err) {
                console.error('Oops, unable to copy', err);
                showMessage("Copy failed! Your browser might not support this feature.", true);
            }
        } else {
            showMessage("Nothing to copy.", true);
        }
    }

    // Event Listeners
    analyzeBtn.addEventListener("click", analyzeReadability);
    clearBtn.addEventListener("click", clearAll);
    textInput.addEventListener("input", analyzeReadability); // Auto-analyze on input

    copyButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const targetId = event.currentTarget.dataset.target;
            copyToClipboard(targetId);
        });
    });

    // Initial clear on load
    clearAll();
});
