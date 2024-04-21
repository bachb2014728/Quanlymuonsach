const AuthorService = require("../services/author.service")

const authorService = new AuthorService();
exports.create = async (req,res) =>{
    try {
        const result = await authorService.create(req.body);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}
exports.findAll = async (req,res) =>{
    try {
        const result = await authorService.findAll();
        res.json(result);
    }catch (e) {
        console.log(e.message)
    }
}
exports.findOne = async(req,res) =>{
    try {
        const result = await authorService.getOne(req.params.id);
        res.json(result)
    }catch (e) {
        console.log(e.message);
    }
}
exports.update = async(req,res) =>{
    try {
        const result = await authorService.update(req.body, req.params.id);
        res.json(result)
    }catch (e) {
        console.log(e.message);
    }
}
exports.delete = async(req,res) =>{
    try {
        const result = await authorService.delete(req.params.id);
        res.json(result)
    }catch (e) {
        console.log(e.message);
    }
}
exports.deleteAll = async(req,res) =>{
    try {
        const result = await authorService.deleteAll();
        res.json(result)
    }catch (e) {
        console.log(e.message);
    }
}