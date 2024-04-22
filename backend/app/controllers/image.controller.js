
const Image = require('../models/Image');
const fs = require('fs');
const zlib = require('zlib');

exports.uploadImage = async (req, res) => {
    try {
        const file = req.file;
        const image = new Image({
            name: file.originalname,
            type: file.mimetype,
            imageData: zlib.deflateSync(file.buffer)
        });
        const savedImage = await image.save();
        res.json(savedImage);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.downloadImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send('Image not found');
        }
        const imageData = zlib.inflateSync(image.imageData);
        console.log(imageData)
        res.set('Content-Type', image.type);
        res.send(imageData);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
