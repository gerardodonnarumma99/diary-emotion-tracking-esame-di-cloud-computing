const axios = require('axios');

const OCR_URL = process.env.OCR_URL;
const OCR_KEY = process.env.OCR_KEY;

const ocrServiceAxios = axios.create({
    baseURL: OCR_URL,
    headers: {
        "Ocp-Apim-Subscription-Key": OCR_KEY,
        "Content-type": "application/octet-stream"
    }
});

const getTextToOcrImage = async(data) => {
    
    try {
        const response = await ocrServiceAxios.post("?language=it&detectOrientation=true", data)

        let globalText = "";
        

        if(response?.data?.regions) {
            response.data.regions.forEach((region) => {
                if(region.lines) {
                    region.lines.forEach((line) => {
                        
                        const lineText = line.words.map(w => w.text).join(' ');
                        if(lineText) {
                            globalText = `${globalText} ${lineText}`
                        }
                    })
                }
            })
        }

        return globalText;
    } catch(e) {
        throw new Error(e);
    }
}

module.exports = {
    getTextToOcrImage
}