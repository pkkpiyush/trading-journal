const editTradeForm = document.getElementById("editTradeForm");

const message = document.getElementById("message");

const screenshotInput = document.getElementById("screenshot");
const imagePreview = document.getElementById("imagePreview");
const currentScreenshot = document.getElementById("currentScreenshot");
const deleteScreenshot = document.getElementById("deleteScreenshot");


// Get trade ID from URL
const urlParams = new URLSearchParams(window.location.search);
const tradeId = urlParams.get("id");


// Check if trade ID exists
if (!tradeId) {

    message.textContent = "No trade ID found.";

} else {

    loadTrade();

}


// Load existing trade
async function loadTrade() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/trades/${tradeId}`
        );

        const trade = await response.json();


        if (!response.ok) {

            message.textContent = "Failed to load trade.";
            return;

        }


        // Basic Information

        document.getElementById("date").value =
            trade.date ? trade.date.substring(0, 10) : "";

        document.getElementById("pair").value =
            trade.pair || "";

        document.getElementById("session").value =
            trade.session || "";

        document.getElementById("bias").value =
            trade.bias || "";

        document.getElementById("direction").value =
            trade.direction || "";


        // Setup & Confluence

        document.getElementById("setup").value =
            trade.setup || "";

        document.getElementById("fvg").checked =
            trade.fvg || false;

        document.getElementById("fib").checked =
            trade.fib || false;

        document.getElementById("correctSL").checked =
            trade.correctSL || false;

        document.getElementById("liquidityTP").checked =
            trade.liquidityTP || false;


        // Order Details

        document.getElementById("orderType").value =
            trade.orderType || "";

        document.getElementById("entryPrice").value =
            trade.entryPrice ?? "";

        document.getElementById("slPrice").value =
            trade.slPrice ?? "";

        document.getElementById("tpPrice").value =
            trade.tpPrice ?? "";

        document.getElementById("entryTime").value =
            trade.entryTime || "";

        document.getElementById("exitTime").value =
            trade.exitTime || "";


        // Risk Management

        document.getElementById("withinRisk").checked =
            trade.withinRisk || false;

        document.getElementById("riskPercent").value =
            trade.riskPercent ?? "";

        document.getElementById("plannedRR").value =
            trade.plannedRR ?? "";

        document.getElementById("achievedRR").value =
            trade.achievedRR ?? "";


        // Psychology

        document.getElementById("emotionalTrade").checked =
            trade.emotionalTrade || false;

        document.getElementById("account").value =
            trade.account || "";


        // Trade Result

        document.getElementById("result").value =
        trade.result || "";

        document.getElementById("pnl").value =
            trade.pnl ?? "";

        document.getElementById("pros").value =
            trade.pros || "";

        document.getElementById("cons").value =
            trade.cons || "";

        document.getElementById("reason").value =
            trade.reason || "";

        document.getElementById("lesson").value =
            trade.lesson || "";


        // Existing screenshot

        if (trade.screenshot) {

            const imagePath =
                trade.screenshot.replaceAll("\\", "/");

            currentScreenshot.innerHTML = `
                Current Screenshot:
                <br><br>

                <img
                    src="http://localhost:5000/${imagePath}"
                    class="trade-image"
                    alt="Current Trade Screenshot"
                >
            `;

        } else {

            currentScreenshot.textContent =
                "No screenshot attached.";

        }


    } catch (error) {

        message.textContent =
            "Server connection failed.";

        console.error(error);

    }

}


// Preview new screenshot
screenshotInput.addEventListener("change", () => {

    const file = screenshotInput.files[0];

    if (file) {

        imagePreview.src =
            URL.createObjectURL(file);

        imagePreview.style.display =
            "block";

    }

});


// Update trade
editTradeForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const tradeData = {

        date: document.getElementById("date").value,

        pair: document.getElementById("pair").value,

        session: document.getElementById("session").value,

        bias: document.getElementById("bias").value,

        direction: document.getElementById("direction").value,


        setup: document.getElementById("setup").value,

        fvg: document.getElementById("fvg").checked,

        fib: document.getElementById("fib").checked,

        correctSL: document.getElementById("correctSL").checked,

        liquidityTP: document.getElementById("liquidityTP").checked,


        orderType: document.getElementById("orderType").value,

        entryPrice: Number(
            document.getElementById("entryPrice").value
        ),

        slPrice: Number(
            document.getElementById("slPrice").value
        ),

        tpPrice: Number(
            document.getElementById("tpPrice").value
        ),

        entryTime: document.getElementById("entryTime").value,

        exitTime: document.getElementById("exitTime").value,


        withinRisk:
            document.getElementById("withinRisk").checked,

        riskPercent: Number(
            document.getElementById("riskPercent").value
        ),

        plannedRR: Number(
            document.getElementById("plannedRR").value
        ),

        achievedRR: Number(
            document.getElementById("achievedRR").value
        ),


        emotionalTrade:
            document.getElementById("emotionalTrade").checked,

        account:
            document.getElementById("account").value,


        result:
            document.getElementById("result").value,

        pnl: Number(
            document.getElementById("pnl").value
        ),

        pros: document.getElementById("pros").value,

        cons: document.getElementById("cons").value,

        reason: document.getElementById("reason").value,

        lesson: document.getElementById("lesson").value

    };


    const formData = new FormData();


    // Add all trade data
    for (const key in tradeData) {

        formData.append(
            key,
            tradeData[key]
        );

    }


    // Screenshot handling

    const screenshot =
        screenshotInput.files[0];


    // Tell backend whether user wants to delete
    // the existing screenshot

    formData.append(
        "deleteScreenshot",
        deleteScreenshot.checked
    );


    // Add new screenshot if selected

    if (screenshot) {

        formData.append(
            "screenshot",
            screenshot
        );

    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/trades/${tradeId}`,
            {
                method: "PUT",
                body: formData
            }
        );


        const result =
            await response.json();


        if (response.ok) {

            message.textContent =
                "Trade updated successfully!";

            console.log(
                "Updated trade:",
                result
            );

            setTimeout(() => {

                window.location.href =
                    "trade-history.html";

            }, 1000);

        } else {

            message.textContent =
                "Failed to update trade.";

            console.error(result);

        }


    } catch (error) {

        message.textContent =
            "Server connection failed.";

        console.error(error);

    }

});