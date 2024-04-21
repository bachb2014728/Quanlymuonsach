const { Schema, model } = require('mongoose');

const provinceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    districts:[
        {
            type: Schema.Types.ObjectId,
            ref: 'District'
        }
    ]
});

module.exports = model("Province", provinceSchema);