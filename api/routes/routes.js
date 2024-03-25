const express = require("express");
const router = express.Router();
const {
    controllers
} = require("../controllers");


router.get("/portfolio", controllers.portfolioControlers.portfolio);
router.get("/holdings", controllers.portfolioControlers.holdings);
router.get("/returns", controllers.portfolioControlers.returns);

router.post("/addTrade", controllers.tradeControllers.addTrade);
router.post("/updateTrade", controllers.tradeControllers.updateTrade);
router.post("/removeTrade", controllers.tradeControllers.removeTrade);

module.exports = router;