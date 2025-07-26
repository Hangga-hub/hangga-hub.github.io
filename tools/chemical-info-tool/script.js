// tools/chemical-info-tool/script.js

document.addEventListener('DOMContentLoaded', () => {
    const chemicalNameInput = document.getElementById('chemicalNameInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const chemicalResultDiv = document.getElementById('chemicalResult');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Output elements for chemical details
    const molecularWeightOutput = document.getElementById('molecularWeightOutput');
    const molecularFormulaOutput = document.getElementById('molecularFormulaOutput');
    const structureOutput = document.getElementById('structureOutput');

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
     * Resets all chemical info output fields and messages.
     */
    const resetOutputs = () => {
        chemicalNameInput.value = '';
        molecularWeightOutput.innerHTML = '<strong>Molecular Weight:</strong> N/A';
        molecularFormulaOutput.innerHTML = '<strong>Molecular Formula:</strong> N/A';
        structureOutput.src = '';
        structureOutput.classList.add('hidden'); // Hide structure image
        chemicalResultDiv.classList.add('hidden'); // Hide the result card
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Fetches chemical information from the PubChem REST API.
     */
    const searchChemicalInfo = async () => {
        const chemicalName = chemicalNameInput.value.trim();

        if (!chemicalName) {
            showMessage(messageBox, 'Please enter a chemical name.', true);
            return;
        }

        // Clear previous results and messages, show loading spinner
        resetOutputs(); // Reset all outputs first
        showMessage(messageBox, 'Searching chemical info...', false);
        loadingSpinner.style.display = 'block'; // Show spinner

        try {
            // First API call to get properties including IsomericSMILES
            const propertiesApiUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(chemicalName)}/property/MolecularWeight,MolecularFormula,IsomericSMILES/JSON`;
            const propertiesResponse = await fetch(propertiesApiUrl);
            const propertiesData = await propertiesResponse.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (propertiesResponse.ok && propertiesData.PropertyTable && propertiesData.PropertyTable.Properties && propertiesData.PropertyTable.Properties.length > 0) {
                const chemicalProperties = propertiesData.PropertyTable.Properties[0];
                
                const molecularWeight = chemicalProperties.MolecularWeight !== undefined ? chemicalProperties.MolecularWeight : 'N/A';
                const molecularFormula = chemicalProperties.MolecularFormula || 'N/A';
                const isomericSMILES = chemicalProperties.IsomericSMILES;

                molecularWeightOutput.innerHTML = `<strong>Molecular Weight:</strong> ${molecularWeight}`;
                molecularFormulaOutput.innerHTML = `<strong>Molecular Formula:</strong> ${molecularFormula}`;
                
                // If SMILES is available, fetch the structure image
                if (isomericSMILES) {
                    const structureApiUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(isomericSMILES)}/PNG`;
                    structureOutput.src = structureApiUrl;
                    structureOutput.classList.remove('hidden');
                } else {
                    structureOutput.src = 'https://placehold.co/300x200/FFFFFF/333333?text=No+Structure'; // Fallback
                    structureOutput.classList.remove('hidden');
                }

                chemicalResultDiv.classList.remove('hidden'); // Show the result card
                showMessage(messageBox, 'Chemical info found!', false);

            } else {
                showMessage(resultsMessageBox, 'Chemical not found or no data available. Please check the name and try again.', true);
            }
        } catch (error) {
            console.error('Error fetching chemical data:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage(resultsMessageBox, 'An error occurred while fetching data. Please check your network connection or try again later.', true);
        }
    };

    // Event listeners
    searchBtn.addEventListener('click', searchChemicalInfo);
    clearBtn.addEventListener('click', resetOutputs);

    // Allow pressing Enter in the input field to trigger search
    chemicalNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchChemicalInfo();
        }
    });
});
