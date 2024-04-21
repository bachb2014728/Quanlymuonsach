const Province = require("../models/Province")
const District = require("../models/District")
const Ward = require("../models/Ward")
class AddressService{
    extractAddressData(payload){
        const contact={
            province:{
                code:payload.province.code,
                name:payload.province.name
            },
            district:{
                code:payload.district.code,
                name:payload.district.name
            },
            ward:{
                code:payload.ward.code,
                name:payload.ward.name
            }
        };

        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }
    async add(data){
        try {
            const address = this.extractAddressData(data);
            let ward = await Ward.findOne({name: address.ward.name})
            if(!ward){
                ward = await new Ward({
                    name: address.ward.name,
                    code: address.ward.code
                })
                await ward.save();
            }
            let district = await District.findOne({name:address.district.name})
            if(!district){
                district = await new District({
                    name:address.district.name,
                    code:address.district.code,
                })
                await district.save();
                district.wards.push(ward);
            }else{
                let districtWards = await District.findById(district._id).populate('wards');
                if (!districtWards.wards.some(w => w._id.equals(ward._id))) {
                    district.wards.push(ward);
                    await district.save();
                }
            }
            let province = await Province.findOne({name: address.province.name});
            if (!province) {
                province = await new Province({
                    name: address.province.name,
                    code: address.province.code,
                    districts: [district]
                });
                await province.save();
            } else {
                let provinceDistricts = await Province.findById(province._id).populate('districts');
                if (!provinceDistricts.districts.some(d => d._id.equals(district._id))) {
                    province.districts.push(district);
                    await province.save();
                }
            }
            return {
                ward,
                district,
                province
            }
        }catch (e) {
            console.log(e.message);
        }
    }
}
module.exports=AddressService