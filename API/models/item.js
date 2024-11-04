const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isSelected: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

module.exports = mongoose.model("Item", itemSchema)