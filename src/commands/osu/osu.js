const axios = require('axios')
const Discord = require('discord.js')

module.exports = {
    name: 'osu',
    description: "osu",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, message, args) => {

        if (!args) return
        let nome = message.content

        nome = nome.split('!osu ')
        nome = nome[1]

        // const file = new AttachmentBuilder('');

        let id = await axios.get(`https://api.chimu.moe/v1/search?query=${nome}`).then(e => e.data.data[0].SetId)


        console.log(id);


        console.log(nome);


        let botFoto = client.user.displayAvatarURL()

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setTitle(`Link do mapa: ${nome}.`)
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setFooter({
                text: 'yurizinho produções',
                iconURL: client.user.displayAvatarURL(),
            })
            .setThumbnail(`https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Osu%21_Logo_2016.svg/800px-Osu%21_Logo_2016.svg.png`)
            .setTimestamp(new Date())
            .setURL(`https://api.chimu.moe/v1/download/${id}`)

        message.reply({ embeds: [embed] })

    }
}