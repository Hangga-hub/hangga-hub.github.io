// script.js for Calendar Generator

document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('monthSelect');
    const yearInput = document.getElementById('yearInput');
    const generateCalendarButton = document.getElementById('generateCalendarButton');
    const calendarHeader = document.getElementById('calendarHeader');
    const calendarGrid = document.getElementById('calendarGrid');
    const messageBox = document.getElementById('messageBox');
    const calendarDisplay = document.querySelector('.calendar-display');

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Populate month select dropdown
    monthNames.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index; // Month index (0-11)
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Set default month and year to current date
    const today = new Date();
    monthSelect.value = today.getMonth();
    yearInput.value = today.getFullYear();

    /**
     * Scrolls the window down to the result output section.
     */
    const scrollToResults = () => {
        if (calendarDisplay) {
            calendarDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Function to generate the calendar grid
    function generateCalendar() {
        messageBox.textContent = ''; // Clear previous messages
        calendarGrid.innerHTML = ''; // Clear previous calendar

        const selectedMonth = parseInt(monthSelect.value);
        const selectedYear = parseInt(yearInput.value);

        if (isNaN(selectedYear) || selectedYear < 1900 || selectedYear > 2100) {
            messageBox.textContent = 'Please enter a valid year between 1900 and 2100.';
            calendarHeader.textContent = '';
            return;
        }

        // Set calendar header (e.g., "July 2025")
        calendarHeader.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;

        // Add day names to the grid
        dayNames.forEach(day => {
            const dayNameCell = document.createElement('div');
            dayNameCell.classList.add('day-name');
            dayNameCell.textContent = day;
            calendarGrid.appendChild(dayNameCell);
        });

        // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
        // Get the number of days in the current month
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        // Fill in empty cells before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day-cell', 'empty');
            calendarGrid.appendChild(emptyCell);
        }

        // Fill in the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            dayCell.textContent = day;

            // Highlight current day
            if (day === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear()) {
                dayCell.classList.add('current-day');
            }
            calendarGrid.appendChild(dayCell);
        }
    }

    // Event listener for the generate button
    generateCalendarButton.addEventListener('click', () => {
        generateCalendar();
        scrollToResults();
    });

    // Initial calendar generation on page load
    generateCalendar();
});
