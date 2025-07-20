// tools/regex-tester/script.js

document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const regexPatternInput = document.getElementById("regexPattern");
    const testStringInput = document.getElementById("testString");
    const flagGlobal = document.getElementById("flagGlobal");
    const flagCaseInsensitive = document.getElementById("flagCaseInsensitive");
    const flagMultiline = document.getElementById("flagMultiline");
    const testRegexBtn = document.getElementById("testRegexBtn");
    const clearBtn = document.getElementById("clearBtn");
    const resultArea = document.getElementById("resultArea");
    const regexExplanationDiv = document.getElementById("regexExplanation");

    /**
     * Explains common regex components. This is a simplified explanation and
     * can be expanded for more comprehensive details.
     * @param {string} pattern The regex pattern string.
     * @returns {string} An HTML string explaining the regex.
     */
    function explainRegex(pattern) {
        let explanation = "";
        if (!pattern) {
            return "<p>Enter a regex pattern to see its explanation.</p>";
        }

        explanation += "<ul>";

        // Basic character types
        if (/\d/.test(pattern)) explanation += "<li><code>\\d</code>: Matches any digit (0-9).</li>";
        if (/\D/.test(pattern)) explanation += "<li><code>\\D</code>: Matches any non-digit character.</li>";
        if (/\w/.test(pattern)) explanation += "<li><code>\\w</code>: Matches any word character (alphanumeric and underscore).</li>";
        if (/\W/.test(pattern)) explanation += "<li><code>\\W</code>: Matches any non-word character.</li>";
        if (/\s/.test(pattern)) explanation += "<li><code>\\s</code>: Matches any whitespace character (space, tab, newline, etc.).</li>";
        if (/\S/.test(pattern)) explanation += "<li><code>\\S</code>: Matches any non-whitespace character.</li>";
        if (/\./.test(pattern)) explanation += "<li><code>.</code>: Matches any character (except newline, unless 's' flag is used).</li>";

        // Anchors
        if (/\^/.test(pattern)) explanation += "<li><code>^</code>: Matches the beginning of the string (or line, with 'm' flag).</li>";
        if (/\$/.test(pattern)) explanation += "<li><code>$</code>: Matches the end of the string (or line, with 'm' flag).</li>";
        if (/\b/.test(pattern)) explanation += "<li><code>\\b</code>: Matches a word boundary.</li>";
        if (/\B/.test(pattern)) explanation += "<li><code>\\B</code>: Matches a non-word boundary.</li>";

        // Quantifiers
        if (/\*/.test(pattern)) explanation += "<li><code>*</code>: Matches the preceding element zero or more times.</li>";
        if (/\+/.test(pattern)) explanation += "<li><code>+</code>: Matches the preceding element one or more times.</li>";
        if (/\?/.test(pattern)) explanation += "<li><code>?</code>: Matches the preceding element zero or one time (also makes quantifiers non-greedy).</li>";
        if (/\{(\d+)\}/.test(pattern)) explanation += "<li><code>{n}</code>: Matches the preceding element exactly 'n' times.</li>";
        if (/\{(\d+),}/.test(pattern)) explanation += "<li><code>{n,}</code>: Matches the preceding element 'n' or more times.</li>";
        if (/\{(\d+),(\d+)\}/.test(pattern)) explanation += "<li><code>{n,m}</code>: Matches the preceding element at least 'n' and at most 'm' times.</li>";

        // Character Sets
        if (/\[.*?\]/.test(pattern)) explanation += "<li><code>[...]</code>: Matches any one of the characters inside the brackets.</li>";
        if (/\[\^.*?\]/.test(pattern)) explanation += "<li><code>[^...]</code>: Matches any character NOT inside the brackets.</li>";

        // Grouping and Alternation
        if (/\(.*\)/.test(pattern)) explanation += "<li><code>(...)</code>: Capturing group; groups multiple tokens together and creates a capture group.</li>";
        if (/\|/.test(pattern)) explanation += "<li><code>|</code>: OR operator; matches either the expression before or after the '|'.</li>";
        if (/\(?:.*\)/.test(pattern)) explanation += "<li><code>(?:...)</code>: Non-capturing group; groups multiple tokens together without creating a capture group.</li>";

        // Escaping special characters
        if (/\\./.test(pattern) && !/\\\d|\\\w|\\\s|\\b/.test(pattern)) explanation += "<li><code>\\X</code>: Escapes the special character 'X' (e.g., <code>\\.</code> matches a literal dot).</li>";

        // Flags (explained separately in the UI, but good to mention here too)
        // This function focuses on pattern syntax, flags are handled by the UI checkboxes.

        explanation += "</ul>";

        if (explanation === "<ul></ul>") {
            return "<p>No common regex components detected for explanation.</p>";
        }
        return explanation;
    }

    /**
     * Performs the regex test and updates the result and explanation areas.
     */
    function performRegexTest() {
        const pattern = regexPatternInput.value;
        const testString = testStringInput.value;
        const isGlobal = flagGlobal.checked;
        const isCaseInsensitive = flagCaseInsensitive.checked;
        const isMultiline = flagMultiline.checked;

        let flags = "";
        if (isGlobal) flags += "g";
        if (isCaseInsensitive) flags += "i";
        if (isMultiline) flags += "m";

        resultArea.innerHTML = ""; // Clear previous results
        regexExplanationDiv.innerHTML = explainRegex(pattern); // Update explanation

        if (!pattern) {
            resultArea.innerHTML = "<p class='result-error'>Please enter a regex pattern.</p>";
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            let match;
            let matchesFound = false;
            let resultHtml = "";

            // Highlight the test string based on matches
            let highlightedString = testString;
            let offset = 0; // To adjust indices after insertions

            // To store all matches for display
            const allMatches = [];

            // Perform matching
            if (isGlobal) {
                while ((match = regex.exec(testString)) !== null) {
                    allMatches.push(match);
                    matchesFound = true;
                }
            } else {
                match = testString.match(regex);
                if (match) {
                    allMatches.push(match);
                    matchesFound = true;
                }
            }

            if (matchesFound) {
                resultHtml += "<p><strong>Matches Found:</strong></p>";
                resultHtml += "<div class='matches-list'>";
                let currentString = testString;
                let lastIndex = 0;

                allMatches.forEach((match, index) => {
                    const matchStart = match.index;
                    const matchEnd = match.index + match[0].length;

                    // Add text before the current match
                    resultHtml += currentString.substring(lastIndex, matchStart);

                    // Add the highlighted match
                    resultHtml += `<span class="regex-match">${match[0]}</span>`;
                    lastIndex = matchEnd;

                    resultHtml += `<p class="match-detail">Match ${index + 1}: "${match[0]}" (Index: ${match.index})`;
                    if (match.length > 1) {
                        resultHtml += " - Groups: ";
                        for (let i = 1; i < match.length; i++) {
                            resultHtml += `Group ${i}: "${match[i]}"${i < match.length - 1 ? ", " : ""}`;
                        }
                    }
                    resultHtml += "</p>";
                });

                // Add any remaining text after the last match
                resultHtml += currentString.substring(lastIndex);

            } else {
                resultHtml = "<p>No matches found.</p>";
            }

            resultArea.innerHTML = `<pre class="highlighted-text">${resultHtml}</pre>`;

        } catch (e) {
            resultArea.innerHTML = `<p class="result-error">Invalid Regex: ${e.message}</p>`;
        }
    }

    /**
     * Clears all input fields and result areas.
     */
    function clearAll() {
        regexPatternInput.value = "";
        testStringInput.value = "";
        flagGlobal.checked = true;
        flagCaseInsensitive.checked = false;
        flagMultiline.checked = false;
        resultArea.innerHTML = "<p>Matches will appear here.</p>";
        regexExplanationDiv.innerHTML = "<p>Explanation of the regex pattern will be displayed here.</p>";
    }

    // Event Listeners
    regexPatternInput.addEventListener("input", performRegexTest);
    testStringInput.addEventListener("input", performRegexTest);
    flagGlobal.addEventListener("change", performRegexTest);
    flagCaseInsensitive.addEventListener("change", performRegexTest);
    flagMultiline.addEventListener("change", performRegexTest);
    testRegexBtn.addEventListener("click", performRegexTest);
    clearBtn.addEventListener("click", clearAll);

    // Initial test on page load with default values
    performRegexTest();
});
