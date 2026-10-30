const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const tradeRoutes = require("./routes/TradeRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/trades", tradeRoutes);



mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Trading Journal API is running...");
});

const PORT = 5000;

app.listen(PORT, () => {
    
});