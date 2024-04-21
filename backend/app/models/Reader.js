const { model, Schema } = require("mongoose");

const readerSchema = new Schema(
    {
        code:{
            type: String,
            required: true,
            unique: true,
        },
        name:{
            type: String,
            required: true,
            unique: true,
        },
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        date:{
            type: Date,
            required: false,
        },
        gender:{
            type: String,
            required: false,
        },
        phone:{
            type: String,
            required: true,
            unique: true,
        },
        address: {
            province: {
                type: Schema.Types.ObjectId,
                ref: 'Province'
            },
            district: {
                type: Schema.Types.ObjectId,
                ref: 'District'
            },
            ward: {
                type: Schema.Types.ObjectId,
                ref: 'Ward'
            }
        }
    },
    { timestamps: true }
);

module.exports = model("Reader", readerSchema);