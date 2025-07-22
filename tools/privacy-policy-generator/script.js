// script.js for Privacy Policy Generator

document.addEventListener("DOMContentLoaded", () => {
    // Get references to form elements
    const companyNameInput = document.getElementById("companyName");
    const websiteNameInput = document.getElementById("websiteName");
    const websiteURLInput = document.getElementById("websiteURL");
    const contactEmailInput = document.getElementById("contactEmail");
    const dataRetentionInput = document.getElementById("dataRetention");

    const collectPersonalData = document.getElementById("collectPersonalData");
    const collectUsageData = document.getElementById("collectUsageData");
    const collectCookies = document.getElementById("collectCookies");
    const collectSensitiveData = document.getElementById("collectSensitiveData");

    const useProvideService = document.getElementById("useProvideService");
    const useImproveService = document.getElementById("useImproveService");
    const useMarketing = document.getElementById("useMarketing");
    const useAnalytics = document.getElementById("useAnalytics");
    const useSecurity = document.getElementById("useSecurity");
    const useLegal = document.getElementById("useLegal");

    const discloseServiceProviders = document.getElementById("discloseServiceProviders");
    const discloseBusinessTransfer = document.getElementById("discloseBusinessTransfer");
    const discloseLegal = document.getElementById("discloseLegal");
    const discloseAffiliates = document.getElementById("discloseAffiliates");
    const disclosePartners = document.getElementById("disclosePartners");

    const userRightsAccess = document.getElementById("userRightsAccess");
    const userRightsRectification = document.getElementById("userRightsRectification");
    const userRightsErasure = document.getElementById("userRightsErasure");
    const userRightsRestrict = document.getElementById("userRightsRestrict");
    const userRightsPortability = document.getElementById("userRightsPortability");
    const userRightsObject = document.getElementById("userRightsObject");

    const generatePolicyBtn = document.getElementById("generatePolicyBtn");
    const clearFormBtn = document.getElementById("clearFormBtn");
    const copyPolicyBtn = document.getElementById("copyPolicyBtn");
    const policyOutput = document.getElementById("policyOutput");
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
        setTimeout(() => {
            messageBox.classList.remove("show");
        }, 3000); // Message disappears after 3 seconds
    }

    /**
     * Generates the privacy policy based on user inputs.
     */
    function generatePrivacyPolicy() {
        const companyName = companyNameInput.value.trim();
        const websiteName = websiteNameInput.value.trim();
        const websiteURL = websiteURLInput.value.trim();
        const contactEmail = contactEmailInput.value.trim();
        const dataRetention = dataRetentionInput.value.trim();
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        if (!companyName || !websiteName || !websiteURL || !contactEmail) {
            showMessage("Please fill in all required 'Your Information' fields.", true);
            return;
        }

        let policyText = `Privacy Policy for ${websiteName}\n\n`;
        policyText += `Effective Date: ${currentDate}\n\n`;
        policyText += `This Privacy Policy describes how ${companyName} ("we," "us," or "our") collects, uses, and discloses your information when you visit and use our website, ${websiteURL} (the "Service").\n\n`;

        // Information Collection Section
        policyText += "1. Information We Collect\n";
        policyText += "We collect various types of information in connection with the services we provide, including:\n";
        let collectedDataPoints = [];
        if (collectPersonalData.checked) collectedDataPoints.push("Personal Identifiable Information (such as your name, email address, postal address, phone number, etc., if provided by you)");
        if (collectUsageData.checked) collectedDataPoints.push("Usage Data (such as your IP address, browser type, operating system, pages visited, time spent on pages, referral sources, and other diagnostic data)");
        if (collectCookies.checked) collectedDataPoints.push("Cookies and Tracking Technologies (small files stored on your device that help us understand your preferences and activity)");
        if (collectSensitiveData.checked) collectedDataPoints.push("Sensitive Personal Data (such as health data, biometric data, financial information, etc., if applicable and with your explicit consent)");

        if (collectedDataPoints.length > 0) {
            policyText += "- " + collectedDataPoints.join(";\n- ") + ".\n";
        } else {
            policyText += "- We do not intentionally collect personal information through this Service.\n";
        }
        policyText += "\n";

        // How We Use Your Information Section
        policyText += "2. How We Use Your Information\n";
        policyText += "We use the collected information for various purposes, including:\n";
        let usagePurposes = [];
        if (useProvideService.checked) usagePurposes.push("To provide, operate, and maintain our Service");
        if (useImproveService.checked) usagePurposes.push("To improve, personalize, and expand our Service");
        if (useMarketing.checked) usagePurposes.push("To send you promotional communications and marketing materials");
        if (useAnalytics.checked) usagePurposes.push("To analyze how you use our Service and for statistical purposes");
        if (useSecurity.checked) usagePurposes.push("To detect, prevent, and address technical issues and security incidents");
        if (useLegal.checked) usagePurposes.push("To comply with legal obligations and enforce our agreements");

        if (usagePurposes.length > 0) {
            policyText += "- " + usagePurposes.join(";\n- ") + ".\n";
        } else {
            policyText += "- We do not use collected information for any specific purpose.\n";
        }
        policyText += "\n";

        // Disclosure of Your Information Section
        policyText += "3. Disclosure of Your Information\n";
        policyText += "We may share your information in the following situations:\n";
        let disclosures = [];
        if (discloseServiceProviders.checked) disclosures.push("With Service Providers: We may share your information with third-party service providers to monitor and analyze the use of our Service, for payment processing, or to contact you.");
        if (discloseBusinessTransfer.checked) disclosures.push("For Business Transfers: We may share or transfer your personal information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.");
        if (discloseLegal.checked) disclosures.push("For Legal Reasons: We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).");
        if (discloseAffiliates.checked) disclosures.push("With Affiliates: We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.");
        if (disclosePartners.checked) disclosures.push("With Business Partners: We may share your information with our business partners to offer you certain products, services, or promotions.");

        if (disclosures.length > 0) {
            policyText += "- " + disclosures.join("\n- ") + ".\n";
        } else {
            policyText += "- We do not disclose your information to third parties, except as required by law.\n";
        }
        policyText += "\n";

        // Data Retention Section
        policyText += "4. Data Retention\n";
        policyText += `We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. This includes ${dataRetention}.\n\n`;

        // Your Data Protection Rights Section
        policyText += "5. Your Data Protection Rights\n";
        policyText += "Depending on your location and applicable laws, you may have the following data protection rights:\n";
        let rights = [];
        if (userRightsAccess.checked) rights.push("The right to access your personal data.");
        if (userRightsRectification.checked) rights.push("The right to request that we correct any information you believe is inaccurate or incomplete.");
        if (userRightsErasure.checked) rights.push("The right to request that we erase your personal data, under certain conditions.");
        if (userRightsRestrict.checked) rights.push("The right to request that we restrict the processing of your personal data, under certain conditions.");
        if (userRightsPortability.checked) rights.push("The right to data portability, allowing you to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.");
        if (userRightsObject.checked) rights.push("The right to object to our processing of your personal data, under certain conditions.");

        if (rights.length > 0) {
            policyText += "- " + rights.join("\n- ") + ".\n";
        } else {
            policyText += "- Your specific data protection rights may vary based on applicable laws.\n";
        }
        policyText += "\n";

        // Changes to This Privacy Policy
        policyText += "6. Changes to This Privacy Policy\n";
        policyText += "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the 'Effective Date' at the top of this Privacy Policy.\n\n";

        // Contact Us Section
        policyText += "7. Contact Us\n";
        policyText += `If you have any questions about this Privacy Policy, you can contact us:\n`;
        policyText += `- By email: ${contactEmail}\n`;

        policyOutput.value = policyText;
        showMessage("Privacy Policy generated successfully!");
    }

    /**
     * Clears all input fields and the generated policy output.
     */
    function clearForm() {
        companyNameInput.value = "";
        websiteNameInput.value = "";
        websiteURLInput.value = "";
        contactEmailInput.value = "";
        dataRetentionInput.value = "As long as necessary for the purposes outlined in this Privacy Policy."; // Reset to default

        // Reset checkboxes to default checked state
        collectPersonalData.checked = true;
        collectUsageData.checked = true;
        collectCookies.checked = true;
        collectSensitiveData.checked = false;

        useProvideService.checked = true;
        useImproveService.checked = true;
        useMarketing.checked = true;
        useAnalytics.checked = true;
        useSecurity.checked = true;
        useLegal.checked = true;

        discloseServiceProviders.checked = true;
        discloseBusinessTransfer.checked = false;
        discloseLegal.checked = true;
        discloseAffiliates.checked = false;
        disclosePartners.checked = false;

        userRightsAccess.checked = true;
        userRightsRectification.checked = true;
        userRightsErasure.checked = true;
        userRightsRestrict.checked = true;
        userRightsPortability.checked = true;
        userRightsObject.checked = true;

        policyOutput.value = "";
        showMessage("Form cleared.");
    }

    /**
     * Copies the content of the policy output textarea to the clipboard.
     */
    function copyPolicyToClipboard() {
        if (policyOutput.value.trim() === "") {
            showMessage("Nothing to copy. Please generate a policy first.", true);
            return;
        }

        policyOutput.select();
        policyOutput.setSelectionRange(0, 99999); // For mobile devices

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showMessage("Privacy Policy copied to clipboard!");
            } else {
                showMessage("Failed to copy to clipboard.", true);
            }
        } catch (err) {
            console.error('Oops, unable to copy', err);
            showMessage("Copy failed! Your browser might not support this feature.", true);
        }
    }

    // Event Listeners
    generatePolicyBtn.addEventListener("click", generatePrivacyPolicy);
    clearFormBtn.addEventListener("click", clearForm);
    copyPolicyBtn.addEventListener("click", copyPolicyToClipboard);

    // Initial clear to set default states
    clearForm();
});
