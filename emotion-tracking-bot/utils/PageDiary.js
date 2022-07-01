const moment = require('moment');

class PageDiary {
    constructor(id, text, sentiment, confidenceScore, creationDate) {
        this.id = id;
        this.text = text;
        this.sentiment = sentiment;
        this.confidenceScore = confidenceScore;
        this.creationDate = creationDate;
    }

    toString() {
        const confidenceScore = new ConfidenceScore(
            this.confidenceScore.positive,
            this.confidenceScore.neutral,
            this.confidenceScore.negative);

        let icon = "";
        if(this.sentiment === 'positive') {
            icon = "😄";
        } else if(this.sentiment === 'negative') {
            icon = "😔";
        } else if(this.sentiment === 'neutral') {
            icon = "😐";
        }

        if(!this.id) {
            return `**TESTO** 📝: ${this.text}
            \n\n**SENTIMENTO** 🙈: ${icon ? icon : this.sentiment}
            \n\**PUNTEGGIO SENTIMENTO** 💯: ${confidenceScore.toString()}`;
        }

        return `**ID** 🔑: ${this.id}
        \n\n**TESTO** 📝: ${this.text}
        \n\n**SENTIMENTO** 🙈: ${icon ? icon : this.sentiment}
        \n\**PUNTEGGIO SENTIMENTO** 💯: ${confidenceScore.toString()}
        \n\n**DATA DI CREAZIONE** ⏰: ${moment(this.creationDate).isValid 
            ? moment(this.creationDate).format('DD/MM/YYYY HH:mm:ss') : ""}
        `;
    }
}

class ConfidenceScore {
    constructor(positive, neutral, negative) {
        this.positive = positive;
        this.neutral = neutral;
        this.negative = negative;
    }

    toString() {
        return `😄 ${this.positive} - 😐 ${this.neutral} - 😔 ${this.negative}`;
    }
}

module.exports.PageDiary = PageDiary;