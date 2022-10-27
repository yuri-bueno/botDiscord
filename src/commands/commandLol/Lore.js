const Discord = require('discord.js')
const axios = require("axios")



module.exports = {
    name: 'lore',
    aliases: ['lores'],
    run: async (client, message, args) => {

        campeao = message.content
        campeao = campeao.split(' ')

        if (!campeao[1]) return


        campeao = campeao[1] + (campeao[2] ? campeao[2][0].toUpperCase() + campeao[2].slice(1) : '');
        campeao = campeao[0].toUpperCase() + campeao.slice(1)
        console.log(campeao);

        const lore = await axios.get(`https://ddragon.leagueoflegends.com/cdn/12.19.1/data/pt_BR/champion/${campeao}.json`)
            .then(resp => {
                return resp.data.data[campeao].lore
            }).catch((err) => { dontFound() })





        let embed = {

            title: `Historia do(a) ${campeao}:`,
            author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL(),
                url: '',
            },
            description: lore,
            thumbnail: {
                url: `http://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/${campeao}.png`,
            },
            image: {
                url: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${campeao}_0.jpg`,
            },

            timestamp: new Date().toISOString(),
            footer: {
                text: 'yurizinho produções',
                icon_url: client.user.displayAvatarURL(),
            },
        };



        message.channel.send({ embeds: [embed] })


        function dontFound() {
            let embed2 = new Discord.EmbedBuilder()
                .setColor(0xFF0000)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(`campeão não encontrado`)
            message.channel.send({ embeds: [embed2] })
        }
    }
}