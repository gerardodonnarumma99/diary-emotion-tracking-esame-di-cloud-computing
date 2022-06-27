const { CosmosClient } = require("@azure/cosmos");
const endpoint = process.env["COSMODB_ENDPOINT"];
const key = process.env["COSMODB_KEY"];
const clientDB = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
    const { confirmCode, chatId } = req.body;

    if(!confirmCode) {
        return context.res = {
            body: {
                status: 400,
                message: "Param confirmCode is required!"
            }
        };
    }

    if(!chatId) {
        return context.res = {
            body: {
                status: 400,
                message: "Param chatId is required!"
            }
        };
    }

    try {
        // creating doc
        const { database } = await clientDB.databases.createIfNotExists({ id: "diary_emotion_db" });

        const { container } = await database.containers.createIfNotExists({ id: "user" });

        const { resources } = await container.items
            .query({
                query: "SELECT * from c WHERE c.confirmTelegramCode = @confirmCode",
                parameters: [{ name: "@confirmCode", value:  confirmCode}]
            })
            .fetchAll();

        if(!Array.isArray(resources) || resources.length !== 1) {
            return context.res = {
                body: {
                    status: 401,
                    message: "User not registered!"
                }
            };
        }

        const user = {
            ...resources[0],
            //confirmTelegramCode: null,
            activeTelegramAccount: true,
            chatIdTelegram: chatId
        }

        const { resource: updatedItem } = await container.item(resources[0].id, resources[0].id).replace(user);

        if(!updatedItem) {
            throw new Error("Error while updating!");
        }

        // saving doc
        context.done();

        return context.res = {
            body: {
                status: 200,
                body: updatedItem
            }
        };

    } catch(error) {
        context.res = {
            body: {
                status: 400,
                message: error.message
            }
        };
    }
};