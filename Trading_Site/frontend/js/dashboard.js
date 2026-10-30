let equityChart;

const totalTrades = document.getElementById("totalTrades");
const winningTrades = document.getElementById("winningTrades");
const losingTrades = document.getElementById("losingTrades");
const winRate = document.getElementById("winRate");
const netPnl = document.getElementById("netPnl");
const averageWin = document.getElementById("averageWin");
const averageLoss = document.getElementById("averageLoss");
const emotionalTrades = document.getElementById("emotionalTrades");
const breakevenTrades = document.getElementById("breakevenTrades");
const lossRate = document.getElementById("lossRate");
const profitFactor = document.getElementById("profitFactor");
const largestWin = document.getElementById("largestWin");
const largestLoss = document.getElementById("largestLoss");
const maxDrawdown = document.getElementById("maxDrawdown");


function getTradeResult(trade) {

    if (trade.result) {
        return trade.result;
    }

    // For old trades that don't have result saved yet
    if (trade.pnl > 0) {
        return "Win";
    }

    if (trade.pnl < 0) {
        return "Loss";
    }

    return "Breakeven";
}



async function loadDashboard() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/trades"
        );

        const trades = await response.json();

        calculateAnalytics(trades);
        calculatePsychologyAnalytics(trades);
        calculateConsistencyAnalytics(trades);
        calculateMistakeAnalytics(trades);

        // Total trades

        const total = trades.length;

        // Trade results

        const wins = trades.filter(
            (trade) => getTradeResult(trade) === "Win"
        ).length;

        const losses = trades.filter(
            (trade) => getTradeResult(trade) === "Loss"
        ).length;

        const breakevens = trades.filter(
            (trade) => getTradeResult(trade) === "Breakeven"
        ).length;



        // Win rate

        const decidedTrades = wins + losses;

        const calculatedWinRate = decidedTrades > 0
            ? (wins / decidedTrades) * 100
            : 0;


        // Net P&L

        let totalPnl = 0;

        trades.forEach((trade) => {

            totalPnl += trade.pnl || 0;

        });


        // Average win

        const winningPnl = trades
            .filter((trade) => trade.pnl > 0)
            .map((trade) => trade.pnl);

        const avgWin =
            winningPnl.length > 0
                ? winningPnl.reduce((a, b) => a + b, 0) /
                  winningPnl.length
                : 0;


        // Average loss

        const losingPnl = trades
            .filter((trade) => trade.pnl < 0)
            .map((trade) => trade.pnl);

        const avgLoss =
            losingPnl.length > 0
                ? losingPnl.reduce((a, b) => a + b, 0) /
                  losingPnl.length
                : 0;


        // Emotional trades

        const emotional = trades.filter(
            (trade) => trade.emotionalTrade === true
        ).length;


        // Loss rate

        const calculatedLossRate =
            total > 0 ? (losses / total) * 100 : 0;


        // Total profit

        const totalProfit = trades
            .filter((trade) => trade.pnl > 0)
            .reduce((sum, trade) => sum + trade.pnl, 0);


        // Total loss

        const totalLoss = trades
            .filter((trade) => trade.pnl < 0)
            .reduce((sum, trade) => sum + Math.abs(trade.pnl), 0);


        // Profit factor

        const calculatedProfitFactor =
            totalLoss > 0
                ? totalProfit / totalLoss
                : 0;


        // Largest win

        const calculatedLargestWin =
            winningPnl.length > 0
                ? Math.max(...winningPnl)
                : 0;


        // Largest loss

        const calculatedLargestLoss =
            losingPnl.length > 0
                ? Math.min(...losingPnl)
                : 0;


        // Maximum drawdown

        let runningPnl = 0;
        let peak = 0;
        let drawdown = 0;

        trades.forEach((trade) => {

            runningPnl += trade.pnl || 0;

            if (runningPnl > peak) {
                peak = runningPnl;
            }

            const currentDrawdown =
                peak - runningPnl;

            if (currentDrawdown > drawdown) {
                drawdown = currentDrawdown;
            }

        });


        // Display values

        totalTrades.textContent = total;

        winningTrades.textContent = wins;

        losingTrades.textContent = losses;

        winRate.textContent =
            calculatedWinRate.toFixed(2) + "%";

        netPnl.textContent =
            "$" + totalPnl.toFixed(2);

        averageWin.textContent =
            "$" + avgWin.toFixed(2);

        averageLoss.textContent =
            "$" + avgLoss.toFixed(2);

        emotionalTrades.textContent =
            emotional;
        breakevenTrades.textContent = breakevens;

        lossRate.textContent =
            calculatedLossRate.toFixed(2) + "%";

        profitFactor.textContent =
            calculatedProfitFactor.toFixed(2);

        largestWin.textContent =
            "+$" + calculatedLargestWin.toFixed(2);

        largestLoss.textContent =
            "-$" + Math.abs(calculatedLargestLoss).toFixed(2);

        maxDrawdown.textContent =
    "-$" + drawdown.toFixed(2);


    // Create equity values

    let equity = 0;

    const equityValues = [];
    const tradeNumbers = [];

    trades.forEach((trade, index) => {

        equity += trade.pnl || 0;

        equityValues.push(equity);

        tradeNumbers.push("Trade " + (index + 1));

    });


    // Create equity chart

    const ctx = document.getElementById("equityChart");

    if (equityChart) {
        equityChart.destroy();
    }

    equityChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: tradeNumbers,

            datasets: [{
                label: "Equity",

                data: equityValues,

                tension: 0.3,

                fill: false
            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {
                    beginAtZero: false
                }

            }

        }

    });

    } catch (error) {

        console.error(
            "Failed to load dashboard:",
            error
        );

    }

}


