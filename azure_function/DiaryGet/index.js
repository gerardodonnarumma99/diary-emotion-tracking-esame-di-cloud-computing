const { CosmosClient } = require("@azure/cosmos");
const endpoint = process.env["COSMODB_ENDPOINT"];
const key = process.env["COSMODB_KEY"];
const clientDB = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
    const { user_id } = req.query;

    if(!user_id) {
        context.res = {
            status: 400, 
            body: "The user_id is required!"
        };

        context.done();
    }
   
    try {
        //CosmosDB
        const { database } = await clientDB.databases.createIfNotExists({ id: "diary_emotion_db" });
    
        const { container } = await database.containers.createIfNotExists({ id: "diary" });

        
        const { resources } = await container.items
            .query({
                query: "SELECT * from c WHERE c.user_id = @user_id",
                parameters: [{ name: "@user_id", value:  user_id}]
            })
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