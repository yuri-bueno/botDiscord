const axios = require('axios')
const Discord = require('discord.js')
const db = require('../../database/models/models')
const dbLocal = require('../../database/db_lol/db.json')
const skins = require('../commandLol/skins')

module.exports = {
    name: 'perfil',
    description: "perfil",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, message, args) => {



        let id = message.mentions.users.first()
        id = id?.id

        if (!id) id = message.author.id

        let serverDiscord = await db.guildsLolGame.findById(message.guild.id)



        let playerEncontrado = serverDiscord?.Players.find(Player => Player?.id == id)



        if (!playerEncontrado) {
            message.channel.send({ content: 'achou n' })
            return
        }

        let skins = await playerEncontrado.skins.map(element => element)

        let skinsDoPlayer = []

        skins.find(skinID => {//procura pra cada skin q o player tem

            dbLocal.find(campeao => {//procura por campeão

                campeao.skins.find(skins => {//procura na skins do campeao

                    if (skins.id == skinID) {
                        skinsDoPlayer.push({ nomeChamp: campeao.name, skinName: skins.name, skinNumber: skins.num, skinId: skins.id })
                        return
                    }

                })
            })

        });





        let horarioAtual = Date.now()

        let horarioDeltaRolls = horarioAtual - playerEncontrado.rollsTime
        let horarioDeltaGets = horarioAtual - playerEncontrado.getsTime

        let girosDisponiveis = 0
        let getsDisponiveis = 0

        for (horarioDeltaRolls; horarioDeltaRolls > 1000 * 60 * 20; girosDisponiveis++) {

            horarioDeltaRolls -= 1000 * 60 * 20

        }
        for (horarioDeltaGets; horarioDeltaGets > 1000 * 60 * 20; getsDisponiveis++) {

            horarioDeltaGets -= 1000 * 60 * 60

        }
        switch (playerEncontrado.tier) {
            case 0:
                for (playerEncontrado.rolls; girosDisponiveis > 0 && playerEncontrado.rolls < 5; playerEncontrado.rolls++) {

                    girosDisponiveis--
                }
                for (playerEncontrado.gets; getsDisponiveis > 0 && playerEncontrado.gets < 1; playerEncontrado.gets++) {

                    getsDisponiveis--
                }
                break;

            default:
                for (playerEncontrado.rolls; girosDisponiveis > 0 && playerEncontrado.rolls < 5; playerEncontrado.rolls++) {

                    girosDisponiveis--
                }
                for (playerEncontrado.gets; getsDisponiveis > 0 && playerEncontrado.gets < 1; playerEncontrado.gets++) {

                    getsDisponiveis--
                }
                break;
        }














        let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: message.guild.members.resolve(id).user.username, iconURL: message.guild.members.resolve(id).user.avatarURL() })
            .setThumbnail(message.guild.members.resolve(id).user.avatarURL())
            .setTitle(`Perfil de ${message.guild.members.resolve(id).user.username}`)
            .setDescription(`Veja as minhas informações abaixo:\n
            > 🙍‍♂️ Nome:\`${message.guild.members.resolve(id).user.username}\`. 
            > 💰 Dinheiro: \`${playerEncontrado.dinheiro}\`
            > 🛡 Tier: \`${'Ferro'}\`
            
            > 🔄 Rolls: \`${playerEncontrado.rolls}\`
            > 📥 Gets: \`${playerEncontrado.gets}\`
            > 🎎 Total de skins: \`${skinsDoPlayer?.length}\`.

            **Skin: ${skinsDoPlayer[0]?.skinName != "default" ? skinsDoPlayer[0]?.skinName : skinsDoPlayer[0]?.nomeChamp}**`)
            .setImage(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${skinsDoPlayer[0]?.nomeChamp}_${skinsDoPlayer[0]?.skinNumber}.jpg`)




        const actionRow = new Discord.ActionRowBuilder()
            .addComponents(
                [
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel('<<<')
                        .setCustomId('VOLTAR'),
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel('>>>')
                        .setCustomId('PROXIMO'),
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel('X')
                        .setCustomId('APAGAR')
                ]
            )
        const msg = await message.channel.send({ embeds: [embed], components: [actionRow] })

        const coletor = msg.createMessageComponentCollector({ time: (5 * 60 * 1000) })



        let skinSelecionadas = skinsDoPlayer
        let skinDaVez = 0

        coletor.on("collect", (c) => {

            switch (c.customId) {
                case 'VOLTAR':
                    if (skinSelecionadas.length == 1) {
                        return
                    }
                    skinDaVez--
                    if (skinDaVez == -1) { skinDaVez = skinSelecionadas.length - 1 }



                    break;
                case 'PROXIMO':

                    if (skinSelecionadas.length == 1) {
                        return
                    }

                    skinDaVez++
                    if (skinDaVez == skinSelecionadas.length) { skinDaVez = 0 }


                    break;
                case 'APAGAR':
                    c.deleteReply()

                    break;
            }

            let embedPerson = new Discord.EmbedBuilder()
                .setAuthor({ name: message.guild.members.resolve(id).user.username, iconURL: message.guild.members.resolve(id).user.avatarURL() })
                .setThumbnail(message.guild.members.resolve(id).user.avatarURL())
                .setTitle(`Perfil de ${message.guild.members.resolve(id).user.username}`)
                .setDescription(`Veja as minhas informações abaixo:\n
            > 🙍‍♂️ Nome:\`${message.guild.members.resolve(id).user.username}\`. 
            > 💰 Dinheiro: \`${playerEncontrado.dinheiro}\`
            > 🛡 Tier: \`${'Ferro'}\`
            
            > 🔄 Rolls: \`${playerEncontrado.rolls}\`
            > 📥 Gets: \`${playerEncontrado.gets}\`
            > 🎎 Total de skins: \`${skinsDoPlayer.length}\`.

            **Skin: ${skinsDoPlayer[skinDaVez]?.skinName != "default" ? skinsDoPlayer[skinDaVez]?.skinName : skinsDoPlayer[skinDaVez]?.nomeChamp}**`)
                .setImage(`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${skinsDoPlayer[skinDaVez]?.nomeChamp}_${skinsDoPlayer[skinDaVez]?.skinNumber}.jpg`)



            c.update({ embeds: [embedPerson], components: [actionRow] })
        })

        coletor.on('end', (collected, reason) => {

            message.delete()
            msg.delete()
        })

    }
}

