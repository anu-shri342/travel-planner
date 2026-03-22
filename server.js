const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Models
const Destination = require("./models/Destination");
const User = require("./models/User");

// ✅ Connect MongoDB Atlas (ONLY ONE CONNECTION)
mongoose.connect("mongodb+srv://AnuShriJ:anu2007@travelplannercluster.niroqe2.mongodb.net/travelPlanner?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// ✅ GET all destinations
app.get("/destinations", async (req, res) => {
    try {
        const data = await Destination.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔐 REGISTER API
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = new User({ username, password });
        await user.save();

        res.json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔐 LOGIN API
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username, password });

        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ✈️ PLAN TRIP API
app.post("/plan", async (req, res) => {
    try {
        let { name, budget, days, members } = req.body;

        budget = Number(budget) || 0;
        days = Number(days) || 1;
        members = Number(members) || 1;

        const dest = await Destination.findOne({
    name: { $regex: new RegExp("^" + name + "$", "i") }
});
        console.log(dest);
       if (!dest) {
    return res.json({ success: false, msg: "Destination not found" });
}

        const total = dest.costPerDay * days * members;

        // 🔥 HOTEL LOGIC HERE
        let hotelType = "budget";
        if (budget > 10000) hotelType = "premium";
        if (budget > 20000) hotelType = "luxury";

        // 🔥 ITINERARY
        let itinerary = [];
        for (let i = 0; i < days; i++) {
            itinerary.push({
                day: i + 1,
                plan: dest.places[i % dest.places.length]
            });
        }

        // ✅ THIS is res.json()
        res.json({
            success: total <= budget,
            destination: dest.name,
            totalCost: total,
            remaining: budget - total,

            places: dest.places,
            nearbyPlaces: dest.nearbyPlaces,

            // 🔥 FIXED HERE
            suggestedHotels: dest.hotels[hotelType],

            activities: dest.activities,
            itinerary: itinerary
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🧪 TEST API
app.get("/test", (req, res) => {
    console.log("TEST API HIT");
    res.send("Working");
});


// 🚀 START SERVER
app.listen(5000, () => {
    console.log("Server running on port 5000");
});