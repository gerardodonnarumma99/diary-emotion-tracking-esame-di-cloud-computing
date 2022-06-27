const {
    AttachmentPrompt,
    ChoicePrompt,
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { saveDiaryPage } = require('../request/diaryRequest');
const { getSpeechText } = require('../request/speetchTextRequest');
const { default: axios } = require('axios');
const fs = require('fs');
const path = require('path');
const appRoot = require('app-root-path');
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const ADD_PAGE_PROMPT = 'ADD_PAGE_PROMPT';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';

class AddDiaryPageSpeechRecognizer extends ComponentDialog {
    constructor(id, userState, userProfile) {
        super("ADD_PAGE_DIALOG_TO_SPEECH_RECOGNIZER")
        this.userProfileAccessor = userProfile;
        
        this.addDialog(new TextPrompt(ADD_PAGE_PROMPT, this.addPagePromptValidator));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.audioMessage.bind(this),
            this.receiveAudio.bind(this),
            this.addPageToSpechText.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async audioMessage(step) {
        return await step.prompt(ATTACHMENT_PROMPT, "Carica il file con estensione .wav");
    }

    async receiveAudio(step) {
        await step.context.sendActivity(step);
        const urlFile = step.result[0].contentUrl;

        if(!urlFile) {
            await step.context.sendActivity(`Carica un file audio valido`);
            return await step.endDialog(step.result);
        }

        if(path.extname(step.result[0].name) !== '.wav') {
            await step.context.sendActivity(`L'audio deve avere estensione .wav`);
            return await step.endDialog(step.result);
        }

        try {
            let fileResponse = await axios.get(urlFile, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'audio/wav'
                }      
            });

            await fs.promises.writeFile(`${appRoot}/fileUpload/${step.result[0].name}`, fileResponse.data);
            let speechText = null;

            const responseSpeech = await getSpeechText(fs.readFileSync(`${appRoot}/fileUpload/prova_audio.wav`));
            if(responseSpeech?.data?.DisplayText) {
                speechText = responseSpeech.data.DisplayText;
            }

            if(speechText.trim().length < 3) {
                await step.context.sendActivity(`Il testo deve contenere almeno 3 caratteri`);
                return await step.endDialog(step.result);
            }

            step.values.speechText = speechText;
            return await step.next();
        } catch(error) {
            await step.context.sendActivity(`Errore da parte del server: ${error.message}`);
        } finally {
            fs.unlinkSync(`${appRoot}/fileUpload/${step.result[0].name}`)
            return await step.endDialog(step.result);
        }
    }

    async addPageToSpechText(step) {
        const text = step.values.speechText;
        const userProfile = await this.userProfileAccessor.get(step.context);

        if(!userProfile || !userProfile.id) {
            await step.context.sendActivity(`Non è stato possibile recuperare i dati dell'utente`);
            return await step.endDialog(step.result);
        }

        if(text.trim().length < 3) {
            await step.context.sendActivity(`Il testo deve contenere almeno 3 caratteri`);
            return await step.endDialog(step.result);
        }

        try {
            await saveDiaryPage({
                text: text,
                sentiment: 'positive',
                confidenceScore: {
                    positive: 1,
                    negative: 0,
                    neutral: 0
                },
                userId: userProfile.id
            })

            await step.context.sendActivity(`La pagina con testo *${text}* è stata aggiunta con successo!`);
        } catch(error) {
            console.log(error);
            await step.context.sendActivity(`Errore da parte del server: ${error.message}`);
        }

        return await step.endDialog(step.result);
    }
}

module.exports.AddDiaryPageSpeechRecognizer = AddDiaryPageSpeechRecognizer;