loadDashboard();

// ==========================================
// ADVANCED ANALYTICS
// ==========================================

function calculateAnalytics(trades) {

    // Day-wise
    const dayData = {};

    // Session-wise
    const sessionData = {};

    // Setup-wise
    const setupData = {};

    // Pair-wise
    const pairData = {};

    // FVG
    const fvgData = {
        true: [],
        false: []
    };

    // Fib
    const fibData = {
        true: [],
        false: []
    };


    trades.forEach((trade) => {

        const pnl = trade.pnl || 0;


        // =========================
        // DAY
        // =========================

        const date = new Date(trade.date);

        if (!isNaN(date)) {

            const day = date.toLocaleDateString(
                "en-US",
                { weekday: "long" }
            );

            if (!dayData[day]) {
                dayData[day] = [];
            }

            dayData[day].push(pnl);
        }


        // =========================
        // SESSION
        // =========================

        const session = trade.session || "Unknown";

        if (!sessionData[session]) {
            sessionData[session] = [];
        }

        sessionData[session].push(pnl);


        // =========================
        // SETUP
        // =========================

        const setup = trade.setup || "Unknown";

        if (!setupData[setup]) {
            setupData[setup] = [];
        }

        setupData[setup].push(pnl);


        // =========================
        // PAIR
        // =========================

        const pair = trade.pair || "Unknown";

        if (!pairData[pair]) {
            pairData[pair] = [];
        }

        pairData[pair].push(pnl);


        // =========================
        // FVG
        // =========================

        if (trade.fvg === true) {
            fvgData.true.push(pnl);
        } else {
            fvgData.false.push(pnl);
        }


        // =========================
        // FIB
        // =========================

        if (trade.fib === true) {
            fibData.true.push(pnl);
        } else {
            fibData.false.push(pnl);
        }

    });


    // Display all analytics

    displayGroupedAnalytics(
        "dayPerformance",
        dayData
    );

    displayGroupedAnalytics(
        "sessionPerformance",
        sessionData
    );

    displayGroupedAnalytics(
        "setupPerformance",
        setupData
    );

    displayGroupedAnalytics(
        "pairPerformance",
        pairData
    );


    displayComparisonAnalytics(
        "fvgPerformance",
        fvgData,
        "With FVG",
        "Without FVG"
    );

    displayComparisonAnalytics(
        "fibPerformance",
        fibData,
        "With Fib",
        "Without Fib"
    );

}



// ==========================================
// GROUPED ANALYTICS DISPLAY
// ==========================================

