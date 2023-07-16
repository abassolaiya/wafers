import mongoose from "mongoose";

const JigsawSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
        },
        title: {
            type: String
        },
        desc:{
            type: String,
        },
        img:{
            type:String
        },
        likes: {
            type: Array,
            default:[]
        },
        comments:[{
            userId: {
                type: String,
                required: false
            },
            comment: {
                type: String,
                required:false
        }}]},{timestamps:true}
);

const Jigsaw = mongoose.model('Jigsaw', JigsawSchema)

export default Jigsaw;