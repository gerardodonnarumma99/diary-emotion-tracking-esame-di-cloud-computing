const { CosmosClient } = require("@azure/cosmos");
const endpoint = process.env["COSMODB_ENDPOINT"];
const key = process.env["COSMODB_KEY"];
const clientDB = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
    const { id } = req.query;

    if(!id) {
        context.res = {
            status: 400, 
            body: "The id is required!"
        };

        context.done();
    }

    try {
        const { database } = await clientDB.databases.createIfNotExists({ id: "diary_emotion_db" });
    
        const { container } = await database.containers.createIfNotExists({ id: "diary" });
        
        const { resource } = await container.item(id, id).delete();

        context.res = {
            status: 200, 
            body: null
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