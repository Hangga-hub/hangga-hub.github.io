document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const inputDate = document.getElementById("inputDate");
    const calculateBtn = document.getElementById("calculateBtn");
    const resetBtn = document.getElementById("resetBtn");
    const resultOutput = document.getElementById("resultOutput");

    // Set the default date to today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    inputDate.value = `${year}-${month}-${day}`;

    /**
     * Calculates the ISO week number and ISO week-year for a given date.
     * Based on ISO 8601 standard.
     * @param {Date} date - The date object.
     * @returns {{week: number, year: number}} An object containing the ISO week number and year.
     */
    function getISOWeekNumber(date) {
        // Create a copy of the date to avoid modifying the original
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

        // Set to nearest Thursday: current date + (4 - current day number)
        // Adjust for Sunday (0) to become 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

        // Get first day of year
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

        // Calculate full weeks to nearest Thursday
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

        // Return array with year and week number
        return { week: weekNo, year: d.getUTCFullYear() };
    }

    /**
     * Handles the calculation and display of the ISO week number.
     */
    function calculateISOWeek() {
        const dateString = inputDate.value;
        if (!dateString) {
            resultOutput.textContent = "Please select a date.";
            resultOutput.classList.add("error");
            return;
        }

        const selectedDate = new Date(dateString);
        if (isNaN(selectedDate.getTime())) {
            resultOutput.textContent = "Invalid date selected. Please choose a valid date.";
            resultOutput.classList.add("error");
            return;
        }

        // Remove error class if present
        resultOutput.classList.remove("error");

        const { week, year } = getISOWeekNumber(selectedDate);
        resultOutput.textContent = `ISO Week: W${String(week).padStart(2, '0')} of ${year}`;
    }

    /**
     * Resets the input date to today and clears the result.
     */
    function resetCalculator() {
        inputDate.value = `${year}-${month}-${day}`; // Reset to today's date
        resultOutput.textContent = "Select a date and click 'Calculate' to see the ISO Week Number.";
        resultOutput.classList.remove("error");
    }

    // Add event listeners
    calculateBtn.addEventListener("click", calculateISOWeek);
    resetBtn.addEventListener("click", resetCalculator);
    inputDate.addEventListener("change", calculateISOWeek); // Recalculate on date change

    // Initial calculation when the page loads with the default date
    calculateISOWeek();
});
