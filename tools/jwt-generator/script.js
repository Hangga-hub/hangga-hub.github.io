document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const headerInput = document.getElementById("headerInput");
    const payloadInput = document.getElementById("payloadInput");
    const secretInput = document.getElementById("secretInput");
    const algorithmSelect = document.getElementById("algorithmSelect");
    const generateJwtBtn = document.getElementById("generateJwtBtn");
    const resetBtn = document.getElementById("resetBtn");
    const jwtOutput = document.getElementById("jwtOutput");
    const copyJwtBtn = document.getElementById("copyJwtBtn");
    const messageBox = document.getElementById("messageBox");

    // Default values for header and payload
    const defaultHeader = `{
    "alg": "HS256",
    "typ": "JWT"
}`;
    const defaultPayload = `{
    "sub": "1234567890",
    "name": "John Doe",
    "iat": ${Math.floor(Date.now() / 1000)}
}`; // Current timestamp for 'issued at'

    // Set initial values
    headerInput.value = defaultHeader;
    payloadInput.value = defaultPayload;

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if it's an error message, false otherwise.
     */
    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.classList.remove("show", "error");
        if (isError) {
            messageBox.classList.add("error");
        }
        messageBox.classList.add("show");

        // Hide message after 5 seconds
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 5000);
    }

    /**
     * Generates a JWT based on the inputs.
     */
    function generateJwt() {
        try {
            const headerStr = headerInput.value;
            const payloadStr = payloadInput.value;
            const secret = secretInput.value;
            const algorithm = algorithmSelect.value;

            // Validate JSON inputs
            let header;
            let payload;
            try {
                header = JSON.parse(headerStr);
            } catch (e) {
                showMessage("Invalid JSON in Header. Please check your syntax.", true);
                return;
            }
            try {
                payload = JSON.parse(payloadStr);
            } catch (e) {
                showMessage("Invalid JSON in Payload. Please check your syntax.", true);
                return;
            }

            // Ensure secret is not empty for HMAC algorithms
            if (secret.trim() === "" && algorithm.startsWith("HS")) {
                showMessage("Secret cannot be empty for HMAC algorithms (HS256, HS384, HS512).", true);
                return;
            }

            // Update algorithm in header to match selected value
            header.alg = algorithm;

            // Use jsrsasign to sign the JWT
            // KJUR.jws.JWS.sign(alg, header, payload, secret)
            // For HS algorithms, the secret is a string.
            // For RS/ES algorithms, it would be a private key string (not implemented here for simplicity)
            const jwt = KJUR.jws.JWS.sign(algorithm, JSON.stringify(header), JSON.stringify(payload), secret);

            jwtOutput.textContent = jwt;
            copyJwtBtn.disabled = false;
            showMessage("JWT generated successfully!");

        } catch (error) {
            console.error("Error generating JWT:", error);
            showMessage(`Error generating JWT: ${error.message || error}`, true);
            jwtOutput.textContent = "Error generating JWT.";
            copyJwtBtn.disabled = true;
        }
    }

    /**
     * Copies the generated JWT to the clipboard.
     */
    function copyJwt() {
        const jwtText = jwtOutput.textContent;
        if (jwtText && jwtText !== "Your generated JWT will appear here." && jwtText !== "Error generating JWT.") {
            try {
                // Use document.execCommand('copy') for better compatibility in iframes
                const textArea = document.createElement("textarea");
                textArea.value = jwtText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showMessage("JWT copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy JWT:", err);
                showMessage("Failed to copy JWT. Please copy manually.", true);
            }
        } else {
            showMessage("No JWT to copy.", true);
        }
    }

    /**
     * Resets all inputs and output.
     */
    function resetAll() {
        headerInput.value = defaultHeader;
        payloadInput.value = defaultPayload;
        secretInput.value = "your-secret-key"; // Reset to default placeholder
        algorithmSelect.value = "HS256";
        jwtOutput.textContent = "Your generated JWT will appear here.";
        copyJwtBtn.disabled = true;
        messageBox.classList.remove("show", "error"); // Clear any messages
        showMessage("Inputs reset.");
    }

    // Add event listeners
    generateJwtBtn.addEventListener("click", generateJwt);
    copyJwtBtn.addEventListener("click", copyJwt);
    resetBtn.addEventListener("click", resetAll);

    // Initial generation on load (with default values)
    generateJwt();
});
