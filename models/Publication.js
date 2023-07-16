import mongoose from "mongoose";

const PublicationSchema = new mongoose.Schema(
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

const Publication = mongoose.model('Publication', PublicationSchema)

export default Publication;