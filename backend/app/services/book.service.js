const Book = require("../models/Book")
const Author = require("../models/Author")
const Publishing = require("../models/Publishing")
const {ObjectId} = require("mongodb");
class BookService{
    async create(data) {
        try {
            const {name,price, quantity, year, author , publishing, favorites} = data
            console.log(author.id);
            let authorItem = await Author.findOne({
                _id: ObjectId.isValid(author.id) ? new ObjectId(author.id) : null,
            });
            let publishingItem = await Publishing.findOne({
                _id: ObjectId.isValid(publishing.id) ? new ObjectId(publishing.id) : null,
            });
            let bookItem = await new Book({
                name,
                price,
                quantity,
                year,
                author: authorItem,
                publishing: publishingItem

            })
            const bookSave = await bookItem.save();

            authorItem.books.push(bookSave);
            await authorItem.save();

            publishingItem.books.push(bookSave)
            await publishingItem.save();
            return bookSave;
        } catch (error) {
            console.log(error.message);
        }
    }
    async getOne(id){
        try {
            return await Book.findOne({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });
        }catch (e) {
            console.log(e.message)
        }
    }
    async findAll(){
        try {
            return await Book.find({});
        }catch (e){
            console.log(e.message);
        }
    }
    async update(id, data) {
        try {
            const { name, price, quantity, year, author, publishing } = data;


            let currentBook = await Book.findOne({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });

            if (author.id !== String(currentBook.author._id) || publishing.id !== String(currentBook.publishing._id)) {
                await Author.updateOne(
                    { _id: currentBook.author._id },
                    { $pull: { books: currentBook._id } }
                );
                await Publishing.updateOne(
                    { _id: currentBook.publishing._id },
                    { $pull: { books: currentBook._id } }
                );
            }

            let authorItem = await Author.findOne({
                _id: ObjectId.isValid(author.id) ? new ObjectId(author.id) : null,
            });
            let publishingItem = await Publishing.findOne({
                _id: ObjectId.isValid(publishing.id) ? new ObjectId(publishing.id) : null,
            });

            let updatedBook = await Book.findByIdAndUpdate(id, {
                name,
                price,
                quantity,
                year,
                author: authorItem,
                publishing: publishingItem
            }, { new: true });

            await Author.updateOne(
                { _id: authorItem._id },
                { $addToSet: { books: updatedBook._id } }
            );
            await Publishing.updateOne(
                { _id: publishingItem._id },
                { $addToSet: { books: updatedBook._id } }
            );

            return updatedBook;
        } catch (error) {
            console.log(error.message);
        }
    }


    async delete(id) {
        try {
            return await Book.findByIdAndDelete(id);
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteAll() {
        try {
            return await Book.deleteMany({});
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = BookService