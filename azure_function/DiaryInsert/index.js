const moment = require('moment');

module.exports = function (context, req) {
    const { text, sentiment, confidenceScore, userId } = req.body;

    const diary = {
        text: text,
        sentiment: sentiment,
        confidence_score: confidenceScore,
        user_id: userId,
        creation_date: moment(new Date())
    }

    try {
        // creating doc
        context.bindings.diaryDocument = JSON.stringify(diary);

        // saving doc
        context.done();

        context.res = {
            body: {
                status: 201,
                message: "Page of diary added successfully!"
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