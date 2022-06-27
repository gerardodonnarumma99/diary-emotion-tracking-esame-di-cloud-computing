const moment = require('moment');
const jwt = require("jsonwebtoken");
const secret = process.env["SECRET_TELEGRAM_CODE"];

module.exports = function (context, req) {
    const { id, name, surname, email } = req.body;

    const token = jwt.sign({ email: email }, secret)

    const user = {
        id: id,
        name: name.trim(),
        surname: surname.trim(),
        email: email,
        isert_date: moment().format("DD/MM/YYYY hh:mm:ss"),
        confirmTelegramCode: token,
        activeTelegramAccount: false,
        chatIdTelegram: null
    }

    try {
        // creating doc
        context.bindings.userDocument = JSON.stringify(user);

        // saving doc
        context.done();

        context.res = {
            body: {
                status: 201,
                message: "User added successfully!"
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