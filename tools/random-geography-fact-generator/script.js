// tools/random-geography-fact-generator/script.js

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const factResultDiv = document.getElementById('factResult');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Output element for the fact
    const factOutput = document.getElementById('factOutput');

    // Preloaded dataset of geography facts
    const geographyFacts = [
        "Did you know Canada has the most lakes in the world?",
        "The Sahara Desert is the largest hot desert in the world, almost as large as the United States.",
        "Mount Everest, the world's highest peak, grows by about 4 millimeters every year.",
        "The Dead Sea, bordering Jordan and Israel, is the lowest point on Earth's land surface.",
        "Russia spans 11 time zones, making it the country with the most time zones.",
        "The Amazon rainforest produces more than 20% of the world's oxygen.",
        "Vatican City is the smallest country in the world, both in area and population.",
        "The Great Barrier Reef off the coast of Australia is the world's largest living structure.",
        "There are more than 2,000 active volcanoes in the world.",
        "The longest river in the world is the Nile River, flowing approximately 6,650 kilometers (4,132 miles).",
        "Australia is wider than the Moon. The Moon's diameter is 3,474 km, while Australia's is 4,000 km.",
        "The driest place on Earth is the Atacama Desert in Chile, with some areas receiving almost no rainfall for centuries.",
        "The highest waterfall in the world is Angel Falls in Venezuela, with a height of 979 meters (3,212 feet).",
        "Istanbul is the only city in the world located on two continents: Europe and Asia.",
        "The Earth's deepest point is the Mariana Trench in the Pacific Ocean, reaching about 11,000 meters (36,000 feet).",
        "The Ganges River in India is considered the most sacred river in Hinduism.",
        "Antarctica is the only continent without a native human population.",
        "The Amazon River, not the Nile, has the largest volume of water flow in the world.",
        "Italy's boot-like shape is due to its long peninsula and the surrounding islands.",
        "In terms of land area, Africa is the second-largest continent, after Asia.",
        "The Pacific Ocean is the largest and deepest ocean on Earth.",
        "Greenland is the largest island in the world that is not a continent.",
        "The Andes mountain range is the longest continental mountain range in the world.",
        "Tokyo, Japan, is the most populous metropolitan area in the world.",
        "The Great Wall of China is the longest wall in the world, stretching over 13,000 miles.",
        "The city of Venice, Italy, is built on more than 100 small islands in a lagoon.",
        "The Danube River flows through more countries than any other river in the world.",
        "The Amazon rainforest is home to one in ten known species on Earth.",
        "Lake Baikal in Russia is the deepest and oldest freshwater lake in the world.",
        "The Himalayas contain the world's highest peaks, including Mount Everest.",
        "The Sahara, Arabian, and Kalahari deserts are some of the world's largest deserts.",
        "The Mississippi River is the second-longest river in North America.",
        "Incas used quipus, a system of knots, to record information in the Andean region.",
        "The Eiffel Tower in Paris, France, was originally a temporary structure for an exhibition.",
        "The Galápagos Islands are famous for their unique wildlife and Charles Darwin's studies.",
        "New Zealand is home to the world's longest place name: Taumatawhakatangihangakoauauotamateapokaiwhenuakitanatahu.",
        "The Dead Sea is almost ten times saltier than ordinary seawater.",
        "The Panama Canal connects the Atlantic and Pacific Oceans through Central America.",
        "The world's largest coral reef system, the Great Barrier Reef, is located in Australia.",
        "The Sahara Desert can experience temperatures ranging from freezing at night to over 50°C during the day.",
        "The Amazon River Basin covers approximately 40% of South America.",
        "The world's largest desert is actually Antarctica, due to its low precipitation.",
        "The Leaning Tower of Pisa in Italy is known for its unintended tilt.",
        "The Yangtze River in China is the longest river in Asia.",
        "Europe is the only continent without any deserts.",
        "The Blue Mosque in Istanbul is famous for its stunning architecture and blue tiles.",
        "The Great Wall of China can be seen from space with the naked eye is a myth.",
        "The city of Timbuktu in Mali was once a center of trade and learning.",
        "The Amazon rainforest is often referred to as the 'lungs of the Earth'.",
        "The Eiffel Tower was the tallest man-made structure in the world until 1930.",
        "The Colosseum in Rome could hold up to 80,000 spectators in ancient times.",
        "The Taj Mahal in India is a UNESCO World Heritage Site and a symbol of love.",
        "The Sydney Opera House is an iconic symbol of Sydney, Australia.",
        "The Empire State Building was the tallest building in the world for nearly 40 years.",
        "The Great Pyramids of Giza are the last of the Seven Wonders of the Ancient World.",
        "Machu Picchu in Peru is an ancient Incan city set high in the Andes Mountains.",
        "Stonehenge in England is a prehistoric monument with mysterious origins.",
        "The city of Petra in Jordan is famous for its rock-cut architecture.",
        "The Grand Canyon in the USA is one of the world's natural wonders.",
        "The Northern Lights, or Aurora Borealis, can be seen in polar regions.",
        "The city of Kyoto in Japan is known for its classical Buddhist temples.",
        "The Amazon is home to more than 2.5 million insect species.",
        "The Burj Khalifa in Dubai is currently the tallest building in the world.",
        "The Kremlin in Moscow is a fortified complex at the heart of Russia.",
        "The city of Jerusalem is sacred to Judaism, Christianity, and Islam.",
        "Mount Fuji is an iconic symbol of Japan and a popular climbing destination.",
        "The Great Sphinx of Giza is one of the world's largest and oldest statues.",
        "The city of Athens in Greece is known as the birthplace of democracy.",
        "The Kremlin in Moscow has been the seat of Russian government for centuries.",
        "Niagara Falls is a group of three waterfalls on the border of Canada and the USA.",
        "The Leaning Tower of Pisa in Italy is famous for its unintended tilt.",
        "The city of Dubrovnik in Croatia is known for its well-preserved medieval architecture.",
        "The Amazon River is the world's largest river by discharge volume of water.",
        "The city of Venice is famous for its canals and gondola rides.",
        "The Sahara Desert can reach temperatures of over 50°C (122°F) during the day.",
        "The city of Reykjavik in Iceland is the northernmost capital of a sovereign state.",
        "The city of Marrakech in Morocco is known for its vibrant markets and gardens.",
        "The Andes Mountains stretch along the western edge of South America.",
        "The city of Buenos Aires is the capital of Argentina and known for tango dance.",
        "The city of Barcelona is known for its unique architecture by Antoni Gaudí.",
        "The city of London is home to the iconic Tower Bridge and Big Ben.",
        "The city of Paris is known as the City of Light and for the Eiffel Tower.",
        "The city of Rio de Janeiro is famous for its Carnival festival and beaches.",
        "The city of Cairo is the capital of Egypt and near the Pyramids of Giza.",
        "The city of Sydney is known for its Opera House and Harbour Bridge.",
        "The city of Los Angeles is known for Hollywood and the entertainment industry.",
        "The city of New York is known as the Big Apple and for Times Square.",
        "The city of Beijing is the capital of China and known for the Forbidden City.",
        "The city of Rome is known for its ancient ruins and the Vatican City.",
        "The city of Berlin is known for its history and the Brandenburg Gate.",
        "The city of Amsterdam is known for its canals and artistic heritage.",
        "The city of Moscow is known for the Red Square and St. Basil's Cathedral.",
        "The city of Bangkok is known for its vibrant street life and cultural landmarks.",
        "The city of Hong Kong is known for its skyline and bustling harbor.",
        "The city of Singapore is known for its cleanliness and modern architecture."


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
     * Resets all fact output fields and messages.
     */
    const resetOutputs = () => {
        factOutput.textContent = '';
        factResultDiv.classList.add('hidden'); // Hide the result card
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Generates and displays a random geography fact.
     */
    const generateFact = () => {
        // Clear previous results and messages, show loading spinner
        resetOutputs(); // Reset all outputs first
        showMessage(messageBox, 'Generating a random fact...', false);
        loadingSpinner.style.display = 'block'; // Show spinner

        // Simulate a small delay for "loading" effect, then display fact
        setTimeout(() => {
            loadingSpinner.style.display = 'none'; // Hide spinner

            if (geographyFacts.length > 0) {
                const randomIndex = Math.floor(Math.random() * geographyFacts.length);
                const randomFact = geographyFacts[randomIndex];
                factOutput.textContent = randomFact;
                factResultDiv.classList.remove('hidden'); // Show the result card
                showMessage(messageBox, 'Fact generated!', false);
            } else {
                showMessage(resultsMessageBox, 'No facts available to generate.', true);
            }
        }, 500); // Simulate network delay
    };

    // Event listeners
    generateBtn.addEventListener('click', generateFact);
    clearBtn.addEventListener('click', resetOutputs);
});
