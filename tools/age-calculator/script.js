// script.js for Age Calculator

document.addEventListener('DOMContentLoaded', () => {
    const dobInput = document.getElementById('dobInput');
    const asOfDateInput = document.getElementById('asOfDateInput');
    const calculateButton = document.getElementById('calculateButton');
    const ageResult = document.getElementById('ageResult');
    const nextBirthday = document.getElementById('nextBirthday');
    const messageBox = document.getElementById('messageBox');

    // Set "As of Date" to today's date by default
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    asOfDateInput.value = `${year}-${month}-${day}`;

    // Function to calculate age
    function calculateAge() {
        messageBox.textContent = ''; // Clear previous messages

        const dobString = dobInput.value;
        const asOfDateString = asOfDateInput.value;

        if (!dobString || !asOfDateString) {
            messageBox.textContent = 'Please select both dates.';
            return;
        }

        const dob = new Date(dobString);
        const asOfDate = new Date(asOfDateString);

        if (dob > asOfDate) {
            messageBox.textContent = 'Date of Birth cannot be in the future relative to "As of Date".';
            ageResult.textContent = '';
            nextBirthday.textContent = '';
            return;
        }

        let years = asOfDate.getFullYear() - dob.getFullYear();
        let months = asOfDate.getMonth() - dob.getMonth();
        let days = asOfDate.getDate() - dob.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            // Get the number of days in the previous month of asOfDate
            const daysInPrevMonth = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0).getDate();
            days += daysInPrevMonth;
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        ageResult.textContent = `${years} years, ${months} months, and ${days} days`;

        // Calculate next birthday
        let nextBday = new Date(asOfDate.getFullYear(), dob.getMonth(), dob.getDate());
        if (nextBday < asOfDate) {
            nextBday.setFullYear(asOfDate.getFullYear() + 1);
        }

        const diffTime = Math.abs(nextBday.getTime() - asOfDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            nextBirthday.textContent = "Happy Birthday today!";
        } else if (diffDays === 365 || diffDays === 366) { // If it's exactly a year away (already had birthday this year)
            nextBirthday.textContent = `Your next birthday is in ${diffDays} days.`;
        }
        else {
             nextBirthday.textContent = `Your next birthday is in ${diffDays} days.`;
        }

         // Special case for leap year birthday on Feb 29
         if (dob.getMonth() === 1 && dob.getDate() === 29) {
            let nextBdayYear = asOfDate.getFullYear();
            let tempNextBday = new Date(nextBdayYear, 1, 29); // Feb 29 of current asOfDate year

            // If Feb 29 of current year is valid and has passed, try next year
            if (tempNextBday.getMonth() === 1 && tempNextBday.getDate() === 29 && tempNextBday < asOfDate) {
                nextBdayYear++;
                tempNextBday = new Date(nextBdayYear, 1, 29);
            } else if (!(tempNextBday.getMonth() === 1 && tempNextBday.getDate() === 29)) {
                // If Feb 29 is not valid in current year (not a leap year), it falls on March 1
                // We need to find the next actual Feb 29
                while (!(tempNextBday.getMonth() === 1 && tempNextBday.getDate() === 29)) {
                    nextBdayYear++;
                    tempNextBday = new Date(nextBdayYear, 1, 29);
                }
            }
            nextBday = tempNextBday;
            const diffTimeLeap = Math.abs(nextBday.getTime() - asOfDate.getTime());
            const diffDaysLeap = Math.ceil(diffTimeLeap / (1000 * 60 * 60 * 24));
            if (diffDaysLeap === 0) {
                nextBirthday.textContent = "Happy Birthday today!";
            } else {
                nextBirthday.textContent = `Your next birthday is in ${diffDaysLeap} days.`;
            }
        }
    }

    // Event listener for the calculate button
    calculateButton.addEventListener('click', calculateAge);

    // Optional: Calculate on date input change if both are filled
    dobInput.addEventListener('change', () => {
        if (dobInput.value && asOfDateInput.value) {
            calculateAge();
        }
    });
    asOfDateInput.addEventListener('change', () => {
        if (dobInput.value && asOfDateInput.value) {
            calculateAge();
        }
    });
});
