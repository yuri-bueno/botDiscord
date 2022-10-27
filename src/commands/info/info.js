const Discord = require('discord.js')

module.exports = {
    name: 'info',
    description: "faz algo ae",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, message) => {


        let dono = '198467016796012544'
        let membros = client.users.cache.size
        let servidores = client.guilds.cache.size
        let canais = client.channels.cache.size
        let bot = client.user.tag
        let botFoto = client.user.displayAvatarURL()


        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: client.user.username, iconURL: botFoto })
            .setFooter({ text: client.user.username, iconURL: botFoto })
            .setThumbnail(botFoto)
            .setTimestamp(new Date())
            .setDescription(`Olá ${interaction.author}, veja as minhas informações abaixo:\n\n> 🤖 Nome:\`${bot}\`.\n> 🤖 Dono:${client.users.cache.get(dono)}.
            \n> ⚙ Membros:\`${membros}\`.\n> ⚙ Servidores:\`${servidores}\`.\n> ⚙ Ping: \`${client.ws.ping}ms🟢\`.`)


        message.channel.send({ embeds: [embed] })
    }
}