function displayGroupedAnalytics(
    elementId,
    data
) {

    const container =
        document.getElementById(elementId);

    container.innerHTML = "";


    const entries = Object.entries(data);


    if (entries.length === 0) {

        container.innerHTML =
            '<p class="no-data">No data available</p>';

        return;
    }


    entries.forEach(([name, pnls]) => {

        const totalPnl =
            pnls.reduce(
                (sum, pnl) => sum + pnl,
                0
            );


        const wins =
            pnls.filter(
                (pnl) => pnl > 0
            ).length;


        const winRate =
            pnls.length > 0
                ? (wins / pnls.length) * 100
                : 0;


        const row =
            document.createElement("div");

        row.className =
            "analytics-row";


        const valueClass =
            totalPnl >= 0
                ? "analytics-profit"
                : "analytics-loss";


        const sign =
            totalPnl >= 0
                ? "+$"
                : "-$";


        row.innerHTML = `

            <span class="analytics-name">
                ${name}
            </span>

            <span>

                <span class="analytics-value ${valueClass}">
                    ${sign}${Math.abs(totalPnl).toFixed(2)}
                </span>

                <span class="analytics-winrate">
                    ${winRate.toFixed(1)}% WR
                </span>

            </span>

        `;


        container.appendChild(row);

    });

}



// ==========================================
// COMPARISON ANALYTICS
// ==========================================

function displayComparisonAnalytics(
    elementId,
    data,
    trueLabel,
    falseLabel
) {

    const container =
        document.getElementById(elementId);

    container.innerHTML = "";


    createComparisonRow(
        container,
        trueLabel,
        data.true
    );


    createComparisonRow(
        container,
        falseLabel,
        data.false
    );

}



// ==========================================
// COMPARISON ROW
// ==========================================

function createComparisonRow(
    container,
    label,
    pnls
) {

    if (pnls.length === 0) {
        return;
    }


    const totalPnl =
        pnls.reduce(
            (sum, pnl) => sum + pnl,
            0
        );


    const wins =
        pnls.filter(
            (pnl) => pnl > 0
        ).length;


    const winRate =
        (wins / pnls.length) * 100;


    const row =
        document.createElement("div");

    row.className =
        "analytics-row";


    const valueClass =
        totalPnl >= 0
            ? "analytics-profit"
            : "analytics-loss";


    const sign =
        totalPnl >= 0
            ? "+$"
            : "-$";


    row.innerHTML = `

        <span class="analytics-name">
            ${label}
        </span>

        <span>

            <span class="analytics-value ${valueClass}">
                ${sign}${Math.abs(totalPnl).toFixed(2)}
            </span>

            <span class="analytics-winrate">
                ${winRate.toFixed(1)}% WR
            </span>

        </span>

    `;


    container.appendChild(row);

}

// ==========================================
// PSYCHOLOGY & RISK ANALYSIS
// ==========================================

function calculatePsychologyAnalytics(trades) {

    // --------------------------------------
    // Emotional Trading
    // --------------------------------------

    const emotionalTrades = trades.filter(
        trade => trade.emotionalTrade === true
    );

    const normalTrades = trades.filter(
        trade => trade.emotionalTrade !== true
    );


    displayBehaviorStats(
        "emotionalAnalysis",
        "Emotional",
        emotionalTrades,
        "Normal",
        normalTrades
    );


    // --------------------------------------
    // Risk Discipline
    // --------------------------------------

    const withinRisk = trades.filter(
        trade => trade.withinRisk === true
    );

    const riskViolation = trades.filter(
        trade => trade.withinRisk !== true
    );


    displayBehaviorStats(
        "riskAnalysis",
        "Within Risk",
        withinRisk,
        "Risk Violation",
        riskViolation
    );


    // --------------------------------------
    // SL Accuracy
    // --------------------------------------

    const correctSL = trades.filter(
        trade => trade.correctSL === true
    );

    const incorrectSL = trades.filter(
        trade => trade.correctSL !== true
    );


    displayBehaviorStats(
        "slAnalysis",
        "Correct SL",
        correctSL,
        "Incorrect SL",
        incorrectSL
    );


    // --------------------------------------
    // Behavior vs P&L
    // --------------------------------------

    displayBehaviorStats(
        "behaviorAnalysis",
        "Disciplined",
        withinRisk,
        "Risk Violation",
        riskViolation
    );

}



// ==========================================
// BEHAVIOR STATISTICS
// ==========================================

function displayBehaviorStats(
    elementId,
    firstLabel,
    firstTrades,
    secondLabel,
    secondTrades
) {

    const container =
        document.getElementById(elementId);

    container.innerHTML = "";


    createBehaviorRow(
        container,
        firstLabel,
        firstTrades
    );


    createBehaviorRow(
        container,
        secondLabel,
        secondTrades
    );

}



