const { model, Schema } = require("mongoose");

const publishingSchema = new Schema(
    {
        name: {
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
        },
        books:[{
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }]
    },
    { timestamps: true }
);

module.exports = model("Publishing", publishingSchema);
