const PublishingService = require("../services/publishing.service");
const publishingService = new PublishingService();

exports.create = async (req, res) => {
    try {
        let result = await publishingService.create(req.body);
        return res.json(result);
    } catch (e) {
        console.log(e.message);
    }
};

exports.findAll = async (req, res) => {
    try {
        let result = await publishingService.getAll();
        return res.json(result);
    } catch (e) {
        console.log(e.message);
    }
};

exports.findOne = async (req, res) => {
    try {
        let result = await publishingService.getById(req.params.id);
        return res.json(result);
    } catch (e) {
        console.log(e.message);
    }
};

exports.update = async (req, res) => {
    try {
        let result = await publishingService.update(req.params.id, req.body);
        return res.json(result);
    } catch (e) {
        console.log(e.message);
    }
};

exports.delete = async (req, res) => {
    try {
        let result = await publishingService.delete(req.params.id);
        return res.json(result);
    } catch (e) {
        console.log(e.message);
    }
};

exports.deleteAll = async (req, res) => {
    try {
        let result = await publishingService.deleteAll();
        return res.json(result);
    } catch (e) {
        console.log(e.message);
    }
};

