// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes, ActivityHandler } = require('botbuilder');

class MyBot extends ActivityHandler {
    constructor() {
        super();
    }
  
    async run(turnContext) {
        //const text = turnContext.activity.text;

        
        /*if(text.toLowerCase() === "test1") {
            turnContext.sendActivity("Test 1");
        }*/
    }
}

module.exports.MyBot = MyBot;
