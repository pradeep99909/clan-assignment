const {
    services
} = require("../services");

exports.addTrade = async (req, res) => {
    try {
        const data = await services.tradeServices.addTrade(req.body);
        res.status(200).send({ data });
    }
    catch(error) {
        res.status(500).send({ error });
    }
}

exports.updateTrade = async (req, res) => {
    try {
        const tradeId = req.body.tradeId;
        res.status(200).send({ data: await services.tradeServices.updateTrade(tradeId, req.body) });
    }
    catch(error) {
        res.status(500).send({ error });
    }
}

exports.removeTrade = async (req, res) => {
    try {
        const tradeId = req.body.tradeId;
        res.status(200).send({ data: await services.tradeServices.removeTrade(tradeId) });
    }
    catch(error) {
        res.status(500).send({ error });
    }
}