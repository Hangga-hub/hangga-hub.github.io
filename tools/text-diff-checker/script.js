// script.js for tools/text-diff-checker/

document.addEventListener('DOMContentLoaded', () => {
    const originalTextInput = document.getElementById('originalText');
    const modifiedTextInput = document.getElementById('modifiedText');
    const compareBtn = document.getElementById('compareBtn');
    const clearBtn = document.getElementById('clearBtn');
    const diffOutputDiv = document.getElementById('diffOutput');
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

    // Function to compare texts and display diff
    async function compareTexts() {
        const originalText = originalTextInput.value;
        const modifiedText = modifiedTextInput.value;

        // Clear previous output
        diffOutputDiv.innerHTML = '';

        if (!originalText && !modifiedText) {
            showMessage('Please enter text in at least one field to compare.', 'info');
            diffOutputDiv.innerHTML = '<p style="text-align: center; color: rgba(238,238,238,0.5);">Differences will appear here after comparison.</p>';
            return;
        }

        toggleLoading(true);

        // Use setTimeout to allow the loading overlay to render before heavy computation
        setTimeout(() => {
            try {
                // Check for identical texts
                if (originalText === modifiedText) {
                    diffOutputDiv.innerHTML = '<p style="text-align: center; color: var(--accent);">No differences found! Texts are identical.</p>';
                    showMessage('Texts are identical.', 'success');
                    toggleLoading(false);
                    return;
                }

                // Generate a unified diff string using jsdiff
                const unifiedDiff = Diff.createPatch('original.txt', originalText, modifiedText, 'Original', 'Modified');

                // Check if the diff is empty (only contains headers)
                const diffLines = unifiedDiff.split('\n');
                if (diffLines.length <= 5) { // Diff header is 5 lines
                    diffOutputDiv.innerHTML = '<p style="text-align: center; color: var(--accent);">No differences found!</p>';
                    showMessage('Texts are identical.', 'success');
                    toggleLoading(false);
                    return;
                }

                // Initialize Diff2HtmlUI with proper configuration
                const diff2htmlUi = new Diff2HtmlUI(
                    diffOutputDiv,
                    unifiedDiff,
                    {
                        outputFormat: 'side-by-side',
                        drawFileList: false,
                        matching: 'lines',
                        synchronisedScroll: true,
                        highlight: true,
                        renderNothingWhenEmpty: false
                    }
                );

                diff2htmlUi.draw();
                diff2htmlUi.highlightCode();
                showMessage('Differences highlighted below.', 'success');
            } catch (e) {
                console.error("Error during diff calculation or rendering:", e);
                diffOutputDiv.innerHTML = '<p style="text-align: center; color: red;">Error processing diff. Please check your input.</p>';
                showMessage('An error occurred during comparison.', 'error');
            } finally {
                toggleLoading(false);
            }
        }, 10);
    }

    // Clear all inputs and output
    clearBtn.addEventListener('click', () => {
        originalTextInput.value = '';
        modifiedTextInput.value = '';
        diffOutputDiv.innerHTML = '<p style="text-align: center; color: rgba(238,238,238,0.5);">Differences will appear here after comparison.</p>';
        showMessage('Cleared all content.', 'info');
    });

    // Event listener for compare button
    compareBtn.addEventListener('click', compareTexts);

    // Add event listeners for Ctrl+Enter shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            compareTexts();
        }
    });
});