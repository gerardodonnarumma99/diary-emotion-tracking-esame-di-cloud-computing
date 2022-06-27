const axios = require('axios');
const moment = require('moment');

const API_KEY = process.env.APP_KEY_FUNCTIONS;
const URL_API = process.env.APP_ENDPONT_FUNCTIONS;

const diaryApiAxios = axios.create({
    baseURL: URL_API,
    headers: {
        //"Ocp-Apim-Subscription-Key": API_KEY, //Per API Manager
        "x-functions-key": API_KEY
    }
});

const getAllDiaryPage = async (user_id = null) => {
    const response = await diaryApiAxios.get(`/diaryget?user_id=${user_id}`)

    return response;
}

const saveDiaryPage = async (diaryPage) => {
    const response = await diaryApiAxios.post(`${URL_API}/diaryinsert`, {
        text: diaryPage.text,
        sentiment: diaryPage.sentiment,
        confidenceScore: {
            positive: diaryPage.confidenceScore.positive,
            negative: diaryPage.confidenceScore.negative,
            neutral: diaryPage.confidenceScore.neutral
        },
        userId: diaryPage.userId
    });

    return response;
}

const deleteDiaryPage = async (id = null) => {
    const response = await diaryApiAxios.get(`/diarydelete?id=${id}`)

    return response;
}

module.exports = {
    getAllDiaryPage,
    saveDiaryPage,
    deleteDiaryPage
}