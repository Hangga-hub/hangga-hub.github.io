// tools/public-holidays-checker/script.js

document.addEventListener('DOMContentLoaded', () => {
    const yearInput = document.getElementById('yearInput');
    const countrySelect = document.getElementById('countrySelect');
    const checkHolidaysBtn = document.getElementById('checkHolidaysBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const holidaysList = document.getElementById('holidaysList');
    const noHolidaysMessage = document.getElementById('noHolidaysMessage');
    const messageBox = document.getElementById('messageBox');

    // Populate country dropdown with countries
    const countries = [
        { code: 'AF', name: 'Afghanistan' },
        { code: 'AX', name: 'Aland Islands' },
        { code: 'AL', name: 'Albania' },
        { code: 'DZ', name: 'Algeria' },
        { code: 'AS', name: 'American Samoa' },
        { code: 'AD', name: 'Andorra' },
        { code: 'AO', name: 'Angola' },
        { code: 'AI', name: 'Anguilla' },
        { code: 'AQ', name: 'Antarctica' },
        { code: 'AG', name: 'Antigua and Barbuda' },
        { code: 'AR', name: 'Argentina' },
        { code: 'AM', name: 'Armenia' },
        { code: 'AW', name: 'Aruba' },
        { code: 'AU', name: 'Australia' },
        { code: 'AT', name: 'Austria' },
        { code: 'AZ', name: 'Azerbaijan' },
        { code: 'BS', name: 'Bahamas' },
        { code: 'BH', name: 'Bahrain' },
        { code: 'BD', name: 'Bangladesh' },
        { code: 'BB', name: 'Barbados' },
        { code: 'BY', name: 'Belarus' },
        { code: 'BE', name: 'Belgium' },
        { code: 'BZ', name: 'Belize' },
        { code: 'BJ', name: 'Benin' },
        { code: 'BM', name: 'Bermuda' },
        { code: 'BT', name: 'Bhutan' },
        { code: 'BO', name: 'Bolivia' },
        { code: 'BA', name: 'Bosnia and Herzegovina' },
        { code: 'BW', name: 'Botswana' },
        { code: 'BV', name: 'Bouvet Island' },
        { code: 'BR', name: 'Brazil' },
        { code: 'IO', name: 'British Indian Ocean Territory' },
        { code: 'BN', name: 'Brunei' },
        { code: 'BG', name: 'Bulgaria' },
        { code: 'BF', name: 'Burkina Faso' },
        { code: 'BI', name: 'Burundi' },
        { code: 'KH', name: 'Cambodia' },
        { code: 'CM', name: 'Cameroon' },
        { code: 'CA', name: 'Canada' },
        { code: 'CV', name: 'Cape Verde' },
        { code: 'KY', name: 'Cayman Islands' },
        { code: 'CF', name: 'Central African Republic' },
        { code: 'TD', name: 'Chad' },
        { code: 'CL', name: 'Chile' },
        { code: 'CN', name: 'China' },
        { code: 'CX', name: 'Christmas Island' },
        { code: 'CC', name: 'Cocos (Keeling) Islands' },
        { code: 'CO', name: 'Colombia' },
        { code: 'KM', name: 'Comoros' },
        { code: 'CG', name: 'Congo' },
        { code: 'CD', name: 'Congo, The Democratic Republic of the' },
        { code: 'CK', name: 'Cook Islands' },
        { code: 'CR', name: 'Costa Rica' },
        { code: 'CI', name: 'Cote d\'Ivoire' },
        { code: 'HR', name: 'Croatia' },
        { code: 'CU', name: 'Cuba' },
        { code: 'CY', name: 'Cyprus' },
        { code: 'CZ', name: 'Czech Republic' },
        { code: 'DK', name: 'Denmark' },
        { code: 'DJ', name: 'Djibouti' },
        { code: 'DM', name: 'Dominica' },
        { code: 'DO', name: 'Dominican Republic' },
        { code: 'EC', name: 'Ecuador' },
        { code: 'EG', name: 'Egypt' },
        { code: 'SV', name: 'El Salvador' },
        { code: 'GQ', name: 'Equatorial Guinea' },
        { code: 'ER', name: 'Eritrea' },
        { code: 'EE', name: 'Estonia' },
        { code: 'ET', name: 'Ethiopia' },
        { code: 'FK', name: 'Falkland Islands (Malvinas)' },
        { code: 'FO', name: 'Faroe Islands' },
        { code: 'FJ', name: 'Fiji' },
        { code: 'FI', name: 'Finland' },
        { code: 'FR', name: 'France' },
        { code: 'GF', name: 'French Guiana' },
        { code: 'PF', name: 'French Polynesia' },
        { code: 'TF', name: 'French Southern Territories' },
        { code: 'GA', name: 'Gabon' },
        { code: 'GM', name: 'Gambia' },
        { code: 'GE', name: 'Georgia' },
        { code: 'DE', name: 'Germany' },
        { code: 'GH', name: 'Ghana' },
        { code: 'GI', name: 'Gibraltar' },
        { code: 'GR', name: 'Greece' },
        { code: 'GL', name: 'Greenland' },
        { code: 'GD', name: 'Grenada' },
        { code: 'GP', name: 'Guadeloupe' },
        { code: 'GU', name: 'Guam' },
        { code: 'GT', name: 'Guatemala' },
        { code: 'GN', name: 'Guinea' },
        { code: 'GW', name: 'Guinea-Bissau' },
        { code: 'GY', name: 'Guyana' },
        { code: 'HT', name: 'Haiti' },
        { code: 'HM', name: 'Heard Island and McDonald Islands' },
        { code: 'VA', name: 'Holy See (Vatican City State)' },
        { code: 'HN', name: 'Honduras' },
        { code: 'HK', name: 'Hong Kong' },
        { code: 'HU', name: 'Hungary' },
        { code: 'IS', name: 'Iceland' },
        { code: 'IN', name: 'India' },
        { code: 'ID', name: 'Indonesia' },
        { code: 'IR', name: 'Iran, Islamic Republic of' },
        { code: 'IQ', name: 'Iraq' },
        { code: 'IE', name: 'Ireland' },
        { code: 'IM', name: 'Isle of Man' },
        { code: 'IL', name: 'Israel' },
        { code: 'IT', name: 'Italy' },
        { code: 'JM', name: 'Jamaica' },
        { code: 'JP', name: 'Japan' },
        { code: 'JE', name: 'Jersey' },
        { code: 'JO', name: 'Jordan' },
        { code: 'KZ', name: 'Kazakhstan' },
        { code: 'KE', name: 'Kenya' },
        { code: 'KI', name: 'Kiribati' },
        { code: 'KP', name: 'Korea, Democratic People\'s Republic of' },
        { code: 'KR', name: 'Korea, Republic of' },
        { code: 'KW', name: 'Kuwait' },
        { code: 'KG', name: 'Kyrgyzstan' },
        { code: 'LA', name: 'Lao People\'s Democratic Republic' },
        { code: 'LV', name: 'Latvia' },
        { code: 'LB', name: 'Lebanon' },
        { code: 'LS', name: 'Lesotho' },
        { code: 'LR', name: 'Liberia' },
        { code: 'LY', name: 'Libyan Arab Jamahiriya' },
        { code: 'LI', name: 'Liechtenstein' },
        { code: 'LT', name: 'Lithuania' },
        { code: 'LU', name: 'Luxembourg' },
        { code: 'MO', name: 'Macao' },
        { code: 'MK', name: 'Macedonia, The Former Yugoslav Republic of' },
        { code: 'MG', name: 'Madagascar' },
        { code: 'MW', name: 'Malawi' },
        { code: 'MY', name: 'Malaysia' },
        { code: 'MV', name: 'Maldives' },
        { code: 'ML', name: 'Mali' },
        { code: 'MT', name: 'Malta' },
        { code: 'MH', name: 'Marshall Islands' },
        { code: 'MQ', name: 'Martinique' },
        // Add more countries as needed
    ];

    /**
     * Populates the country select dropdown.
     */
    const populateCountries = () => {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    };

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (message, isError = false) => {
        messageBox.textContent = message;
        messageBox.classList.remove('error');
        if (isError) {
            messageBox.classList.add('error');
        }
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Clears the holidays list and shows the "No holidays to display" message.
     */
    const resetHolidaysList = () => {
        holidaysList.innerHTML = ''; // Clear existing list items
        holidaysList.appendChild(noHolidaysMessage); // Add back the default message
        noHolidaysMessage.style.display = 'block'; // Ensure it's visible
    };

    // Initialize the year input with the current year
    yearInput.value = new Date().getFullYear();
    populateCountries(); // Populate the country dropdown on load
    resetHolidaysList(); // Initialize the holidays list display

    // Event listener for the "Check Holidays" button
    checkHolidaysBtn.addEventListener('click', async () => {
        const year = yearInput.value.trim();
        const countryCode = countrySelect.value;

        if (!year || !countryCode) {
            showMessage('Please enter a year and select a country.', true);
            resetHolidaysList();
            return;
        }

        const currentYear = new Date().getFullYear();
        if (parseInt(year) < 1900 || parseInt(year) > 2100) {
            showMessage('Please enter a year between 1900 and 2100.', true);
            resetHolidaysList();
            return;
        }

        showMessage(`Fetching holidays for ${countrySelect.options[countrySelect.selectedIndex].text} in ${year}...`);
        resetHolidaysList(); // Clear previous results

        try {
            const apiUrl = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok && data.length > 0) {
                // Clear the "No holidays" message
                noHolidaysMessage.style.display = 'none';

                data.forEach(holiday => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <strong>${holiday.name}</strong>
                        <span class="holiday-date">${holiday.date}</span>
                        <span>${holiday.localName}</span>
                    `;
                    holidaysList.appendChild(listItem);
                });
                showMessage('Holidays loaded successfully!', false);
            } else if (response.ok && data.length === 0) {
                showMessage(`No public holidays found for ${countrySelect.options[countrySelect.selectedIndex].text} in ${year}.`, false);
                noHolidaysMessage.textContent = `No public holidays found for ${countrySelect.options[countrySelect.selectedIndex].text} in ${year}.`;
                noHolidaysMessage.style.display = 'block';
            }
            else {
                // Handle API errors or invalid country codes
                const errorText = data.status === 404 ? 'Country code not found or no data for this year.' : 'Failed to retrieve holidays. Please try again.';
                showMessage(`Error: ${errorText}`, true);
                resetHolidaysList();
            }
        } catch (error) {
            console.error('Error fetching public holidays:', error);
            showMessage('An error occurred while fetching holidays. Please check your network connection or try again later.', true);
            resetHolidaysList();
        }
    });

    // Event listener for the "Clear Form" button
    clearFormBtn.addEventListener('click', () => {
        yearInput.value = new Date().getFullYear(); // Reset year to current year
        countrySelect.value = ''; // Reset country selection
        showMessage('', false); // Clear any active message
        resetHolidaysList(); // Reset the holidays list display
    });
});
