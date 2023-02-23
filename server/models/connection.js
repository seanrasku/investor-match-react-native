import mongoose from "mongoose";
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;

const connectionSchema = new Schema(
    {
        investor: {
            type: ObjectId, 
            ref: "User",
        },

        socialVenture: {
            type: ObjectId, 
            ref: "User",
        },
        initiatedBy: {
            type: String,
            enum: ["Investor", "SocialVenture"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Connected", "Pending"],
            default: "Pending"
        },

    },
    { timestamps: true }

);

connectionSchema.index({investor: 1, socialVenture: 1}, {unique: true});

export default mongoose.model("Connection", connectionSchema);
