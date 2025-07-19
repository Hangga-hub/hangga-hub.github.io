// script.js for tools/sql-formatter/

document.addEventListener('DOMContentLoaded', () => {
    const inputSqlTextarea = document.getElementById('inputSql');
    const sqlDialectSelect = document.getElementById('sqlDialect');
    const formatSqlBtn = document.getElementById('formatSqlBtn');
    const outputSqlTextarea = document.getElementById('outputSql');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Function to display messages
    function showMessage(message, type = 'info') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        } else {
            console.warn("Message box element not found.");
        }
    }

    // Show/hide loading overlay
    function toggleLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    // Function to format SQL
    async function formatSql() {
        const inputSql = inputSqlTextarea.value.trim();
        const dialect = sqlDialectSelect.value;

        if (!inputSql) {
            showMessage('Please enter SQL code to format.', 'info');
            outputSqlTextarea.value = '';
            return;
        }

        toggleLoading(true);
        outputSqlTextarea.value = 'Formatting...';

        // Use setTimeout to allow the loading overlay to render before heavy computation
        setTimeout(() => {
            try {
                // The sqlFormatter library exposes a global object `sqlFormatter`
                // with a `format` method.
                const formattedSql = window.sqlFormatter.format(inputSql, {
                    language: dialect,
                    indent: '  ', // 2 spaces for indentation
                    linesBetweenQueries: 2, // Add 2 empty lines between queries
                });
                outputSqlTextarea.value = formattedSql;
                showMessage('SQL formatted successfully!', 'success');
            } catch (error) {
                console.error('Error formatting SQL:', error);
                outputSqlTextarea.value = 'Error: Could not format SQL. Please check your query syntax.';
                showMessage('Failed to format SQL. Check your query syntax.', 'error');
            } finally {
                toggleLoading(false);
            }
        }, 10); // Small delay to allow loading overlay to show
    }

    // Function to clear all fields
    function clearAll() {
        inputSqlTextarea.value = '';
        outputSqlTextarea.value = '';
        sqlDialectSelect.value = 'sql'; // Reset to default
        showMessage('Cleared all fields.', 'info');
    }

    // Event Listeners
    formatSqlBtn.addEventListener('click', formatSql);
    clearBtn.addEventListener('click', clearAll);

    // Optional: Format on input change (can be resource intensive for very large inputs)
    // inputSqlTextarea.addEventListener('input', formatSql);
    // sqlDialectSelect.addEventListener('change', formatSql);

    // Initial format when the page loads with default content
    formatSql();
});
