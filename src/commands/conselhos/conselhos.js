const axios = require("axios")
const Discord = require('discord.js')

module.exports = {
    name: 'conselhos',
    aliases: ['conselho'],
    run: async (client, message, args) => {



        const conselho = await axios.get("https://api.adviceslip.com/advice").then(resp => {
            return resp.data.slip.advice
        }).catch(e => {
            message.reply({ content: 'Sem conselhos por hoje :(' })
        })

        const conselhosTraduzido = await axios.get(`https://api.mymemory.translated.net/get?q=${conselho}&langpair=en|pt-BR`).then(resp => {
            return resp.data.responseData.translatedText

        }).catch(e => {
            message.reply({ content: 'Sem conselhos por hoje :[' })
        })


        message.reply({ content: conselhosTraduzido })
    }
}