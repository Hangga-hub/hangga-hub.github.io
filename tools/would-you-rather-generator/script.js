document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const quantityInput = document.getElementById("quantityInput");
    const generateBtn = document.getElementById("generateBtn");
    const resetBtn = document.getElementById("resetBtn");
    const questionsOutput = document.getElementById("questionsOutput");
    const copyOutputBtn = document.getElementById("copyOutputBtn");
    const messageBox = document.getElementById("messageBox");

    // --- Would You Rather Question List ---
    // Each question is an object with two options
    const questionList = [
        { option1: "Be able to fly", option2: "Be invisible" },
        { option1: "Have unlimited money", option2: "Have unlimited wishes (but only for others)" },
        { option1: "Fight 100 duck-sized horses", option2: "Fight 1 horse-sized duck" },
        { option1: "Always be 10 minutes late", option2: "Always be 20 minutes early" },
        { option1: "Live in a house made of candy", option2: "Live in a house made of pizza" },
        { option1: "Be able to talk to animals", option2: "Be able to speak all human languages" },
        { option1: "Have super strength", option2: "Have super speed" },
        { option1: "Eat only pizza for the rest of your life", option2: "Eat only ice cream for the rest of your life" },
        { option1: "Be a famous movie star", option2: "Be a world-renowned scientist" },
        { option1: "Have a photographic memory", option2: "Be able to instantly learn any skill" },
        { option1: "Live without internet for a month", option2: "Live without your phone for a month" },
        { option1: "Have a rewind button for your life", option2: "Have a pause button for your life" },
        { option1: "Be able to breathe underwater", option2: "Be able to walk on walls" },
        { option1: "Always have to say everything on your mind", option2: "Never be able to speak again" },
        { option1: "Have a pet dragon", option2: "Have a pet unicorn" },
        { option1: "Travel to the past", option2: "Travel to the future" },
        { option1: "Be able to control fire", option2: "Be able to control water" },
        { option1: "Live in space for a year", option2: "Live at the bottom of the ocean for a year" },
        { option1: "Be able to teleport anywhere", option2: "Be able to read minds" },
        { option1: "Have a personal chef", option2: "Have a personal masseuse" },
        { option1: "Be stuck on a deserted island with your worst enemy", option2: "Be stuck on a deserted island alone" },
        { option1: "Have unlimited access to any book", option2: "Have unlimited access to any movie" },
        { option1: "Be fluent in every language", option2: "Be a master of every musical instrument" },
        { option1: "Always have cold feet", option2: "Always have sweaty hands" },
        { option1: "Be able to talk to ghosts", option2: "Be able to see the future" },
        { option1: "Have a tail", option2: "Have horns" },
        { option1: "Live in a world without music", option2: "Live in a world without color" },
        { option1: "Be able to change your eye color at will", option2: "Be able to change your hair color at will" },
        { option1: "Have a permanent clown nose", option2: "Have permanent clown shoes" },
        { option1: "Be able to understand animals but not speak to them", option2: "Be able to speak to animals but not understand them" },
        { option1: "Fight a chicken every time you get into a car", option2: "Fight a horse every time you get into a car" },
        { option1: "Only be able to whisper", option2: "Only be able to shout" },
        { option1: "Have a tiny house that can travel anywhere", option2: "Have a giant mansion that is stuck in one place" },
        { option1: "Be able to turn invisible but only when no one is looking", option2: "Be able to fly but only 1 foot off the ground" },
        { option1: "Have a permanent unibrow", option2: "Have a permanent mustache (for women) or beard (for men)" },
        { option1: "Be able to summon any food, but it's always slightly burnt", option2: "Be able to summon any drink, but it's always lukewarm" },
        { option1: "Have hands for feet", option2: "Have feet for hands" },
        { option1: "Only be able to walk backwards", option2: "Only be able to crawl forwards" },
        { option1: "Be able to talk to plants", option2: "Be able to talk to rocks" },
        { option1: "Live in a constant state of déjà vu", option2: "Live in a constant state of jamais vu" },
        { option1: "Have unlimited bacon", option2: "Have unlimited donuts" },
        { option1: "Be a master of disguise", option2: "Be a master of impersonation" },
        { option1: "Have a pet elephant", option2: "Have a pet whale" },
        { option1: "Always know the answer to every question", option2: "Always know the best way to solve every problem" },
        { option1: "Be able to control dreams", option2: "Be able to control time (but only for yourself)" },
        { option1: "Have a singing voice that makes everyone cry", option2: "Have a laugh that makes everyone angry" },
        { option1: "Be covered in fur", option2: "Be covered in scales" },
        { option1: "Live in a treehouse", option2: "Live in a cave" },
        { option1: "Have an extra finger", option2: "Have an extra toe" },
        { option1: "Be able to perfectly mimic any sound", option2: "Be able to perfectly mimic any voice" },
        { option1: "Be able to speak any language fluently", option2: "Be able to play any musical instrument perfectly" },
        { option1: "Have a private jet", option2: "Have a private island" }, 
        { option1: "Be able to breathe underwater", option2: "Be able to survive in space" },
        { option1: "Have superhuman strength", option2: "Have superhuman speed" },
        { option1: "Be able to teleport anywhere", option2: "Be able to time travel to any point in history" },
        { option1: "Have a photographic memory", option2: "Be able to learn any new skill in a day" },
        { option1: "Be able to talk to animals", option2: "Be able to talk to the dead" },
        { option1: "Have a money-making machine", option2: "Have a machine that can grant any wish" },
        { option1: "Be able to see the future", option2: "Be able to see the past" },
        { option1: "Have a robot clone of yourself", option2: "Have a human clone of yourself" },
        { option1: "Be able to control the weather", option2: "Be able to control gravity" },
        { option1: "Be able to turn invisible at will", option2: "Be able to teleport anywhere instantly" },
        { option1: "Have superhuman agility", option2: "Have superhuman endurance" },
        { option1: "Be able to communicate with aliens", option2: "Be able to communicate with parallel universes" },
        { option1: "Have a giant water slide in your backyard", option2: "Have a giant trampoline in your backyard" },
        { option1: "Have a pet dragon", option2: "Have a pet phoenix" },
        { option1: "Be able to speak any language fluently", option2: "Be able to write any language fluently" },
        { option1: "Have a 10-minute conversation with a historical figure", option2: "Have a 10-minute conversation with an alien" },
        { option1: "Be able to control the Earth's rotation", option2: "Be able to control the Earth's temperature" },
        { option1: "Have a personal assistant robot", option2: "Have a personal assistant AI" },
        { option1: "Be able to see the future of technology", option2: "Be able to see the future of medicine" },
        { option1: "Have a machine that can turn thoughts into reality", option2: "Have a machine that can turn dreams into reality" },
        { option1: "Be able to travel to parallel universes", option2: "Be able to travel to alternate timelines" },
        { option1: "Have a 3D printer that can create anything", option2: "Have a machine that can create portals to anywhere" },
        { option1: "Be able to talk to inanimate objects", option2: "Be able to hear the thoughts of inanimate objects" },
        { option1: "Have a personal spaceship", option2: "Have a personal submarine" },
        { option1: "Be able to control the stock market", option2: "Be able to control the weather" },
        { option1: "Have a machine that can grant wishes", option2: "Have a machine that can make anything you want appear out of thin air" },
        { option1: "Be able to see the past", option2: "Be able to see the future" },
        { option1: "Have a personal robot that can do anything", option2: "Have a personal AI that can do anything" },
        { option1: "Be able to turn invisible", option2: "Be able to teleport anywhere" }
    ];


    // --- Initial State ---
    questionsOutput.textContent = "Click 'Generate Questions' to see them here!";
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
     * Generates a specified quantity of random "Would You Rather" questions.
     */
    function generateQuestions() {
        const quantity = parseInt(quantityInput.value);

        if (isNaN(quantity) || quantity < 1 || quantity > questionList.length) {
            questionsOutput.textContent = `Please enter a quantity between 1 and ${questionList.length}.`;
            copyOutputBtn.disabled = true;
            showMessage(`Invalid quantity. Please enter a number between 1 and ${questionList.length}.`, true);
            return;
        }

        // Shuffle the question list and pick the first 'quantity' unique questions
        const shuffledQuestions = [...questionList].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffledQuestions.slice(0, quantity);

        let outputHtml = "<ol>";
        selectedQuestions.forEach((q, index) => {
            outputHtml += `<li>Would you rather ${q.option1} or ${q.option2}?</li>`;
        });
        outputHtml += "</ol>";

        questionsOutput.innerHTML = outputHtml;
        copyOutputBtn.disabled = false;
        showMessage(`Generated ${quantity} questions!`);

        // Scroll to the output section
        questionsOutput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Copies the generated questions to the clipboard.
     */
    function copyOutput() {
        // Get the plain text content of the ordered list
        const listItems = questionsOutput.querySelectorAll('li');
        let textToCopy = "";
        listItems.forEach((item, index) => {
            textToCopy += `${index + 1}. ${item.textContent}\n`;
        });

        if (textToCopy.trim() === "" || textToCopy.includes("Click 'Generate Questions' to see them here!")) {
            showMessage("No questions to copy.", true);
            return;
        }

        try {
            // Use document.execCommand('copy') for better compatibility in iframes
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showMessage("Questions copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy questions:", err);
            showMessage("Failed to copy questions. Please copy manually.", true);
        }
    }

    /**
     * Resets all inputs and outputs to their default states.
     */
    function resetTool() {
        quantityInput.value = "5";
        questionsOutput.textContent = "Click 'Generate Questions' to see them here!";
        copyOutputBtn.disabled = true;
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Tool reset.");
    }

    // --- Event Listeners ---
    generateBtn.addEventListener("click", generateQuestions);
    copyOutputBtn.addEventListener("click", copyOutput);
    resetBtn.addEventListener("click", resetTool);
});
