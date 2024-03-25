const {
    services
} = require("../services");

exports.portfolio = async (req, res) => {
    try {
        const data = await services.portfolioServices.portfolio(req.body.dematAccNo);
        res.status(200).send({ data });
    }
    catch(error) {
        res.status(500).send({ error });
    }
}

exports.holdings = async (req, res) => {
    try {
        const data= await services.portfolioServices.holdings(req.body.dematAccNo);
        res.status(200).send({ data});
    }
    catch(error) {
        res.status(500).send({ error });
    }
}

exports.returns = async (req, res) => {
    try {
        const data = await services.portfolioServices.returns(req.body.dematAccNo)
        res.status(200).send({ data });
    }
    catch(error) {
        res.status(500).send({ error });
    }
}