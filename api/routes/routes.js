const express = require("express");
const router = express.Router();
const controllers = require("../controllers");


router.get("/portfolio", controllers.portfolioControllers.portfolio);
router.get("/holdings", controllers.portfolioControllers.holdings);
router.get("/returns", controllers.portfolioControllers.returns);

router.post("/addTrade", controllers.tradeControllers.addTrade);
router.post("/updateTrade", controllers.tradeControllers.updateTrade);
router.post("/removeTrade", controllers.tradeControllers.removeTrade);

module.exports = router;