// tools/pet-name-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    const petTypeInput = document.getElementById('petTypeInput');
    const nameStyleSelect = document.getElementById('nameStyleSelect');
    const nameCountInput = document.getElementById('nameCountInput');
    const generateNamesBtn = document.getElementById('generateNamesBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const generatedNamesList = document.getElementById('generatedNamesList');
    const outputSection = document.querySelector('.output-section'); // For scrolling

    /**
     * Displays a message in a specified message box.
     * @param {HTMLElement} element - The message box HTML element.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.classList.remove('error');
        if (isError) {
            element.classList.add('error');
        }
        element.classList.add('show');
        setTimeout(() => {
            element.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Resets all input and output fields.
     */
    const resetOutputs = () => {
        petTypeInput.value = '';
        nameStyleSelect.value = '';
        nameCountInput.value = '5'; // Reset to default
        generatedNamesList.innerHTML = ''; // Clear generated names
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none';
    };

    // Preloaded dataset of pet names
    // This dataset is a simplified example. In a real application,
    // you might have a much larger, categorized dataset.
    const petNames = {
        "dog": [
            "Buddy", "Max", "Charlie", "Bella", "Lucy", "Daisy", "Milo", "Luna", "Bailey", "Cooper",
            "Rocky", "Bear", "Duke", "Shadow", "Winston", "Leo", "Apollo", "Boomer", "Zeus", "Gus",
            "Sadie", "Chloe", "Sophie", "Zoe", "Penny", "Ruby", "Stella", "Coco", "Rosie", "Ginger", "Hazel",
            "Lola", "Maggie", "Gracie", "Abby", "Finn", "Bentley", "Maverick", "Dakota", "Rocky", "Sasha",
            "Chester", "Molly", "Morgan", "Cody", "Buster", "Hunter", "Rufus", "Odessa", "Luna", "Skye"
        ],
        "cat": [
            "Oliver", "Leo", "Milo", "Charlie", "Lucy", "Luna", "Bella", "Daisy", "Willow", "Cleo",
            "Jasper", "Felix", "Smokey", "Tiger", "Simba", "Gizmo", "Oreo", "Mittens", "Whiskers", "Shadow",
            "Princess", "Nala", "Chloe", "Sophie", "Lily", "Ruby", "Stella", "Pepper", "Hazel", "Willow",
            "Luna", "Skye", "Sasha", "Cinnamon", "Tigger", "Scooter", "Mittens", "Snowball", "Chiquita", "Kiwi"
        ],
        "fish": [
            "Finley", "Bubbles", "Goldie", "Nemo", "Dory", "Splash", "Flipper", "Coral", "Gill", "Aqua",
            "Moby", "Wanda", "Sushi", "Guppy", "Blob", "Sparkle", "Blue", "Red", "Sunny", "Wave",
            "Tidal", "Nixie", "Oceana", "Luna", "Squirt", "Bloopie", "Finnley", "Caspian", "Luna", "Gizmo"
        ],
        "bird": [
            "Skye", "Sunny", "Pip", "Chirpy", "Tweety", "Echo", "Kiwi", "Rio", "Bluebell", "Feather",
            "Mango", "Zazu", "Buddy", "Coco", "Peanut", "Jasper", "Willow", "Phoenix", "Sky", "Cloud",
            "Luna", "Sparky", "Minnie", "Tiny", "Sammy", "Kiwi", "Koko", "Lola", "Gracie", "Cinnamon"
        ],
        "rabbit": [
            "Thumper", "Bugs", "Cotton", "Snowball", "Hopper", "Bunny", "Fluffy", "Oreo", "Marshmallow", "Clover",
            "Hazel", "Daisy", "Pip", "Smokey", "Pepper", "Willow", "Coco", "Bella", "Lucky", "Patches",
            "Cinnamon", "Nutmeg", "Caramel", "Mocha", "Ginger", "Sasha", "Luna", "Skye", "Ruby", "Rufus"
        ],
        "hamster": [
            "Hammy", "Squeaky", "Nibbles", "Pip", "Cheeks", "Peanut", "Fuzzy", "Gizmo", "Buddy", "Coco",
            "Daisy", "Hazel", "Milo", "Oreo", "Patches", "Pepper", "Smokey", "Snowball", "Sunny", "Willow",
            "Luna", "Skye", "Sparky", "Tiny", "Sammy", "Kiwi", "Koko", "Lola", "Gracie", "Cinnamon"
        ],
        // Add more pet types and names as needed
        "default": [
            "Buddy", "Luna", "Max", "Bella", "Charlie", "Daisy", "Milo", "Lucy", "Oliver", "Chloe",
            "Leo", "Sophie", "Jasper", "Zoe", "Rocky", "Penny", "Bailey", "Ruby", "Cooper", "Stella",
            "Coco", "Rosie", "Shadow", "Winston", "Apollo", "Zeus", "Gus", "Sadie", "Ginger", "Hazel", "Lola",
            "Maggie", "Gracie", "Abby", "Finn", "Bentley", "Maverick", "Dakota", "Rocky", "Sasha", "Chester",
            "Molly", "Morgan", "Cody", "Buster", "Hunter", "Rufus", "Odessa", "Luna", "Skye"
        ]
    };

    /**
     * Generates pet names from the local dataset.
     */
    const generatePetNames = () => {
        const petType = petTypeInput.value.trim().toLowerCase();
        const nameCount = parseInt(nameCountInput.value.trim());

        // Clear previous outputs
        generatedNamesList.innerHTML = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';

        if (!petType) {
            showMessage(messageBox, 'Please enter a type of pet (e.g., dog, cat).', true);
            return;
        }
        if (isNaN(nameCount) || nameCount < 1 || nameCount > 10) {
            showMessage(messageBox, 'Please enter a number between 1 and 10 for the number of names.', true);
            return;
        }

        showMessage(messageBox, 'Generating names from local data...', false);
        loadingSpinner.style.display = 'block';

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';

            const availableNames = petNames[petType] || petNames["default"];
            const generated = new Set(); // Use a Set to ensure unique names
            
            // Generate unique random names
            while (generated.size < nameCount && generated.size < availableNames.length) {
                const randomIndex = Math.floor(Math.random() * availableNames.length);
                generated.add(availableNames[randomIndex]);
            }

            if (generated.size > 0) {
                generated.forEach(name => {
                    const listItem = document.createElement('li');
                    listItem.textContent = name;
                    generatedNamesList.appendChild(listItem);
                });
                showMessage(resultsMessageBox, 'Names generated successfully!', false);
            } else {
                showMessage(resultsMessageBox, `No names found for "${petType}". Try "dog", "cat", "fish", "bird", "rabbit", "hamster" or leave blank for general names.`, true);
            }
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500); // Simulate a small delay for "loading" effect
    };

    // Event Listeners
    generateNamesBtn.addEventListener('click', generatePetNames);
    clearAllBtn.addEventListener('click', resetOutputs);

    // Allow Enter key to trigger generation in petType input
    petTypeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generatePetNames();
        }
    });

    // Initial state setup
    resetOutputs();
});
