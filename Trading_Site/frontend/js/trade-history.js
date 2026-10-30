const tradesContainer = document.getElementById("tradesContainer");

const searchInput = document.getElementById("searchInput");
const sessionFilter = document.getElementById("sessionFilter");
const directionFilter = document.getElementById("directionFilter");
const resultFilter = document.getElementById("resultFilter");

const setupFilter = document.getElementById("setupFilter");
const emotionalFilter = document.getElementById("emotionalFilter");
const riskFilter = document.getElementById("riskFilter");
const fvgFilter = document.getElementById("fvgFilter");
const fibFilter = document.getElementById("fibFilter");
const accountFilter = document.getElementById("accountFilter");
const clearFilters = document.getElementById("clearFilters");

let allTrades = [];



// Load all trades
async function loadTrades() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/trades"
        );

        allTrades = await response.json();

        displayTrades(allTrades);

    } catch (error) {

        tradesContainer.innerHTML =
            "<p>Failed to load trades.</p>";

        console.error(error);

    }

}



// Display trades
function displayTrades(trades) {

    tradesContainer.innerHTML = "";

    if (trades.length === 0) {

        tradesContainer.innerHTML =
            "<p>No trades found.</p>";

        return;

    }



    trades.forEach((trade) => {

        const tradeCard =
            document.createElement("div");

        tradeCard.className =
            "trade-card";



        const tradeDate =
            new Date(trade.date).toLocaleDateString();



        const pnlClass =
            trade.pnl > 0
                ? "profit"
                : trade.pnl < 0
                    ? "loss"
                    : "";



        tradeCard.innerHTML = `

            <div class="trade-header">

                <div>

                    <h3>
                        ${trade.pair || "-"}
                        -
                        ${trade.direction || "-"}
                    </h3>

                    <p class="trade-date">
                        ${tradeDate}
                    </p>

                </div>


                <div class="${pnlClass} trade-pnl">

                    ${trade.pnl > 0 ? "+ $" : trade.pnl < 0 ? "- $" : "$"}
                    ${Math.abs(trade.pnl ?? 0)}

                </div>

            </div>



            <!-- BASIC INFORMATION -->

            <h3>Basic Information</h3>

            <div class="trade-details">

                <p>
                    <strong>Date</strong>
                    <span>${tradeDate}</span>
                </p>

                <p>
                    <strong>Pair</strong>
                    <span>${trade.pair || "-"}</span>
                </p>

                <p>
                    <strong>Day</strong>
                    <span>
                        ${new Date(trade.date).toLocaleDateString(
                            "en-US",
                            { weekday: "long" }
                        )}
                    </span>
                </p>

                <p>
                    <strong>Session</strong>
                    <span>${trade.session || "-"}</span>
                </p>

                <p>
                    <strong>Bias</strong>
                    <span>${trade.bias || "-"}</span>
                </p>

                <p>
                    <strong>Direction</strong>
                    <span>${trade.direction || "-"}</span>
                </p>

            </div>



            <!-- SETUP -->

            <h3>Setup & Confluence</h3>

            <div class="trade-details">

                <p>
                    <strong>Setup Type</strong>
                    <span>${trade.setup || "-"}</span>
                </p>

                <p>
                    <strong>FVG</strong>
                    <span>${trade.fvg ? "Yes" : "No"}</span>
                </p>

                <p>
                    <strong>Fibonacci</strong>
                    <span>${trade.fib ? "Yes" : "No"}</span>
                </p>

                <p>
                    <strong>Correct SL</strong>
                    <span>${trade.correctSL ? "Yes" : "No"}</span>
                </p>

                <p>
                    <strong>Liquidity TP</strong>
                    <span>${trade.liquidityTP ? "Yes" : "No"}</span>
                </p>

            </div>



            <!-- ORDER DETAILS -->

            <h3>Order Details</h3>

            <div class="trade-details">

                <p>
                    <strong>Order Type</strong>
                    <span>${trade.orderType || "-"}</span>
                </p>

                <p>
                    <strong>Entry Price</strong>
                    <span>${trade.entryPrice ?? "-"}</span>
                </p>

                <p>
                    <strong>Stop Loss</strong>
                    <span>${trade.slPrice ?? "-"}</span>
                </p>

                <p>
                    <strong>Take Profit</strong>
                    <span>${trade.tpPrice ?? "-"}</span>
                </p>

                <p>
                    <strong>Entry Time</strong>
                    <span>${trade.entryTime || "-"}</span>
                </p>

                <p>
                    <strong>Exit Time</strong>
                    <span>${trade.exitTime || "-"}</span>
                </p>

            </div>



            <!-- RISK MANAGEMENT -->

            <h3>Risk Management</h3>

            <div class="trade-details">

                <p>
                    <strong>Within Risk</strong>
                    <span>${trade.withinRisk ? "Yes" : "No"}</span>
                </p>

                <p>
                    <strong>Risk %</strong>
                    <span>${trade.riskPercent ?? "-"}</span>
                </p>

                <p>
                    <strong>Planned RR</strong>
                    <span>${trade.plannedRR ?? "-"}</span>
                </p>

                <p>
                    <strong>Achieved RR</strong>
                    <span>${trade.achievedRR ?? "-"}</span>
                </p>

            </div>



            <!-- PSYCHOLOGY -->

            <h3>Psychology</h3>

            <div class="trade-details">

                <p>
                    <strong>Emotional Trade</strong>
                    <span>
                        ${trade.emotionalTrade ? "Yes" : "No"}
                    </span>
                </p>

                <p>
                    <strong>Account</strong>
                    <span>${trade.account || "-"}</span>
                </p>

            </div>



            <!-- TRADE RESULT -->

            <h3>Trade Result</h3>

            <div class="trade-details">

                <p>
                    <strong>P&L</strong>
                    <span class="${pnlClass}">
                        ${trade.pnl > 0 ? "+ $" : trade.pnl < 0 ? "- $" : "$"}
                        ${Math.abs(trade.pnl ?? 0)}
                    </span>
                </p>

                <p>
                    <strong>Pros</strong>
                    <span>${trade.pros || "-"}</span>
                </p>

                <p>
                    <strong>Cons</strong>
                    <span>${trade.cons || "-"}</span>
                </p>

                <p>
                    <strong>Reason</strong>
                    <span>${trade.reason || "-"}</span>
                </p>

                <p>
                    <strong>Lesson</strong>
                    <span>${trade.lesson || "-"}</span>
                </p>

            </div>



            <!-- SCREENSHOT -->

            <h3>Trade Screenshot</h3>

            ${
                trade.screenshot
                ?
                `
                <div class="screenshot-container">

                    <img
                        src="http://localhost:5000/${trade.screenshot.replaceAll("\\", "/")}"
                        class="trade-image"
                        alt="Trade Screenshot"
                    >

                </div>
                `
                :
                "<p class='no-image'>No screenshot attached</p>"
            }



            <!-- ACTIONS -->

            <div class="trade-actions">

                <button
                    class="edit-btn"
                    onclick="openEditPage('${trade._id}')"
                >
                    Edit Trade
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTrade('${trade._id}')"
                >
                    Delete Trade
                </button>

            </div>

        `;



        tradesContainer.appendChild(tradeCard);

    });

}



