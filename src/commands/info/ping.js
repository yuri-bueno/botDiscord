const Discord = require('discord.js')

module.exports = {
    name: 'ping',
    aliases: ['ping'],
    run: async (client, message, args) => {

        //  console.log(message);
        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription(`🏓Olá ${message.author}, seu ping está em: \`carregando...\``)

        let embed2 = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription(`🏓Olá ${message.author}, seu ping está em: \`${client.ws.ping}ms\``)


        message.channel.send({ embeds: [embed] }).then(msg => {
            console.log(msg)
            setTimeout(() => {
                msg.edit({ embeds: [embed2] })
            }, 300);
        })
    }
}