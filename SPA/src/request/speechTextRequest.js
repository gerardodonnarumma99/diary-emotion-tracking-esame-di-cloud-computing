import axios from "axios"
import { SPEECH_TEXT_KEY, SPEECH_TEXT_URL_SERVICE, SPEECH_TEXT_URL_TOKEN } from "../constant";

const speechTextApiTokenAxios = axios.create({
    baseURL: SPEECH_TEXT_URL_TOKEN,
    headers: {
        "Ocp-Apim-Subscription-Key": SPEECH_TEXT_KEY
    }
});

const getSpeechText = async (file) => {

    try {
        const responseSpeechToken = await getTokenSpeechText();

        const responseSpeechText = await axios.post(SPEECH_TEXT_URL_SERVICE, 
        file,
        {
            headers: {
                "Ocp-Apim-Subscription-Key": SPEECH_TEXT_KEY,
                "Authorization": "Bearer "+responseSpeechToken.data,
                "Content-type": "audio/wav"
            }
        })

        return responseSpeechText;
    } catch(e) {
        throw new Error(e);
    }
}

const getTokenSpeechText = async () => {
    const responseSpeechToken = await speechTextApiTokenAxios.post("");

    return responseSpeechToken;
}

export {
    getSpeechText
}