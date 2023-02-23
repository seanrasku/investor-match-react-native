import mongoose from "mongoose";
const { Schema } = mongoose;
const {ObjectId} = mongoose.Schema;

const chatSchema = new Schema(
    //Chat not enforced by connection on database level
    {
        from: {
            type: ObjectId, 
            ref: "User",
        },
        to: {
            type: ObjectId, 
            ref: "User",
        },
        message: {
            type: String,
        },
        viewed: {
            type: Boolean,
            default: false
        },
        deleteStatus: { //Which users have deleted this chat
            type: String,
            enum: ["Both", "Neither", "Investor", "SocialVenture"],
            default: "Neither"
        },

    },
    { timestamps: true }

);

export default mongoose.model("Chat", chatSchema);

