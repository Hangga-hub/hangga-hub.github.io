// script.js for tools/word-character-counter/

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const wordCountDisplay = document.getElementById('wordCount');
    const charCountWithSpacesDisplay = document.getElementById('charCountWithSpaces');
    const charCountNoSpacesDisplay = document.getElementById('charCountNoSpaces');
    const lineCountDisplay = document.getElementById('lineCount');

    // Problematic elements - adding explicit checks and logging their retrieval
    const paragraphCountDisplay = document.getElementById('paragraphCount');
    const readTimeDisplay = document.getElementById('readTime');
    const slowReadTimeDisplay = document.getElementById('slowReadTime');
    const fastReadTimeDisplay = document.getElementById('fastReadTime'); // Corrected: This was the variable name
    const speakTimeDisplay = document.getElementById('speakTime');
    const avgWordLengthDisplay = document.getElementById('avgWordLength');

    // --- DEBUGGING: Log element existence immediately after retrieval ---
    console.log("Element check: textInput", textInput);
    console.log("Element check: wordCountDisplay", wordCountDisplay);
    console.log("Element check: charCountWithSpacesDisplay", charCountWithSpacesDisplay);
    console.log("Element check: charCountNoSpacesDisplay", charCountNoSpacesDisplay);
    console.log("Element check: lineCountDisplay", lineCountDisplay);
    console.log("Element check: paragraphCountDisplay", paragraphCountDisplay);
    console.log("Element check: readTimeDisplay", readTimeDisplay);
    console.log("Element check: slowReadTimeDisplay", slowReadTimeDisplay);
    console.log("Element check: fastReadTimeDisplay", fastReadTimeDisplay); // Fixed typo here!
    console.log("Element check: speakTimeDisplay", speakTimeDisplay);
    console.log("Element check: avgWordLengthDisplay", avgWordLengthDisplay);
    // ------------------------------------------------------------------


    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const uppercaseBtn = document.getElementById('uppercaseBtn');
    const lowercaseBtn = document.getElementById('lowercaseBtn');
    const titlecaseBtn = document.getElementById('titlecaseBtn');
    const messageBox = document.getElementById('messageBox');

    // Average reading speed (words per minute)
    const WORDS_PER_MINUTE_READ_AVG = 200;
    // Average speaking speed (words per minute)
    const WORDS_PER_MINUTE_READ_SLOW = 150; // Slower reading speed
    const WORDS_PER_MINUTE_READ_FAST = 250; // Faster reading speed
    const WORDS_PER_MINUTE_SPEAK = 130; // A common range is 120-150

    // Function to display messages
    function showMessage(message, type = 'info') {
        if (messageBox) { // Ensure messageBox exists before using it
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`; // Add type for styling (e.g., 'success', 'error', 'info')
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000); // Hide after 3 seconds
        } else {
            console.warn("Message box element not found.");
        }
    }

    // Function to format time for display
    function formatTime(totalMinutes) {
        if (totalMinutes === 0) return '0 min';
        const minutes = Math.floor(totalMinutes);
        const seconds = Math.round((totalMinutes - minutes) * 60);
        if (minutes > 0 && seconds > 0) {
            return `${minutes} min ${seconds} sec`;
        } else if (minutes > 0) {
            return `${minutes} min`;
        } else {
            return `${seconds} sec`;
        }
    }

    // Case conversion functions (copied from Case Converter)
    function toUppercase(text) {
        return text.toUpperCase();
    }

    function toLowercase(text) {
        return text.toLowerCase();
    }

    function toTitleCase(text) {
        // Convert to lowercase first to handle existing capitalization
        return text.toLowerCase().split(' ').map(word => {
            if (word.length === 0) return '';
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }

    // Function to update counts and apply visual effect
    function updateCounts() {
        console.log("updateCounts() called.");

        const text = textInput.value;

        // Word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        if (wordCountDisplay) wordCountDisplay.textContent = wordCount;
        console.log("Word Count:", wordCount);

        // Character count (with spaces)
        const charCountWithSpaces = text.length;
        if (charCountWithSpacesDisplay) charCountWithSpacesDisplay.textContent = charCountWithSpaces;

        // Character count (no spaces)
        const charsNoSpaces = text.replace(/\s/g, '');
        if (charCountNoSpacesDisplay) charCountNoSpacesDisplay.textContent = charsNoSpaces.length;

        // Line count
        const lines = text.split('\n');
        const lineCount = lines.length === 1 && lines[0] === '' ? 1 : lines.length;
        if (lineCountDisplay) lineCountDisplay.textContent = lineCount;

        // Paragraph count (based on two or more consecutive newlines)
        const paragraphs = text.trim().split(/\n{2,}/).filter(p => p.trim().length > 0);
        const paragraphCount = paragraphs.length;
        if (paragraphCountDisplay) {
            paragraphCountDisplay.textContent = paragraphCount;
        } else {
            console.error("Error: paragraphCountDisplay is null. Cannot update Paragraphs count.");
        }
        console.log("Paragraph Count (calculated):", paragraphCount);

        // Reading Time (Average)
        const readTimeMinutesAvg = wordCount / WORDS_PER_MINUTE_READ_AVG;
        if (readTimeDisplay) {
            readTimeDisplay.textContent = formatTime(readTimeMinutesAvg);
        } else {
            console.error("Error: readTimeDisplay is null. Cannot update Avg. Read Time.");
        }
        console.log("Avg Read Time (minutes, calculated):", readTimeMinutesAvg);

        // Reading Time (Slow)
        const readTimeMinutesSlow = wordCount / WORDS_PER_MINUTE_READ_SLOW;
        if (slowReadTimeDisplay) {
            slowReadTimeDisplay.textContent = formatTime(readTimeMinutesSlow);
        } else {
            console.error("Error: slowReadTimeDisplay is null. Cannot update Slow Read Time.");
        }
        console.log("Slow Read Time (minutes, calculated):", readTimeMinutesSlow);


        // Reading Time (Fast)
        const readTimeMinutesFast = wordCount / WORDS_PER_MINUTE_READ_FAST;
        if (fastReadTimeDisplay) { // This was the line with the typo!
            fastReadTimeDisplay.textContent = formatTime(readTimeMinutesFast);
        } else {
            console.error("Error: fastReadTimeDisplay is null. Cannot update Fast Read Time.");
        }
        console.log("Fast Read Time (minutes, calculated):", readTimeMinutesFast);


        // Speaking Time (This was already working, but including for completeness)
        const speakTimeMinutes = wordCount / WORDS_PER_MINUTE_SPEAK;
        if (speakTimeDisplay) {
            speakTimeDisplay.textContent = formatTime(speakTimeMinutes);
        } else {
            console.error("Error: speakTimeDisplay is null. Cannot update Speak Time.");
        }
        console.log("Speak Time (minutes, calculated):", speakTimeMinutes);


        // Average Word Length
        const avgWordLength = wordCount > 0 ? (charsNoSpaces.length / wordCount).toFixed(2) : '0.00';
        if (avgWordLengthDisplay) {
            avgWordLengthDisplay.textContent = avgWordLength;
        } else {
            console.error("Error: avgWordLengthDisplay is null. Cannot update Avg. Word Length.");
        }
        console.log("Avg Word Length (calculated):", avgWordLength);


        // Apply a subtle animation class to result values
        document.querySelectorAll('.result-value').forEach(el => {
            el.classList.remove('animate-pulse-effect'); // Remove to re-trigger
            void el.offsetWidth; // Trigger reflow
            el.classList.add('animate-pulse-effect');
        });
    }

    // Event listener for real-time updates
    if (textInput) { // Ensure textInput exists before adding listener
        textInput.addEventListener('input', updateCounts);
    } else {
        console.error("Error: textInput element not found. Cannot attach input listener.");
    }


    // Event listener for clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            textInput.value = '';
            updateCounts(); // Reset counts after clearing
            showMessage('Text cleared, counts reset.', 'info');
        });
    } else {
        console.warn("Clear button element not found.");
    }

    // Event listener for copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (textInput && textInput.value) { // Ensure textInput exists
                textInput.select();
                document.execCommand('copy');
                showMessage('Text copied to clipboard!', 'success');
            } else {
                showMessage('No text to copy.', 'info');
            }
        });
    } else {
        console.warn("Copy button element not found.");
    }

    // Event listeners for case conversion buttons
    if (uppercaseBtn) {
        uppercaseBtn.addEventListener('click', () => {
            if (textInput) textInput.value = toUppercase(textInput.value);
            updateCounts(); // Update counts after conversion
            showMessage('Converted to UPPERCASE!', 'success');
        });
    } else {
        console.warn("Uppercase button element not found.");
    }

    if (lowercaseBtn) {
        lowercaseBtn.addEventListener('click', () => {
            if (textInput) textInput.value = toLowercase(textInput.value);
            updateCounts(); // Update counts after conversion
            showMessage('Converted to lowercase!', 'success');
        });
    } else {
        console.warn("Lowercase button element not found.");
    }

    if (titlecaseBtn) {
        titlecaseBtn.addEventListener('click', () => {
            if (textInput) textInput.value = toTitleCase(textInput.value);
            updateCounts(); // Update counts after conversion
            showMessage('Converted to Title Case!', 'success');
        });
    } else {
        console.warn("Title Case button element not found.");
    }

    // Initial update when the page loads
    // Ensure textInput is available before calling updateCounts initially
    if (textInput) {
        updateCounts();
    } else {
        console.error("Error: textInput element not found on DOMContentLoaded. Initial update skipped.");
    }
});
