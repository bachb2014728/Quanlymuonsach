const Detail = require("../models/Detail")
const Book = require("../models/Book")
const Role = require("../models/Role")
const Reader = require("../models/Reader")

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {ObjectId} = require("mongodb");
class DetailService{
     getUsername (data){
        const token = data.headers.authorization?.split(" ")[1];

        const decoded = jwt.decode(token,  process.env.TOKEN_KEYWORD);

        const userToken = decoded.user.username;
        return User.findOne({username: userToken});
    }
    async findAll(){
        return await Detail.find({});
    }
    async findAllByUsername(data){

    }
    async create(data) {
        const {reader,books, endDate} = data.body;
        const user = await this.getUsername(data);

        let currentRole = await Role.findOne({
            _id: user.role ? new ObjectId(user.role._id) : null,
        });

        const startDate = new Date();
        let endDateNew = new Date();

        if (!endDate){
            endDateNew.setDate(startDate.getDate() + 7);
        }else{
            endDateNew = endDate
        }
        const bookLists = await Book.find({
            _id: { $in: books }
        });
        console.log(bookLists)
        if (currentRole.name === 'ADMIN') {
            console.log("ADMIN")
            let readerAdd = await Reader.findOne({
                _id: ObjectId.isValid(reader) ? new ObjectId(reader) : null,
            });
            const newDetail = await new Detail({
                books: bookLists,
                startDate: startDate,
                endDate: endDateNew,
                reader: readerAdd,
                status: "progress"
            });

            return await newDetail.save();
        } else if (currentRole.name === 'USER') {
            console.log(`USER :${user._id}`)
            const reader = await Reader.findOne({ user: user._id });

            const newDetail = await new Detail({
                books: bookLists,
                startDate: startDate,
                endDate: endDateNew,
                reader: reader,
                status: "awaiting"
            });

            return await newDetail.save();
        } else {
            throw new Error('Invalid user role');
        }
    }
    async update(data) {
        try {
            const {reader, books, endDate, status} = data.body;
            let id = data.params.id;
            let user;
            user = await this.getUsername(data);

            let currentRole = await Role.findOne({
                _id: user.role ? new ObjectId(user.role._id) : null,
            });

            const startDate = new Date();
            let endDateNew = new Date();

            if (!endDate){
                endDateNew.setDate(startDate.getDate() + 7);
            }else{
                endDateNew = endDate
            }
            const bookLists = await Book.find({
                _id: { $in: books }
            });

            if (currentRole.name === 'ADMIN') {
                let readerAdd = await Reader.findOne({
                    _id: ObjectId.isValid(reader) ? new ObjectId(reader) : null,
                });
                return await Detail.findByIdAndUpdate(id, {
                    books: bookLists,
                    startDate: startDate,
                    endDate: endDateNew,
                    reader: readerAdd,
                    status: status
                }, {new: true});
            } else if (currentRole.name === 'USER') {
                const reader = await Reader.findOne({ user: user._id });

                return await Detail.findByIdAndUpdate(id, {
                    books: bookLists,
                    startDate: startDate,
                    endDate: endDateNew,
                    reader: reader,
                    status: status
                }, {new: true});
            } else {
                throw new Error('Invalid user role');
            }
        }catch (e) {
            console.log(e.message)
        }
    }
    async findAllByUser(data){
         try {
             const {code} = data.body;
             const reader = await Reader.findOne({code: code});
             return await Detail.find({reader: reader})
         }catch (e) {
             console.log(e.message)
         }
    }
}
module.exports=DetailService