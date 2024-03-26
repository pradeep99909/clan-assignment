const { tradeSchema } = require('../../models');
const config = require('../../config');
const portfolioServices = require('./portfolioServices');
const mongoose = require('mongoose');

exports.getTrades = async (dematAccNo, symbol) => {
  console.log("🚀 ~ exports.getTrades= ~ dematAccNo, symbol:", dematAccNo, symbol)
  const query = {
      dematAccNo: dematAccNo,
      symbol: symbol
  }
  const tradeModel = new tradeSchema();
  const trades = await tradeModel.collection.find(query, {}, { lean: true }).toArray();
  return trades;
}

exports.addTrade = async (tradeData) => {
  try {
    console.log('tradeData ::', tradeData);
    const {
      symbol,
      quantity,
      price,
      type,
    } = tradeData;
    const tradePortfolio = await portfolioServices.getportfolioBySymbol('ABC', symbol);
    console.log('🚀 ~ tradePortfolio:', tradePortfolio);
    let portfolio;
    if (type === config.ENUM.TRADE_ACTION.BUY && tradePortfolio) {
      tradePortfolio.quantity += quantity;
      tradePortfolio.buyedPrice = (tradePortfolio.buyedPrice + (price * quantity)) / tradePortfolio.quantity + quantity; //average caluation of price
      portfolio = await portfolioServices. updatePortFolio(tradePortfolio);
    } else if (type === config.ENUM.TRADE_ACTION.BUY && !tradePortfolio) {
      portfolio = await portfolioServices.addPortfolio(tradeData);
    } else if (type === config.ENUM.TRADE_ACTION.SELL && tradePortfolio) {
      tradePortfolio.quantity -= quantity;
      tradePortfolio.buyedPrice -= (price * quantity);
      portfolio = await portfolioServices.updatePortFolio(tradePortfolio);
    }
    console.log("🚀 ~ exports.addTrade= ~ portfolio:", portfolio)
    const tradeModel = new tradeSchema({
      dematAccNo: 'ABC',
      symbol,
      quantity,
      currentPrice: price,
      type,
      time: Date.now(),
    });
    const trade = await tradeModel.save();
    return trade;
  } catch (err) {
    console.error('addTrade :: err ::', err);
  }
};

exports.updateTrade = async (tradeId, tradeData) => {
  try {
    console.log('tradeData ::', tradeData);
    const {
      symbol,
      quantity,
      price
    } = tradeData;
    const tradeQuery = {
      _id: new mongoose.Types.ObjectId(tradeId),
    };
    const tradeModel = new tradeSchema();
    const trade = await tradeModel.collection.findOne(tradeQuery, { lean: true });
    console.log("🚀 ~ exports.updateTrade= ~ trade:", trade)
    if(!trade) throw "Trade Do not Exist!";
    const tradePortfolio = await portfolioServices.getportfolioBySymbol('ABC', symbol);
    console.log('🚀 ~ tradePortfolio:', tradePortfolio);
    let portfolio;
    if (trade.type === config.ENUM.TRADE_ACTION.BUY && tradePortfolio) {
      tradePortfolio.quantity += quantity;
      tradePortfolio.buyedPrice = (tradePortfolio.buyedPrice + (price * quantity)) / tradePortfolio.quantity + quantity; //average caluation of price
      portfolio = await portfolioServices.updatePortFolio(tradePortfolio);
    } else if (trade.type === config.ENUM.TRADE_ACTION.BUY && !tradePortfolio) {
      portfolio = await portfolioServices.addPortfolio(tradeData);
    } else if (trade.type === config.ENUM.TRADE_ACTION.SELL && tradePortfolio) {
      tradePortfolio.quantity -= quantity;
      tradePortfolio.buyedPrice -= (price * quantity);
      portfolio = await portfolioServices.updatePortFolio(tradePortfolio);
    }
    return await tradeModel.collection.findOneAndUpdate(tradeQuery, { 
      $set: { 
        quantity,
        currentPrice: price
      } 
    }, { lean: true, new: true });
  } catch (err) {
    console.error('addTrade :: err ::', err);
    throw err;
  }
};

exports.removeTrade = async (tradeId) => {
  try {
    const query = {
      _id: new mongoose.Types.ObjectId(tradeId),
    };
    const tradeModel = new tradeSchema();
    const trade = await tradeModel.collection.findOne(query, {}, { lean: true });
    console.log('🚀 ~ trade:', trade);
    if (!trade) throw 'No Trade found!';
    if (trade.type == config.ENUM.TRADE_ACTION.BUY) {
      const portfolio = portfolioServices.getportfolioBySymbol(trade.dematAccNo, trade.symbol);
      console.log('🚀 ~ portfolio:', portfolio);
      if (portfolio.quantity - trade.quantity <= 0) {
        await portfolioServices.removeSymbolPortfolio(trade.dematAccNo, trade.symbol);
      } else {
        const portfolio = await portfolioServices.updatePortFolio(trade);
        console.log('🚀 ~ getportfolioBySymbol ~ portfolio:', portfolio);
      }
    }
    const removeTrade = await tradeModel.collection.findOneAndDelete(query, { lean: true, new: true });
    return removeTrade;
  } catch (err) {
    console.error('addTrade :: err ::', err);
    throw err;
  }
};