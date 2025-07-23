// script.js for Stopwatch & Timer

document.addEventListener("DOMContentLoaded", () => {
    // --- Common Elements ---
    const messageBox = document.getElementById("messageBox");

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("error", "show"); // Reset classes
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");
        // Automatically hide the message after 3 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
            messageBox.textContent = ""; // Clear text after hiding
        }, 3000);
    }

    /**
     * Formats milliseconds into HH:MM:SS.mmm string.
     * @param {number} ms - Time in milliseconds.
     * @returns {string} Formatted time string.
     */
    function formatTime(ms, includeMilliseconds = true) {
        const hours = Math.floor(ms / 3600000);
        ms %= 3600000;
        const minutes = Math.floor(ms / 60000);
        ms %= 60000;
        const seconds = Math.floor(ms / 1000);
        const milliseconds = ms % 1000;

        const pad = (num, length = 2) => String(num).padStart(length, '0');

        let formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        if (includeMilliseconds) {
            formatted += `.${pad(milliseconds, 3)}`;
        }
        return formatted;
    }

    // --- Stopwatch Logic ---
    const stopwatchDisplay = document.getElementById("stopwatchDisplay");
    const startStopwatchBtn = document.getElementById("startStopwatchBtn");
    const pauseStopwatchBtn = document.getElementById("pauseStopwatchBtn");
    const resetStopwatchBtn = document.getElementById("resetStopwatchBtn");
    const lapStopwatchBtn = document.getElementById("lapStopwatchBtn");
    const lapList = document.getElementById("lapList");

    let stopwatchStartTime = 0;
    let stopwatchElapsedTime = 0;
    let stopwatchInterval = null;
    let lapTimes = [];
    let lapCounter = 0;

    /**
     * Updates the stopwatch display.
     */
    function updateStopwatchDisplay() {
        const currentTime = Date.now();
        stopwatchElapsedTime = currentTime - stopwatchStartTime;
        stopwatchDisplay.textContent = formatTime(stopwatchElapsedTime);
    }

    /**
     * Starts the stopwatch.
     */
    function startStopwatch() {
        if (stopwatchInterval) return; // Already running

        stopwatchStartTime = Date.now() - stopwatchElapsedTime;
        stopwatchInterval = setInterval(updateStopwatchDisplay, 10); // Update every 10ms for millisecond precision

        startStopwatchBtn.disabled = true;
        pauseStopwatchBtn.disabled = false;
        resetStopwatchBtn.disabled = false;
        lapStopwatchBtn.disabled = false;
        showMessage("Stopwatch started.");
    }

    /**
     * Pauses the stopwatch.
     */
    function pauseStopwatch() {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;

        startStopwatchBtn.disabled = false;
        pauseStopwatchBtn.disabled = true;
        lapStopwatchBtn.disabled = true; // Cannot record lap when paused
        showMessage("Stopwatch paused.");
    }

    /**
     * Resets the stopwatch.
     */
    function resetStopwatch() {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        stopwatchStartTime = 0;
        stopwatchElapsedTime = 0;
        lapTimes = [];
        lapCounter = 0;
        stopwatchDisplay.textContent = "00:00:00.000";
        lapList.innerHTML = ""; // Clear lap list

        startStopwatchBtn.disabled = false;
        pauseStopwatchBtn.disabled = true;
        resetStopwatchBtn.disabled = true;
        lapStopwatchBtn.disabled = true;
        showMessage("Stopwatch reset.");
    }

    /**
     * Records a lap time.
     */
    function recordLap() {
        if (!stopwatchInterval) {
            showMessage("Stopwatch is not running to record a lap.", true);
            return;
        }
        lapCounter++;
        const lapTime = stopwatchElapsedTime;
        const lapItem = document.createElement("li");
        lapItem.innerHTML = `<span>Lap ${lapCounter}:</span> <span>${formatTime(lapTime)}</span>`;
        lapList.prepend(lapItem); // Add to the top of the list
        showMessage(`Lap ${lapCounter} recorded.`);
    }

    // Stopwatch Event Listeners
    startStopwatchBtn.addEventListener("click", startStopwatch);
    pauseStopwatchBtn.addEventListener("click", pauseStopwatch);
    resetStopwatchBtn.addEventListener("click", resetStopwatch);
    lapStopwatchBtn.addEventListener("click", recordLap);

    // --- Timer Logic ---
    const timerDisplay = document.getElementById("timerDisplay");
    const timerHoursInput = document.getElementById("timerHours");
    const timerMinutesInput = document.getElementById("timerMinutes");
    const timerSecondsInput = document.getElementById("timerSeconds");
    const setTimerBtn = document.getElementById("setTimerBtn");
    const startTimerBtn = document.getElementById("startTimerBtn");
    const pauseTimerBtn = document.getElementById("pauseTimerBtn");
    const resetTimerBtn = document.getElementById("resetTimerBtn");

    let timerDuration = 0; // Total duration in milliseconds
    let timerRemainingTime = 0; // Remaining time in milliseconds
    let timerInterval = null;
    let timerIsRunning = false;

    /**
     * Updates the timer display.
     */
    function updateTimerDisplay() {
        if (timerRemainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerIsRunning = false;
            timerDisplay.textContent = "00:00:00";
            startTimerBtn.disabled = true;
            pauseTimerBtn.disabled = true;
            resetTimerBtn.disabled = false; // Allow reset after completion
            showMessage("Timer finished!", false); // Not an error, but a completion message
            // Optional: Play a sound or show a modal for timer completion
            return;
        }

        timerRemainingTime -= 1000; // Decrement by 1 second (interval is 1000ms)
        timerDisplay.textContent = formatTime(timerRemainingTime, false); // No milliseconds for timer
    }

    /**
     * Sets the timer duration from input fields.
     */
    function setTimer() {
        const hours = parseInt(timerHoursInput.value) || 0;
        const minutes = parseInt(timerMinutesInput.value) || 0;
        const seconds = parseInt(timerSecondsInput.value) || 0;

        if (hours < 0 || minutes < 0 || seconds < 0 || minutes > 59 || seconds > 59) {
            showMessage("Please enter valid positive values for hours, minutes (0-59), and seconds (0-59).", true);
            return;
        }

        timerDuration = (hours * 3600 + minutes * 60 + seconds) * 1000; // Convert to milliseconds
        if (timerDuration <= 0) {
            showMessage("Please set a timer duration greater than zero.", true);
            return;
        }

        timerRemainingTime = timerDuration;
        timerDisplay.textContent = formatTime(timerRemainingTime, false);

        startTimerBtn.disabled = false;
        pauseTimerBtn.disabled = true;
        resetTimerBtn.disabled = false;
        setTimerBtn.disabled = false; // Can re-set timer
        showMessage("Timer set.");
    }

    /**
     * Starts the timer countdown.
     */
    function startTimer() {
        if (timerIsRunning) return; // Already running
        if (timerRemainingTime <= 0 && timerDuration <= 0) {
             showMessage("Please set a timer duration first.", true);
             return;
        }
        if (timerRemainingTime <= 0 && timerDuration > 0) {
            // If timer finished, but duration was set, restart from duration
            timerRemainingTime = timerDuration;
        }

        timerIsRunning = true;
        timerInterval = setInterval(updateTimerDisplay, 1000); // Update every second

        startTimerBtn.disabled = true;
        pauseTimerBtn.disabled = false;
        resetTimerBtn.disabled = false;
        setTimerBtn.disabled = true; // Cannot set while running
        showMessage("Timer started.");
    }

    /**
     * Pauses the timer.
     */
    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timerIsRunning = false;

        startTimerBtn.disabled = false; // Can resume
        pauseTimerBtn.disabled = true;
        resetTimerBtn.disabled = false;
        setTimerBtn.disabled = false; // Can set new timer
        showMessage("Timer paused.");
    }

    /**
     * Resets the timer.
     */
    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timerIsRunning = false;
        timerDuration = 0;
        timerRemainingTime = 0;
        timerHoursInput.value = "0";
        timerMinutesInput.value = "0";
        timerSecondsInput.value = "0";
        timerDisplay.textContent = "00:00:00";

        startTimerBtn.disabled = true;
        pauseTimerBtn.disabled = true;
resetTimerBtn.disabled = true;
        setTimerBtn.disabled = false;
        showMessage("Timer reset.");
    }

    // Timer Event Listeners
    setTimerBtn.addEventListener("click", setTimer);
    startTimerBtn.addEventListener("click", startTimer);
    pauseTimerBtn.addEventListener("click", pauseTimer);
    resetTimerBtn.addEventListener("click", resetTimer);

    // Initial setup
    resetStopwatch(); // Initialize stopwatch state
    resetTimer(); // Initialize timer state
});
