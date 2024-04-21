const BookService = require("../services/book.service");
const bookService = new BookService();

exports.create = async(req, res, next) =>{
    try {
        const result = await bookService.create(req.body);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}

exports.findAllBook = async (req, res, next) =>{
    try {
        const result = await bookService.findAll();
        res.json(result)
    }catch (e) {
        console.log(e.message);
    }
}

exports.update = async(req, res, next) =>{
    try {
        const result = await bookService.update(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}

exports.delete = async(req, res, next) =>{
    try {
        const result = await bookService.delete(req.params.id);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}

exports.deleteAll = async(req, res, next) =>{
    try {
        const result = await bookService.deleteAll();
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}
exports.getOne = async(req, res, next) =>{
    try {
        const result = await bookService.getOne(req.params.id);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}
