// script.js for tools/ip-subnet-calculator/

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const ipAddressInput = document.getElementById('ipAddressInput');
    const cidrInput = document.getElementById('cidrInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsContainer = document.getElementById('resultsContainer');
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

    // --- Core IP Calculation Logic ---

    /**
     * Validates if a string is a valid IPv4 address.
     * @param {string} ip - The IP address string.
     * @returns {boolean} True if valid, false otherwise.
     */
    function isValidIp(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;
        return parts.every(part => {
            const num = parseInt(part, 10);
            return !isNaN(num) && num >= 0 && num <= 255 && String(num) === part; // Check for leading zeros
        });
    }

    /**
     * Converts an IPv4 address string to its 32-bit binary representation.
     * @param {string} ip - The IP address string.
     * @returns {string} 32-bit binary string.
     */
    function ipToBinary(ip) {
        return ip.split('.')
                 .map(octet => parseInt(octet, 10).toString(2).padStart(8, '0'))
                 .join('');
    }

    /**
     * Converts a 32-bit binary string back to an IPv4 address string.
     * @param {string} binary - The 32-bit binary string.
     * @returns {string} IPv4 address string.
     */
    function binaryToIp(binary) {
        const octets = [];
        for (let i = 0; i < 32; i += 8) {
            octets.push(parseInt(binary.substring(i, i + 8), 2));
        }
        return octets.join('.');
    }

    /**
     * Generates the subnet mask (e.g., "255.255.255.0") from a CIDR prefix.
     * @param {number} cidr - The CIDR prefix (0-32).
     * @returns {string} The subnet mask.
     */
    function getCidrSubnetMask(cidr) {
        let binaryMask = '1'.repeat(cidr) + '0'.repeat(32 - cidr);
        return binaryToIp(binaryMask);
    }

    /**
     * Calculates all IP subnet details.
     * @param {string} ip - The IP address.
     * @param {number} cidr - The CIDR prefix.
     * @returns {object} An object containing all calculated details.
     */
    function calculateSubnetDetails(ip, cidr) {
        const ipBinary = ipToBinary(ip);
        const subnetMaskBinary = '1'.repeat(cidr) + '0'.repeat(32 - cidr);
        const wildcardMaskBinary = '0'.repeat(cidr) + '1'.repeat(32 - cidr);

        // Calculate Network Address (IP AND Subnet Mask)
        let networkBinary = '';
        for (let i = 0; i < 32; i++) {
            networkBinary += (parseInt(ipBinary[i]) & parseInt(subnetMaskBinary[i])).toString();
        }
        const networkAddress = binaryToIp(networkBinary);

        // Calculate Broadcast Address (Network Address OR Wildcard Mask)
        let broadcastBinary = '';
        for (let i = 0; i < 32; i++) {
            broadcastBinary += (parseInt(networkBinary[i]) | parseInt(wildcardMaskBinary[i])).toString();
        }
        const broadcastAddress = binaryToIp(broadcastBinary);

        // Calculate First Usable Host (Network Address + 1)
        let firstHostAddress = 'N/A';
        if (cidr !== 32 && cidr !== 31) { // /32 has no hosts, /31 has 2 (network/broadcast, no usable)
            const networkInt = parseInt(networkBinary, 2);
            firstHostAddress = binaryToIp((networkInt + 1).toString(2).padStart(32, '0'));
        }

        // Calculate Last Usable Host (Broadcast Address - 1)
        let lastHostAddress = 'N/A';
        if (cidr !== 32 && cidr !== 31) { // /32 has no hosts, /31 has 2 (network/broadcast, no usable)
            const broadcastInt = parseInt(broadcastBinary, 2);
            lastHostAddress = binaryToIp((broadcastInt - 1).toString(2).padStart(32, '0'));
        }

        // Calculate Total Usable Hosts
        let totalHosts = 2 ** (32 - cidr);
        let usableHosts = 'N/A';
        if (cidr === 32) {
            usableHosts = 0; // Single host
        } else if (cidr === 31) {
            usableHosts = 0; // Point-to-point link, no usable hosts beyond network/broadcast
        } else {
            usableHosts = totalHosts - 2; // Subtract network and broadcast addresses
        }


        return {
            ipAddress: ip,
            cidr: cidr,
            subnetMask: getCidrSubnetMask(cidr),
            wildcardMask: binaryToIp(wildcardMaskBinary),
            networkAddress: networkAddress,
            broadcastAddress: broadcastAddress,
            firstHost: firstHostAddress,
            lastHost: lastHostAddress,
            totalHosts: totalHosts,
            usableHosts: usableHosts
        };
    }

    // --- UI and Event Handlers ---

    // Function to display results
    function displayResults(details) {
        resultsContainer.style.display = 'block';
        resultsContainer.innerHTML = `
            <h3>Subnet Details for ${details.ipAddress}/${details.cidr}</h3>
            <p><strong>Network Address:</strong> ${details.networkAddress}</p>
            <p><strong>Subnet Mask:</strong> ${details.subnetMask}</p>
            <p><strong>Wildcard Mask:</strong> ${details.wildcardMask}</p>
            <p><strong>Broadcast Address:</strong> ${details.broadcastAddress}</p>
            <p><strong>First Usable Host:</strong> ${details.firstHost}</p>
            <p><strong>Last Usable Host:</strong> ${details.lastHost}</p>
            <p><strong>Total Hosts:</strong> ${details.totalHosts}</p>
            <p><strong>Usable Hosts:</strong> ${details.usableHosts}</p>
        `;
    }

    // Main calculation function triggered by button
    async function handleCalculate() {
        const ipAddress = ipAddressInput.value.trim();
        const cidr = parseInt(cidrInput.value.trim(), 10);

        if (!isValidIp(ipAddress)) {
            showMessage('Invalid IP Address format. Please use X.X.X.X (e.g., 192.168.1.1).', 'error');
            resultsContainer.innerHTML = '<p style="text-align: center; color: rgba(238,238,238,0.5);">Subnet details will appear here after calculation.</p>';
            resultsContainer.style.display = 'block';
            return;
        }

        if (isNaN(cidr) || cidr < 0 || cidr > 32) {
            showMessage('Invalid CIDR Prefix. Please enter a number between 0 and 32.', 'error');
            resultsContainer.innerHTML = '<p style="text-align: center; color: rgba(238,238,238,0.5);">Subnet details will appear here after calculation.</p>';
            resultsContainer.style.display = 'block';
            return;
        }

        toggleLoading(true);

        setTimeout(() => {
            try {
                const details = calculateSubnetDetails(ipAddress, cidr);
                displayResults(details);
                showMessage('Subnet calculated successfully!', 'success');
            } catch (error) {
                console.error('Error during calculation:', error);
                resultsContainer.innerHTML = '<p style="text-align: center; color: red;">An error occurred during calculation. Please check your inputs.</p>';
                showMessage('An error occurred during calculation.', 'error');
            } finally {
                toggleLoading(false);
            }
        }, 10); // Small delay to allow loading overlay to show
    }

    // Function to clear all inputs and results
    function clearAll() {
        ipAddressInput.value = '192.168.1.1';
        cidrInput.value = '24';
        resultsContainer.innerHTML = '<p style="text-align: center; color: rgba(238,238,238,0.5);">Subnet details will appear here after calculation.</p>';
        resultsContainer.style.display = 'block';
        showMessage('Cleared all fields.', 'info');
    }

    // Event Listeners
    calculateBtn.addEventListener('click', handleCalculate);
    clearBtn.addEventListener('click', clearAll);

    // Initial calculation on page load with default values
    handleCalculate();
});
