// tools/http-status-code-tester/script.js

document.addEventListener('DOMContentLoaded', () => {
    const statusCodeInput = document.getElementById('statusCodeInput');
    const testBtn = document.getElementById('testBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageBox = document.getElementById('messageBox');
    const resultsMessageBox = document.getElementById('resultsMessageBox');
    const statusResultDiv = document.getElementById('statusResult');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Output elements for status code details
    const statusTextOutput = document.getElementById('statusTextOutput');
    const explanationOutput = document.getElementById('explanationOutput');
    const mockResponseOutput = document.getElementById('mockResponseOutput');

    // Basic explanations for common HTTP status codes
    const statusExplanations = {
        // 1xx Informational
        100: "Continue: The server has received the request headers and the client should proceed to send the request body.",
        101: "Switching Protocols: The requester has asked the server to switch protocols.",
        102: "Processing (WebDAV): The server has received and is processing the request, but no response is available yet.",
        103: "Early Hints: Used to return some response headers before final HTTP message.",

        // 2xx Success
        200: "OK: The request has succeeded.",
        201: "Created: The request has been fulfilled and resulted in a new resource being created.",
        202: "Accepted: The request has been accepted for processing, but the processing has not been completed.",
        203: "Non-Authoritative Information: The returned metadata is not exactly the same as available from the origin server, but collected from a local or a third-party copy.",
        204: "No Content: The server successfully processed the request, and is not returning any content.",
        205: "Reset Content: The server successfully processed the request, but is not returning any content. It requires the requester to reset the document view.",
        206: "Partial Content: The server is delivering only part of the resource due to a range header sent by the client.",
        207: "Multi-Status (WebDAV): A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.",
        208: "Already Reported (WebDAV): Used inside a DAV:propstat response element to avoid enumerating the internal members of multiple bindings to the same collection repeatedly.",
        226: "IM Used (HTTP Delta encoding): The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",

        // 3xx Redirection
        300: "Multiple Choices: The request has more than one possible response.",
        301: "Moved Permanently: The requested resource has been assigned a new permanent URI.",
        302: "Found (Previously 'Moved Temporarily'): The resource can be found under a different URI.",
        303: "See Other: The response to the request can be found under another URI using a GET method.",
        304: "Not Modified: Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.",
        305: "Use Proxy: The requested resource must be accessed through the proxy given by the Location field.",
        307: "Temporary Redirect: The request should be repeated with another URI; however, future requests should still use the original URI.",
        308: "Permanent Redirect: The request and all future requests should be repeated using another URI.",

        // 4xx Client Error
        400: "Bad Request: The server cannot or will not process the request due to an apparent client error.",
        401: "Unauthorized: Authentication is required and has failed or has not yet been provided.",
        402: "Payment Required: Reserved for future use.",
        403: "Forbidden: The request was a valid request, but the server is refusing to respond to it.",
        404: "Not Found: The requested resource could not be found on the server.",
        405: "Method Not Allowed: The request method is not supported for the requested resource.",
        406: "Not Acceptable: The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.",
        407: "Proxy Authentication Required: The client must first authenticate itself with the proxy.",
        408: "Request Timeout: The server timed out waiting for the request.",
        409: "Conflict: The request could not be completed due to a conflict with the current state of the resource.",
        410: "Gone: The requested resource is no longer available at the server and no forwarding address is known.",
        411: "Length Required: The server rejected the request because the Content-Length header field is not defined and the server requires it.",
        412: "Precondition Failed: The server does not meet one of the preconditions that the requester put on the request.",
        413: "Payload Too Large: The request entity is larger than limits defined by server.",
        414: "URI Too Long: The URI provided was too long for the server to process.",
        415: "Unsupported Media Type: The request entity has a media type which the server or resource does not support.",
        416: "Range Not Satisfiable: The client has asked for a portion of the file, but the server cannot supply that portion.",
        417: "Expectation Failed: The server cannot meet the requirements of the Expect request-header field.",
        418: "I'm a teapot: This code was defined in 1998 as one of the traditional IETF April Fools' jokes.",
        421: "Misdirected Request: The request was directed at a server that is not able to produce a response.",
        422: "Unprocessable Entity (WebDAV): The request was well-formed but was unable to be followed due to semantic errors.",
        423: "Locked (WebDAV): The resource that is being accessed is locked.",
        424: "Failed Dependency (WebDAV): The request failed because it depended on another request and that request failed.",
        425: "Too Early (WebDAV): Indicates that the server is unwilling to risk processing a request that might be replayed.",
        426: "Upgrade Required: The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.",
        428: "Precondition Required: The origin server requires the request to be conditional.",
        429: "Too Many Requests: The user has sent too many requests in a given amount of time.",
        431: "Request Header Fields Too Large: The server is unwilling to process the request because its header fields are too large.",
        451: "Unavailable For Legal Reasons: A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.",

        // 5xx Server Error
        500: "Internal Server Error: A generic error message, given when an unexpected condition was encountered.",
        501: "Not Implemented: The server either does not recognize the request method, or it lacks the ability to fulfill the request.",
        502: "Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
        503: "Service Unavailable: The server is currently unavailable (because it is overloaded or down for maintenance).",
        504: "Gateway Timeout: The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
        505: "HTTP Version Not Supported: The server does not support the HTTP protocol version used in the request.",
        506: "Variant Also Negotiates: Transparent content negotiation for the request results in a circular reference.",
        507: "Insufficient Storage (WebDAV): The server is unable to store the representation needed to complete the request.",
        508: "Loop Detected (WebDAV): The server detected an infinite loop while processing the request.",
        510: "Not Extended: Further extensions to the request are required for the server to fulfill it.",
        511: "Network Authentication Required: The client needs to authenticate to gain network access."
    };

    // Mock responses for common HTTP status codes
    const mockResponses = {
        200: "HTTP/1.1 200 OK\nContent-Type: text/plain\n\n200 OK",
        201: "HTTP/1.1 201 Created\nContent-Type: application/json\nLocation: /new-resource/123\n\n{\"message\": \"Resource created successfully\", \"id\": 123}",
        204: "HTTP/1.1 204 No Content\n\n",
        400: "HTTP/1.1 400 Bad Request\nContent-Type: text/plain\n\n400 Bad Request",
        401: "HTTP/1.1 401 Unauthorized\nContent-Type: text/plain\nWWW-Authenticate: Basic realm=\"Access to site\"\n\n401 Unauthorized",
        403: "HTTP/1.1 403 Forbidden\nContent-Type: text/plain\n\n403 Forbidden",
        404: "HTTP/1.1 404 Not Found\nContent-Type: text/plain\n\n404 Not Found",
        500: "HTTP/1.1 500 Internal Server Error\nContent-Type: text/plain\n\n500 Internal Server Error",
        503: "HTTP/1.1 503 Service Unavailable\nContent-Type: text/plain\nRetry-After: 3600\n\n503 Service Unavailable"
        // Add more mock responses as needed for other status codes
    };

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
     * Resets all output fields and messages.
     */
    const resetOutputs = () => {
        statusCodeInput.value = '';
        statusTextOutput.textContent = '';
        explanationOutput.innerHTML = '<strong>Explanation:</strong> N/A';
        mockResponseOutput.textContent = '';
        statusResultDiv.classList.add('hidden'); // Hide the result card
        messageBox.classList.remove('show');
        messageBox.textContent = '';
        resultsMessageBox.classList.remove('show');
        resultsMessageBox.textContent = '';
        loadingSpinner.style.display = 'none'; // Hide spinner
    };

    /**
     * Displays HTTP status code information and a mock response from local data.
     */
    const testStatusCode = async () => {
        const statusCode = parseInt(statusCodeInput.value.trim());

        if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
            showMessage(messageBox, 'Please enter a valid HTTP status code (100-599).', true);
            return;
        }

        // Clear previous results and messages, show loading spinner
        resetOutputs(); // Reset all outputs first
        showMessage(messageBox, `Retrieving information for status code ${statusCode}...`, false);
        loadingSpinner.style.display = 'block'; // Show spinner

        // Simulate a small delay for "processing"
        setTimeout(() => {
            loadingSpinner.style.display = 'none'; // Hide spinner

            const explanation = statusExplanations[statusCode] || 'No specific explanation available.';
            const mockResponse = mockResponses[statusCode] || `HTTP/1.1 ${statusCode} Unknown Status\nContent-Type: text/plain\n\n${statusCode} Unknown Status - No mock response available in dataset.`;

            // Determine status text from explanation or a generic one
            const statusText = explanation.split(':')[0].trim();

            statusTextOutput.textContent = `${statusCode} ${statusText}`;
            explanationOutput.innerHTML = `<strong>Explanation:</strong> ${explanation}`;
            mockResponseOutput.textContent = mockResponse;
            statusResultDiv.classList.remove('hidden'); // Show the result card
            showMessage(messageBox, `Status code ${statusCode} information retrieved!`, false);

            // Scroll to the result section
            statusResultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        }, 500); // Simulate processing delay
    };

    // Event listeners
    testBtn.addEventListener('click', testStatusCode);
    clearBtn.addEventListener('click', resetOutputs);

    // Allow pressing Enter in the input field to trigger test
    statusCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            testStatusCode();
        }
    });
});
