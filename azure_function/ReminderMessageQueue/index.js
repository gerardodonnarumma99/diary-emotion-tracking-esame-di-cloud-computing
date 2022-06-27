const { CosmosClient } = require("@azure/cosmos");
const moment = require("moment");
const axios = require("axios");
const endpoint = process.env["COSMODB_ENDPOINT"];
const key = process.env["COSMODB_KEY"];
const clientDB = new CosmosClient({ endpoint, key });
const TELEGRAM_BOT_TOKEN = process.env["TELEGRAM_BOT_TOKEN"];
const { ServiceBusClient } = require("@azure/service-bus");

// connection string to your Service Bus namespace
const connectionString = "Endpoint=sb://diaryemotiontrackingbus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=6dRbhbcJlzEnGG6Io9arwKjYaNgqjUnujTvAhyu4FhM=";

// name of the queue
const queueName = "reminderQueue";

const sendReminderMessage = async (chatIdTelegram) => {
    const urlTelegram = "https://api.telegram.org/bot"+TELEGRAM_BOT_TOKEN+"/sendMessage";
    axios.get(urlTelegram, { 
        params: { 
            chat_id: chatIdTelegram,
            text: "prova da coda"
        }
    })

    try {
        /*const { database } = await clientDB.databases.createIfNotExists({ id: "diary_emotion_db" });
    
        const userContainer = await database.containers.createIfNotExists({ id: "user" });
        const diaryContainer = await database.containers.createIfNotExists({ id: "diary" });

        const usersFetch = await userContainer.container.items
            .query({
                query: "SELECT * from c WHERE c.chatIdTelegram = @chatIdTelegram",
                parameters: [{ name: "@chatIdTelegram", value:  chatIdTelegram}]
            })
            .fetchAll();
            

        if(!usersFetch || !usersFetch.resources || !usersFetch.resources[0]) {
            return;
        }

        const diaryFetch = await diaryContainer.container.items
        .query({
            query: "SELECT * from c WHERE c.user_id = @user_id",
            parameters: [{ name: "@user_id", value:  usersFetch.resources[0].id}]
        })
        .fetchAll();

        let sendMessage = false;

        if(diaryFetch.resources.length === 0) {
            sendMessage = true;
        } else {
            const pageDiaryExist = diaryFetch.resources.some((diary) => (moment(now).isSame(
                moment(diary.creation_date).format("DD/MM/YYYY")
            )));

            sendMessage = !pageDiaryExist;
        }

        if(sendMessage && usersFetch.resources[0].activeTelegramAccount && usersFetch.resources[0].chatIdTelegram) {
            const message = `Ciao *${usersFetch.resources[0].name}*, il tuo diario è triste! 
                \nOggi non hai scritto nulla, ma puoi ancora rimediare. 
                \nCorri subito a raccontare le tue giornate al *Diary Emotion Tracking* e lui solamente per te,
                analizzarà i tuoi sentimenti, così potrai tenerne traccia e potrai migliorare la qualità della tua vita!`;

            const urlTelegram = "https://api.telegram.org/bot"+TELEGRAM_BOT_TOKEN+"/sendMessage";
            axios.get(urlTelegram, { 
                params: { 
                    chat_id: usersFetch.resources[0].chatIdTelegram,
                    text: message
                }
            })
        }

        return;*/
    } catch(error) {
       throw new Error(error.message);
    }
}

module.exports = async function (context, req) {
    const { reminder, telegramId } = req.body;

    if(!reminder || !telegramId) {
        return context.res = {
            status: 400, 
            body: "The params reminder and telegramId are required!"
        };
    }

    /*if(!moment(reminder).isValid()) {
        return context.res = {
            status: 400, 
            body: "The param reminder is not valid!"
        };
    }*/


    
    const scheduleDate = moment("18/06/2022 17:02:00");
    const sbClient = new ServiceBusClient(connectionString);

	// createSender() can also be used to create a sender for a topic.
	const sender = sbClient.createSender(queueName);

    const message = {
        body: '',
        customProperties: {
            userIdTelegram: telegramId
        },
        brokerProperties: {
            ScheduledEnqueueTimeUtc: moment.utc(scheduleDate).format()
        }
    };

    await sender.sendMessages(message, function(error){
        if(!error){
            
        }
        context.log('MESSAGGIO INVIATO')
        sendReminderMessage(message.customProperties.userIdTelegram)
    });
};