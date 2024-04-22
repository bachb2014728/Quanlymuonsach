const Role = require("../models/Role")
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const Reader = require("../models/Reader")
const Employee = require("../models/Employee")

const bcrypt = require("bcrypt");
const crypto = require('crypto');;

const AddressService = require("../services/address.service")
const {ObjectId} = require("mongodb");
const addressService = new AddressService()
class AuthService {
    generateRandomString(length) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    }
    async signup(data) {
        try {
            const { username, password , name , phone, address ,role } = data;
            const hashedPass = await bcrypt.hash(password, 10);
            if(role === "USER"){
                let userRole = await Role.findOne({ name: "USER" });

                if (!userRole) {
                    userRole = await new Role({ name: "USER" });
                    await userRole.save();
                }

                const user = await new User({
                    username,
                    password: hashedPass,
                    role: userRole._id
                });

                const savedUser = await user.save();

                userRole.users.push(savedUser);
                await userRole.save();

                const { province, district, ward } = await addressService.add(address);

                const randomString = this.generateRandomString(8);
                const newReader = await new Reader({
                    code: randomString,
                    user: savedUser,
                    name: name,
                    phone: phone,
                    address: {
                        province: province._id,
                        district: district._id,
                        ward: ward._id
                    },
                    gender: '',
                    date : new Date()
                })
                await newReader.save()

                return {
                    status: "ok",
                    message: "Đăng kì tài khoản thành công",
                    newReader
                };
            }else{
                let userRole = await Role.findOne({ name: "ADMIN" });

                if (!userRole) {
                    userRole = await new Role({ name: "ADMIN" });
                    await userRole.save();
                }

                const admin = await new User({
                    username,
                    password: hashedPass,
                    role: userRole._id
                });

                const savedAdmin = await admin.save();

                userRole.users.push(savedAdmin);
                await userRole.save();

                const { province, district, ward } = await addressService.add(address);
                const randomString = this.generateRandomString(8);

                const newEmployee = await new Employee({
                    code: randomString,
                    user: savedAdmin,
                    name: name,
                    phone: phone,
                    address: {
                        province: province._id,
                        district: district._id,
                        ward: ward._id
                    },
                })
                await newEmployee.save()

                return {
                    status: "ok",
                    message: "Đăng kì tài khoản thành công",
                    newEmployee
                };
            }

        } catch (error) {
            console.log(error.message);
        }
    }
    async update(data) {
        try {
            const { username, password, name, phone, address, role } = data.body;
            const hashedPass = await bcrypt.hash(password, 10);

            const token = data.headers.authorization?.split(" ")[1];

            const decoded = await jwt.decode(token,  process.env.TOKEN_KEYWORD);

            const userToken = decoded.user.username;
            let user = await User.findOne({ username: userToken });

            user = await User.findByIdAndUpdate(user._id, {
                username: userToken,
                password: hashedPass,
            }, { new: true });

            if (role === "USER") {
                const { province, district, ward } = await addressService.add(address);
                const reader = await Reader.findOne({ user: user });
                if (reader) {
                    reader.name = name;
                    reader.phone = phone;
                    reader.address = {
                        province: province._id,
                        district: district._id,
                        ward: ward._id
                    };
                    await reader.save();
                }
            } else {
                const { province, district, ward } = await addressService.add(address);
                const employee = await Employee.findOne({ user: user._id });
                if (employee) {
                    employee.name = name;
                    employee.phone = phone;
                    employee.address = {
                        province: province._id,
                        district: district._id,
                        ward: ward._id
                    };
                    await employee.save();
                }
            }

            return {
                status: "ok",
                message: "Cập nhật tài khoản thành công",
                user
            };
        } catch (error) {
            console.log(error.message);
        }
    }

    async login(data) {
        try {
            const { username, password } = data;

            const user = await User.findOne({ username });

            const token = await jwt.sign({ user }, process.env.TOKEN_KEYWORD, { expiresIn: '15m' });
            const refreshToken = await jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            return {
                token,
                refreshToken
            };
        } catch (error) {
            console.log(error.message);
        }
    }
    async profile(data){
        try {
            const token = data.headers.authorization?.split(" ")[1];

            const decoded = await jwt.decode(token,  process.env.TOKEN_KEYWORD);

            const userToken = decoded.user.username;
            let user = await User.findOne({ username: userToken });

            let currentRole = await Role.findOne({
                _id: user.role ? new ObjectId(user.role._id) : null,
            });
            if(currentRole.name === "USER"){
                return {
                    account: await Reader.findOne({user: user}).populate('user'),
                    role: currentRole.name
                };
            }else{
                return {
                    account: await Employee.findOne({user:user}).populate('user'),
                    role: currentRole.name
                }
            }
        }catch (e) {
            console.log(e.message)
        }
    }
}

module.exports = AuthService;