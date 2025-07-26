// tools/ip-device-info/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Output elements for IP info
    const ipAddressOutput = document.getElementById('ipAddressOutput');
    const countryOutput = document.getElementById('countryOutput');
    const cityOutput = document.getElementById('cityOutput');
    const regionOutput = document.getElementById('regionOutput');
    const postalOutput = document.getElementById('postalOutput');
    const coordsOutput = document.getElementById('coordsOutput');
    const timezoneOutput = document.getElementById('timezoneOutput');
    const ispOutput = document.getElementById('ispOutput');
    const messageBox = document.getElementById('messageBox');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const refreshBtn = document.getElementById('refreshBtn');

    // New output elements for Device info
    const browserOutput = document.getElementById('browserOutput');
    const osOutput = document.getElementById('osOutput');
    const deviceTypeOutput = document.getElementById('deviceTypeOutput');
    const resolutionOutput = document.getElementById('resolutionOutput');
    const languageOutput = document.getElementById('languageOutput');
    const userAgentOutput = document.getElementById('userAgentOutput');

    /**
     * Displays a message in the message box.
     * @param {string} message - The message to display.
     * @param {boolean} isError - True if the message is an error, false otherwise.
     */
    const showMessage = (message, isError = false) => {
        messageBox.textContent = message;
        messageBox.classList.remove('error');
        if (isError) {
            messageBox.classList.add('error');
        }
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 3000); // Message disappears after 3 seconds
    };

    /**
     * Resets all output fields to their initial "Detecting..." state.
     */
    const resetOutputs = () => {
        ipAddressOutput.textContent = 'Detecting...';
        countryOutput.textContent = 'Detecting...';
        cityOutput.textContent = 'Detecting...';
        regionOutput.textContent = 'Detecting...';
        postalOutput.textContent = 'Detecting...';
        coordsOutput.textContent = 'Detecting...';
        timezoneOutput.textContent = 'Detecting...';
        ispOutput.textContent = 'Detecting...';

        browserOutput.textContent = 'Detecting...';
        osOutput.textContent = 'Detecting...';
        deviceTypeOutput.textContent = 'Detecting...';
        resolutionOutput.textContent = 'Detecting...';
        languageOutput.textContent = 'Detecting...';
        userAgentOutput.textContent = 'Detecting...';

        messageBox.classList.remove('show');
        messageBox.textContent = '';
    };

    /**
     * Detects browser name and version from user agent.
     * @param {string} userAgent - The user agent string.
     * @returns {string} The detected browser name and version.
     */
    const getBrowserInfo = (userAgent) => {
        let browserName = "Unknown Browser";
        let browserVersion = "";

        // Order matters for some browsers (e.g., Edge vs Chrome)
        if (userAgent.includes("Edge")) {
            browserName = "Microsoft Edge";
            browserVersion = userAgent.split("Edge/")[1]?.split(" ")[0];
        } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
            browserName = "Google Chrome";
            browserVersion = userAgent.split("Chrome/")[1]?.split(" ")[0];
        } else if (userAgent.includes("Firefox")) {
            browserName = "Mozilla Firefox";
            browserVersion = userAgent.split("Firefox/")[1];
        } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
            browserName = "Apple Safari";
            browserVersion = userAgent.split("Version/")[1]?.split(" ")[0];
        } else if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) {
            browserName = "Internet Explorer";
            browserVersion = userAgent.includes("MSIE") ? userAgent.split("MSIE ")[1]?.split(";")[0] : userAgent.split("rv:")[1]?.split(")")[0];
        } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
            browserName = "Opera";
            browserVersion = userAgent.includes("Opera") ? userAgent.split("Opera/")[1]?.split(" ")[0] : userAgent.split("OPR/")[1]?.split(" ")[0];
        }
        return `${browserName}${browserVersion ? ' ' + browserVersion : ''}`;
    };

    /**
     * Detects operating system from user agent.
     * @param {string} userAgent - The user agent string.
     * @returns {string} The detected OS.
     */
    const getOSInfo = (userAgent) => {
        if (userAgent.includes("Windows NT 10.0")) return "Windows 10";
        if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1";
        if (userAgent.includes("Windows NT 6.2")) return "Windows 8";
        if (userAgent.includes("Windows NT 6.1")) return "Windows 7";
        if (userAgent.includes("Windows NT 6.0")) return "Windows Vista";
        if (userAgent.includes("Windows NT 5.1")) return "Windows XP";
        if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS X")) return "macOS";
        if (userAgent.includes("Android")) return "Android";
        if (userAgent.includes("iOS") || userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
        if (userAgent.includes("Linux")) return "Linux";
        return "Unknown OS";
    };

    /**
     * Detects device type (mobile, tablet, desktop) based on user agent and screen size.
     * @returns {string} The detected device type.
     */
    const getDeviceType = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|s\-)|al(av|ca|co)|amoi|an(d|on)|aq(io|er)|as(te|us)|attw|au(di|\-m|r |s )|av(ie|te)|be(fo|co)|bl(ac|k|l)|bn(ar|rp|ob)|bo(at|nd)|br(az|go)|bi(nd|lga|te)|c(ap|er|ev)|ce(ll|ig)|cl(as|ch|in)|cp(mo|tp)|dc\-s|di(ne|fi|pn)|dg(st|ca)|dm(gi|ki|pn)|dzg|el(eg|em)|epsi|co|erch|c\-l|ht(tp|ad)|ipg|jm(in|on)|ki(mo|tl)|ko(on|ny)|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\-w)|li(ca|co)|lm(at|on)|lpt|lw(cg|er|in)|m(on|ad)o|mwbp|mywa|n(sm|ev)|ne(on|bb)|ng(el|le)|nl(al|dn)|nx(it|om)|ny(mo|ty)|on(ad|eo)|os(bl|nd|uc)|owg|pm(to|er|lg)|pn\-be|po(ck|fe)|py(g|gq)|qa\-a|qc(07|12|21|32|60|\-h|a7|g1|g5|g7|g9|for|go|i\-|o8|op|pv|ro|ru|s\-|t5)|rh(mo|st)|ri(mi|gn)|rwa|rzc|s55\/|sa(ge|ma|mm|pn|si)|send|te(sl|sy)|t\-mo|ti(ck|ga)|tr(ad|h|by)|ts(ad|tp)|un(ar|ev|go)|us(ca|ha)|vk(40|5[0-3]|\-v)|vm(g|go)|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c |webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
            return "Mobile";
        }
        if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)) {
            return "Tablet";
        }
        return "Desktop";
    };

    /**
     * Fetches and displays IP address and device information.
     */
    const autoDetectIpInfo = async () => {
        resetOutputs(); // Reset outputs before fetching
        loadingSpinner.style.display = 'block'; // Show spinner
        showMessage('Fetching your IP and device information...', false);

        // --- IP Info Fetch ---
        try {
            // Using ipapi.co for comprehensive free data
            const apiUrl = 'https://ipapi.co/json/';
            const response = await fetch(apiUrl);
            const data = await response.json();

            loadingSpinner.style.display = 'none'; // Hide spinner

            if (response.ok && !data.error) {
                ipAddressOutput.textContent = data.ip || 'N/A';
                countryOutput.textContent = data.country_name || 'N/A';
                cityOutput.textContent = data.city || 'N/A';
                regionOutput.textContent = data.region || 'N/A';
                postalOutput.textContent = data.postal || 'N/A';
                coordsOutput.textContent = `${data.latitude || 'N/A'}, ${data.longitude || 'N/A'}`;
                timezoneOutput.textContent = data.timezone || 'N/A';
                ispOutput.textContent = data.org || data.asn || 'N/A'; // org is usually ISP, asn is AS number

                showMessage('Information updated successfully!', false);
            } else {
                const errorMessage = data.reason || 'Failed to retrieve IP information. Please try again.';
                showMessage(`Error: ${errorMessage}`, true);
                // Set outputs to N/A if there's an error
                ipAddressOutput.textContent = 'N/A';
                countryOutput.textContent = 'N/A';
                cityOutput.textContent = 'N/A';
                regionOutput.textContent = 'N/A';
                postalOutput.textContent = 'N/A';
                coordsOutput.textContent = 'N/A, N/A';
                timezoneOutput.textContent = 'N/A';
                ispOutput.textContent = 'N/A';
            }
        } catch (error) {
            console.error('Error fetching IP data:', error);
            loadingSpinner.style.display = 'none'; // Hide spinner on error
            showMessage('An error occurred while fetching data. Please check your network connection or try again later.', true);
            // Set outputs to N/A on network error
            ipAddressOutput.textContent = 'N/A';
            countryOutput.textContent = 'N/A';
            cityOutput.textContent = 'N/A';
            regionOutput.textContent = 'N/A';
            postalOutput.textContent = 'N/A';
            coordsOutput.textContent = 'N/A, N/A';
            timezoneOutput.textContent = 'N/A';
            ispOutput.textContent = 'N/A';
        }

        // --- Device Info Detection ---
        const userAgent = navigator.userAgent;
        userAgentOutput.textContent = userAgent || 'N/A';
        browserOutput.textContent = getBrowserInfo(userAgent);
        osOutput.textContent = getOSInfo(userAgent);
        deviceTypeOutput.textContent = getDeviceType();
        resolutionOutput.textContent = `${window.screen.width}x${window.screen.height}`;
        languageOutput.textContent = navigator.language || 'N/A';
    };

    // Automatically fetch info on page load
    autoDetectIpInfo();

    // Event listener for the "Refresh Info" button
    refreshBtn.addEventListener('click', autoDetectIpInfo);
});
