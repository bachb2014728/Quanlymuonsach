const Book = require("../models/Book")
const Author = require("../models/Author")
const Image = require("../models/Image")
const Publishing = require("../models/Publishing")
const {ObjectId} = require("mongodb");
const ImageService = require("../services/image.service")
const imageService = new ImageService();
class BookService{
    async create(data) {
        try {
            const {name,price, quantity, year, author , publishing, favorites, images} = data

            let authorItem = await Author.findOne({
                _id: ObjectId.isValid(author) ? new ObjectId(author) : null,
            });
            let imageLists = [];
            for (let id of images){
                let image = await Image.findOne({
                    _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
                });
                imageLists.push(image.id)
            }

            let publishingItem = await Publishing.findOne({
                _id: ObjectId.isValid(publishing) ? new ObjectId(publishing) : null,
            });

            const bookItem = await new Book({
                name: name,
                images: imageLists,
                price:price,
                quantity:quantity,
                year:year,
                author: authorItem,
                publishing: publishingItem

            })
            console.log(bookItem)
            await bookItem.save();

            authorItem.books.push(bookItem);
            await authorItem.save();

            publishingItem.books.push(bookItem)
            await publishingItem.save();
            return bookItem;
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
    async convertBook(payload){
        let images = await Promise.all((payload.images).map(async (item) => {
            return Buffer.from(await imageService.download(item)).toString('base64');
        }));
        let authorItem =  await Author.findOne(payload.author);
        let publishingItem = await Publishing.findOne(payload.publishing);
        const contact = {
            id: payload._id,
            name: payload.name,
            images: images,
            price:payload.price,
            quantity:payload.quantity,
            year:payload.year,
            author:authorItem,
            publishing:publishingItem,
            favorites: payload.favorites,
        }
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }
    async findAll(){
        try {
            let books =  await Book.find({});
            return await Promise.all(books.map(async (item) => {
                return this.convertBook(item);
            }));
        }catch (e){
            console.log(e.message);
        }
    }
    async update(id, data) {
        try {
            const { name, price,images, quantity, year, author, publishing } = data;
            let currentBook = await Book.findOne({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            })
            let newImageIds = [];
            if (images.length > 0) {
                if (currentBook.images.length > 0){
                    for (let index = 0 ; index < currentBook.images.length ; index++ ) {
                        await Image.deleteOne({ _id: currentBook.images[index] });
                    }
                }
                for (let id of images) {
                    let imageDoc = await Image.findOne({
                        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
                    });
                    newImageIds.push(imageDoc);
                }
            }else{
                newImageIds  = currentBook.images
            }
            if (author !== String(currentBook.author) || publishing !== String(currentBook.publishing)) {
                await Author.updateOne(
                    { _id: currentBook.author },
                    { $pull: { books: currentBook._id } }
                );
                await Publishing.updateOne(
                    { _id: currentBook.publishing },
                    { $pull: { books: currentBook._id } }
                );
            }
            let authorItem = await Author.findOne({
                _id: ObjectId.isValid(author._id) ? new ObjectId(author._id) : null,
            });
            let publishingItem = await Publishing.findOne({name: publishing.name});
            console.log(authorItem)
            let updatedBook = await Book.findOneAndUpdate(currentBook, {
                name,
                price,
                quantity,
                year,
                images: newImageIds,
                author: authorItem,
                publishing: publishingItem
            }, { new: true });
            console.log(updatedBook)
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
            let book = await Book.findById(id);
            for (let index = 0 ; index < book.images.length ; index++ ) {
                await Image.deleteOne({ _id: book.images[index] });
            }
            await Book.findByIdAndDelete(id);
            const publishingList = await Publishing.find({ books: id });
            const authors = await Author.find({ books: id });
            for (let publishing of publishingList) {
                const index = publishing.books.indexOf(id);
                if (index > -1) {
                    publishing.books.splice(index, 1);
                    await publishing.save();
                }
            }

            for (let author of authors) {
                const index = author.books.indexOf(id);
                if (index > -1) {
                    author.books.splice(index, 1);
                    await author.save();
                }
            }
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