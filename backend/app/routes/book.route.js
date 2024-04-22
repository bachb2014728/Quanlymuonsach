const express = require("express");
const bookController = require("../controllers/book.controller");

const TokenMiddleware = require("../middlewares/token.middleware");
const { checkAll, checkPrivacy, checkAdmin } = new TokenMiddleware();

const BookMiddleware = require("../middlewares/book.middleware")
const bookMiddleware = new BookMiddleware();

const router = express.Router();

router.route("/")
    .get(checkAdmin,bookController.findAllBook)
    .post(checkAdmin,bookMiddleware.create,bookController.create)
    .delete(checkAdmin,bookController.deleteAll);

// router.route("/favorite").get(checkAdmin,bookController.findAllFavorite);

router.route("/:id")
    .get(checkAdmin,bookMiddleware.get,bookController.getOne)
    .put(checkAdmin,bookMiddleware.update,bookController.update)
    .delete(checkAdmin,bookController.delete);

module.exports = router;