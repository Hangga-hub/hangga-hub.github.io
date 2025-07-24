document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const quantityInput = document.getElementById("quantityInput");
    const generateBtn = document.getElementById("generateBtn");
    const resetBtn = document.getElementById("resetBtn");
    const emojiOutput = document.getElementById("emojiOutput");
    const copyOutputBtn = document.getElementById("copyOutputBtn");
    const messageBox = document.getElementById("messageBox");

    // --- Emoji List (a selection of popular emojis) ---
    const emojiList = [
        '😀', '😂', '😍', '👍', '🙏', '💯', '🔥', '🌟', '🚀', '💡',
        '🎉', '🍕', '❤️', '🌈', '🐶', '🐱', '🌸', '☀️', '🌍', '⏰',
        '🥳', '😎', '🤩', '🤯', '🤔', '🤫', '😇', '😈', '🤡', '👻',
        '🤖', '👾', '👽', '👋', '👏', '🙌', '🤞', '🤙', '💪', '🧠',
        '👀', '👂', '👃', '👄', '👅', '💅', '👑', '💍', '💎', '💰',
        '📈', '📉', '📊', '📚', '✏️', '🖋️', '📏', '✂️', '⚙️', '🛠️',
        '💻', '📱', '⌨️', '🖱️', '🖨️', '📷', '📹', '🎙️', '🎧', '🎤',
        '🎶', '🎵', '🎸', '🥁', '🎷', '🎺', '🎻', '🎨', '🎭', '🎬',
        '🎮', '🎲', '🧩', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉',
        '🚗', '🚕', '🚌', '🏎️', '🚓', '🚑', '🚒', '🚚', '🚲', '🛴',
        '✈️', '🚁', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉',
        '🚢', '⛵', '🚤', '🛥️', '⚓', '🗺️', '🧭', '🏖️', '🏝️', '🏞️',
        '🏙️', '🌃', '🌉', '🌌', '🌠', '🎇', '🎆', '🌈', '🌪️', '⚡',
        '☔', '❄️', '☃️', '🌬️', '💨', '🌊', '💧', '💦', '💧', '🔥',
        '🍎', '🍌', '🍓', '🍇', '🍉', '🍍', '🥭', '🥝', '🍒', '🍑',
        '🍔', '🍟', '🍕', '🌭', '🌮', '🌯', '🍜', '🍝', '🍣', '🍤',
        '🍦', '🍩', '🍪', '🍫', '🍬', '🍭', '🍮', '🍯', '🥛', '☕',
        '🍵', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🧊'
    ];


    // --- Initial State ---
    emojiOutput.textContent = "Click 'Generate Emojis' to see them here!";
    copyOutputBtn.disabled = true;

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
     * Generates a specified quantity of random emojis.
     */
    function generateEmojis() {
        const quantity = parseInt(quantityInput.value);

        if (isNaN(quantity) || quantity < 1 || quantity > 1000) {
            emojiOutput.textContent = "Please enter a quantity between 1 and 1000.";
            copyOutputBtn.disabled = true;
            showMessage("Invalid quantity. Please enter a number between 1 and 1000.", true);
            return;
        }

        let generatedEmojis = [];
        for (let i = 0; i < quantity; i++) {
            const randomIndex = Math.floor(Math.random() * emojiList.length);
            generatedEmojis.push(emojiList[randomIndex]);
        }

        emojiOutput.textContent = generatedEmojis.join(''); // Join without spaces for dense display
        copyOutputBtn.disabled = false;
        showMessage(`Generated ${quantity} emojis!`);

        // Scroll to the output section
        emojiOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Copies the generated emojis to the clipboard.
     */
    function copyOutput() {
        const textToCopy = emojiOutput.textContent;
        if (textToCopy && textToCopy !== "Click 'Generate Emojis' to see them here!") {
            try {
                // Use document.execCommand('copy') for better compatibility in iframes
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showMessage("Emojis copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy emojis:", err);
                showMessage("Failed to copy emojis. Please copy manually.", true);
            }
        } else {
            showMessage("No emojis to copy.", true);
        }
    }

    /**
     * Resets all inputs and outputs to their default states.
     */
    function resetTool() {
        quantityInput.value = "10";
        emojiOutput.textContent = "Click 'Generate Emojis' to see them here!";
        copyOutputBtn.disabled = true;
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Tool reset.");
    }

    // --- Event Listeners ---
    generateBtn.addEventListener("click", generateEmojis);
    copyOutputBtn.addEventListener("click", copyOutput);
    resetBtn.addEventListener("click", resetTool);
});
