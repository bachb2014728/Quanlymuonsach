const AuthService = require("../services/auth.service");
const authService = new AuthService();

exports.signup = async(req, res, next) =>{
    try {
        const result = await authService.signup(req.body);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}
exports.login = async (req, res, next) =>{
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}
exports.refresh = async (req, res, next) =>{
    try {
    }catch (e) {
        console.log(e.message);
    }
}
exports.update = async (req, res, next) =>{
    try {
        const result = await authService.update(req);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}
exports.profile = async (req, res, next) =>{
    try {
        const result = await authService.profile(req);
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}
exports.get= async (req, res, next) =>{
    try {
        const result = await authService.getAllReader();
        res.json(result);
    } catch (error) {
        console.log(error.message);
    }
}
