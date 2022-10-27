const axios = require("axios")

require("dotenv").config()




module.exports = async function enviar(puuid) {



    const historico = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&start=0&count=5`,

        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
            return resp.data.map(e => e)
        }).catch((e) => {
            console.error(e)

        })


    let partidas = []

    let promesas = await Promise.all([axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${historico[0]}`,
        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
            return resp.data
        }).catch((e) => {
            console.error(e)
        }),
    axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${historico[1]}`,
        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
            return resp.data
        }).catch((e) => {
            console.error(e)
        }),
    axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${historico[2]}`,
        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
            return resp.data
        }).catch((e) => {
            console.error(e)
        }),
    axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${historico[3]}`,
        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
            return resp.data
        }).catch((e) => {
            console.error(e)
        }),
    axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${historico[4]}`,
        { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
            return resp.data
        }).catch((e) => {
            console.error(e)
        }),])

    partidas = [...promesas]

    /* for (const partida of historico) {
 
 
         info = await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/${partida}`,
             { headers: { 'X-Riot-Token': process.env.LOL_KEY } }).then(resp => {
 
                 num++
                 console.log(`${num} de ${quantidade} partidas ${num * 100 / quantidade}%`);
                 return resp.data
             }).catch((e) => {
                 console.error(e)
             })
 
         partidas.push(info)
 
     }*/
    let resultado = []

    for (const partida of partidas) {

        let { summonerName, championId, championName, win, lane, item0, item1, item2, item3, item4, item5, item6, perks } = partida.info.participants.find(x => x.puuid == puuid)
        resultado.push({ summonerName, championId, championName, win, lane, items: { item0, item1, item2, item3, item4, item5, item6 }, perks })
    }

    return resultado
















}