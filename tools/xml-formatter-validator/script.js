document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const inputXmlTextarea = document.getElementById('inputXml');
    const outputXmlTextarea = document.getElementById('outputXml');
    const formatBtn = document.getElementById('formatBtn');
    const validateBtn = document.getElementById('validateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const validationResultsDiv = document.getElementById('validationResults');
    const messageBox = document.getElementById('messageBox');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Sample XML for initial load
    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="cooking">
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30.00</price>
  </book>
  <book category="children">
    <title lang="en">Harry Potter</title>
    <author>J.K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
</bookstore>`;

    // Function to display messages
    function showMessage(message, type = 'info') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        }
    }

    // Show/hide loading overlay
    function toggleLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    // Function to clear validation results display
    function clearValidationResults() {
        validationResultsDiv.style.display = 'none';
        validationResultsDiv.className = '';
        validationResultsDiv.innerHTML = '';
    }

    /**
     * Formats the input XML using xml-formatter library
     */
    async function formatXml() {
        const xmlString = inputXmlTextarea.value.trim();
        clearValidationResults();
        outputXmlTextarea.value = '';

        if (!xmlString) {
            showMessage('Please enter XML content to format.', 'info');
            return;
        }

        toggleLoading(true);
        outputXmlTextarea.value = 'Formatting...';

        setTimeout(() => {
            try {
                // First validate the XML
                new DOMParser().parseFromString(xmlString, "text/xml");
                
                // If validation passes, format it
                const formattedXml = xmlFormatter(xmlString, {
                    indentation: '  ',
                    lineSeparator: '\n',
                    whiteSpaceAtEndOfSelfclosingTag: true
                });
                
                outputXmlTextarea.value = formattedXml;
                showMessage('XML formatted successfully!', 'success');
            } catch (error) {
                console.error('Error formatting XML:', error);
                outputXmlTextarea.value = 'Error: Could not format XML.\n' + error.message;
                showMessage(`Formatting failed: ${error.message}`, 'error');
                
                validationResultsDiv.style.display = 'block';
                validationResultsDiv.className = 'invalid';
                validationResultsDiv.innerHTML = `
                    <h3>Formatting Error:</h3>
                    <p>${error.message}</p>
                `;
            } finally {
                toggleLoading(false);
            }
        }, 10);
    }

    /**
     * Validates the input XML using DOMParser
     */
    async function validateXml() {
        const xmlString = inputXmlTextarea.value.trim();
        clearValidationResults();
        outputXmlTextarea.value = '';

        if (!xmlString) {
            showMessage('Please enter XML content to validate.', 'info');
            return;
        }

        toggleLoading(true);

        setTimeout(() => {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, "text/xml");
                
                // Check for parser errors
                const parserErrors = xmlDoc.getElementsByTagName("parsererror");
                if (parserErrors.length > 0) {
                    throw new Error(parserErrors[0].textContent);
                }

                validationResultsDiv.style.display = 'block';
                validationResultsDiv.className = 'valid';
                validationResultsDiv.innerHTML = `
                    <h3>Validation Successful!</h3>
                    <p>Your XML is well-formed.</p>
                `;
                showMessage('XML is valid!', 'success');

            } catch (error) {
                console.error('Error validating XML:', error);
                validationResultsDiv.style.display = 'block';
                validationResultsDiv.className = 'invalid';
                validationResultsDiv.innerHTML = `
                    <h3>Validation Failed:</h3>
                    <p>${error.message.replace(/Error: /g, '')}</p>
                    <p>Your XML is not well-formed. Please check for syntax errors.</p>
                `;
                showMessage(`Validation failed: ${error.message}`, 'error');
            } finally {
                toggleLoading(false);
            }
        }, 10);
    }

    // Function to clear all fields
    function clearAll() {
        inputXmlTextarea.value = '';
        outputXmlTextarea.value = '';
        clearValidationResults();
        showMessage('Cleared all fields.', 'info');
    }

    // Event Listeners
    formatBtn.addEventListener('click', formatXml);
    validateBtn.addEventListener('click', validateXml);
    clearBtn.addEventListener('click', clearAll);

    // Initial setup
    inputXmlTextarea.value = sampleXml;
});

// Fallback for xml-formatter if not loaded from CDN
if (typeof xmlFormatter === 'undefined') {
    window.xmlFormatter = function(xmlString, options) {
        const indent = options?.indentation || '  ';
        let formatted = '';
        let level = 0;
        let inTag = false;
        let inAttribute = false;
        
        for (let i = 0; i < xmlString.length; i++) {
            const char = xmlString[i];
            
            if (char === '<') {
                if (xmlString[i+1] === '/') {
                    level--;
                    formatted += '\n' + indent.repeat(level);
                } else {
                    formatted += '\n' + indent.repeat(level);
                    level++;
                }
                inTag = true;
                formatted += char;
            } else if (char === '>') {
                inTag = false;
                inAttribute = false;
                formatted += char;
            } else if (inTag && char === ' ' && !inAttribute) {
                formatted += '\n' + indent.repeat(level) + char;
            } else if (char === '"') {
                inAttribute = !inAttribute;
                formatted += char;
            } else {
                formatted += char;
            }
        }
        
        return formatted.trim();
    };
}