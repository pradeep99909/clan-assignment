const { tradeSchema, portfolioSchema } = require("../../models");
const config = require("../../config");

exports.portfolio = async (dematAccNo) => {
    try {
        console.log("🚀 ~ exports.portfolio= ~ dematAccNo:", dematAccNo)
        const group = {
            $group: {
                _id: "$symbol",
                trades: {
                    $push: {
                        currentPrice: "$currentPrice",
                        quantity: "$quantity",
                        dematAccNo: "$dematAccNo",
                    }
                }
            }
        };
        const pipeline = [group];
        console.log("🚀 ~ exports.portfolio= ~ pipeline:", pipeline)
        const tradeModel = new tradeSchema();
        const portfolio = await tradeModel.collection.aggregate(pipeline).toArray();
        console.log("🚀 ~ exports.portfolio= ~ portfolio:", portfolio)
        return portfolio;
    }
    catch (err) {
        console.error("🚀 ~ exports.portfolio= ~ err:", err)
        throw error;
    }
}

exports.holdings = async (dematAccNo) => {
    console.log("🚀 ~ exports.portfolio= ~ dematAccNo:", dematAccNo)
    const query = {
        dematAccNo
    };
    console.log("🚀 ~ exports.portfolio= ~ query:", query)
    const portfolioModel = new portfolioSchema();
    const holdings = await portfolioModel.collection.find(query , {}, { lean: true }).toArray();
    console.log("🚀 ~ exports.portfolio= ~ holdings:", holdings)
    return holdings;
}

exports.returns = async (dematAccNo) => {
    try {
        const query = {
            dematAccNo
        };
        console.log("🚀 ~ exports.portfolio= ~ query:", query)
        const portfolioModel = new portfolioSchema();
        const portfolioStocks = await portfolioModel.collection.find(query,{}, { lean: true }).toArray();
        console.log("🚀 ~ exports.returns= ~ portfolioStocks:", portfolioStocks)
        let totalBuyAmount = 0;
        let totalSellAmount = 0;
        for (stock of portfolioStocks) {
            console.log("🚀 ~ exports.returns= ~ stock:", stock)
            const query = {
                dematAccNo: dematAccNo,
                symbol: stock.symbol
            }
            console.log("🚀 ~ exports.returns= ~ query:", query)
            const tradeModel = new tradeSchema();
            const trades = await tradeModel.collection.find(query, {}, { lean: true }).toArray();
            console.log("🚀 ~ exports.returns= ~ trades:", trades)
            for (trade of trades) {
                console.log("🚀 ~ cumulativeReturns ~ trade:", trade)
                if (trade.type === config.ENUM.TRADE_ACTION.BUY) {
                    totalBuyAmount += trade.quantity * trade.currentPrice;
                } else if (trade.type === config.ENUM.TRADE_ACTION.SELL) {
                    totalSellAmount += trade.quantity * trade.currentPrice;
                }
            }
        };
        let cumulativeReturn = totalSellAmount - totalBuyAmount;
        console.log("🚀 ~ cumulativeReturns ~ cumulativeReturn:", cumulativeReturn)
        if (cumulativeReturn < 0 && totalSellAmount === 0) {
            cumulativeReturn = Math.abs(cumulativeReturn);
        }
        let returnPercentage = (cumulativeReturn / totalBuyAmount) * 100;
        console.log("🚀 ~ cumulativeReturns ~ returnPercentage:", returnPercentage)
        if (totalBuyAmount !== 0) {
            returnPercentage = (cumulativeReturn / totalBuyAmount) * 100;
        }
        
        // Ensure cumulative return is positive if only buy trades
        return {
            cumulativeReturn,
            returnPercentage
        };
    } catch (error) {
        console.error('Error calculating cumulative returns:', error);
        throw error;
      }
}

exports.addPortfolio = async (portfolioData) => {
    const {
        symbol,
        quantity,
        price
    } = portfolioData;
    const portfolioModel = new portfolioSchema({
        dematAccNo: "ABC",
        symbol,
        quantity,
        buyedPrice: price * quantity
    });
    return await portfolioModel.save();
}

exports.getportfolioBySymbol = async (dematAccNo, symbol) => {
    const query = {
        dematAccNo,
        symbol
    }
    const portfolioModel = new portfolioSchema();
    const portfolio = await portfolioModel.collection.findOne(query, {}, { lean: true});
    console.log("🚀 ~ getportfolioBySymbol ~ portfolio:", portfolio)
    return portfolio;
}

exports.removeSymbolPortfolio = async (dematAccNo, symbol) => {
    const query = {
        dematAccNo,
        symbol
    }
    const portfolioModel = new portfolioSchema();
    const portfolio = await portfolioModel.collection.deleteOne(query, {}, { lean: true });
    console.log("🚀 ~ removeSymbolPortfolio ~ portfolio:", portfolio)
    return portfolio;
}

exports.updatePortFolio = async (portfoilioData) => {
    const query = {
        dematAccNo: portfoilioData.dematAccNo,
        symbol: portfoilioData.symbol
    };
    const update = {
        $set: {}
    }
    if (portfoilioData.quantity) {
        update['$set']['quantity'] = portfoilioData.quantity;
    }
    if (portfoilioData.buyedPrice) {
        update['$set']['buyedPrice'] = portfoilioData.quantity;
    }
    const portfolioModel = new portfolioSchema();
    const portfolio = await portfolioModel.collection.findOneAndUpdate(query, update, { lean: true, new: true });
    return portfolio;
}