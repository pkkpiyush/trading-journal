const tradeForm = document.getElementById("tradeForm");

const screenshotInput = document.getElementById("screenshot");
const imagePreview = document.getElementById("imagePreview");

screenshotInput.addEventListener("change", () => {
    const file = screenshotInput.files[0];

    if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = "block";
    }
});

tradeForm.addEventListener("submit", async (event) => {
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
        entryPrice: Number(document.getElementById("entryPrice").value),
        slPrice: Number(document.getElementById("slPrice").value),
        tpPrice: Number(document.getElementById("tpPrice").value),

        entryTime: document.getElementById("entryTime").value,
        exitTime: document.getElementById("exitTime").value,

        withinRisk: document.getElementById("withinRisk").checked,
        riskPercent: Number(document.getElementById("riskPercent").value),
        plannedRR: Number(document.getElementById("plannedRR").value),
        achievedRR: Number(document.getElementById("achievedRR").value),

        emotionalTrade: document.getElementById("emotionalTrade").checked,

        account: document.getElementById("account").value,

        result: document.getElementById("result").value,

        pnl: Number(document.getElementById("pnl").value),

        pros: document.getElementById("pros").value,
        cons: document.getElementById("cons").value,
        reason: document.getElementById("reason").value,
        lesson: document.getElementById("lesson").value
    };

    const formData = new FormData();

    for (const key in tradeData) {
        formData.append(key, tradeData[key]);
    }

    const screenshot = document.getElementById("screenshot").files[0];

    if (screenshot) {
        formData.append("screenshot", screenshot);
    }

    try {
        const response = await fetch("http://localhost:5000/api/trades", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("message").textContent =
                "Trade saved successfully!";

            tradeForm.reset();

            console.log("Saved trade:", result);
        } else {
            document.getElementById("message").textContent =
                "Failed to save trade.";

            console.error(result);
        }

    } catch (error) {
        document.getElementById("message").textContent =
            "Server connection failed.";

        console.error(error);
    }
});