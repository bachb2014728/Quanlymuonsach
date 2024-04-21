const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../api-error");

class TokenMiddleware {
    async checkUser(req, res, next) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(403).json(new ApiError(403,`Lỗi token là rỗng`));
            }

            const decodedToken = await jwt.decode(
                token,
                process.env.TOKEN_KEYWORD,
                (err) => {
                    if (err) {
                        return res.status(403).json(new ApiError(403,'Bị từ chối hoặc token không hợp lệ'));
                    }
                }
            );

            if (!decodedToken) {
                return res.status(403).json(new ApiError(403,'Không hợp lệ'));
            }

            next();
        } catch (error) {
            console.log(error.message);
        }
    }

    async checkAdmin(req, res, next) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(404).json(new ApiError(404,`Không tìm thấy : ${token}`));
            }

            const decodedToken = await jwt.decode(
                token,
                process.env.ADMIN_KEYWORD,
                (err) => {
                    if (err) {
                        return res.status(403).json(new ApiError(403,'Bị từ chối hoặc token không hợp lệ'));
                    }
                }
            );

            if (!decodedToken) {
                return res.status(403).json(new ApiError(403,'Bị từ chối'));
            }

            if (decodedToken.user.username !== "bach@gmail.com") {
                return res.status(403).json(new ApiError(403,`${decodedToken.user.name} không có quyền truy cập`));
            }

            next();
        } catch (error) {
            console.log(error.message);
        }
    }

    async checkAll(req, res, next) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(404).json(new ApiError(404,'Không tìm thấy'));
            }

            const decodedAsAdminToken = await jwt.decode(
                token,
                process.env.ADMIN_KEYWORD
            );
            const decodedAsUserToken = await jwt.decode(
                token,
                process.env.TOKEN_KEYWORD
            );

            if (!decodedAsAdminToken || !decodedAsUserToken) {
                return res.status(403).json(new ApiError(403,'Bị từ chối hoặc token không hợp lệ'));
            }

            decodedAsAdminToken
                ? (req.admin = decodedAsAdminToken.admin)
                : (req.user = decodedAsUserToken.user);

            next();
        } catch (error) {
            console.log(error.message);
        }
    }

    async checkPrivacy(req, res, next) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decodedUser = jwt.decode(token, process.env.TOKEN_KEYWORD);
            const currentUser = await User.findById(req.params.id);
            if (
                currentUser._id.toString() !== decodedUser.user._id &&
                decodedUser.user.username !== process.env.ADMIN_LOGIN
            ) {
                return res.status(403).json(new ApiError(403,`${decodedUser.user.name} không có quyền truy cập`));
            }

            next()
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = TokenMiddleware;