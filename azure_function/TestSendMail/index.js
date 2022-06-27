module.exports = async function (context, req) {
    var message = {
        "personalizations": [ { "to": [ { "email": "sample@sample.com" } ] } ],
        from: { email: "gerardodonnarumma99@gmail.com" },
        subject: "Azure news",
        content: [{
            type: 'text/plain',
            value: input
        }]
    };

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: message
    };
}