// ==========================================
// CREATE BEHAVIOR ROW
// ==========================================

function createBehaviorRow(
    container,
    label,
    trades
) {

    if (trades.length === 0) {

        return;
    }


    const totalPnl =
        trades.reduce(
            (sum, trade) =>
                sum + (trade.pnl || 0),
            0
        );


    const wins =
        trades.filter(
            trade => trade.pnl > 0
        ).length;


    const winRate =
        trades.length > 0
            ? (wins / trades.length) * 100
            : 0;


    const row =
        document.createElement("div");

    row.className =
        "analytics-row";


    const valueClass =
        totalPnl >= 0
            ? "analytics-profit"
            : "analytics-loss";


    const sign =
        totalPnl >= 0
            ? "+$"
            : "-$";


    row.innerHTML = `

        <span class="analytics-name">
            ${label}
        </span>

        <span>

            <span class="analytics-value ${valueClass}">
                ${sign}${Math.abs(totalPnl).toFixed(2)}
            </span>

            <span class="analytics-winrate">
                ${winRate.toFixed(1)}% WR
            </span>

        </span>

    `;


    container.appendChild(row);

}

// ==========================================
// STREAK & CONSISTENCY ANALYSIS
// ==========================================

function calculateConsistencyAnalytics(trades) {

    if (trades.length === 0) {
        return;
    }


    // --------------------------------------
    // Sort trades chronologically
    // --------------------------------------

    const sortedTrades = [...trades].sort(
        (a, b) =>
            new Date(a.date) - new Date(b.date)
    );


    // --------------------------------------
    // Streak variables
    // --------------------------------------

    let currentWin = 0;
    let currentLoss = 0;

    let bestWin = 0;
    let worstLoss = 0;


    // --------------------------------------
    // Calculate streaks
    // --------------------------------------

    sortedTrades.forEach((trade) => {

        const pnl = trade.pnl || 0;


        if (pnl > 0) {

            currentWin++;
            currentLoss = 0;

            if (currentWin > bestWin) {
                bestWin = currentWin;
            }

        }

        else if (pnl < 0) {

            currentLoss++;
            currentWin = 0;

            if (currentLoss > worstLoss) {
                worstLoss = currentLoss;
            }

        }

        else {

            currentWin = 0;
            currentLoss = 0;

        }

    });


    // --------------------------------------
    // Current streak
    // --------------------------------------

    let currentWinningStreakValue = 0;
    let currentLosingStreakValue = 0;


    for (let i = sortedTrades.length - 1; i >= 0; i--) {

        const pnl = sortedTrades[i].pnl || 0;


        if (pnl > 0) {

            if (currentLosingStreakValue > 0) {
                break;
            }

            currentWinningStreakValue++;

        }

        else if (pnl < 0) {

            if (currentWinningStreakValue > 0) {
                break;
            }

            currentLosingStreakValue++;

        }

        else {

            break;

        }

    }


    // --------------------------------------
    // Average trades per day
    // --------------------------------------

    const tradingDays = {};


    sortedTrades.forEach((trade) => {

        const date = new Date(trade.date);

        const day = date.toISOString().split("T")[0];

        if (!tradingDays[day]) {
            tradingDays[day] = 0;
        }

        tradingDays[day]++;

    });


    const numberOfDays =
        Object.keys(tradingDays).length;


    const averageTrades =
        numberOfDays > 0
            ? sortedTrades.length / numberOfDays
            : 0;


    // --------------------------------------
    // Best & Worst Trading Day
    // --------------------------------------

    const dailyPnl = {};


    sortedTrades.forEach((trade) => {

        const date = new Date(trade.date);

        const day = date.toISOString().split("T")[0];

        if (!dailyPnl[day]) {
            dailyPnl[day] = 0;
        }

        dailyPnl[day] += trade.pnl || 0;

    });


    const dailyEntries =
        Object.entries(dailyPnl);


    let bestDay = null;
    let worstDay = null;


    dailyEntries.forEach(([day, pnl]) => {

        if (
            bestDay === null ||
            pnl > bestDay.pnl
        ) {

            bestDay = {
                day: day,
                pnl: pnl
            };

        }


        if (
            worstDay === null ||
            pnl < worstDay.pnl
        ) {

            worstDay = {
                day: day,
                pnl: pnl
            };

        }

    });


    // --------------------------------------
    // Consistency Score
    // --------------------------------------

    const profitableDays =
        dailyEntries.filter(
            ([day, pnl]) => pnl > 0
        ).length;


    const consistency =
        numberOfDays > 0
            ? (profitableDays / numberOfDays) * 100
            : 0;


    // --------------------------------------
    // Display
    // --------------------------------------

    document.getElementById(
        "currentWinningStreak"
    ).textContent =
        currentWinningStreakValue + " Trades";


    document.getElementById(
        "currentLosingStreak"
    ).textContent =
        currentLosingStreakValue + " Trades";


    document.getElementById(
        "bestWinningStreak"
    ).textContent =
        bestWin + " Trades";


    document.getElementById(
        "worstLosingStreak"
    ).textContent =
        worstLoss + " Trades";


    document.getElementById(
        "averageTradesDay"
    ).textContent =
        averageTrades.toFixed(1);


    // Best Trading Day
if (bestDay) {

    const bestPnlClass =
        bestDay.pnl >= 0
            ? "analytics-profit"
            : "analytics-loss";

    document.getElementById(
        "bestTradingDay"
    ).innerHTML = `
        <span>${bestDay.day}</span>
        <span class="day-pnl ${bestPnlClass}">
            +$${bestDay.pnl.toFixed(2)}
        </span>
    `;
}


// Worst Trading Day
if (worstDay) {

    const worstPnlClass =
        worstDay.pnl >= 0
            ? "analytics-profit"
            : "analytics-loss";

    document.getElementById(
        "worstTradingDay"
    ).innerHTML = `
        <span>${worstDay.day}</span>
        <span class="day-pnl ${worstPnlClass}">
            $${worstDay.pnl.toFixed(2)}
        </span>
    `;
}


    document.getElementById(
        "consistencyScore"
    ).textContent =
        consistency.toFixed(1) + "%";

}

