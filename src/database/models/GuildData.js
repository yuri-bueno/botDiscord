const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
    _id: String,
    setCanal: {
        channel: { type: Number, required: false, default: -1 },
    },
    Players: {
        Player: {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            dinheiro: { type: Number, default: 0 },
        },
    }

})


module.exports = model('guildsData', guildSchema)