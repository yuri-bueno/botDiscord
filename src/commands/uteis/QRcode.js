const axios = require('axios')
const Discord = require('discord.js')

module.exports = {
    name: 'qrcode',
    description: "criarqrcode",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, message, args) => {

        if (!args) return

        let msg = message.content

        msg = msg.split('!qrcode ')
        msg = msg[1]

        console.log(args);

        let botFoto = client.user.displayAvatarURL()

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setTitle(`QrCode criado:`)
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setFooter({
                text: 'yurizinho produções',
                iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(new Date())
            .setImage(`https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=${msg}`)

        message.channel.send({ embeds: [embed] })
        //  message.delete()

    }
}