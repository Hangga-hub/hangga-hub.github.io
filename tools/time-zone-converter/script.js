// script.js for Time Zone Converter

document.addEventListener('DOMContentLoaded', () => {
    const dateTimeInput = document.getElementById('dateTimeInput');
    const fromTimeZoneSelect = document.getElementById('fromTimeZoneSelect');
    const toTimeZoneSelect = document.getElementById('toTimeZoneSelect');
    const convertButton = document.getElementById('convertButton');
    const convertedTimeResult = document.getElementById('convertedTimeResult');
    const timeDifferenceElement = document.getElementById('timeDifference');
    const messageBox = document.getElementById('messageBox');

    // Function to populate time zone dropdowns
    function populateTimeZones() {
        // Use Intl.supportedValuesOf('timeZone') for a comprehensive list if available
        let timeZones = [];
        if (Intl && Intl.supportedValuesOf) {
            timeZones = Intl.supportedValuesOf('timeZone');
        } else {
            // Fallback for older browsers (less comprehensive list)
            // This list is a common subset and might not cover all edge cases
            timeZones = [
                'America/New_York', 'America/Los_Angeles', 'Europe/London',
                'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Jakarta',
                'Australia/Sydney', 'Pacific/Auckland', 'UTC'
            ].sort(); // Sort for readability
        }

        const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        timeZones.forEach(zone => {
            const optionFrom = document.createElement('option');
            optionFrom.value = zone;
            optionFrom.textContent = zone;
            fromTimeZoneSelect.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = zone;
            optionTo.textContent = zone;
            toTimeZoneSelect.appendChild(optionTo);
        });

        // Set default values to local time zone
        fromTimeZoneSelect.value = localTimeZone;
        toTimeZoneSelect.value = localTimeZone;

        // Set current date and time to input
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
        dateTimeInput.value = localISOTime;
    }

    // Function to convert time
    function convertTime() {
        messageBox.textContent = ''; // Clear previous messages
        convertedTimeResult.textContent = '';
        timeDifferenceElement.textContent = '';

        const inputDateTimeString = dateTimeInput.value;
        const fromTimeZone = fromTimeZoneSelect.value;
        const toTimeZone = toTimeZoneSelect.value;

        if (!inputDateTimeString) {
            messageBox.textContent = 'Please select a date and time.';
            return;
        }

        // Create a Date object from the input string.
        // It's important to treat this as a local time in the 'fromTimeZone'.
        // Using new Date() directly with a string like "YYYY-MM-DDTHH:MM"
        // will parse it as local time, then we can format it to the desired time zone.
        const inputDate = new Date(inputDateTimeString);

        if (isNaN(inputDate.getTime())) {
            messageBox.textContent = 'Invalid date and time input.';
            return;
        }

        try {
            // Format the input date/time to the 'fromTimeZone' for display
            const formattedFromTime = new Intl.DateTimeFormat('en-US', {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: true,
                timeZone: fromTimeZone
            }).format(inputDate);

            // Convert the input date/time to the 'toTimeZone'
            const formattedToTime = new Intl.DateTimeFormat('en-US', {
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: true,
                timeZone: toTimeZone
            }).format(inputDate);

            convertedTimeResult.textContent = `${formattedToTime} (${toTimeZone})`;

            // Calculate time difference for display
            // Get UTC milliseconds for both time zones
            const fromTimeUTC = new Date(inputDate.toLocaleString('en-US', { timeZone: fromTimeZone })).getTime();
            const toTimeUTC = new Date(inputDate.toLocaleString('en-US', { timeZone: toTimeZone })).getTime();

            const diffMs = toTimeUTC - fromTimeUTC;
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours === 0) {
                timeDifferenceElement.textContent = `No time difference.`;
            } else {
                const sign = diffHours > 0 ? '+' : '-';
                const absHours = Math.abs(diffHours);
                const hoursPart = Math.floor(absHours);
                const minutesPart = Math.round((absHours - hoursPart) * 60);

                let diffText = `Time difference: ${sign}${hoursPart} hours`;
                if (minutesPart > 0) {
                    diffText += ` and ${minutesPart} minutes`;
                }
                timeDifferenceElement.textContent = diffText;
            }

        } catch (error) {
            messageBox.textContent = 'Error during conversion. Please check time zones.';
            console.error('Time zone conversion error:', error);
        }
    }

    // Event listeners
    convertButton.addEventListener('click', convertTime);

    // Initial population of time zones and setting default date/time
    populateTimeZones();
});
