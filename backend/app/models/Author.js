const { model, Schema } = require("mongoose");

const authorSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        code:{
            type: String,
            required: true,
            unique: true,
        },
        books:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Book'
            }
        ],

    },
    { timestamps: true }
);

module.exports = model("Author", authorSchema);