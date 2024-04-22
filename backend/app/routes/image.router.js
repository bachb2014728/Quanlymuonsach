const express = require("express");

const imageController = require('../controllers/image.controller');

const router = express.Router();
const multer = require("multer");
const upload = multer();

router.route("/").post(upload.single('image'),imageController.uploadImage)

router.route("/:id").get(imageController.downloadImage)

module.exports = router;