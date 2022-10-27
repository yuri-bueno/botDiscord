const axios = require("axios")
const Discord = require('discord.js')
const db = require('../../database/db_lol/db.json')
const historico = require('../../utilidades/pegarHistorico')
require("dotenv").config()



module.exports = {
    name: 'partida',
    aliases: [],
    run: async (client, message, args) => {



        try {

            let partida = message.content
            partida = partida.split('!partida ')
            partida = partida[1].split('entrou no saguão\n' || '\n')
            partida = partida.map(e => {
                return e.replace(/entrou no saguão[ a-zA-Z0-9]*/g, '')
            })

            partida = partida.map(e => e.trim())

            console.log(partida);

            let players = await partida.map(e => {
                return pegarPuuid(e)
            })





            async function pegarPuuid(nick) {

                try {
                    let { id, summonerLevel, profileIconId, name, puuid } = await axios.get(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nick}`,
                        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
                            return resp.data
                        }).catch((e) => {
                            console.log(e)
                            return
                        })

                    let dados = await Promise.all([historico(puuid, 5),
                    axios.get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
                        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
                            return resp.data
                        }).catch((e) => {
                            console.error(e)
                            message.channel.send({ content: "⚠⚠ error ⚠⚠" })
                        }),
                    axios.get(`https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}/top`,
                        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
                            return resp.data
                        }).catch((e) => {
                            console.error(e)
                            message.channel.send({ content: "⚠⚠ error ⚠⚠" })
                        })])

                    estatistica([{ id, summonerLevel, profileIconId, name }, ...dados]);
                } catch (error) {
                    message.channel.send({ content: "\`⚠⚠ um dos nome errado ou api da riot bloqueou ⚠⚠\`" })
                    return
                }


            }







            let seriesd = ['winStrick', 'losseStrick', 'normal']
            async function estatistica(info) {
                let { id, summonerLevel, profileIconId, name } = info[0]
                let historico = info[1]
                let infoRanqd = info[2]
                let maestria = info[3]
                let modoRanqd = TratarInfoRanqd(infoRanqd)

                let { tier: tierSoloQ,
                    rank: rankSoloQ,
                    leaguePoints: leaguePointsSoloQ,
                    wins: winsSoloQ,
                    losses: lossesSoloQ } = modoRanqd[0] ? modoRanqd[0] : ''
                let winrateSoloQ = modoRanqd[0] ? (winsSoloQ * 100 / (winsSoloQ + lossesSoloQ)).toFixed(1) : 0


                let { tier: tierFlex,
                    rank: rankFlex,
                    leaguePoints: leaguePointsFlex,
                    wins: winsFlex,
                    losses: lossesFlex } = modoRanqd[1] ? modoRanqd[1] : ''
                let winrateFlex = modoRanqd[1] ? (winsFlex * 100 / (winsFlex + lossesFlex)).toFixed(1) : 0


                let champs = await maestria.map(e => {
                    return db.find(x => x.key == e.championId).name
                })



                let victorys = 0


                let champions = []

                /*      for (const partida in historico) {
          
                          let { win, lane } = historico[partida]
          
                          if (win) victorys++
          
                         // champions.push(championName)
          
          
                      }*/

                let embed = new Discord.EmbedBuilder()
                    .setColor(winrateSoloQ > 50 ? 0x41a50f : 0xa51e0f)
                    .setTitle(`Nick : ${name}`)
                    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setFooter({
                        text: 'yurizinho produções',
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .addFields([
                        {
                            name: `SoloQ:`,
                            value: modoRanqd[0] ? `\`${tierSoloQ} ${rankSoloQ}\` \n \`${leaguePointsSoloQ} pdl\` \nWinRate: \`${winrateSoloQ}\`%` : "Sem elo",
                            inline: true
                        },
                        {
                            name: `Flex:`,
                            value: modoRanqd[1] ? `\`${tierFlex} ${rankFlex}\` \n \`${leaguePointsFlex} pdl\` \nWinRate: \`${winrateFlex}\`%` : "Sem elo",
                            inline: true
                        },
                        {
                            name: `         Maestrias:`,
                            value: `Maestria \`${maestria[0].championLevel}\` de \`${champs[0]}\` com \`${maestria[0].championPoints}\`pts 
                                  Maestria \`${maestria[1].championLevel}\` de \`${champs[1]}\` com \`${maestria[1].championPoints}\`pts 
                                  Maestria \`${maestria[2].championLevel}\` de \`${champs[2]}\` com \`${maestria[2].championPoints}\`pts `,

                        }
                    ])
                    .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.19.1/img/profileicon/${profileIconId}.png`)
                    .setTimestamp(new Date())
                    .setURL(`https://www.leagueofgraphs.com/summoner/br/${name.replace(/ /g, '+')}`)



                message.channel.send({ embeds: [embed] })

            }

            function TratarInfoRanqd(info) {
                let modoRanqd = []
                for (const modo of info) {
                    if (modo.queueType == 'RANKED_SOLO_5x5') {
                        modoRanqd[0] = modo
                    }
                    if (modo.queueType == 'RANKED_FLEX_SR') {
                        modoRanqd[1] = modo
                    }
                }
                return modoRanqd
            }

        } catch (error) {
            console.log(error);
        }

    }
}