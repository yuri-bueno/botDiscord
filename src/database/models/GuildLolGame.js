const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
    _id: String,
    Players: Array

})


module.exports = model('guildsLoLGame', guildSchema)




/*
 setCanal: {
        channel: { type: Number, required: false, default: -1 },
    },


Player: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    dinheiro: { type: Number, default: 0 },
}*/