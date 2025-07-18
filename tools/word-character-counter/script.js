// script.js for tools/word-character-counter/

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const wordCountDisplay = document.getElementById('wordCount');
    const charCountWithSpacesDisplay = document.getElementById('charCountWithSpaces');
    const charCountNoSpacesDisplay = document.getElementById('charCountNoSpaces');
    const lineCountDisplay = document.getElementById('lineCount');
    const paragraphCountDisplay = document.getElementById('paragraphCount');
    const readTimeDisplay = document.getElementById('readTime');
    const slowReadTimeDisplay = document.getElementById('slowReadTime');
    const fastReadTimeDisplay = document.getElementById('fastReadTime');
    const speakTimeDisplay = document.getElementById('speakTime');
    const avgWordLengthDisplay = document.getElementById('avgWordLength');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const uppercaseBtn = document.getElementById('uppercaseBtn'); // New
    const lowercaseBtn = document.getElementById('lowercaseBtn'); // New
    const titlecaseBtn = document.getElementById('titlecaseBtn'); // New
    const messageBox = document.getElementById('messageBox');

    // Average reading speed (words per minute)
    const WORDS_PER_MINUTE_READ_AVG = 200;
    // Average speaking speed (words per minute)
    const WORDS_PER_MINUTE_READ_SLOW = 150; // Slower reading speed
    const WORDS_PER_MINUTE_READ_FAST = 250; // Faster reading speed
    const WORDS_PER_MINUTE_SPEAK = 130; // A common range is 120-150

    // Function to display messages
    function showMessage(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`; // Add type for styling (e.g., 'success', 'error', 'info')
        messageBox.style.display = 'block';
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000); // Hide after 3 seconds
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
        const text = textInput.value;

        // Word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        wordCountDisplay.textContent = wordCount;

        // Character count (with spaces)
        const charCountWithSpaces = text.length;
        charCountWithSpacesDisplay.textContent = charCountWithSpaces;

        // Character count (no spaces)
        const charsNoSpaces = text.replace(/\s/g, '');
        charCountNoSpacesDisplay.textContent = charsNoSpaces.length;

        // Line count
        const lines = text.split('\n');
        // Ensure at least 1 line for empty text, otherwise count actual lines
        const lineCount = lines.length === 1 && lines[0] === '' ? 1 : lines.length;
        lineCountDisplay.textContent = lineCount;

        // Paragraph count (based on two or more consecutive newlines)
        // Split by one or more newlines, then filter out empty strings
        const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 0);
        const paragraphCount = paragraphs.length;
        paragraphCountDisplay.textContent = paragraphCount;

        // Reading Time (Average)
        const readTimeMinutesAvg = wordCount / WORDS_PER_MINUTE_READ_AVG;
        readTimeDisplay.textContent = formatTime(readTimeMinutesAvg);

        // Reading Time (Slow)
        const readTimeMinutesSlow = wordCount / WORDS_PER_MINUTE_READ_SLOW;
        slowReadTimeDisplay.textContent = formatTime(readTimeMinutesSlow);

        // Reading Time (Fast)
        const readTimeMinutesFast = wordCount / WORDS_PER_MINUTE_READ_FAST;
        fastReadTimeDisplay.textContent = formatTime(readTimeMinutesFast);

        // Speaking Time
        const speakTimeMinutes = wordCount / WORDS_PER_MINUTE_SPEAK;
        speakTimeDisplay.textContent = formatTime(speakTimeMinutes);

        // Average Word Length
        const avgWordLength = wordCount > 0 ? (charsNoSpaces.length / wordCount).toFixed(2) : '0.00';
        avgWordLengthDisplay.textContent = avgWordLength;


        // Apply a subtle animation class to result values
        document.querySelectorAll('.result-value').forEach(el => {
            el.classList.remove('animate-pulse-effect'); // Remove to re-trigger
            void el.offsetWidth; // Trigger reflow
            el.classList.add('animate-pulse-effect');
        });
    }

    // Event listener for real-time updates
    textInput.addEventListener('input', updateCounts);

    // Event listener for clear button
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateCounts(); // Reset counts after clearing
        showMessage('Text cleared, counts reset.', 'info');
    });

    // Event listener for copy button
    copyBtn.addEventListener('click', () => {
        if (textInput.value) {
            textInput.select();
            document.execCommand('copy');
            showMessage('Text copied to clipboard!', 'success');
        } else {
            showMessage('No text to copy.', 'info');
        }
    });

    // Event listeners for case conversion buttons
    uppercaseBtn.addEventListener('click', () => {
        textInput.value = toUppercase(textInput.value);
        updateCounts(); // Update counts after conversion
        showMessage('Converted to UPPERCASE!', 'success');
    });

    lowercaseBtn.addEventListener('click', () => {
        textInput.value = toLowercase(textInput.value);
        updateCounts(); // Update counts after conversion
        showMessage('Converted to lowercase!', 'success');
    });

    titlecaseBtn.addEventListener('click', () => {
        textInput.value = toTitleCase(textInput.value);
        updateCounts(); // Update counts after conversion
        showMessage('Converted to Title Case!', 'success');
    });


    // Initial update when the page loads
    updateCounts();
});
