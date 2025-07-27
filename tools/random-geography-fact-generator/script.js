// tools/random-geography-fact-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const factResult = document.getElementById('factResult');
    const factOutput = document.getElementById('factOutput');
    const resultSection = document.querySelector('.result-section');

    // A simple list of geography facts
    const geographyFacts = [
        "The Pacific Ocean is the largest and deepest ocean, covering about a third of the Earth's surface.",
        "The Atacama Desert in Chile is the driest non-polar desert in the world.",
        "Mount Everest, the world's highest peak, grows about 4 millimeters taller every year due to geological uplift.",
        "Russia is the largest country in the world by land area, spanning 11 time zones.",
        "The Nile River is the longest river in the world, flowing for about 6,650 kilometers (4,132 miles).",
        "Vatican City is the smallest independent state in the world, both in area and population.",
        "The Great Barrier Reef in Australia is the world's largest coral reef system.",
        "Canada has the longest coastline of any country in the world.",
        "The Sahara Desert is the largest hot desert in the world, covering most of North Africa.",
        "Angel Falls in Venezuela is the world's tallest uninterrupted waterfall.",
        "Istanbul, Turkey is the only city in the world that straddles two continents: Europe and Asia.",
        "Lesotho is a country entirely surrounded by another country (South Africa).",
        "The Dead Sea's shores are the lowest land-based elevation on Earth.",
        "Lake Baikal in Siberia, Russia, is the world's largest freshwater lake by volume, containing about 22-23% of the world's fresh surface water.",
        "Greenland is the world's largest island that is not a continent."
    ];

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
     * Resets the output area to its initial state.
     */
    const resetOutputs = () => {
        factResult.classList.add('hidden');
        factOutput.textContent = '';
        messageBox.classList.remove('show');
        resultsMessageBox.classList.remove('show');
        loadingSpinner.style.display = 'none';
    };

    /**
     * Scrolls the window down to the result output section.
     */
    const scrollToResults = () => {
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    /**
     * Generates and displays a random fact.
     */
    const generateFact = () => {
        showMessage(messageBox, 'Generating a new fact...');
        loadingSpinner.style.display = 'block';
        factResult.classList.add('hidden');
        resultsMessageBox.classList.remove('show');

        // Simulate a network request or processing time
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * geographyFacts.length);
            factOutput.textContent = geographyFacts[randomIndex];

            loadingSpinner.style.display = 'none';
            factResult.classList.remove('hidden');
            showMessage(messageBox, 'Fact generated!', false);
            scrollToResults();
        }, 500); // 0.5 second delay
    };

    // Event Listeners
    generateBtn.addEventListener('click', generateFact);
    clearBtn.addEventListener('click', resetOutputs);
});