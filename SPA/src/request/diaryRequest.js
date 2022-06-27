import axios from 'axios';
import moment from 'moment';
import { API_KEY, URL_API } from '../constant';
import { getAnalyzeSentimentOneText } from '../utils/text_analysis';

const diaryApiAxios = axios.create({
    baseURL: URL_API,
    headers: {
        "x-functions-key": API_KEY
    }
});

const getAllDiaryPage = async (user_id = null) => {
    const response = await diaryApiAxios.get(`/diaryget?user_id=${user_id}`)

    return response.data;
}

const getDiaryById = async (id = null) => {
    const response = await diaryApiAxios.get(`/diarybyidget?id=${id}`)

    return response.data;
}

const saveDiaryPage = async (text, userId) => {
    const responseAnalyze = await getAnalyzeSentimentOneText(text);

    if(!responseAnalyze?.sentences || !responseAnalyze?.sentences[0]) {
        return false;
    }

    const sentimentAnalysis = responseAnalyze.sentences[0];

    const response = await diaryApiAxios.post(`${URL_API}/diaryinsert`, {
        text: text,
        sentiment: sentimentAnalysis.sentiment,
        confidenceScore: {
            positive: sentimentAnalysis.confidenceScores.positive,
            negative: sentimentAnalysis.confidenceScores.negative,
            neutral: sentimentAnalysis.confidenceScores.neutral
        },
        userId: userId
    });

    if(response.status === 200) {
        return true;
    }

    return false;
}

const updateDiaryPage = async (id, text, userId) => {
    const responseAnalyze = await getAnalyzeSentimentOneText(text);

    if(!responseAnalyze?.sentences || !responseAnalyze?.sentences[0]) {
        return false;
    }

    const sentimentAnalysis = responseAnalyze.sentences[0];

    const response = await diaryApiAxios.post(`${URL_API}/diaryput`, {
        id: id,
        text: text,
        sentiment: sentimentAnalysis.sentiment,
        confidenceScore: {
            positive: sentimentAnalysis.confidenceScores.positive,
            negative: sentimentAnalysis.confidenceScores.negative,
            neutral: sentimentAnalysis.confidenceScores.neutral
        },
        userId: userId
    });

    return response.data;
}

const deleteDiaryPage = async (id = null) => {
    const response = await diaryApiAxios.get(`/diarydelete?id=${id}`)

    return response.data;
}

const getDiaryPageByDate = async (date, userId) => {
    if(!date || !moment(date).isValid() || !userId) {
        return null;
    }

    const response = await diaryApiAxios.get(`/diarybydateget?datePage=${moment(date).format('YYYY-MM-DD')}&userId=${userId}`)

    return response.data;
}

export {
    getAllDiaryPage,
    getDiaryById,
    saveDiaryPage,
    updateDiaryPage,
    deleteDiaryPage,
    getDiaryPageByDate
}