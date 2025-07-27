// tools/gpa-calculator/script.js

document.addEventListener('DOMContentLoaded', () => {
    const courseInputsContainer = document.getElementById('courseInputs');
    const addCourseBtn = document.getElementById('addCourseBtn');
    const calculateGpaBtn = document.getElementById('calculateGpaBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const gpaResultOutput = document.getElementById('gpaResultOutput');
    const outputSection = document.querySelector('.output-section'); // For scrolling

    let courseCounter = 0; // To keep track of course rows

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
     * Creates and appends a new course input row.
     */
    const addCourseRow = () => {
        const newCourseRow = document.createElement('div');
        newCourseRow.classList.add('course-input-grid');
        newCourseRow.dataset.id = courseCounter; // Assign a unique ID

        newCourseRow.innerHTML = `
            <label for="courseName${courseCounter}">Course Name</label>
            <input type="text" id="courseName${courseCounter}" placeholder="Course Name">
            <label for="credits${courseCounter}">Credits</label>
            <input type="number" id="credits${courseCounter}" placeholder="Credits" min="0.5" step="0.5">
            <label for="grade${courseCounter}">Grade</label>
            <select id="grade${courseCounter}">
                <option value="">Select Grade</option>
                <option value="4.0">A</option>
                <option value="3.7">A-</option>
                <option value="3.3">B+</option>
                <option value="3.0">B</option>
                <option value="2.7">B-</option>
                <option value="2.3">C+</option>
                <option value="2.0">C</option>
                <option value="1.7">C-</option>
                <option value="1.3">D+</option>
                <option value="1.0">D</option>
                <option value="0.7">D-</option>
                <option value="0.0">F</option>
            </select>
            <button class="remove-course-btn" type="button" title="Remove Course"><i class="ri-close-circle-line"></i></button>
        `;

        courseInputsContainer.appendChild(newCourseRow);

        // Add event listener to the new remove button
        newCourseRow.querySelector('.remove-course-btn').addEventListener('click', () => {
            newCourseRow.remove();
            showMessage(messageBox, 'Course removed.', false);
            // Recalculate GPA if courses are removed after a calculation
            if (gpaResultOutput.textContent !== '0.00' && gpaResultOutput.textContent !== 'N/A') {
                calculateGpa();
            }
        });

        courseCounter++;
    };

    /**
     * Calculates the GPA based on the entered courses.
     */
    const calculateGpa = () => {
        let totalQualityPoints = 0;
        let totalCredits = 0;
        let hasValidInput = false;

        // Clear previous messages and output
        gpaResultOutput.textContent = '0.00';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        loadingSpinner.style.display = 'block';

        const courseRows = courseInputsContainer.querySelectorAll('.course-input-grid');
        let validationError = false;

        courseRows.forEach(row => {
            const creditsInput = row.querySelector('input[type="number"]');
            const gradeSelect = row.querySelector('select');

            const credits = parseFloat(creditsInput.value);
            const gradePoints = parseFloat(gradeSelect.value);

            // Validate inputs for each row
            if (isNaN(credits) || credits <= 0) {
                // Only show error if credits input is not empty, allowing empty rows to be ignored
                if (creditsInput.value.trim() !== '') {
                    validationError = true;
                    showMessage(messageBox, 'Please enter valid credits (e.g., 3, 4) for all courses.', true);
                }
                return; // Skip this row if credits are invalid
            }
            if (isNaN(gradePoints)) {
                // Only show error if a grade was explicitly selected but is invalid (shouldn't happen with dropdown)
                if (gradeSelect.value.trim() !== '') {
                    validationError = true;
                    showMessage(messageBox, 'Please select a grade for all courses.', true);
                }
                return; // Skip this row if grade is not selected
            }

            // If we reach here, this row has valid credits and grade
            hasValidInput = true;
            totalCredits += credits;
            totalQualityPoints += credits * gradePoints;
        });

        // If there's a validation error, stop here
        if (validationError) {
            loadingSpinner.style.display = 'none';
            gpaResultOutput.textContent = 'N/A';
            return;
        }

        // Simulate processing delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';

            if (totalCredits > 0) {
                const gpa = totalQualityPoints / totalCredits;
                gpaResultOutput.textContent = gpa.toFixed(2);
                showMessage(resultsMessageBox, 'GPA calculated successfully!', false);
            } else if (hasValidInput) {
                // This case means credits were valid but summed to 0, which shouldn't happen with min="0.5"
                gpaResultOutput.textContent = 'N/A';
                showMessage(resultsMessageBox, 'No valid course data to calculate GPA.', true);
            } else {
                gpaResultOutput.textContent = '0.00'; // Default if no valid inputs at all
                showMessage(resultsMessageBox, 'Please add and fill in at least one course to calculate GPA.', true);
            }
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    };

    /**
     * Clears all course inputs and resets the GPA display.
     */
    const clearAll = () => {
        courseInputsContainer.innerHTML = ''; // Remove all course rows
        courseCounter = 0; // Reset counter
        addCourseRow(); // Add back one empty row
        resetOutputs(); // Reset messages and GPA display
        showMessage(messageBox, 'All inputs cleared.', false);
        gpaResultOutput.textContent = '0.00'; // Ensure it's 0.00 after clear
    };

    // Initial setup: add one course row on load
    addCourseRow();

    // Event Listeners
    addCourseBtn.addEventListener('click', addCourseRow);
    calculateGpaBtn.addEventListener('click', calculateGpa);
    clearAllBtn.addEventListener('click', clearAll);
});
