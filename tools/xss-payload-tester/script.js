// script.js for XSS Payload Tester (Sandboxed)

document.addEventListener('DOMContentLoaded', () => {
    console.log("XSS Payload Tester script loaded.");

    // --- Get references to elements ---
    const xssPayloadInput = document.getElementById('xssPayloadInput');
    const xssSandboxFrame = document.getElementById('xssSandboxFrame');
    const runPayloadBtn = document.getElementById('runPayloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');

    // --- Helper function to show messages to the user ---
    function showMessage(message, isError = false) {
        if (!messageBox) {
            console.error("Error: Message box element (#messageBox) not found in HTML.");
            return;
        }

        messageBox.textContent = message;
        messageBox.classList.remove('error');
        messageBox.classList.add('show');

        if (isError) {
            messageBox.classList.add('error');
            messageBox.style.color = 'var(--cyber-neon-pink)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-pink)';
            console.error("Message (Error):", message);
        } else {
            messageBox.style.color = 'var(--cyber-neon-cyan)';
            messageBox.style.textShadow = '0 0 12px var(--cyber-neon-cyan)';
            console.log("Message (Success/Info):", message);
        }

        // Hide message after a few seconds
        setTimeout(() => {
            messageBox.classList.remove('show');
            messageBox.textContent = '';
        }, 3000);
    }

    // --- Function to run the XSS payload in the sandboxed iframe ---
    function runPayload() {
        const payload = xssPayloadInput.value.trim();

        if (!payload) {
            showMessage("Please enter an XSS payload (HTML or JavaScript) to test.", true);
            return;
        }

        // Construct a full HTML document for the iframe's srcdoc
        // This ensures the payload is treated as a complete document within the sandbox.
        // We add a basic style to make the content visible against the dark background.
        const iframeContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>XSS Sandbox</title>
                <style>
                    body {
                        background-color: #1a1a1f; /* Dark background for visibility */
                        color: #eee;
                        font-family: 'Inter', sans-serif;
                        padding: 15px;
                        margin: 0;
                        overflow: auto;
                    }
                    /* Basic styling for common XSS artifacts */
                    img { max-width: 100%; height: auto; }
                    pre { background-color: #0a0a0a; padding: 10px; border-radius: 5px; overflow-x: auto; }
                </style>
            </head>
            <body>
                ${payload}
            </body>
            </html>
        `;

        // Set the srcdoc of the iframe. This is safer than writing directly to document.body
        // as it creates a new, isolated document for the iframe.
        xssSandboxFrame.srcdoc = iframeContent;
        showMessage("Payload executed in sandbox. Check the output frame above.", false);
    }

    // --- Function to clear inputs and reset the iframe ---
    function clearAll() {
        xssPayloadInput.value = '';
        xssSandboxFrame.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>XSS Sandbox</title>
                <style>
                    body {
                        background-color: #1a1a1f;
                        color: #777;
                        font-family: 'Inter', sans-serif;
                        padding: 15px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <p>Your XSS payload output will appear here.</p>
                <p>Enter HTML or JavaScript in the input box and click 'Run Payload'.</p>
            </body>
            </html>
        `; // Reset iframe content
        showMessage("Cleared payload and reset sandbox.", false);
    }

    // --- Event Listeners ---
    if (runPayloadBtn) {
        runPayloadBtn.addEventListener('click', runPayload);
        console.log("Run Payload button event listener attached.");
    } else {
        console.error("Error: Run Payload button (#runPayloadBtn) not found.");
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
        console.log("Clear button event listener attached.");
    } else {
        console.error("Error: Clear button (#clearBtn) not found.");
    }

    // Initial state: Clear the iframe content on load
    clearAll();
    console.log("Initial sandbox reset performed.");
});
