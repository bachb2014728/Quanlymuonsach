const express = require("express");
const authorController = require("../controllers/author.controller");

const TokenMiddleware = require("../middlewares/token.middleware");
const { checkAll, checkPrivacy, checkAdmin } = new TokenMiddleware();

const AuthorMiddleware = require("../middlewares/author.middleware")
const authorMiddleware = new AuthorMiddleware();
const router = express.Router();

router.route("/").get(authorController.findAll)
    .post(checkAdmin, authorMiddleware.create,authorController.create)
    .delete(checkAdmin,authorController.deleteAll);

router.route("/:id").get(authorMiddleware.getOne,authorController.findOne)
    .put(checkAdmin,authorMiddleware.update,authorController.update)
    .delete(checkAdmin,authorMiddleware.delete,authorController.delete);

module.exports = router;