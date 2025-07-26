// tools/dictionary-thesaurus/script.js

document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const searchWordBtn = document.getElementById('searchWordBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const wordDetails = document.getElementById('wordDetails');
    const wordDisplay = document.getElementById('wordDisplay');
    const phoneticsDisplay = document.getElementById('phoneticsDisplay');
    const meaningsContainer = document.getElementById('meaningsContainer');
    const initialMessage = document.getElementById('initialMessage');
    const messageBox = document.getElementById('messageBox');

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (message, isError = false) => {
        messageBox.textContent = message;
        messageBox.classList.remove('error');
        if (isError) {
            messageBox.classList.add('error');
        }
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Resets all output fields and shows the initial message.
     */
    const resetOutputs = () => {
        wordDetails.style.display = 'none';
        wordDisplay.textContent = '';
        phoneticsDisplay.innerHTML = '';
        meaningsContainer.innerHTML = '';
        initialMessage.style.display = 'block';
    };

    // Initialize the display
    resetOutputs();

    // Event listener for the "Search Word" button
    searchWordBtn.addEventListener('click', async () => {
        const word = wordInput.value.trim();

        if (!word) {
            showMessage('Please enter a word to search.', true);
            resetOutputs();
            return;
        }

        showMessage(`Searching for "${word}"...`);
        resetOutputs(); // Clear previous results

        try {
            const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.length > 0) {
                const entry = data[0]; // Get the first entry for the word

                wordDisplay.textContent = entry.word;
                wordDetails.style.display = 'block';
                initialMessage.style.display = 'none';

                // Display phonetics and audio
                phoneticsDisplay.innerHTML = '';
                if (entry.phonetics && entry.phonetics.length > 0) {
                    const phoneticText = entry.phonetics.find(p => p.text)?.text || '';
                    const audioSrc = entry.phonetics.find(p => p.audio)?.audio || '';

                    phoneticsDisplay.innerHTML = `${phoneticText || 'N/A'}`;
                    if (audioSrc) {
                        const audioIcon = document.createElement('i');
                        audioIcon.className = 'ri-volume-up-fill audio-icon';
                        audioIcon.title = 'Listen to pronunciation';
                        audioIcon.style.cursor = 'pointer';
                        audioIcon.onclick = () => {
                            new Audio(audioSrc).play().catch(e => console.error("Audio playback failed:", e));
                        };
                        phoneticsDisplay.appendChild(audioIcon);
                    }
                } else {
                    phoneticsDisplay.textContent = 'Phonetics: N/A';
                }

                // Display meanings
                meaningsContainer.innerHTML = '';
                if (entry.meanings && entry.meanings.length > 0) {
                    entry.meanings.forEach(meaning => {
                        const meaningSection = document.createElement('div');
                        meaningSection.className = 'meaning-section';
                        meaningSection.innerHTML = `<h4>${meaning.partOfSpeech}</h4>`;

                        const definitionsList = document.createElement('ol');
                        meaning.definitions.forEach((def, index) => {
                            const listItem = document.createElement('li');
                            listItem.innerHTML = `${def.definition}`;
                            if (def.example) {
                                listItem.innerHTML += `<span class="example">"${def.example}"</span>`;
                            }
                            definitionsList.appendChild(listItem);
                        });
                        meaningSection.appendChild(definitionsList);

                        // Synonyms and Antonyms
                        if (meaning.synonyms && meaning.synonyms.length > 0) {
                            const synonymsDiv = document.createElement('div');
                            synonymsDiv.className = 'synonyms-antonyms';
                            synonymsDiv.innerHTML = '<strong>Synonyms:</strong> ';
                            meaning.synonyms.slice(0, 5).forEach(syn => { // Limit to 5 for brevity
                                synonymsDiv.innerHTML += `<span>${syn}</span>`;
                            });
                            meaningSection.appendChild(synonymsDiv);
                        }
                        if (meaning.antonyms && meaning.antonyms.length > 0) {
                            const antonymsDiv = document.createElement('div');
                            antonymsDiv.className = 'synonyms-antonyms';
                            antonymsDiv.innerHTML = '<strong>Antonyms:</strong> ';
                            meaning.antonyms.slice(0, 5).forEach(ant => { // Limit to 5 for brevity
                                antonymsDiv.innerHTML += `<span>${ant}</span>`;
                            });
                            meaningSection.appendChild(antonymsDiv);
                        }

                        meaningsContainer.appendChild(meaningSection);
                    });
                } else {
                    meaningsContainer.innerHTML = '<p style="color: var(--text); opacity: 0.7;">No meanings found for this word.</p>';
                }

                showMessage('Word details loaded!', false);
            } else if (response.status === 404) {
                showMessage(`Word "${word}" not found in the dictionary.`, true);
                resetOutputs();
            } else {
                showMessage('Failed to retrieve word information. Please try again later.', true);
                resetOutputs();
            }
        } catch (error) {
            console.error('Error fetching word data:', error);
            showMessage('An error occurred while fetching word data. Please check your network connection or try again later.', true);
            resetOutputs();
        }
    });

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        wordInput.value = ''; // Clear the input field
        showMessage('', false); // Clear any active message
        resetOutputs(); // Reset all output fields
    });
});
