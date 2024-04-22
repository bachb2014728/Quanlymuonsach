const Publishing = require("../models/Publishing")
const AddressService = require("../services/address.service")

const Province = require("../models/Province")
const District = require("../models/District")
const Ward = require("../models/Ward")

const Book = require("../models/Book")

const BookService = require("../services/book.service")
const bookService = new BookService();

const {ObjectId} = require("mongodb");
const addressService = new AddressService();
class PublishingService{
    extractPublishingData(payload){
        const contact={
            name: payload.name,
            address: {
                province: payload.province,
                district: payload.district,
                ward: payload.ward
            },
            books: payload.books,
        };
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }
    extractPublishingCreateData(payload){
        const contact={
            name: payload.name,
            address: payload.address,
            books: payload.books,
        };
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }
    async create(payload){
        const {name,address,books} = this.extractPublishingCreateData(payload);

        const {province,district,ward} = await addressService.addCreate(address);


        const publishing = new Publishing({
            name: name,
            address: {
                province: province._id,
                district: district._id,
                ward: ward._id
            },
            books: books
        });
        await publishing.save();

        return publishing;
    }
    async convertPublishing(payload){
        let provinceItem = await Province.findOne({
            _id: ObjectId.isValid(payload.address.province) ? new ObjectId(payload.address.province) : null,
        })
        let districtItem = await District.findOne({
            _id: ObjectId.isValid(payload.address.district) ? new ObjectId(payload.address.district) : null,
        })
        let wardItem = await Ward.findOne({
            _id: ObjectId.isValid(payload.address.ward) ? new ObjectId(payload.address.ward) : null,
        })
        let contact = {
            id: payload.id,
            name: payload.name,
            province: {
                name: provinceItem.name,
                code: provinceItem.code
            },
            district:{
                name: districtItem.name,
                code: districtItem.code
            },
            ward:{
                name: wardItem.name,
                code: wardItem.code
            },
            books:payload.books
        }
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }
    async getAll() {
        let results = await Publishing.find({});
        return await Promise.all(results.map(async (publishing) => {
            return this.convertPublishing(publishing);
        }));
    }
    async getById(id) {
        const contact = await Publishing.findById(id);
        return this.convertPublishing(contact);
    }

    async update(id, payload) {
        const { name, address, books } = this.extractPublishingData(payload);
        const { province,district,ward } = await addressService.add(address);
        console.log(province)
        return Publishing.findByIdAndUpdate(id, {
            name: name,
            address: {
                province: province._id,
                district: district._id,
                ward: ward._id
            },
            books: books
        }, {new: true});
    }

    async delete(id) {
        await Book.updateMany({ publishing: id }, { publishing: null });
        return await Publishing.findByIdAndDelete(id);
    }

    async deleteAll() {
        return await Publishing.deleteMany({});
    }
}
module.exports=PublishingService