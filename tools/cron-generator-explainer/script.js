// script.js for Cron Expression Generator & Explainer

document.addEventListener('DOMContentLoaded', () => {
    // --- Generator Elements ---
    const minuteSelect = document.getElementById('minuteSelect');
    const hourSelect = document.getElementById('hourSelect');
    const dayOfMonthSelect = document.getElementById('dayOfMonthSelect');
    const monthSelect = document.getElementById('monthSelect');
    const dayOfWeekSelect = document.getElementById('dayOfWeekSelect');
    const generatedCron = document.getElementById('generatedCron');
    const copyGeneratedCronButton = document.getElementById('copyGeneratedCronButton');

    // --- Explainer Elements ---
    const cronInput = document.getElementById('cronInput');
    const explainCronButton = document.getElementById('explainCronButton');
    const cronExplanation = document.getElementById('cronExplanation');
    const copyExplanationButton = document.getElementById('copyExplanationButton');

    const messageBox = document.getElementById('messageBox');

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dayOfWeekNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    // --- Populate Generator Dropdowns ---
    function populateSelect(selectElement, start, end, prefix = '', suffix = '') {
        selectElement.innerHTML = ''; // Clear existing options
        const allOption = document.createElement('option');
        allOption.value = '*';
        allOption.textContent = 'Every ' + (prefix ? prefix.toLowerCase() : 'value');
        selectElement.appendChild(allOption);

        for (let i = start; i <= end; i++) {
            const option = document.createElement('option');
            option.value = i;
            if (selectElement === monthSelect) {
                option.textContent = monthNames[i - 1]; // Months are 1-indexed in cron
            } else if (selectElement === dayOfWeekSelect) {
                option.textContent = dayOfWeekNames[i]; // Days are 0-indexed in cron (Sunday=0)
            } else {
                option.textContent = i;
            }
            selectElement.appendChild(option);
        }
    }

    populateSelect(minuteSelect, 0, 59, 'Minute');
    populateSelect(hourSelect, 0, 23, 'Hour');
    populateSelect(dayOfMonthSelect, 1, 31, 'Day of Month');
    populateSelect(monthSelect, 1, 12, 'Month');
    populateSelect(dayOfWeekSelect, 0, 6, 'Day of Week');

    // --- Cron Generator Logic ---
    function updateGeneratedCron() {
        const minute = minuteSelect.value;
        const hour = hourSelect.value;
        const dayOfMonth = dayOfMonthSelect.value;
        const month = monthSelect.value;
        const dayOfWeek = dayOfWeekSelect.value;

        generatedCron.value = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    }

    // Add event listeners for generator dropdowns
    minuteSelect.addEventListener('change', updateGeneratedCron);
    hourSelect.addEventListener('change', updateGeneratedCron);
    dayOfMonthSelect.addEventListener('change', updateGeneratedCron);
    monthSelect.addEventListener('change', updateGeneratedCron);
    dayOfWeekSelect.addEventListener('change', updateGeneratedCron);

    // Initial generation on load
    updateGeneratedCron();

    // --- Cron Explainer Logic ---

    // Helper to get human-readable list/range/step
    function getFieldDescription(fieldValue, unitName, min, max, namesMap = null) {
        if (fieldValue === '*') {
            return `every ${unitName}`;
        }

        const parts = fieldValue.split(',');
        const descriptions = parts.map(part => {
            if (part.includes('/')) {
                const [range, step] = part.split('/');
                let baseDesc;
                if (range === '*') {
                    baseDesc = `every ${step} ${unitName}s`;
                } else if (range.includes('-')) {
                    const [start, end] = range.split('-').map(Number);
                    baseDesc = `every ${step} ${unitName}s from ${namesMap ? namesMap[start] : start} to ${namesMap ? namesMap[end] : end}`;
                } else {
                    baseDesc = `every ${step} ${unitName}s starting at ${namesMap ? namesMap[Number(range)] : Number(range)}`;
                }
                return baseDesc;
            } else if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                return `from ${namesMap ? namesMap[start] : start} to ${namesMap ? namesMap[end] : end} ${unitName}s`;
            } else {
                return `at ${namesMap ? namesMap[Number(part)] : Number(part)} ${unitName}`;
            }
        });

        if (descriptions.length === 1) {
            return descriptions[0];
        } else {
            // Join with commas and 'and' for the last item
            const last = descriptions.pop();
            return `${descriptions.join(', ')} and ${last}`;
        }
    }

    function explainCron() {
        messageBox.textContent = ''; // Clear previous messages
        const cronString = cronInput.value.trim();

        if (!cronString) {
            cronExplanation.value = 'Please enter a cron expression.';
            return;
        }

        const fields = cronString.split(/\s+/); // Split by one or more spaces

        if (fields.length < 5 || fields.length > 6) {
            cronExplanation.value = 'Invalid cron expression format. It should have 5 or 6 fields (minute hour day-of-month month day-of-week [year]).';
            return;
        }

        const [minuteField, hourField, dayOfMonthField, monthField, dayOfWeekField] = fields;

        try {
            const minuteDesc = getFieldDescription(minuteField, 'minute', 0, 59);
            const hourDesc = getFieldDescription(hourField, 'hour', 0, 23);
            const dayOfMonthDesc = getFieldDescription(dayOfMonthField, 'day of the month', 1, 31);
            const monthDesc = getFieldDescription(monthField, 'month', 1, 12, monthNames);
            const dayOfWeekDesc = getFieldDescription(dayOfWeekField, 'day of the week', 0, 6, dayOfWeekNames);

            let explanation = `This cron expression will run:\n`;
            explanation += `- ${minuteDesc}\n`;
            explanation += `- ${hourDesc}\n`;
            explanation += `- ${dayOfMonthDesc}\n`;
            explanation += `- ${monthDesc}\n`;
            explanation += `- ${dayOfWeekDesc}`;

            if (fields.length === 6) {
                const yearField = fields[5];
                const yearDesc = getFieldDescription(yearField, 'year', 1970, 2099); // Common year range
                explanation += `\n- ${yearDesc}`;
            }

            cronExplanation.value = explanation;

        } catch (error) {
            messageBox.textContent = 'Error parsing cron expression. Please check the format and values.';
            cronExplanation.value = '';
            console.error('Cron explanation error:', error);
        }
    }

    // Add event listeners for explainer
    cronInput.addEventListener('input', explainCron);
    explainCronButton.addEventListener('click', explainCron);

    // Initial explanation on load
    explainCron();


    // --- Copy to Clipboard Functions ---
    function copyToClipboard(element, successMessage) {
        if (element.value) {
            element.select();
            try {
                document.execCommand('copy');
                messageBox.textContent = successMessage;
                messageBox.style.color = 'var(--cyber-neon-cyan)';
                messageBox.style.textShadow = '0 0 8px var(--cyber-neon-cyan)';
            } catch (err) {
                messageBox.textContent = 'Failed to copy!';
                messageBox.style.color = '#ff5555';
                messageBox.style.textShadow = '0 0 8px #ff5555';
                console.error('Failed to copy text: ', err);
            }
        } else {
            messageBox.textContent = 'Nothing to copy!';
            messageBox.style.color = '#ff5555';
            messageBox.style.textShadow = '0 0 8px #ff5555';
        }
        setTimeout(() => {
            messageBox.textContent = '';
        }, 3000); // Clear message after 3 seconds
    }

    copyGeneratedCronButton.addEventListener('click', () => {
        copyToClipboard(generatedCron, 'Generated Cron copied to clipboard!');
    });

    copyExplanationButton.addEventListener('click', () => {
        copyToClipboard(cronExplanation, 'Explanation copied to clipboard!');
    });
});
