const { CosmosClient } = require("@azure/cosmos");
const endpoint = process.env["COSMODB_ENDPOINT"];
const key = process.env["COSMODB_KEY"];
const clientDB = new CosmosClient({ endpoint, key });


module.exports = async function (context, req) {
   
    try {
        //CosmosDB
        const { database } = await clientDB.databases.createIfNotExists({ id: "diary_emotion_db" });
    
        const { container } = await database.containers.createIfNotExists({ id: "user" });

        
        const query = "SELECT * FROM c ";
        
        const { resources } = await container.items
            .query(query)
            .fetchAll();

        context.res = {
            status: 200, 
            body: resources
        };
    } catch(error) {
        context.res = {
            status: 400,
            body: error
        }
    }

}