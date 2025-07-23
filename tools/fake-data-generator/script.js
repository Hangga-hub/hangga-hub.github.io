// script.js for Fake Data Generator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to input elements
    const numRecordsInput = document.getElementById("numRecords");
    const generateNamesCheckbox = document.getElementById("generateNames");
    const generateEmailsCheckbox = document.getElementById("generateEmails");
    const generateAddressesCheckbox = document.getElementById("generateAddresses");
    const generateCreditCardsCheckbox = document.getElementById("generateCreditCards");

    // Get references to output and button elements
    const generatedDataOutput = document.getElementById("generatedDataOutput");
    const generateBtn = document.getElementById("generateBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyResultsBtn = document.getElementById("copyResultsBtn");
    const messageBox = document.getElementById("messageBox");

    // --- Data Pools ---
    const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Kevin", "Linda", "Mike", "Nancy", "Oscar", "Pamela", "Quinn", "Rachel", "Steve", "Tina", "Ursula", "Victor", "Wendy", "Xavier", "Yara", "Zack"];
    const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen"];
    const streetNames = ["Main St", "Oak Ave", "Pine Ln", "Maple Rd", "Cedar Blvd", "Elm Dr", "Willow Way", "Birch Ct", "Park Pl", "Highland St", "River Rd", "Lake Ave", "Forest Ln", "Mountain Blvd"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus"];
    const states = ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MD", "CO", "MN", "SC", "AL", "LA", "KY", "OR", "OK", "CT"];
    const emailDomains = ["example.com", "test.org", "mail.net", "domain.info", "web.co"];

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
     * Gets a random element from an array.
     * @param {Array} arr - The array to pick from.
     * @returns {*} A random element from the array.
     */
    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Generates a fake full name.
     * @returns {string} A fake full name.
     */
    function generateFakeName() {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        return `${firstName} ${lastName}`;
    }

    /**
     * Generates a fake email address based on a name.
     * @param {string} name - The name to use for the email.
     * @returns {string} A fake email address.
     */
    function generateFakeEmail(name) {
        const cleanedName = name.toLowerCase().replace(/\s/g, '.');
        const domain = getRandomElement(emailDomains);
        return `${cleanedName}${Math.floor(Math.random() * 100)}@${domain}`;
    }

    /**
     * Generates a fake street address.
     * @returns {string} A fake street address.
     */
    function generateFakeAddress() {
        const streetNumber = Math.floor(Math.random() * 999) + 1;
        const streetName = getRandomElement(streetNames);
        const city = getRandomElement(cities);
        const state = getRandomElement(states);
        const zipCode = Math.floor(10000 + Math.random() * 90000); // 5-digit zip code
        return `${streetNumber} ${streetName}, ${city}, ${state} ${zipCode}`;
    }

    /**
     * Implements the Luhn algorithm to validate or generate a checksum digit.
     * @param {string} cardNumber - The card number string (without the last digit if generating).
     * @returns {number} The checksum digit required to make the number Luhn valid.
     */
    function calculateLuhnChecksum(cardNumber) {
        let sum = 0;
        let parity = (cardNumber.length + 1) % 2; // Start from rightmost digit, which is index 0 if length is odd, 1 if even

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);

            if (i % 2 === parity) { // Double every second digit from the right
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
        }
        return (sum * 9) % 10; // The checksum digit to make sum a multiple of 10
    }

    /**
     * Generates a fake credit card number that passes the Luhn algorithm.
     * Only generates numbers that look like Visa (4xxx) or Mastercard (5xxx).
     * @returns {string} A Luhn-valid fake credit card number.
     */
    function generateFakeCreditCard() {
        // Common prefixes for Visa (4) and Mastercard (5)
        const prefixes = ["4", "5"];
        const prefix = getRandomElement(prefixes);

        let cardNumber = prefix;
        // Generate 14-15 random digits to make it 15-16 digits total before checksum
        const remainingLength = 15 - cardNumber.length; // For 16-digit card
        for (let i = 0; i < remainingLength; i++) {
            cardNumber += Math.floor(Math.random() * 10);
        }

        // Calculate the Luhn checksum for the generated part
        const checksum = calculateLuhnChecksum(cardNumber);
        return cardNumber + checksum;
    }

    /**
     * Generates the requested fake data and displays it.
     */
    function generateData() {
        const numRecords = parseInt(numRecordsInput.value);
        const genNames = generateNamesCheckbox.checked;
        const genEmails = generateEmailsCheckbox.checked;
        const genAddresses = generateAddressesCheckbox.checked;
        const genCreditCards = generateCreditCardsCheckbox.checked;

        // Input validation
        if (isNaN(numRecords) || numRecords < 1 || numRecords > 100) {
            showMessage("Please enter a number of records between 1 and 100.", true);
            return;
        }

        if (!genNames && !genEmails && !genAddresses && !genCreditCards) {
            showMessage("Please select at least one data type to generate.", true);
            return;
        }

        generatedDataOutput.innerHTML = ""; // Clear previous results
        let outputHtml = "";
        let rawDataForCopy = "";

        for (let i = 0; i < numRecords; i++) {
            let name = "";
            let email = "";
            let address = "";
            let creditCard = "";

            if (genNames) {
                name = generateFakeName();
            }
            if (genEmails) {
                // If names are not generated, generate a basic name for email
                email = generateFakeEmail(name || generateFakeName());
            }
            if (genAddresses) {
                address = generateFakeAddress();
            }
            if (genCreditCards) {
                creditCard = generateFakeCreditCard();
            }

            // Format for display
            outputHtml += `<div class="data-entry">`;
            rawDataForCopy += `--- Record ${i + 1} ---\n`;

            if (name) {
                outputHtml += `<p><strong>Name:</strong> ${name}</p>`;
                rawDataForCopy += `Name: ${name}\n`;
            }
            if (email) {
                outputHtml += `<p><strong>Email:</strong> ${email}</p>`;
                rawDataForCopy += `Email: ${email}\n`;
            }
            if (address) {
                outputHtml += `<p><strong>Address:</strong> ${address}</p>`;
                rawDataForCopy += `Address: ${address}\n`;
            }
            if (creditCard) {
                outputHtml += `<p><strong>Credit Card:</strong> ${creditCard}</p>`;
                rawDataForCopy += `Credit Card: ${creditCard}\n`;
            }
            outputHtml += `</div>`;
            rawDataForCopy += `\n`; // Add a newline between records for raw copy
        }

        generatedDataOutput.innerHTML = outputHtml;
        generatedDataOutput.dataset.rawData = rawDataForCopy; // Store raw data for copying

        showMessage(`Generated ${numRecords} records.`);
    }

    /**
     * Clears the output area and resets input defaults.
     */
    function clearOutput() {
        generatedDataOutput.innerHTML = '<p style="text-align: center; color: rgba(238, 238, 238, 0.5);">Generated data will appear here.</p>';
        generatedDataOutput.dataset.rawData = ""; // Clear stored raw data
        numRecordsInput.value = "5";
        generateNamesCheckbox.checked = true;
        generateEmailsCheckbox.checked = true;
        generateAddressesCheckbox.checked = false; // Default to off for addresses and CCs
        generateCreditCardsCheckbox.checked = false;
        showMessage("Output cleared and options reset.");
    }

    /**
     * Copies all generated data to the clipboard.
     */
    function copyResults() {
        const dataToCopy = generatedDataOutput.dataset.rawData;

        if (!dataToCopy) {
            showMessage("No data to copy. Please generate some first.", true);
            return;
        }

        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = dataToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showMessage("All generated data copied to clipboard!");
            } else {
                showMessage("Failed to copy data to clipboard.", true);
            }
        } catch (err) {
            console.error('Oops, unable to copy', err);
            showMessage("Copy failed! Your browser might not support this feature.", true);
        } finally {
            document.body.removeChild(tempTextArea); // Clean up
        }
    }

    // Event Listeners
    generateBtn.addEventListener("click", generateData);
    clearBtn.addEventListener("click", clearOutput);
    copyResultsBtn.addEventListener("click", copyResults);

    // Initial state setup
    clearOutput(); // Clear output and set defaults on load
});
