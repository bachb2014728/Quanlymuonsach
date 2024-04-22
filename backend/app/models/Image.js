const { model, Schema } = require("mongoose");

const ImageSchema = new Schema({
    name: {
        type:String
    },
    type:{
        type:  String
    },
    imageData: Buffer
});

module.exports = model('Image', ImageSchema);
