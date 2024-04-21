const { model, Schema } = require("mongoose");

const detailSchema = new Schema(
    {
        books:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Book'
            }
        ],
        status:{
            type:String,
            required: true
        },
        reader:{
            type: Schema.Types.ObjectId,
            ref: 'Reader'
        },
        startDate:{
            type: Date,
            required: true,
        },
        endDate:{
            type: Date,
            required: true,
        },

    },
    { timestamps: true }
);

module.exports = model("Detail", detailSchema);