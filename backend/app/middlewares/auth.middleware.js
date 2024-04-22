const User = require("../models/User")
const ApiError = require("../api-error");
const {compare} = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthMiddleware {
    async signup(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password ) {
                return res.status(400).json(new ApiError(400,"Đăng kí thiếu dữ liệu"));
            }
            if (username === process.env.ADMIN_LOGIN) {
                return res.status(409).json(new ApiError(409,"Email đã tồn tại"));
            }
            const existUser = await User.findOne({username});
            if (existUser) {
                return res.status(409).json(new ApiError(409,"Email đã tồn tại"));
            }
            next();
        } catch (error) {
            return res.json(new ApiError(500, error.message));
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json(new ApiError(400, "Email hoặc mật khẩu là rỗng"));
            }
            const existUser = await User.findOne({username});
            if (!existUser) {
                return res.status(403).json(new ApiError(403, "Email hoặc mật khẩu không đúng"));
            }

            const comparedPass = await compare(password, existUser.password);
            if (!comparedPass) {
                return res.status(403).json(new ApiError(403, "Email hoặc mật khẩu không đúng"));
            }

            next();
        } catch (error) {
            return res.json(new ApiError(500, error.message));
        }
    }
    async refresh(req, res, next){
        try {
            const {token} =req.body;
            if(!token){
                return res.status(400).json(new ApiError(400, "Token là rỗng"));
            }
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (!err) {
                    next();
                } else {
                    return res.status(403).json({ message: 'Invalid refresh token' });
                }
            });
            next()
        }catch (e) {
            return res.json(new ApiError(500, e.message));
        }
    }

    async profile(req, res, next) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token ) {
                return res.status(401).json(new ApiError(401, "Không tim thấy token"));
            }
            const decoded = await jwt.decode(token,  process.env.TOKEN_KEYWORD);

            const userToken = decoded.user.username;

            if (!userToken ) {
                return res.status(403).json(new ApiError(403,"Lỗi token không đúng"));
            }

            next()
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = AuthMiddleware;