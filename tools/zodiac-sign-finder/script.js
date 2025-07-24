document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const birthdateInput = document.getElementById("birthdateInput");
    const findSignBtn = document.getElementById("findSignBtn");
    const resetBtn = document.getElementById("resetBtn");
    const resultOutput = document.getElementById("resultOutput");

    // Set the default date to a common birthdate or today's date for demonstration
    // For a real-world app, you might leave it blank or set it to a reasonable default.
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    birthdateInput.value = `${year}-01-01`; // Default to Jan 1st of current year

    /**
     * Determines the zodiac sign based on the given month and day.
     * @param {number} month - The month (1-12).
     * @param {number} day - The day of the month.
     * @returns {{sign: string, dates: string}} An object containing the zodiac sign and its date range.
     */
    function getZodiacSign(month, day) {
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
            return { sign: "Aries ♈", dates: "March 21 – April 19" };
        } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
            return { sign: "Taurus ♉", dates: "April 20 – May 20" };
        } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
            return { sign: "Gemini ♊", dates: "May 21 – June 20" };
        } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
            return { sign: "Cancer ♋", dates: "June 21 – July 22" };
        } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
            return { sign: "Leo ♌", dates: "July 23 – August 22" };
        } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
            return { sign: "Virgo ♍", dates: "August 23 – September 22" };
        } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
            return { sign: "Libra ♎", dates: "September 23 – October 22" };
        } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
            return { sign: "Scorpio ♏", dates: "October 23 – November 21" };
        } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
            return { sign: "Sagittarius ♐", dates: "November 22 – December 21" };
        } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
            return { sign: "Capricorn ♑", dates: "December 22 – January 19" };
        } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
            return { sign: "Aquarius ♒", dates: "January 20 – February 18" };
        } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
            return { sign: "Pisces ♓", dates: "February 19 – March 20" };
        } else {
            return { sign: "Unknown", dates: "Please enter a valid birthdate." };
        }
    }

    /**
     * Handles the finding and display of the zodiac sign.
     */
    function findZodiacSign() {
        const dateString = birthdateInput.value;
        if (!dateString) {
            resultOutput.textContent = "Please enter your birthdate.";
            resultOutput.classList.add("error");
            return;
        }

        const selectedDate = new Date(dateString);
        if (isNaN(selectedDate.getTime())) {
            resultOutput.textContent = "Invalid date entered. Please choose a valid birthdate.";
            resultOutput.classList.add("error");
            return;
        }

        // Get month (0-11) and day (1-31)
        const month = selectedDate.getMonth() + 1; // Convert to 1-12
        const day = selectedDate.getDate();

        // Remove error class if present
        resultOutput.classList.remove("error");

        const { sign, dates } = getZodiacSign(month, day);
        resultOutput.innerHTML = `Your Zodiac Sign is: <br><strong>${sign}</strong><br>(${dates})`;
    }

    /**
     * Resets the input date and clears the result.
     */
    function resetFinder() {
        birthdateInput.value = `${year}-01-01`; // Reset to default for demonstration
        resultOutput.textContent = "Enter your birthdate and click 'Find Zodiac Sign' to see your sign.";
        resultOutput.classList.remove("error");
    }

    // Add event listeners
    findSignBtn.addEventListener("click", findZodiacSign);
    resetBtn.addEventListener("click", resetFinder);
    birthdateInput.addEventListener("change", findZodiacSign); // Recalculate on date change

    // Initial calculation when the page loads with the default date
    findZodiacSign();
});
