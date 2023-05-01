const Discord = require("discord.js");

class Utility {
    static createEmbedMessage(color, title, author, thumbnailLink, fields, image, body){
        const embedMessage = new Discord.EmbedBuilder()
        .setColor(color)
        // .setTitle(title)
        .setAuthor({name: author, iconURL: thumbnailLink});
        // .setThumbnail(thumbnailLink);
        fields.forEach(field => {
            embedMessage.addFields({name: field[0],value: field[1],inline: field[2]});
        });
        if(image != null) embedMessage.setImage(image);
        // if(body != null) embedMessage.setDescription(body);
        return embedMessage;
    }

    static createSimpleEmbedMessage(colour, title, textToDisplay, thumbnailLink){
        const embedMessage = new Discord.EmbedBuilder()
        .setColor(colour)
        // .setAuthor()
        .setDescription(textToDisplay);

        if(thumbnailLink != null) embedMessage.setAuthor({name: title, iconURL: thumbnailLink});

        return embedMessage;
    }

    static createTriviaEmbedMessage(question_number, a1, a2, a3, a4, question){
        //TODO REWORK THIS (CUZ IT'S UGLY)
        const embedMessage = new Discord.EmbedBuilder()
            .setColor('#ff0000')
            .setTitle("Question " + question_number)
            .setDescription(question)
            .addFields(
                { name: '\u200B', value: '1 - ' + a1, inline: true },
                { name: '\u200B', value: '2 - ' + a2, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '\u200B', value: '3 - ' + a3, inline: true },
                { name: '\u200B', value: '4 - ' + a4, inline: true },
            )
        return embedMessage;
    }

    static capitalizeFirstLetter(string){
        let mot = "";
        mot += string[0].toUpperCase();
        mot += string.slice(1);
        return mot;
    }

    static shuffleArray(array){
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    static randomNumberFromZero(max){
        return Math.floor(Math.random() * max) + 1;
    }

    static sleep(ms) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < ms);
    }
}

module.exports = Utility;