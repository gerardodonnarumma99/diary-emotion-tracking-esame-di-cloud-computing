const { CosmosClient } = require("@azure/cosmos");
const moment = require("moment");
const axios = require("axios");
const endpoint = process.env["COSMODB_ENDPOINT"];
const key = process.env["COSMODB_KEY"];
const clientDB = new CosmosClient({ endpoint, key });
const TELEGRAM_BOT_TOKEN = process.env["TELEGRAM_BOT_TOKEN"];

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString(); //Ogni ora --> "0 0 * * * *"
                                              //Ogni 5 minuti --> "0 */5 * * * *"
    if (myTimer.isPastDue)                    // Oggni mezz'ora -->0 */30 * * * *
    {
        context.log('JavaScript is running late!');
        return;
    }

    try {
        const { database } = await clientDB.databases.createIfNotExists({ id: "diary_emotion_db" });
    
        const userContainer = await database.containers.createIfNotExists({ id: "user" });
        const diaryContainer = await database.containers.createIfNotExists({ id: "diary" });

        const usersFetch = await userContainer.container.items
            .query({
                query: "SELECT * from c"
            })
            .fetchAll();

        if(!usersFetch || !usersFetch.resources) {
            return context.done();
        }

        context.log(`users: ${usersFetch.resources}`)

        const now = moment().format("DD/MM/YYYY");
        const promises = [];

        for(const user of usersFetch.resources) {
            const diaryFetch = await diaryContainer.container.items
            .query({
                query: "SELECT * from c WHERE c.user_id = @user_id",
                parameters: [{ name: "@user_id", value:  user.id}]
            })
            .fetchAll();
            context.log(`diary: ${usersFetch.resources}`)

            let sendMessage = false;

            if(diaryFetch.resources.length === 0) {
                sendMessage = true;
            } else {
                const pageDiaryExist = diaryFetch.resources.some((diary) => (moment(now).isSame(
                    moment(diary.creation_date).format("DD/MM/YYYY")
                )));

                sendMessage = !pageDiaryExist;
            }

            context.log(`Send Message: ${sendMessage}`)
            context.log(`user.activeTelegramAccount: ${user.activeTelegramAccount}`)
            context.log(`user.chatIdTelegram: ${user.chatIdTelegram}`)
            context.log(`TOKEN: ${TELEGRAM_BOT_TOKEN}`)

            if(sendMessage && user.activeTelegramAccount && user.chatIdTelegram) {
                context.log(`Ci sto`)
                const message = `Ciao *${user.name}*, il tuo diario è triste! 
                    \nOggi non hai scritto nulla, ma puoi ancora rimediare. 
                    \nCorri subito a raccontare le tue giornate al *Diary Emotion Tracking* e lui solamente per te,
                    analizzarà i tuoi sentimenti, così potrai tenerne traccia e potrai migliorare la qualità della tua vita!`;

                const urlTelegram = "https://api.telegram.org/bot"+TELEGRAM_BOT_TOKEN+"/sendMessage";

                promises.push(axios.get(urlTelegram, { 
                    params: { 
                        chat_id: user.chatIdTelegram,
                        text: message
                    }
                }));
                context.log(`URL Telegram: ${urlTelegram}`);
            }
            //https://api.telegram.org/bot5227519048:AAGF4pQDGEFUglwq9Qw3So1KqBu3bQw_r_8/sendMessage?chat_id=813343256&text=ProvaGerry
        }

            promises.push(axios.get("https://api.telegram.org/bot5227519048:AAGF4pQDGEFUglwq9Qw3So1KqBu3bQw_r_8/sendMessage?chat_id=813343256&text=Mammt2"));
            axios.all(promises)
                .then(axios.spread((res) => context.log(`[RESPONSE API TELEGRAM]: ${res}`)));
    } catch(error) {
        context.log(`Error: ${error}`)
    }
};