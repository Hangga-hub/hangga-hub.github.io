// script.js for tools/lorem-ipsum-generator/

document.addEventListener('DOMContentLoaded', () => {
    const quantityInput = document.getElementById('quantity');
    const typeSelect = document.getElementById('type');
    const startWithLoremCheckbox = document.getElementById('startWithLorem');
    const generateBtn = document.getElementById('generateBtn');
    const generatedTextarea = document.getElementById('generatedText');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');

    // Base Lorem Ipsum text
    const loremIpsumBase = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    // Split base text into sentences and words for easier manipulation
    const baseSentences = loremIpsumBase.match(/[^.!?]+[.!?]+/g) || [loremIpsumBase];
    const baseWords = loremIpsumBase.match(/\b\w+\b/g) || [];

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

    // Function to get a random element from an array
    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Function to generate Lorem Ipsum
    function generateLoremIpsum() {
        const quantity = parseInt(quantityInput.value);
        const type = typeSelect.value;
        const startWithLorem = startWithLoremCheckbox.checked;

        if (isNaN(quantity) || quantity < 1 || quantity > 100) {
            showMessage('Please enter a quantity between 1 and 100.', 'error');
            return;
        }

        let result = [];
        let generatedCount = 0;

        if (type === 'paragraphs') {
            const numSentencesPerParagraph = Math.floor(baseSentences.length / 3); // Approx 3 sentences per paragraph
            for (let i = 0; i < quantity; i++) {
                let paragraph = [];
                if (startWithLorem && i === 0) {
                    paragraph.push(baseSentences[0]); // Start first paragraph with classic phrase
                    for (let j = 1; j < numSentencesPerParagraph; j++) {
                        paragraph.push(getRandomElement(baseSentences));
                    }
                } else {
                    for (let j = 0; j < numSentencesPerParagraph; j++) {
                        paragraph.push(getRandomElement(baseSentences));
                    }
                }
                result.push(paragraph.join(' '));
            }
            generatedTextarea.value = result.join('\n\n'); // Double newline for paragraphs
            generatedCount = quantity;
        } else if (type === 'sentences') {
            if (startWithLorem) {
                result.push(baseSentences[0]); // Start with classic phrase
                generatedCount++;
            }
            for (let i = generatedCount; i < quantity; i++) {
                result.push(getRandomElement(baseSentences));
            }
            generatedTextarea.value = result.join(' '); // Single space for sentences
            generatedCount = result.length;
        } else if (type === 'words') {
            if (startWithLorem) {
                const loremWords = baseSentences[0].match(/\b\w+\b/g);
                result.push(...loremWords);
                generatedCount += loremWords.length;
            }
            for (let i = generatedCount; i < quantity; i++) {
                result.push(getRandomElement(baseWords));
            }
            generatedTextarea.value = result.join(' '); // Single space for words
            generatedCount = result.length;
        }

        showMessage(`${generatedCount} ${type} generated!`, 'success');
    }

    // Event listeners
    generateBtn.addEventListener('click', generateLoremIpsum);

    copyTextBtn.addEventListener('click', () => {
        if (generatedTextarea.value) {
            generatedTextarea.select();
            document.execCommand('copy');
            showMessage('Text copied to clipboard!', 'success');
        } else {
            showMessage('No text to copy.', 'info');
        }
    });

    clearBtn.addEventListener('click', () => {
        generatedTextarea.value = '';
        showMessage('Cleared all content.', 'info');
    });

    // Generate initial text on page load
    generateLoremIpsum();
});
