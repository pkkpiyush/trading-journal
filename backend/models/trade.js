const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true
        },

        pair: {
            type: String,
            required: true
        },

        session: String,

        bias: String,

        direction: {
            type: String,
            enum: ["Buy", "Sell"],
            required: true
        },

        setup: String,

        fvg: Boolean,

        fib: Boolean,

        correctSL: Boolean,

        liquidityTP: Boolean,

        orderType: String,

        withinRisk: Boolean,

        emotionalTrade: Boolean,

        pnl: {
            type: Number,
            required: true
        },

        result: {
            type: String,
            enum: ["Win", "Loss", "Breakeven"],
            required: true
        },

        pros: String,

        cons: String,

        reason: String,

        account: {
            type: String,
            enum: ["Paper", "Live", "Funded"]
        },

        orderTypeConfirmation: Boolean,

        breakevenRetest: Boolean,

        lesson: String,

        entryPrice: Number,

        slPrice: Number,

        tpPrice: Number,

        entryTime: String,

        exitTime: String,

        riskPercent: Number,

        plannedRR: Number,

        achievedRR: Number,

        mistakes: [String],

        screenshot: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Trade", tradeSchema);