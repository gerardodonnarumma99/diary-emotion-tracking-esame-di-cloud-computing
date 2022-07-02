const {
    ChoicePrompt,
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { getAllDiaryPage } = require('../request/diaryRequest');
const { PageDiary } = require('../utils/PageDiary');
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class GetDiaryPageDialog extends ComponentDialog {
    constructor(id, userState, userProfileAccessor) {
        super("GET_PAGE_DIALOG")
        this.userProfileAccessor = userProfileAccessor;

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.getAllPage.bind(this)
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

    async getAllPage(step) {
        const userProfile = await this.userProfileAccessor.get(step.context);

        if(!userProfile || !userProfile.id) {
            await step.context.sendActivity(`Non è stato possibile recuperare i dati dell'utente`);
            return await step.endDialog(step.result);
        }

        try {
            const response = await getAllDiaryPage(userProfile.id);

            if(response && response.data && response.data.length > 0) {
                for(const page of response.data) {
                    const pageObject = new PageDiary(page.id, page.text, page.sentiment, page.confidence_score, page.creation_date);

                    await step.context.sendActivity(`${pageObject.toString()}`);
                }
            } else {
                await step.context.sendActivity(`Non è presente alcuna pagina di diario!`);
            }
        } catch(error) {
            await step.context.sendActivity(`Errore da parte del server: ${error.message}`);
        } finally {
            await step.context.sendActivity(`Scrivi qualcosa per continuare ad utilizzare il Bot.`);
        }

        return await step.endDialog(step.result);
    }
}

module.exports.GetDiaryPageDialog = GetDiaryPageDialog;