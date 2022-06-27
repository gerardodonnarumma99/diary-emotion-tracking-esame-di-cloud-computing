const {
    AttachmentPrompt,
    ChoiceFactory,
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
const appRoot = require('app-root-path');
const { AddDiaryPageSpeechRecognizer } = require('./addDiaryPageSpeechRecognizer');
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const ADD_PAGE_PROMPT = 'ADD_PAGE_PROMPT';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';

class AddMainDiaryPageDialog extends ComponentDialog {
    constructor(id, userState, userProfile) {
        super("ADD_PAGE_DIALOG")
        this.addDialog(new TextPrompt(ADD_PAGE_PROMPT, this.addPagePromptValidator));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT));
        //this.addDialog(new AddDiaryPageDialogToText("ADD_PAGE_DIALOG_TO_TEXT", userState, userProfile));
        this.addDialog(new AddDiaryPageSpeechRecognizer("ADD_PAGE_DIALOG_TO_SPEECH_RECOGNIZER", userState, userProfile));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.questionStep.bind(this),
            this.switchQuestionStep.bind(this),
            //this.addPage.bind(this)
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

    async questionStep(step) {
        return await step.prompt(CHOICE_PROMPT, {
            prompt: `Vuoi scrivere la pagina di diario o caricare un file audio da analizzare?`,
            choices: ChoiceFactory.toChoices([
                'Voglio scrivere la pagina di diario', 
                'Voglio caricare un file audio'
            ])
        });
    }

    async switchQuestionStep(step) {
        if(step.result.value.toLowerCase() === "voglio scrivere la pagina di diario") {
            return await step.beginDialog("ADD_PAGE_DIALOG_TO_TEXT", this.userState);
        } else if(step.result.value.toLowerCase() === "voglio caricare un file audio") {
            return await step.beginDialog("ADD_PAGE_DIALOG_TO_SPEECH_RECOGNIZER", this.userState);
        }
    }

    async writeTextPage(step) {
        
        const promptOptions = { 
            prompt: 'Scrivi una pagina di diario', 
            retryPrompt: "Il testo deve contenere almeno 3 caratteri" 
        };
        return await step.prompt(ADD_PAGE_PROMPT, promptOptions);
    }

    async addPagePromptValidator(promptContext) {
        const text = promptContext.recognized.value;

        if(text.trim() === "" || text.trim().length < 3) {
            return false;
        }

        return true;
    }

    async addPage(step) {
        const result = await saveDiaryPage({
            text: step.result,
            sentiment: 'positive',
            confidenceScore: {
                positive: 1,
                negative: 0,
                neutral: 0
            },
            userId: step.context.activity.from.id
        })

        if(result) {
            await step.context.sendActivity('La pagina è stata aggiunta con successo!');
        } else {
            await step.context.sendActivity(`Errore da parte del server!`);
        }

        return await step.endDialog(step.result);
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

        if(path.extname(step.result[0].name)) {
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
    
            let speechText = null;
    
            fs.writeFile(`${appRoot}/fileUpload/${step.result[0].name}`, fileResponse.data, async function (err, file) {
                try {
                    const responseSpeech = await getSpeechText(fs.readFileSync(`${appRoot}/fileUpload/prova_audio.wav`));
                    if(responseSpeech?.data?.DisplayText) {
                        speechText = responseSpeech.data.DisplayText;
                    }
                } catch(error) {
                    await step.context.sendActivity(`Errore da parte del server: ${error.message}`);
                } finally {
                    fs.unlinkSync(`${appRoot}/fileUpload/${step.result[0].name}`)
                    return await step.endDialog(step.result);
                }
            });
        } catch(error) {
            await step.context.sendActivity(`Errore da parte del server: ${error.message}`);
        } finally {
            return await step.endDialog(step.result);
        }
    }
}

module.exports.AddMainDiaryPageDialog = AddMainDiaryPageDialog;