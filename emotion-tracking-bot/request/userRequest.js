const axios = require('axios');

const API_KEY = process.env.APP_KEY_FUNCTIONS;
const URL_API = process.env.APP_ENDPONT_FUNCTIONS;

const diaryApiAxios = axios.create({
    baseURL: URL_API,
    headers: {
        //"Ocp-Apim-Subscription-Key": API_KEY, //Per API Manager
        "x-functions-key": API_KEY
    }
});

const getUserByToken = async (confirmCode, chatId) => {
    if(!confirmCode) {
        throw new Error("The confirm token is required!");
    }

    if(!chatId) {
        throw new Error("The id chat is required!");
    }

    const result = await diaryApiAxios.post(`${URL_API}/UserVerifyTokenTelegram`, {
        confirmCode: confirmCode,
        chatId: chatId
    })

    return result;
}

module.exports = {
    getUserByToken
}