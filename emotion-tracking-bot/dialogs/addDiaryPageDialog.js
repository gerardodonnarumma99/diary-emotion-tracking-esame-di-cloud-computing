const {
    // eslint-disable-next-line no-unused-vars
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
const axios = require('axios');
const { getAnalyzeSentimentOneText } = require('../utils/text_analysis');
const { PageDiary } = require('../utils/PageDiary');
const { getTextToOcrImage } = require('../request/visionOcrRequest');
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const ADD_PAGE_PROMPT = 'ADD_PAGE_PROMPT';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const TEXT_ADD_PAGE = "Voglio scrivere del testo"
const AUDIO_ADD_PAGE = "Voglio inviare un audio da analizzare"
const IMAGE_ADD_PAGE = "Voglio inviare un'immagine da analizzare"

class AddDiaryPageDialog extends ComponentDialog {
    constructor(id, userState, userProfileAccessor) {
        super("ADD_PAGE_DIALOG")
        this.userProfileAccessor = userProfileAccessor;

        this.addDialog(new TextPrompt(ADD_PAGE_PROMPT, this.addPagePromptValidator));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.main.bind(this),
            this.switchQuestionStep.bind(this),
            this.confirmAddPageStep.bind(this),
            this.addPage.bind(this)
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

    async main(step) {
        return await step.prompt(CHOICE_PROMPT, {
            prompt: `Come vuoi scrivere la tua pagina?`,
            choices: ChoiceFactory.toChoices([
                TEXT_ADD_PAGE, 
                AUDIO_ADD_PAGE,
                IMAGE_ADD_PAGE
            ])
        });
    }

    async switchQuestionStep(step) {
        step.values.insertAudio = false;
        step.values.insertImage = false;

        if(step.result.value === TEXT_ADD_PAGE) {
            const promptOptions = { 
                prompt: 'Scrivi una pagina di diario', 
                retryPrompt: "Il testo deve contenere almeno 3 caratteri!" 
            };
            return await step.prompt(ADD_PAGE_PROMPT, promptOptions);
        } else if(step.result.value === AUDIO_ADD_PAGE) {
            step.values.insertAudio = true;
            return await step.prompt(ATTACHMENT_PROMPT, "Invia l'audio.")
        } else if(step.result.value === IMAGE_ADD_PAGE) {
            step.values.insertImage = true;
            return await step.prompt(ATTACHMENT_PROMPT, "Invia l'immagine.")
        }
    }

    async addPagePromptValidator(promptContext) {
        const text = promptContext.recognized.value;

        if(text.trim() === "" || text.trim().length < 3) {
            return false;
        }

        return true;
    }

    async confirmAddPageStep(step) {
        try {
            let text = null;
            if(step?.result && step.result[0] && step.result[0].contentUrl) {
                const urlFile = step.result[0].contentUrl;
                const typeFile = step.result[0].type;

                if(step.values.insertAudio) {
                    text = await this.speechToText(urlFile);
                    
                } else if(step.values.insertImage) {
                    text = await this.imageOcrToText(urlFile, typeFile)
                    
                }

                if(!text) {
                    await step.context.sendActivity(`Non è stato possibile recuperare il testo!`);
                    await step.endDialog();
                } else if(text.trim().length < 3) {
                    await step.context.sendActivity(`Il testo deve contenere almeno 3 caratteri!`);
                    await step.endDialog();
                }
            }

            if(!text) {
                text = step.result
            }
            
            const resultSentiment = await getAnalyzeSentimentOneText(text);

            if(!resultSentiment || !resultSentiment?.sentences[0]) {
                await step.context.sendActivity(`Non è stato possibile effettuare l'analisi del testo`);
                return await step.endDialog(text);
            }

            step.values.sentimentAnalisys = resultSentiment.sentences[0];
            step.values.text = text;

            const pageObject = new PageDiary(
                null,
                text, 
                resultSentiment.sentences[0].sentiment, 
                resultSentiment.sentences[0].confidenceScores, 
                null);

            await step.context.sendActivity(`*Resoconto*\n\n${pageObject.toString()}`);

            return await step.prompt(CHOICE_PROMPT, {
                prompt: `Sei sicuro di voler aggiungere la pagina?`,
                choices: ChoiceFactory.toChoices(['Sì', 'No'])
            });
        } catch(e) {
            console.log('Errore '+e)
            await step.context.sendActivity(`Errore da parte del server!`);
        }
    }

    async addPage(step) {
        if(!step.result.value || step.result.value === 'No') {
            await step.context.sendActivity(`L'aggiunta della pagina è stata annullata!`);
            return await step.endDialog(step.result);
        }

        const userProfile = await this.userProfileAccessor.get(step.context);

        if(!userProfile || !userProfile.id) {
            await step.context.sendActivity(`Non è stato possibile recuperare i dati dell'utente`);
            return await step.endDialog(step.result);
        }

        try {
            if(!step?.values?.sentimentAnalisys) {
                await step.context.sendActivity(`Non è stato possibile effettuare l'analisi del testo`);
                return await step.endDialog(text);
            }
            
            const sentimentAnalisys = step.values.sentimentAnalisys;

            await saveDiaryPage({
                text: step.values.text,
                sentiment: sentimentAnalisys.sentiment,
                confidenceScore: {
                    positive: sentimentAnalisys.confidenceScores.positive,
                    negative: sentimentAnalisys.confidenceScores.negative,
                    neutral: sentimentAnalisys.confidenceScores.neutral
                },
                userId: userProfile.id
            })

            await step.context.sendActivity('La pagina è stata aggiunta con successo!');
        } catch(e) {
            await step.context.sendActivity(`Errore da parte del server!`);
        } finally {
            await step.context.sendActivity(`Scrivi qualcosa per continuare ad utilizzare il Bot.`);
        }

        return await step.endDialog(step.result);
    }

    async speechToText(urlFile) {
        try {
            const fileResponse = await axios.get(urlFile, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'audio/wav'
                }      
            });
            
            const speechResult = await getSpeechText(fileResponse.data);

            if(speechResult && speechResult?.data?.DisplayText) {
                return speechResult.data.DisplayText;
            }

            return null;
        } catch(e) {
            throw new Error(e);
        }
    }

    async imageOcrToText(urlFile, typeFile) {
        try {
            const fileResponse = await axios.get(urlFile, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': `${typeFile}`
                }      
            });
            
            const text = await getTextToOcrImage(fileResponse.data);

            return text;
        } catch(e) {
            throw new Error(e);
        }
    }
}

module.exports.AddDiaryPageDialog = AddDiaryPageDialog;