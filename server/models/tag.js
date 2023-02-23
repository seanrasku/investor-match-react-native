import mongoose from "mongoose";
const { Schema } = mongoose;

const tagSchema = new Schema(
    {
        name: {
            type: String,
        },
        community: {
            type: String,
            enum: ["Interest", "Place", "Identity"],
        },
    },
    {timestamps: true}
)

tagSchema.index({name: 1}, {unique: true});


export default mongoose.model("Tag", tagSchema);

