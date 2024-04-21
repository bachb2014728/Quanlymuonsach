const { model, Schema } = require("mongoose");

const bookSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
        },
        price:{
            type: Number,
            required: true,
            unique: true,
        },
        quantity:{
            type: Number,
            required: true,
            unique: true,
        },
        year:{
            type: String,
            required: true,
        },
        publishing:{
            type: Schema.Types.ObjectId,
            ref: 'Publishing'
        },
        author:{
            type: Schema.Types.ObjectId,
            ref: 'Author'
        },
        favorites:[{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    { timestamps: true }
);

module.exports = model("Book", bookSchema);