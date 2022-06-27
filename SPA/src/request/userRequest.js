import axios from 'axios';
import { API_KEY, URL_API } from '../constant';

const diaryApiAxios = axios.create({
    baseURL: URL_API,
    headers: {
        "x-functions-key": API_KEY
    }
});

const getUserById = async (id = null) => {
    const response = await diaryApiAxios.get(`/SingleUserDataGet?id=${id}`)

    if(response?.data && response.data.length > 0) {
        return {
            id: response.data[0].id,
            email: response.data[0].email,
            name: response.data[0].name,
            surname: response.data[0].surname,
            confirmTelegramCode: response.data[0].confirmTelegramCode
        }
    }

    return null;
}

const saveUser = async (user) => {
    const response = await diaryApiAxios.post(`${URL_API}/UserInsert`, {
        id: user.id,
        email: user.mail,
        name: user.givenName,
        surname: user.surname
    });

    if(response?.data && response.data.length > 0) {
        return user;
    }

    return null;
}

export {
    getUserById,
    saveUser
}