// Apply filters
function applyFilters() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedSession =
        sessionFilter.value;

    const selectedDirection =
        directionFilter.value;

    const selectedResult =
        resultFilter.value;

    const selectedSetup =
        setupFilter.value;

    const selectedEmotional =
        emotionalFilter.value;

    const selectedRisk =
        riskFilter.value;

    const selectedFVG =
        fvgFilter.value;

    const selectedFib =
        fibFilter.value;

    const selectedAccount =
        accountFilter.value;



    const filteredTrades =
        allTrades.filter((trade) => {


            // Search
            const matchesSearch =
                (trade.pair || "")
                    .toLowerCase()
                    .includes(searchText)
                ||
                (trade.setup || "")
                    .toLowerCase()
                    .includes(searchText);



            // Session
            const matchesSession =
                selectedSession === "" ||
                trade.session === selectedSession;



            // Direction
            const matchesDirection =
                selectedDirection === "" ||
                trade.direction === selectedDirection;



            // Result
            let matchesResult = true;

            if (selectedResult === "profit") {

                matchesResult =
                    trade.pnl > 0;

            }

            if (selectedResult === "loss") {

                matchesResult =
                    trade.pnl < 0;

            }

            if (selectedResult === "breakeven") {

                matchesResult =
                    trade.pnl === 0;

            }



            // Setup
            const matchesSetup =
                selectedSetup === "" ||
                trade.setup === selectedSetup;



            // Emotional
            let matchesEmotional = true;

            if (selectedEmotional === "emotional") {

                matchesEmotional =
                    trade.emotionalTrade === true;

            }

            if (selectedEmotional === "normal") {

                matchesEmotional =
                    trade.emotionalTrade === false;

            }



            // Risk
            let matchesRisk = true;

            if (selectedRisk === "within") {

                matchesRisk =
                    trade.withinRisk === true;

            }

            if (selectedRisk === "violation") {

                matchesRisk =
                    trade.withinRisk === false;

            }



            // FVG
            let matchesFVG = true;

            if (selectedFVG === "yes") {

                matchesFVG =
                    trade.fvg === true;

            }

            if (selectedFVG === "no") {

                matchesFVG =
                    trade.fvg === false;

            }



            // Fibonacci
            let matchesFib = true;

            if (selectedFib === "yes") {

                matchesFib =
                    trade.fib === true;

            }

            if (selectedFib === "no") {

                matchesFib =
                    trade.fib === false;

            }



            // Account
            const matchesAccount =
                selectedAccount === "" ||
                trade.account === selectedAccount;



            return (
                matchesSearch &&
                matchesSession &&
                matchesDirection &&
                matchesResult &&
                matchesSetup &&
                matchesEmotional &&
                matchesRisk &&
                matchesFVG &&
                matchesFib &&
                matchesAccount
            );

        });



    displayTrades(filteredTrades);

}



