const mongoose = require("mongoose");

const { Schema } = mongoose;

const canvaSchema = new Schema(
    {
        name: {
            type: String,
            default: "Untitled Project",
            trim: true,
            maxlength: 120,
        },
        canvasJson: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);



module.exports = mongoose.model("Canvas", canvaSchema);
