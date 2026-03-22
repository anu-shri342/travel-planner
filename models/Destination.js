const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
    name: String,
    costPerDay: Number,

    places: [String], // main tourist places

    nearbyPlaces: [String], // nearby attractions

    hotels: {
        budget: [String],
        premium: [String],
        luxury: [String]
    },

    food: [String], // famous food

    transport: [String], // transport options

    activities: [String] // things to do
});

module.exports = mongoose.model("Destination", destinationSchema);