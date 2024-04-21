const { model, Schema } = require("mongoose");

const roleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    { timestamps: true }
);

module.exports = model("Role", roleSchema);
