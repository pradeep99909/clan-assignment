const { tradeSchema, portfolioSchema } = require('../../models');
const config = require('../../config');
const portfolioServices = require('./portfolioServices');
const mongoose = require('mongoose');

exports.addTrade = async (tradeData) => {
  try {
    console.log('tradeData ::', tradeData);
    const {
      symbol,
      quantity,
      price,
      type,
    } = tradeData;
    const query = {
      dematAccNo: 'ABC',
      symbol,
    };
    const portfolioModel = new portfolioSchema();
    const tradePortfolio = await portfolioModel.collection.findOne(query, {}, { lean: true });
    console.log('🚀 ~ tradePortfolio:', tradePortfolio);
    let portfolio;
    if (type === config.ENUM.TRADE_ACTION.BUY && tradePortfolio) {
      tradePortfolio.quantity += quantity;
      tradePortfolio.buyedPrice = (tradePortfolio.buyedPrice + (price * quantity)) / tradePortfolio.quantity + quantity;
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
    const query = {
      dematAccNo: 'ABC',
      symbol,
    };
    const tradeQuery = {
      _id: new mongoose.Types.ObjectId(tradeId),
    };
    const tradeModel = new tradeSchema();
    const trade = await tradeModel.collection.findOne(tradeQuery, { lean: true });
    console.log("🚀 ~ exports.updateTrade= ~ trade:", trade)
    if(!trade) throw "Trade Do not Exist!";
    const portfolioModel = new portfolioSchema();
    const tradePortfolio = await portfolioModel.collection.findOne(query, { lean: true });
    console.log('🚀 ~ tradePortfolio:', tradePortfolio);
    let portfolio;
    if (trade.type === config.ENUM.TRADE_ACTION.BUY && tradePortfolio) {
      tradePortfolio.quantity += quantity;
      tradePortfolio.buyedPrice = (tradePortfolio.buyedPrice + (price * quantity)) / tradePortfolio.quantity + quantity;
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
        const query = {
          dematAccNo: trade.dematAccNo,
          symbol: trade.symbol,
        };
        const update = {
          $inc: {
            quantity: -trade.quantity,
          },
        };
        const portfolioModel = new portfolioSchema();
        const portfolio = await portfolioModel.collection.findOneAndUpdate(query, update, { lean: true, new: true });
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
