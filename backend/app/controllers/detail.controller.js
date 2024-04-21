const DetailService = require("../services/detail.service")
const detailService = new DetailService();

exports.findAll = async (req, res) => {
    try {
        const result = await detailService.findAll();
        return res.json(result)
    }catch (e) {
        console.log(e.message)
    }
};

exports.create = async (req, res) => {
    try {
        const result = await detailService.create(req);
        return res.json(result)
    }catch (e) {
        console.log(e.message)
    }
};

exports.findOne = async (req, res) => {
    try {
        const result = await detailService.findOne(req);
        return res.json(result)
    }catch (e) {
        console.log(e.message)
    }
};


exports.update = async (req, res) => {
    try {
        const result = await detailService.update(req);
        return res.json(result)
    }catch (e) {
        console.log(e.message)
    }
};

exports.findAllUser = async (req,res) => {
    try {
        const result = await detailService.findAllByUser(req);
        return res.json(result)
    }catch (e) {
        console.log(e.message)
    }
};
