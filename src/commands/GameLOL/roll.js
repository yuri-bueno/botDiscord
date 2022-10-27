const axios = require('axios')
const Discord = require('discord.js')
const db = require('../../database/models/models')
const dbLocal = require('../../database/db_lol/db.json')

module.exports = {
    name: 'roll',
    description: "roll",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, message, args) => {


        serverDiscord = await db.guildsLolGame.findById(message.guild.id)


        champRandom = Math.floor(Math.random() * (dbLocal.length))
        let nameChamp = dbLocal[champRandom].name

        let sortSkin = Math.floor(Math.random() * (dbLocal[champRandom].skins.length));
        //  let skinName = dbLocal[champRandom].skins[sortSkin].name
        let { name: skinName, num: skinNum, id: skinId } = dbLocal[champRandom].skins[sortSkin]


        if (!serverDiscord) {  //checar se é a primeira vez q o db é criado 

            console.log('criando save do server');
            serverDiscord = await db.guildsLolGame.create({
                _id: message.guild.id,
                Players: []
            })


        }

        // console.log(serverDiscord);

        let dono = null
        let index = -1
        let player = serverDiscord?.Players.find(Player => {

            dono = Player.skins.find(e => e == skinId)
            if (dono) {
                dono = [Player.nome, Player.id]
            }

            index++
            return Player?.id == message.author.id
        })

        //   console.log(dono);
        // console.log('inicial', player);
        if (!player) {                          //player novo----------------------------------------------

            let setNewPlayer = {
                id: message.author.id,
                nome: message.author.username,
                dinheiro: 0,
                tier: 0,
                rolls: 5,
                rollsTime: Date.now(),
                gets: 1,
                getsTime: Date.now(),
                skins: []
            }
            player = setNewPlayer
            let enviado1 = await db.guildsLolGame.findByIdAndUpdate(message.guild.id,
                {
                    _id: message.guild.id,
                    Players: [...serverDiscord.Players, setNewPlayer]
                }, { new: true })
            message.reply({ content: 'Conta criada com sucesso!!!', ephemeral: true })
        } else {//player já registrado=------------------------------------------------------------


            let horarioAtual = Date.now()

            let horarioDelta = horarioAtual - player.rollsTime

            let girosDisponiveis = 0

            for (horarioDelta; horarioDelta > 1000 * 60 * 20; girosDisponiveis++) {

                horarioDelta -= 1000 * 60 * 20

            }

            switch (player.tier) {
                case 0:
                    for (player.rolls; girosDisponiveis > 0 && player.rolls < 5; player.rolls++) {

                        girosDisponiveis--
                    }
                    break;

                default:
                    for (player.rolls; girosDisponiveis > 0 && player.rolls < 5; player.rolls++) {

                        girosDisponiveis--
                    }
                    break;
            }


            if (player?.rolls <= 0) {
                console.log(player?.rolls);

                let time = new Date(player.rollsTime + 1000 * 60 * 20).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
                message.reply({ content: `você não tem rolls sobrando volte as ${time.slice(11, 13)}:${time.slice(14, 16)} para receber seu proximo roll!!!` })
                return
            }
            console.log(girosDisponiveis, player.rolls);
            player.dinheiro = player.dinheiro + 10
            player.rolls -= 1
            player.rollsTime = horarioAtual
            serverDiscord.Players[index] = player
            //    console.log(serverDiscord.Players[index]);

            let enviado2 = await db.guildsLolGame.findByIdAndUpdate(message.guild.id, { _id: message.guild.id, Players: serverDiscord.Players }, { new: true })

        }


        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setTitle(`${nameChamp}:`)
            .setAuthor({ name: "+10 por roll", iconURL: 'https://down.imgspng.com/download/0720/coin_PNG36871.png' })
            .setDescription(`${skinName}`)
            .setFooter({
                text: !dono ? 'yurizinho produções' : `${dono[0]} já pegou esse aqui!!`,
                iconURL: !dono ? client.user.displayAvatarURL() : client.guilds.resolve(message.guild.id).members.resolve(dono[1]).user.avatarURL(),
            })
            .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/${nameChamp}.png`)
            .setImage(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${nameChamp}_${skinNum}.jpg`)
            .setTimestamp(new Date())


        const actionRow = new Discord.ActionRowBuilder()
            .addComponents(
                [
                    new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setLabel(!dono ? 'PEGAR' : `Dono: ${dono[0]}`)
                        .setCustomId(`GET!${skinName}!${skinNum}!${nameChamp}!${skinId}`)
                        .setDisabled(!dono ? false : true),
                ]
            )

        const msg = await message.channel.send({ embeds: [embed], components: [actionRow] })

        const collector = msg.createMessageComponentCollector({ time: (5 * 60 * 1000) })




        collector.on('end', (collected, reason) => {

            if (reason = 'time') {

                let embedTimeOut = new Discord.EmbedBuilder()
                    .setColor(0xcd0a0a)
                    .setTitle(`${nameChamp}:`)
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setDescription(`${skinName}`)
                    .setFooter({
                        text: `😭😭😭Tempo esgotado 😭😭😭`,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/${nameChamp}.png`)
                    .setImage(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${nameChamp}_${skinNum}.jpg`)
                    .setTimestamp(new Date())

                const actionRowTimeOut = new Discord.ActionRowBuilder()
                    .addComponents(
                        [
                            new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Primary)
                                .setLabel('ACABOU O TEMPO :(')
                                .setCustomId('GET')
                                .setDisabled(true),

                        ]
                    )

                msg.edit({ embeds: [embedTimeOut], components: [actionRowTimeOut] })
            }

        })



    }
}

