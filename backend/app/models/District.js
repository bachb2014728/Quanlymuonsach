const { Schema, model } = require('mongoose');

const districtSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    wards:[{
        type: Schema.Types.ObjectId,
        ref: 'Ward'
    }]

});
module.exports = model("District", districtSchema);