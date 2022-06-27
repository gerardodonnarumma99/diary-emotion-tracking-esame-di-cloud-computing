const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const client = new TextAnalyticsClient(
    process.env.TEXT_ANALYSIS_URL, 
    new AzureKeyCredential(process.env.TEXT_ANALYSIS_KEY)
);

/*const documents = [
    { id: "1", language: "it", text: "Sono contentissimooo oggi è una giornata stupenda." }
]
  
async function main() {
    const results = await client.analyzeSentiment(documents);

    for (const result of results) {
        if (result.error === undefined) {
            
            
            
        } else {
            console.error("Encountered an error:", result.error);
        }
    }
}*/

const getAnalyzeSentimentOneText = async (text, language = "it") => {
    const documents = [
        { id: "1", language: language, text: text }
    ]

    const results = await client.analyzeSentiment(documents);

    if(results && results[0]) {
        return results[0];
    }

    return null;
}

module.exports = {
    getAnalyzeSentimentOneText
}