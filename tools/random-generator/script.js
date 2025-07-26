// tools/random-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    const getJokeBtn = document.getElementById('getJokeBtn');
    const getQuoteBtn = document.getElementById('getQuoteBtn');
    const clearOutputBtn = document.getElementById('clearOutputBtn');
    const jokeSetup = document.getElementById('jokeSetup');
    const jokePunchline = document.getElementById('jokePunchline');
    const quoteContent = document.getElementById('quoteContent');
    const quoteAuthor = document.getElementById('quoteAuthor');
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
        jokeSetup.textContent = '';
        jokeSetup.style.display = 'none';
        jokePunchline.textContent = '';
        jokePunchline.style.display = 'none';
        quoteContent.textContent = '';
        quoteContent.style.display = 'none';
        quoteAuthor.textContent = '';
        quoteAuthor.style.display = 'none';
        initialMessage.style.display = 'block';
    };

    // Initialize the display
    resetOutputs();

    // Event listener for "Get Random Joke" button
    getJokeBtn.addEventListener('click', async () => {
        showMessage('Fetching a random joke...');
        resetOutputs();

        try {
            const apiUrl = 'https://official-joke-api.appspot.com/jokes/random';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.setup && data.punchline) {
                jokeSetup.textContent = data.setup;
                jokeSetup.style.display = 'block';
                jokePunchline.textContent = data.punchline;
                jokePunchline.style.display = 'block';
                initialMessage.style.display = 'none';
                showMessage('Joke loaded!', false);
            } else {
                showMessage('Failed to retrieve a joke. Please try again.', true);
            }
        } catch (error) {
            console.error('Error fetching joke:', error);
            showMessage('An error occurred while fetching the joke. Please check your network connection or try again later.', true);
        }
    });

    // Event listener for "Get Random Quote" button
    getQuoteBtn.addEventListener('click', async () => {
        showMessage('Fetching a random quote...');
        resetOutputs();

        try {
            const apiUrl = 'https://api.quotable.io/random';
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.content && data.author) {
                quoteContent.textContent = `"${data.content}"`;
                quoteContent.style.display = 'block';
                quoteAuthor.textContent = `- ${data.author}`;
                quoteAuthor.style.display = 'block';
                initialMessage.style.display = 'none';
                showMessage('Quote loaded!', false);
            } else {
                showMessage('Failed to retrieve a quote. Please try again.', true);
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            showMessage('An error occurred while fetching the quote. Please check your network connection or try again later.', true);
        }
    });

    // Event listener for "Clear Output" button
    clearOutputBtn.addEventListener('click', () => {
        resetOutputs();
        showMessage('', false); // Clear any active message
    });
});
