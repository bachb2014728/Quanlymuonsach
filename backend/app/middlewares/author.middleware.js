const Author = require("../models/Author");
const ApiError = require("../api-error");
const {ObjectId} = require("mongodb");

class AuthorMiddleware{
    async create(req,res,next){
        try {
            const {name,code} = req.body
            if(!name || !code){
                return res.status(400).json(new ApiError(400,"Thêm thiếu dữ liệu"));
            }
            let existAuthor = await Author.findOne({code});


            if(existAuthor){
                return res.status(409).json(new ApiError(409,`${name} đã tồn tại`))
            }
            next();
        }catch (e) {
            console.log(e.message);
        }
    }
    async getOne(req,res,next){
        try {
            const id = req.params.id;
            if(!id){
                return res.status(400).json(new ApiError(400,"Id là rỗng"))
            }
            const existAuthor = await Author.findOne({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            })
            if(!existAuthor){
                return res.status(404).json(new ApiError(404, `Không tìm thấy ${id}`))
            }
            next();
        }catch (e) {
            console.log(e.message);
        }
    }
    async update(req,res,next){
        try {
            const _id = req.params.id;
            const {name,code} = req.body;
            if(!_id){
                return res.status(400).json(new ApiError(400,"Id là rỗng"))
            }
            const existAuthor = await Author.findOne({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });
            if(!existAuthor){
                return res.status(404).json(new ApiError(404, `Không tìm thấy ${_id}`))
            }
            if(!name || !code){
                return res.status(400).json(new ApiError(400,"Giá trị không là rỗng"))
            }

            next();
        }catch (e) {
            console.log(e.message);
        }
    }
    async delete(req,res,next){
        try {
            const id = req.params.id;
            const {name,code} = req.body;
            if(!id){
                return res.status(400).json(new ApiError(400,"Id là rỗng"))
            }
            const existAuthor = await Author.findOne({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            })
            if(!existAuthor){
                return res.status(404).json(new ApiError(404, `Không tìm thấy ${id}`))
            }
            next();
        }catch (e) {
            console.log(e.message)
        }
    }
}
module.exports=AuthorMiddleware
