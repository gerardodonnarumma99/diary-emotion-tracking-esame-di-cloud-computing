import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics";
import { TEXT_ANALYSIS_KEY, TEXT_ANALYSIS_URL } from "../constant";

const client = new TextAnalyticsClient(TEXT_ANALYSIS_URL, new AzureKeyCredential(TEXT_ANALYSIS_KEY));

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

export {
    getAnalyzeSentimentOneText
}