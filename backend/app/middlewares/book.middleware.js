const Book = require("../models/Book");
const ApiError = require("../api-error");
const {ObjectId} = require("mongodb");

class BookMiddleware{
    async create(req,res,next){
        try {
            const {name,price, quantity, year, author , publishing, favorites} = req.body
            let existBook = await Book.findOne({name: name});
            if(existBook){
                return res.status(409).json(new ApiError(409,`${name} đã tồn tại`))
            }
            next();
        }catch (e) {
            console.log(e.message);
        }
    }
    async update(req,res,next){
        try {
            const id = req.params.id;
            let currentBook = await Book.findOne({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });
            const {name,price, images, quantity, year, author , publishing, favorites} = req.body
            if(!currentBook){
                return res.status(404).json(new ApiError(404,`Không tìm thấy sách với ID: ${id}`))
            }
            if(!name || !price || !quantity){
                return res.status(400).json(new ApiError(400, "Dữ liêu rỗng"))
            }
            next()
        }catch (e) {
            console.log(e.message)
        }
    }
    async get(req,res,next){
        try {
            const id = req.params.id;
            let currentBook = await Book.findOne({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });
            const {name,price, quantity, year, author , publishing, favorites} = req.body
            if(!currentBook){
                return res.status(404).json(new ApiError(404,`Không tìm thấy sách với ID: ${id}`))
            }
        }catch (e) {
            console.log(e.message)
        }
    }
}
module.exports=BookMiddleware