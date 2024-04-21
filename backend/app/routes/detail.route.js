const express = require("express");
const detail = require("../controllers/detail.controller");

const TokenMiddleware = require("../middlewares/token.middleware");
const { checkAll, checkPrivacy, checkAdmin } = new TokenMiddleware();

const router = express.Router();

router.route("/")
    .get(checkAdmin,detail.findAll)
    .post(checkAdmin,detail.create);

router.route("/user").get(detail.findAllUser)

router.route("/:id").get(detail.findOne)
    .put(checkAdmin,detail.update);

module.exports = router;