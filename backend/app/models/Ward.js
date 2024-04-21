const { Schema, model } = require('mongoose');
const wardSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    }
});
module.exports = model("Ward", wardSchema);