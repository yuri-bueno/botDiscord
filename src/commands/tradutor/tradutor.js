const axios = require("axios")
const Discord = require('discord.js')

module.exports = {
    name: 'traduzir',
    aliases: ['tradutor'],
    run: async (client, message, args) => {





        let texto = message.content
        texto = texto.split('!traduzir ')

        if (!texto[1]) return
        console.log(texto[1]);

        const textoTraduzido = await axios.get(`https://api.mymemory.translated.net/get?q=${texto[1]}&langpair=en|pt-BR`).then(resp => {

            return resp.data.responseData.translatedText

        }).catch((e) => {


            console.error(e)
            message.reply({ content: "⚠⚠ Limite de traduções diarias atingido ⚠⚠" })
        })

        let embed = {

            title: `Texto traduzido:`,
            author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL(),
                url: '',
            },
            description: `\`\`\`${textoTraduzido}\`\`\``,
            thumbnail: {
                url: `https://upload.wikimedia.org/wikipedia/commons/1/14/Google_Translate_logo_%28old%29.png`,
            },


            timestamp: new Date().toISOString(),
            footer: {
                text: 'yurizinho produções',
                icon_url: client.user.displayAvatarURL(),
            },
        };

        message.reply({ embeds: [embed] })



    }
}