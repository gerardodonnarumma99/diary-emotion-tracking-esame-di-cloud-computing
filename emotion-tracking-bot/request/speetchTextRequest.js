const axios = require('axios');
const fs = require('fs');
const path = require('path');

const speechTextApiTokenAxios = axios.create({
    baseURL: process.env.SPEECH_SERVICE_URL_TOKEN,
    headers: {
        "Ocp-Apim-Subscription-Key": process.env.SPEECH_SERVICE_KEY
    }
});

const getSpeechText = async (file) => {

    try {
        const responseSpeechToken = await getTokenSpeechText();

        const responseSpeechText = await axios.post(process.env.SPEECH_SERVICE_URL_CONVERSATION_IT, 
        file,
        {
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.SPEECH_SERVICE_KEY,
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

module.exports = {
    getSpeechText
}