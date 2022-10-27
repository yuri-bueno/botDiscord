const Discord = require('discord.js')
const axios = require("axios")



module.exports = {
    name: 'runa',
    aliases: ['runas'],
    run: async (client, message, args) => {

        campeao = message.content
        campeao = campeao.split(' ')

        if (!campeao[1]) return


        campeao = campeao[1] + (campeao[2] ? '-' + campeao[2] : '');
        console.log(campeao);

        let site = await axios.get(`https://rankedboost.com/league-of-legends/build/${campeao}/`).then(e => e.data)


        let items = site.match(/(https:\/\/img\.rankedboost\.com\/wp\-content\/plugins\/league\/assets\/runes\/[\wÀ-ú,\.^?~=\+\_/*\+'"-]*.png)/g)

        items = items.filter((este, i) => items.indexOf(este) === i);
        console.log(items);


        let embed1 = new Discord.EmbedBuilder().setImage(items[1])
        let embed2 = new Discord.EmbedBuilder().setImage(items[3])
        let embed3 = new Discord.EmbedBuilder().setImage(items[4])
        let embed4 = new Discord.EmbedBuilder().setImage(items[5])
        let embed5 = new Discord.EmbedBuilder().setImage(items[6])
        let embed6 = new Discord.EmbedBuilder().setImage(items[7])
        await message.channel.send({ embeds: [embed1, embed2, embed3, embed4, embed5, embed6] });
        return
    }
}