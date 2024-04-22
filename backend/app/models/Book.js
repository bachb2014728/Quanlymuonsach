const { model, Schema } = require("mongoose");

const bookSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
        },
        images:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Image'
            }
        ],
        price:{
            type: Number,
        },
        quantity:{
            type: Number,
        },
        year:{
            type: String,
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