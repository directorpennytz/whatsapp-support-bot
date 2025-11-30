function generateReply(text) {
    const lower = text.toLowerCase();

    // Chagua lugha
// Detect Kiswahili first
const swahiliWords = ["habari", "mambo", "shikamoo", "bei", "huduma", "ulipo", "wapi", "tafuta", "msaada"];
const isSwahili = swahiliWords.some(w => lower.includes(w));
const isEnglish = !isSwahili;   // Ukiona Kiswahili, jibu Kiswahili

    // Greetings
    if (
        lower.includes("hello") ||
        lower.includes("hi") ||
        lower.includes("habari") ||
        lower.includes("mambo") 
    ) {
        return isEnglish
            ? "Hello 👋, how can I help you today?"
            : "Habari 👋, naweza kukusaidia vipi leo?";
    }

    // Price
    if (lower.includes("price") || lower.includes("bei")) {
        return isEnglish
            ? "Our prices depend on the service. Please tell me which service you need."
            : "Bei zetu zinategemea huduma. Tafadhali taja huduma unayohitaji.";
    }

    // Services
    if (
        lower.includes("services") ||
        lower.includes("huduma") ||
        lower.includes("service")
    ) {
        return isEnglish
            ? "We offer services like: certificates, website design, graphics, business support and more."
            : "Tunatoa huduma kama: vyeti, websites, graphics, usajili wa biashara na nyinginezo.";
    }

    // Location
    if (
        lower.includes("location") ||
        lower.includes("ulipo") ||
        lower.includes("wapi")
    ) {
        return isEnglish
            ? "We are located in Tanzania. Contact us for exact directions."
            : "Tupo Tanzania. Wasiliana nasi kwa maelekezo kamili.";
    }

    // Default reply
    return isEnglish
        ? "Thank you for your message 😊. How can I assist you?"
        : "Asante kwa ujumbe wako 😊. Nakusaidiaje?";
}
