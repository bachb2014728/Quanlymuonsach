const Image = require("../models/Image");
const zlib = require("zlib");

class ImageService{
    async download(data){
        const image = await Image.findById(data);
        return zlib.inflateSync(image.imageData);
    }
}
module.exports = ImageService