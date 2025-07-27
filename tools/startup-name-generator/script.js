// script.js for Startup Name Generator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const keywordsInput = document.getElementById("keywords");
    const nameStyleRadios = document.querySelectorAll('input[name="nameStyle"]');
    const numNamesInput = document.getElementById("numNames");

    // Get references to output and button elements
    const generatedNamesList = document.getElementById("generatedNamesList");
    const generateBtn = document.getElementById("generateBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyResultsBtn = document.getElementById("copyResultsBtn");
    const messageBox = document.getElementById("messageBox");
    const outputSection = document.querySelector('.output-section');

    // Define word lists for name generation
    const commonPrefixes = ["Syn", "Omni", "Core", "Aero", "Bio", "Cyber", "Data", "Eco", "Flex", "Giga", "Hyper", "Infra", "Kilo", "Meta", "Nano", "Opti", "Pico", "Quantum", "Revo", "Spectra", "Tera", "Ultra", "Velo", "Xeno", "Zeta"];
    const commonSuffixes = ["fy", "ly", "io", "ify", "net", "ware", "tech", "labs", "hub", "flow", "verse", "sphere", "cloud", "solutions", "gen", "stack", "byte", "link", "peak", "core", "edge", "nest"];
    const adjectives = ["Bright", "Swift", "Global", "Smart", "Infinite", "Apex", "Prime", "True", "Bold", "Future", "Dynamic", "Elite", "Grand", "Vital"];
    const nouns = ["Labs", "Solutions", "Hub", "Works", "Systems", "Corp", "Ventures", "Forge", "Innovate", "Nexus", "Sphere", "Path", "Leap", "Spark"];
    const playfulWords = ["Jelly", "Spark", "Giggle", "Wiz", "Zoom", "Panda", "Quirk", "Bliss", "Zest", "Doodle", "Snappy", "Flicker", "Bounce"];
    const techWords = ["Byte", "Data", "Code", "Pixel", "Logic", "Cloud", "Net", "Sync", "Link", "Grid", "Matrix", "Flow", "Core"];

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("error", "show"); // Reset classes
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");
        // Automatically hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, 3000);
    }

    /**
     * Scrolls the window down to the result output section.
     */
    function scrollToResults() {
        if (outputSection) {
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Capitalizes the first letter of a string.
     * @param {string} string - The input string.
     * @returns {string} The string with the first letter capitalized.
     */
    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Generates a single startup name based on style and keywords.
     * @param {string[]} keywordsArray - Array of keywords provided by the user.
     * @param {string} style - The selected name style ('modern', 'classic', 'playful').
     * @returns {string} A generated startup name.
     */
    function generateSingleName(keywordsArray, style) {
        let name = "";
        const useKeyword = keywordsArray.length > 0 && Math.random() < 0.5; // 50% chance to use a keyword

        let primaryWord = useKeyword ? keywordsArray[Math.floor(Math.random() * keywordsArray.length)] : '';
        primaryWord = capitalizeFirstLetter(primaryWord);

        switch (style) {
            case 'modern':
                // Combine a prefix/keyword with a techy word or suffix, possibly dropping vowels
                let part1 = commonPrefixes[Math.floor(Math.random() * commonPrefixes.length)];
                let part2 = techWords[Math.floor(Math.random() * techWords.length)];
                let part3 = commonSuffixes[Math.floor(Math.random() * commonSuffixes.length)];

                if (useKeyword) {
                    // Try to blend keyword
                    if (Math.random() < 0.5) { // Keyword as prefix
                        name = primaryWord + part2.toLowerCase().replace(/[aeiou]/g, ''); // e.g., HealthByte
                    } else { // Keyword as suffix
                        name = part1.replace(/[aeiou]/g, '') + primaryWord; // e.g., SynHealth
                    }
                } else {
                    name = capitalizeFirstLetter(part1.replace(/[aeiou]/g, '')) + capitalizeFirstLetter(part2); // e.g., SynData
                }

                if (Math.random() < 0.3) { // Add a suffix sometimes
                    name += part3;
                }
                break;

            case 'classic':
                // Adjective + Noun or Keyword + Noun
                let adj = adjectives[Math.floor(Math.random() * adjectives.length)];
                let noun = nouns[Math.floor(Math.random() * nouns.length)];
                if (useKeyword) {
                    name = primaryWord + " " + noun; // e.g., Health Solutions
                } else {
                    name = adj + " " + noun; // e.g., Bright Labs
                }
                break;

            case 'playful':
                // Playful word + common noun or playful suffix
                let playful = playfulWords[Math.floor(Math.random() * playfulWords.length)];
                let suffix = commonSuffixes[Math.floor(Math.random() * commonSuffixes.length)];

                if (useKeyword) {
                    if (Math.random() < 0.5) {
                        name = primaryWord + capitalizeFirstLetter(playful); // e.g., FinanceWiz
                    } else {
                        name = playful + primaryWord; // e.g., SparkHealth
                    }
                } else {
                    if (Math.random() < 0.6) { // Playful word + Noun
                        name = playful + capitalizeFirstLetter(nouns[Math.floor(Math.random() * nouns.length)]); // e.g., GiggleHub
                    } else { // Playful word + suffix
                        name = playful + suffix; // e.g., Zoomify
                    }
                }
                break;
        }
        return capitalizeFirstLetter(name.replace(/\s+/g, '')); // Remove spaces and ensure camelCase if multiple words
    }


    /**
     * Generates startup names based on user-selected criteria.
     */
    function generateStartupNames() {
        const keywords = keywordsInput.value.trim();
        const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : [];

        let selectedStyle = 'modern'; // Default
        for (const radio of nameStyleRadios) {
            if (radio.checked) {
                selectedStyle = radio.value;
                break;
            }
        }

        const numNames = parseInt(numNamesInput.value);

        // Input validation
        if (isNaN(numNames) || numNames < 1 || numNames > 20) {
            showMessage("Please enter a number of names to generate between 1 and 20.", true);
            scrollToResults();
            return;
        }

        generatedNamesList.innerHTML = ""; // Clear previous results
        const generatedSet = new Set(); // To store unique names

        let attempts = 0;
        const maxAttempts = numNames * 5; // Prevent infinite loops for impossible combinations

        while (generatedSet.size < numNames && attempts < maxAttempts) {
            const newName = generateSingleName(keywordsArray, selectedStyle);
            if (newName.length > 2 && newName.length < 25 && !generatedSet.has(newName)) { // Basic length check and uniqueness
                generatedSet.add(newName);
            }
            attempts++;
        }

        if (generatedSet.size === 0) {
            showMessage("Could not generate names with the given criteria. Try different keywords or styles.", true);
            scrollToResults();
            return;
        }

        generatedSet.forEach(name => {
            const listItem = document.createElement("li");
            listItem.textContent = name;
            generatedNamesList.appendChild(listItem);
        });

        showMessage(`Generated ${generatedSet.size} startup names.`);
        scrollToResults();
    }

    /**
     * Clears all input fields and generated names.
     */
    function clearFields() {
        keywordsInput.value = "";
        document.getElementById("numNames").value = "5";
        document.querySelector('input[name="nameStyle"][value="modern"]').checked = true; // Reset to default style
        generatedNamesList.innerHTML = ""; // Clear results list
        showMessage("All fields cleared.");
    }

    /**
     * Copies all generated names to the clipboard.
     */
    function copyResults() {
        const names = Array.from(generatedNamesList.children).map(li => li.textContent).join('\n');

        if (names.length === 0) {
            showMessage("No names to copy. Please generate some first.", true);
            return;
        }

        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = names;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showMessage("Names copied to clipboard!");
            } else {
                showMessage("Failed to copy names to clipboard.", true);
            }
        } catch (err) {
            console.error('Oops, unable to copy', err);
            showMessage("Copy failed! Your browser might not support this feature.", true);
        } finally {
            document.body.removeChild(tempTextArea); // Clean up
        }
    }

    // Event Listeners
    generateBtn.addEventListener("click", generateStartupNames);
    clearBtn.addEventListener("click", clearFields);
    copyResultsBtn.addEventListener("click", copyResults);

    // Initial state setup
    clearFields(); // Clear fields and results on load
});
