const {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { deleteDiaryPage } = require('../request/diaryRequest');
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const DELETE_PAGE_PROMPT = 'DELETE_PAGE_PROMPT';

class DeleteDiaryPageDialog extends ComponentDialog {
    constructor(id, userState) {
        super("DELETE_PAGE_DIALOG")
        this.addDialog(new TextPrompt(DELETE_PAGE_PROMPT, this.idPagePromptValidator));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.writeIdDeletePage.bind(this),
            this.confirmDeletePage.bind(this),
            this.deletePageResult.bind(this)
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

    async writeIdDeletePage(step) {
        const promptOptions = { 
            prompt: `Inserisci l'ID della pagina da eliminare`, 
            retryPrompt: "L'ID non può essere vuoto" 
        };
        return await step.prompt(DELETE_PAGE_PROMPT, promptOptions);
    }

    async idPagePromptValidator(promptContext) {
        const text = promptContext.recognized.value;

        if(text.trim() === "" || text.trim().length < 3) {
            return false;
        }

        return true;
    }

    async confirmDeletePage(step) {
        step.values["idPage"] = step.result;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: `Sei sicuro di voler cancellare la pagina? L'operazione è irreversibile!`,
            choices: ChoiceFactory.toChoices(['Sì', 'No'])
        });
    }

    async deletePageResult(step) {
        const result = step.result.value;
        const idPage = step.values.idPage;

        if(result.toLowerCase() === 'sì') {
            try {
                const response = await deleteDiaryPage(idPage);
    
                if(response?.data?.status === 400) {
                    await step.context.sendActivity(`Non esiste nessuna pagina con ID ${idPage}`);
                } else {
                    await step.context.sendActivity('La pagina è stata eliminata con successo!');
                }
            } catch(error) {
                await step.context.sendActivity(`Errore da parte del server: ${error.message}`);
            } finally {
                return await step.endDialog(step.result);
            }
        } else if(result.toLowerCase() === 'no') {
            return await step.endDialog(step.result);
        }
    }
}

module.exports.DeleteDiaryPageDialog = DeleteDiaryPageDialog;