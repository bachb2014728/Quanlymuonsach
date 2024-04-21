const Author = require("../models/Author");
const Book = require("../models/Book")
const {ObjectId} = require("mongodb");

class AuthorService{
    extractAuthorData(payload) {
        const object = {
            name: payload.name,
            code: payload.code,
            books:payload.books
        };
        Object.keys(object).forEach(
            (key) => object[key] === undefined && delete object[key]
        );
        return object;
    }
    async create(data) {
        try {
            const author = this.extractAuthorData(data);
            const result = await new Author(author);
            return await result.save();
        } catch (error) {
            console.log(error.message);
        }
    }
    async findAll(){
        try {
            return await Author.find({});
        }catch (e) {
            console.log(e.message);
        }
    }
    async getOne(id){
        try {
            return await Author.findById({_id : id})
        }catch (e) {
            console.log(e.message);
        }
    }
    async update(data,id){
        try {
            const filter = {
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            };
            const update = this.extractAuthorData(data);
            return await Author.findOneAndUpdate(
                filter,
                {$set: update},
                {returnDocument: "after"}
            );
        }catch (e) {
            console.log(e.message);
        }
    }
    async delete(id){
        try {
            const authorItem = await Author.findById(id);
            if (!authorItem) {
                return { message: 'Tác giả không tồn tại' };
            }

            const result = await Author.findOneAndDelete({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });

            await Book.updateMany(
                { author: ObjectId.isValid(id) ? new ObjectId(id) : null },
                { $unset: { author: "" } }
            );

            return {
                message: 'Xoa thành công'
            };
        } catch (e) {
            console.log(e.message);
        }
    }
    async deleteAll(){
        try {
            await Author.deleteMany({});

            await Book.updateMany({}, { $unset: { author: "" } });

            return {
                message: 'Đã xóa tất cả tác giả và cập nhật sách thành công'
            };
        } catch (e) {
            console.log(e.message);
        }
    }

}

module.exports= AuthorService