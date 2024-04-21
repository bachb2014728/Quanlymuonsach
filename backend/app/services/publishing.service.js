const Publishing = require("../models/Publishing")
const AddressService = require("../services/address.service")
const addressService = new AddressService();
class PublishingService{
    extractPublishingData(payload){
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
        const {name,address,books} = this.extractPublishingData(payload);

        const {province,district,ward} = await addressService.add(address);

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
    async getAll() {
        return await Publishing.find({});
    }

    async getById(id) {
        return await Publishing.findById(id);
    }

    async update(id, payload) {
        const { name, address, books } = this.extractPublishingData(payload);
        const { province, district, ward } = await addressService.add(address);

        return await Publishing.findByIdAndUpdate(id, {
            name: name,
            address: {
                province: province._id,
                district: district._id,
                ward: ward._id
            },
            books: books
        }, { new: true });
    }

    async delete(id) {
        return await Publishing.findByIdAndDelete(id);
    }

    async deleteAll() {
        return await Publishing.deleteMany({});
    }
}
module.exports=PublishingService