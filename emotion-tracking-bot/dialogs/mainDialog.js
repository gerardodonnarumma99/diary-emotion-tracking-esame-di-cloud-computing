// eslint-disable-next-line no-unused-vars
const { ChoicePrompt, ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { GetDiaryPageDialog } = require('./getDiaryPageDialog');
const { DeleteDiaryPageDialog } = require('./deleteDiaryPage');
const { getUserByToken } = require('../request/userRequest');
const { AddDiaryPageDialog } = require('./addDiaryPageDialog');
const MAIN_DIALOG = 'MAIN_DIALOG';
const ADD_PAGE_DIALOG = 'ADD_PAGE_DIALOG';
const GET_PAGE_DIALOG = 'GET_PAGE_DIALOG';
const DELETE_PAGE_DIALOG = 'DELETE_PAGE_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY';

class MainDialog extends ComponentDialog {
    constructor(id, userState) {
        super(id);

        this.userState = userState;
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

        this.addDialog(new ChoicePrompt('cardPrompt'))
            .addDialog(new AddDiaryPageDialog(ADD_PAGE_DIALOG, userState, this.userProfileAccessor))
            .addDialog(new GetDiaryPageDialog(GET_PAGE_DIALOG, userState, this.userProfileAccessor))
            .addDialog(new DeleteDiaryPageDialog(DELETE_PAGE_DIALOG, userState, this.userProfileAccessor))
            .addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.stepUserAuth.bind(this),
                this.confirmUser.bind(this),
                this.initialStep.bind(this),
                this.invokeStep.bind(this),
                this.finalStep.bind(this)
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
        const userProfile = await this.userProfileAccessor.get(turnContext, {});
        this.userProfile = userProfile;

        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async stepUserAuth(stepContext) {
        if(this.userProfile.id && this.userProfile.email) {
            stepContext.values.userVerify = true;
            return await stepContext.next();
        } else {
            stepContext.values.userVerify = false;
            return await stepContext.prompt(TEXT_PROMPT, 'Inserisci il token del tuo account utente');
        }
    }

    async confirmUser(stepContext) {
        if(stepContext.values.userVerify) {
            return await stepContext.next();
        }

        const confirmToken = stepContext.result;

        try {
            const result = await getUserByToken(confirmToken, stepContext.context.activity.from.id);

            if(result && result?.status === 200 && result.data && result.data.body) {
                const user = {...result.data.body};

                this.userProfile.id = user.id;
                this.userProfile.email = user.email;
                this.userProfile.name = user.name;
                this.userProfile.surname = user.surname;

                await stepContext.context.sendActivity("Account confermato! Puoi iniziare ad utilizzare il bot.");
                return await stepContext.next();
            } else {
                await stepContext.context.sendActivity("Non esiste nessun utente con il codice inserito!");
            }

            return await stepContext.endDialog(stepContext.result);
        } catch(e) {
            console.log('errore: '+e.message)
            await stepContext.context.sendActivity("Non è stato possibile recuperare il codice di conferma dell'account!");
            return await stepContext.endDialog(stepContext.result);
        }
    }

    async initialStep(stepContext) {
        const options = {
            prompt: 'Cosa vuoi fare?',
            choices: this.getChoices()
        };
        return await stepContext.prompt('cardPrompt', options);
    }

    async invokeStep(stepContext) {
        var result = stepContext.result.value;
        if(result.toLowerCase() === 'aggiungi pagina') {
            return await stepContext.beginDialog(ADD_PAGE_DIALOG, this.userState);
        } else if(result.toLowerCase() === 'visualizza tutte le pagine') {
            return await stepContext.beginDialog(GET_PAGE_DIALOG, this.userState);
        } else if(result.toLowerCase() === 'elimina una pagina') {
            return await stepContext.beginDialog(DELETE_PAGE_DIALOG, this.userState);
        }
    }

    async finalStep(stepContext) {
        return await stepContext.endDialog();
    }

    getChoices() {
        var cardOptions;
        cardOptions = [
            {
                value: 'test',
                synonyms: ['test', '/test']
            },
            {
                value: 'Aggiungi pagina',
                synonyms: ['addPage', '/addPage']
            },
            {
                value: 'Visualizza tutte le pagine',
                synonyms: ['getAllPage', '/getAllPage']
            },
            {
                value: 'Elimina una pagina',
                synonyms: ['deletePage', '/deletePage']
            }
        ];
        
        return cardOptions;
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;