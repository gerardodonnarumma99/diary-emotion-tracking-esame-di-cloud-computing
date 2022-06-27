const moment = require('moment');
const { CosmosClient } = require("@azure/cosmos");
const endpoint = process.env["COSMODB_ENDPOINT"];
const key = process.env["COSMODB_KEY"];
const clientDB = new CosmosClient({ endpoint, key });


module.exports = async function (context, req) {

    const { datePage, userId } = req.query;

    if(!datePage) {
        context.res = {
            status: 400, 
            body: "The datePage is required!"
        };

        context.done();
    }

    if(!userId) {
        context.res = {
            status: 400, 
            body: "The userId is required!"
        };

        context.done();
    }

    if(!moment(datePage, "YYYY-MM-DD").isValid()) {
        context.res = {
            status: 400, 
            body: "The datePage is not valid!"
        };

        context.done();
    }
   
    try {
        //CosmosDB
        const { database } = await clientDB.databases.createIfNotExists({ id: "diary_emotion_db" });
    
        const { container } = await database.containers.createIfNotExists({ id: "diary" });
        
        const { resources } = await container.items
            .query({
                query: "SELECT * from c WHERE SUBSTRING(c.creation_date, 0, 10) = @datePage AND c.user_id = @userId",
                parameters: [
                    { name: "@datePage", value:  datePage},
                    { name: "@userId", value:  userId}
                ]
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