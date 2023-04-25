const Discord = require("discord.js");

class Utility {
    static createEmbedMessage(color, title, author, thumbnailLink, fields, image){
        const embedMessage = new Discord.EmbedBuilder()
        .setColor(color)
        .setAuthor({name: author, iconURL: thumbnailLink});
        fields.forEach(field => {
            embedMessage.addFields({name: field[0],value: field[1],inline: field[2]});
        });
        if(image != null) embedMessage.setImage(image);
        return embedMessage;
    }

    static createSimpleEmbedMessage(colour, title, textToDisplay, thumbnailLink){
        const embedMessage = new Discord.EmbedBuilder()
        .setColor(colour)
        .setAuthor({name: title, iconURL: thumbnailLink})
        .setDescription(textToDisplay);

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
}

module.exports = Utility;