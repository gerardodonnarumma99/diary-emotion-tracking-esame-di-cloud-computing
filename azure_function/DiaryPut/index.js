const { CosmosClient } = require("@azure/cosmos");
const endpoint = process.env["COSMODB_ENDPOINT"];
const key = process.env["COSMODB_KEY"];
const clientDB = new CosmosClient({ endpoint, key });


module.exports = async function (context, req) {
    const { id, text, sentiment, confidenceScore, userId } = req.body;

    const diaryUpsert = {
        id: id,
        text: text,
        sentiment: sentiment,
        confidence_score: confidenceScore,
        user_id: userId
    }
   
    try {
        //CosmosDB
        const { database } = await clientDB.databases.createIfNotExists({ id: "diary_emotion_db" });
    
        const { container } = await database.containers.createIfNotExists({ id: "diary" });

        const { resource: updatedItem } = await container.item(id, id).replace(diaryUpsert);

        return context.res = {
            status: 200, 
            body: updatedItem
        };

    } catch(error) {
        return context.res = {
            status: 400,
            body: error
        }
    }

}