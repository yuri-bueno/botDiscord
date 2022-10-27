const Discord = require('discord.js')
const client = new Discord.Client({ intents: [1, 512, 32768, 2, 128] })
const fs = require("fs");

const dotenv = require('dotenv')

const { connect } = require('mongoose')
const Models = require('./src/database/models/models')
dotenv.config()


const db = require('./src/database/models/models')
client.login(process.env.TOKEN_DISCORD)


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync(`./src/commands/`);


async function connectToDatabase() {
    const connection = await connect(`mongodb+srv://drailer:${process.env.DB_KEY}@discordbot.bxlabum.mongodb.net/BotDiscord?retryWrites=true&w=majority`)
    //const connection = await connect(`mongodb+srv://drailer:${process.env.DB_KEY}@discordbot.bxlabum.mongodb.net/?retryWrites=true&w=majority`)
    console.log("conectado com o banco de dados")
    module.exports = connection
}


fs.readdirSync('./src/commands/').forEach(local => {
    const comandos = fs.readdirSync(`./src/commands/${local}`).filter(arquivo => arquivo.endsWith('.js'))

    for (let file of comandos) {
        let puxar = require(`./src/commands/${local}/${file}`)

        if (puxar.name) {
            client.commands.set(puxar.name, puxar)
        }
        if (puxar.aliases && Array.isArray(puxar.aliases))
            puxar.aliases.forEach(x => client.aliases.set(x, puxar.name))
    }
});

client.on("messageCreate", async (message) => {

    let prefix = process.env.PREFIX.toString();

    if (message.author.bot) return;

    if (message.channel.type === Discord.ChannelType.DM) return;

    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;


    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);


    let cmd = args.shift().toLowerCase()
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd))

    try {
        command.run(client, message, args)
    } catch (err) {

        console.error('Erro:' + err);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        let buttonID = interaction.customId;

        buttonID = buttonID.split('!')

        if (buttonID[0] == 'GET') {
            get(buttonID, interaction)
        }

    }

})

client.on("ready", () => {



    console.log(`${client.user.username} está online e metendo!!!`);
    connectToDatabase()
    /*   let index = 0
       setInterval(() => {
           let Guilds = client.guilds.cache.map(guild => guild.id)
   
           for (let server of Guilds) {
               db.guildsLolGame.findById(server)
                   .then(server => {
                       //console.log(server);
                       if (server?.Players) {
                           // console.log('to aqui');
                           setPlayersAtt = []
   
   
                           if (index >= 6) {
                               console.log('att gets');
                               server?.Players.forEach(e => {
                                   //  console.log('att gets2', e);
                                   if (e.gets <= 0) {
                                       e.gets++
                                       console.log('att gets3', e);
                                   }
   
                                   if (e.rolls < 5) {
                                       e.rolls = e.rolls + 1
   
                                       setPlayersAtt.push(e)
                                   } else {
   
   
                                       setPlayersAtt.push(e)
                                   }
   
                               })
                               index = 0
                           } else {
   
                               server?.Players.forEach(e => {
   
   
                                   if (e.rolls < 5) {
                                       e.rolls = e.rolls + 1
   
                                       setPlayersAtt.push(e)
                                   } else {
   
                                       setPlayersAtt.push(e)
                                   }
   
                               })
                           }
   
                           //   console.log(setPlayersAtt);
                           enviar(server, setPlayersAtt)
                       }
   
                   })
           }
   
           index++
           console.log(index);
           //  console.log(setPlayersAtt);
   
       }, 1000 * 1 * 3);*/
})


async function enviar(server, players) {
    // console.log(server, players);
    let enviar = await db.guildsLolGame.findByIdAndUpdate(server, { _id: server, Players: players }, { new: true })
    enviar = enviar
}


async function get(buttonID, interaction) {

    let skinName = buttonID[1]
    let skinNum = buttonID[2]
    let nameChamp = buttonID[3]
    let SkinID = buttonID[4]


    let serverDiscord = await db.guildsLolGame.findById(interaction.guild.id)
    let index = serverDiscord?.Players.findIndex(Player => Player?.id == interaction.user.id)




    let horarioAtual = Date.now()

    let horarioDelta = horarioAtual - serverDiscord.Players[index].getsTime

    let getsDisponiveis = 0

    for (horarioDelta; horarioDelta > 1000 * 60 * 60; getsDisponiveis++) {

        horarioDelta -= 1000 * 60 * 60

    }

    switch (serverDiscord.Players[index].tier) {
        case 0:
            for (serverDiscord.Players[index].gets; getsDisponiveis > 0 && serverDiscord.Players[index].gets < 1; serverDiscord.Players[index].gets++) {

                getsDisponiveis--
            }
            break;

        default:
            for (serverDiscord.Players[index].gets; getsDisponiveis > 0 && serverDiscord.Players[index].gets < 1; serverDiscord.Players[index].gets++) {

                getsDisponiveis--
            }
            break;
    }


    if (serverDiscord.Players[index].gets <= 0) {
        console.log(serverDiscord.Players[index].gets);

        let time = new Date(serverDiscord.Players[index].getsTime + 1000 * 60 * 60).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
        interaction.reply({ content: `você não tem gets sobrando volte as ${time.slice(11, 13)}:${time.slice(14, 16)} !!!`, ephemeral: true })
        return
    }


    if (index == -1) {

        let setNewPlayer = {
            id: interaction.user.id,
            nome: interaction.user.username,
            dinheiro: 0,
            tier: 0,
            rolls: 5,
            rollsTime: Date.now(),
            gets: 1,
            getsTime: Date.now(),
            skins: []
        }
        player = setNewPlayer

        serverDiscord = await db.guildsLolGame.findByIdAndUpdate(interaction.guild.id,
            {
                _id: interaction.guild.id,
                Players: [...serverDiscord.Players, setNewPlayer]
            }, { new: true })
        index = serverDiscord.Players.length - 1
    }
    serverDiscord.Players[index].getsTime = horarioAtual
    serverDiscord.Players[index].skins.push(SkinID)
    serverDiscord.Players[index].dinheiro += 50
    serverDiscord.Players[index].gets--
    let enviado2 = await db.guildsLolGame.findByIdAndUpdate(interaction.guild.id, { _id: interaction.guild.id, Players: serverDiscord.Players }, { new: true })
    // console.log(index, SkinID, enviado2);



    let embedGet = new Discord.EmbedBuilder()
        .setColor(0x0ccb19)
        .setTitle(`${nameChamp}:`)
        .setAuthor({ name: "+50 por pegar", iconURL: 'https://down.imgspng.com/download/0720/coin_PNG36871.png' })
        .setDescription(`${skinName}`)
        .setFooter({
            text: `${interaction.user.username} Pegou ${skinName != 'default' ? skinName : nameChamp}`,
            iconURL: interaction.user.displayAvatarURL(),
        })
        .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.19.1/img/champion/${nameChamp}.png`)
        .setImage(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${nameChamp}_${skinNum}.jpg`)
        .setTimestamp(new Date())

    const actionRowGet = new Discord.ActionRowBuilder()
        .addComponents(
            [
                new Discord.ButtonBuilder()
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel(`${interaction.user.username} Pegou`)
                    .setCustomId('GET')
                    .setDisabled(true),

            ]
        )

    interaction.update({ embeds: [embedGet], components: [actionRowGet] })

}