// ==========================================
// MISTAKE ANALYSIS
// ==========================================

function calculateMistakeAnalytics(trades) {

    const mistakeData = {};


    trades.forEach((trade) => {

        if (!Array.isArray(trade.mistakes)) {
            return;
        }


        trade.mistakes.forEach((mistake) => {

            if (!mistake) {
                return;
            }


            if (!mistakeData[mistake]) {

                mistakeData[mistake] = {
                    count: 0,
                    pnl: 0
                };

            }


            mistakeData[mistake].count++;

            mistakeData[mistake].pnl +=
                trade.pnl || 0;

        });

    });


    displayMistakeFrequency(mistakeData);

    displayMistakeImpact(mistakeData);

}



// ==========================================
// MISTAKE FREQUENCY
// ==========================================

function displayMistakeFrequency(data) {

    const container =
        document.getElementById("mistakeFrequency");

    container.innerHTML = "";


    const entries =
        Object.entries(data)
        .sort((a, b) =>
            b[1].count - a[1].count
        );


    if (entries.length === 0) {

        container.innerHTML =
            '<p class="no-data">No mistakes recorded</p>';

        return;
    }


    entries.forEach(([mistake, data]) => {

        const row =
            document.createElement("div");

        row.className =
            "analytics-row";


        row.innerHTML = `

            <span class="analytics-name">
                ${mistake}
            </span>

            <span class="analytics-value">
                ${data.count} trades
            </span>

        `;


        container.appendChild(row);

    });

}



// ==========================================
// MISTAKE P&L IMPACT
// ==========================================

function displayMistakeImpact(data) {

    const container =
        document.getElementById("mistakeImpact");

    container.innerHTML = "";


    const entries =
        Object.entries(data)
        .sort((a, b) =>
            a[1].pnl - b[1].pnl
        );


    if (entries.length === 0) {

        container.innerHTML =
            '<p class="no-data">No mistakes recorded</p>';

        return;
    }


    entries.forEach(([mistake, data]) => {

        const pnl = data.pnl;


        const valueClass =
            pnl >= 0
                ? "analytics-profit"
                : "analytics-loss";


        const sign =
            pnl >= 0
                ? "+$"
                : "-$";


        const row =
            document.createElement("div");

        row.className =
            "analytics-row";


        row.innerHTML = `

            <span class="analytics-name">
                ${mistake}
            </span>

            <span class="analytics-value ${valueClass}">
                ${sign}${Math.abs(pnl).toFixed(2)}
            </span>

        `;


        container.appendChild(row);

    });

}