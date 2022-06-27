const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const { v4: uuid } = require('uuid');
const { Blob } = require("buffer");

const key = "65cc3af18769427a85b5040f7d61aa04";
const endpoint = "https://diaryemotiontrackingvisoservice.cognitiveservices.azure.com/";

const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new Face.FaceClient(credentials, endpoint);

const image_base_url = "https://csdx.blob.core.windows.net/resources/Face/Images/";
const person_group_id = uuid();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function detectFaceRecognize(url) {
    // Detect faces from image URL. Since only recognizing, use the recognition model 4.
    // We use detection model 3 because we are only retrieving the qualityForRecognition attribute.
    // Result faces with quality for recognition lower than "medium" are filtered out.
    let detected_faces = await client.face.detectWithStream(new Blob([url], { type: "image/jpeg" }),
        {
            detectionModel: "detection_01",
            recognitionModel: "recognition_04",
            returnFaceAttributes: ["emotion"]
        });

    return detected_faces;
    //return detected_faces.filter(face => face.faceAttributes.qualityForRecognition == 'high' || face.faceAttributes.qualityForRecognition == 'medium');
}

module.exports = {
    detectFaceRecognize
}