// Search and filters
searchInput.addEventListener(
    "input",
    applyFilters
);

sessionFilter.addEventListener(
    "change",
    applyFilters
);

directionFilter.addEventListener(
    "change",
    applyFilters
);

resultFilter.addEventListener(
    "change",
    applyFilters
);

setupFilter.addEventListener(
    "change",
    applyFilters
);

emotionalFilter.addEventListener(
    "change",
    applyFilters
);

riskFilter.addEventListener(
    "change",
    applyFilters
);

fvgFilter.addEventListener(
    "change",
    applyFilters
);

fibFilter.addEventListener(
    "change",
    applyFilters
);

accountFilter.addEventListener(
    "change",
    applyFilters
);



// Clear all filters
clearFilters.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        sessionFilter.value = "";

        directionFilter.value = "";

        resultFilter.value = "";

        setupFilter.value = "";

        emotionalFilter.value = "";

        riskFilter.value = "";

        fvgFilter.value = "";

        fibFilter.value = "";

        accountFilter.value = "";

        displayTrades(allTrades);

    }
);



// Open edit page
function openEditPage(id) {

    window.location.href =
        `edit-trade.html?id=${id}`;

}



// Delete trade
async function deleteTrade(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this trade?"
        );

    if (!confirmDelete) {

        return;

    }



    try {

        const response =
            await fetch(
                `http://localhost:5000/api/trades/${id}`,
                {
                    method: "DELETE"
                }
            );



        const result =
            await response.json();



        if (response.ok) {

            alert(
                "Trade deleted successfully!"
            );

            loadTrades();

        } else {

            alert(
                "Failed to delete trade."
            );

            console.error(result);

        }



    } catch (error) {

        alert(
            "Server connection failed."
        );

        console.error(error);

    }

}



// Start
loadTrades();