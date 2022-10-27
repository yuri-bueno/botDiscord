const axios = require("axios")
const Discord = require('discord.js')
const db = require('../../database/db_lol/db.json')
require("dotenv").config()
module.exports = {
    name: 'nick',
    aliases: ['nicks'],
    run: async (client, message, args) => {





        let nick = message.content
        nick = nick.split('!nick ')
        console.log('pesquisou o nick:', nick[1]);
        if (!nick[1]) return

        const accountId = await axios.get(`https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nick[1]}`,
            { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
                return resp.data
            }).catch((e) => {
                console.error('campeão n encontrado')
                return
            })


        if (!accountId) {

            dontFound('Player não encontrado :(')
            return
        }


        let { id, summonerLevel, profileIconId, name, puuid } = accountId


        let infoAccount = await axios.get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
            { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
                return resp.data
            }).catch((e) => {
                console.error(e)
                message.channel.send({ content: "⚠⚠ error ⚠⚠" })
            })

        let modoRanqd = TratarInfoRanqd(infoAccount)

        console.log(modoRanqd);

        let { tier: tierSoloQ, rank: rankSoloQ, leaguePoints: leaguePointsSoloQ, wins: winsSoloQ, losses: lossesSoloQ } = modoRanqd[0] ? modoRanqd[0] : ''
        let winrateSoloQ = modoRanqd[0] ? (winsSoloQ * 100 / (winsSoloQ + lossesSoloQ)).toFixed(1) : 0

        let { tier: tierFlex, rank: rankFlex, leaguePoints: leaguePointsFlex, wins: winsFlex, losses: lossesFlex } = modoRanqd[1] ? modoRanqd[1] : ''
        let winrateFlex = modoRanqd[1] ? (winsFlex * 100 / (winsFlex + lossesFlex)).toFixed(1) : 0

        const maestria = await axios.get(`https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}/top`,
            { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
                return resp.data
            }).catch((e) => {
                console.error(e)
                message.channel.send({ content: "⚠⚠ error ⚠⚠" })
            })

        let champs = await maestria.map(e => {
            return db.find(x => x.key == e.championId).name
        })
        console.log(champs);



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
                            Maestria \`${maestria[2].championLevel}\` de \`${champs[2]}\` com \`${maestria[2].championPoints}\`pts `
                }
            ])
            .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.19.1/img/profileicon/${profileIconId}.png`)
            .setTimestamp(new Date())
            .setURL(`https://www.leagueofgraphs.com/summoner/br/${name.replace(/ /g, '+')}`)



        message.channel.send({ embeds: [embed] })




        function dontFound(msg) {
            let embed2 = new Discord.EmbedBuilder()
                .setColor(0xFF0000)
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setDescription(msg)
            message.channel.send({ embeds: [embed2] })
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


    }
}