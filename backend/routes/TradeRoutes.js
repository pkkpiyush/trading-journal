const express = require("express");
const Trade = require("../models/trade");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Add a new trade
router.post("/", upload.single("screenshot"), async (req, res) => {
    try {
        const tradeData = req.body;

        if (req.file) {
            tradeData.screenshot = req.file.path;
        }

        const trade = new Trade(tradeData);

        const savedTrade = await trade.save();

        res.status(201).json(savedTrade);
    } catch (error) {
        res.status(400).json({
            message: "Failed to save trade",
            error: error.message
        });
    }
});

// Get all trades
router.get("/", async (req, res) => {
    try {
        const trades = await Trade.find();

        res.json(trades);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch trades",
            error: error.message
        });
    }
});

module.exports = router;


// Get one trade by ID
router.get("/:id", async (req, res) => {

    try {

        const trade = await Trade.findById(req.params.id);

        if (!trade) {

            return res.status(404).json({
                message: "Trade not found"
            });

        }

        res.json(trade);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch trade",
            error: error.message
        });

    }

});


// Delete a trade
router.delete("/:id", async (req, res) => {
    try {
        const deletedTrade = await Trade.findByIdAndDelete(req.params.id);

        if (!deletedTrade) {
            return res.status(404).json({
                message: "Trade not found"
            });
        }

        res.json({
            message: "Trade deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete trade",
            error: error.message
        });
    }
});

// PUT update
router.put("/:id", upload.single("screenshot"), async (req, res) => {

    try {

        const trade = await Trade.findById(req.params.id);

        if (!trade) {

            // If a new screenshot was uploaded but trade doesn't exist,
            // remove the newly uploaded file.

            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }

            return res.status(404).json({
                message: "Trade not found"
            });

        }


        const tradeData = req.body;


        // New screenshot uploaded
        const newScreenshot = req.file;


        // User selected "Delete existing screenshot"
        const wantsToDelete =
            tradeData.deleteScreenshot === "true";


        /*
         * CASE 1:
         * New screenshot uploaded
         *
         * Replace old screenshot.
         */

        if (newScreenshot) {

            // Delete old screenshot if one exists

            if (trade.screenshot) {

                const oldPath =
                    trade.screenshot.replaceAll("\\", "/");

                fs.unlink(oldPath, (error) => {

                    if (error && error.code !== "ENOENT") {
                        console.log(
                            "Failed to delete old screenshot:",
                            error.message
                        );
                    }

                });

            }


            // Save new screenshot path

            tradeData.screenshot =
                newScreenshot.path;


            // Delete flag is no longer needed

            delete tradeData.deleteScreenshot;

        }


        /*
         * CASE 2:
         * Delete checked and no new screenshot uploaded.
         */

        else if (wantsToDelete) {

            if (trade.screenshot) {

                const oldPath =
                    trade.screenshot.replaceAll("\\", "/");

                fs.unlink(oldPath, (error) => {

                    if (error && error.code !== "ENOENT") {
                        console.log(
                            "Failed to delete screenshot:",
                            error.message
                        );
                    }

                });

            }


            // Remove screenshot from MongoDB

            tradeData.$unset = {
                screenshot: 1
            };


            delete tradeData.deleteScreenshot;

        }


        /*
         * CASE 3:
         * Nothing changed.
         *
         * Keep existing screenshot.
         */

        else {

            delete tradeData.deleteScreenshot;

        }


        let updatedTrade;


        if (tradeData.$unset) {

            const unsetData =
                tradeData.$unset;

            delete tradeData.$unset;


            updatedTrade =
                await Trade.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: tradeData,
                        $unset: unsetData
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

        } else {

            updatedTrade =
                await Trade.findByIdAndUpdate(
                    req.params.id,
                    tradeData,
                    {
                        new: true,
                        runValidators: true
                    }
                );

        }


        res.json(updatedTrade);


    } catch (error) {

        // If update failed after a new screenshot was uploaded,
        // remove the newly uploaded file to avoid an orphan file.

        if (req.file) {

            fs.unlink(
                req.file.path,
                () => {}
            );

        }


        res.status(400).json({

            message: "Failed to update trade",

            error: error.message

        });

    }

});