`use strict`
import mongoose from "mongoose";
//comment schema
const commentSchema = new mongoose.Schema({
     user: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
         required: true },
     content: {
         type: String,
         required: true,
         trim: true },
     timestamp: {
         type: Date,
         default: Date.now
        } 
});

//help post schema
const helpSchema = new mongoose.Schema({
    description :{
        type: String, 
        required: true, 
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    bloodDonation:{
        type: Boolean,
        default:false
    },
    comments: [commentSchema],
},
{timestamps : true});

helpSchema.post('save', async function (doc, next) {
    try {
        if (doc.resolve_status) {
            await doc.constructor.deleteOne({ _id: doc._id });
            console.log('Help post and its comments have been deleted');
        }
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model("Help", helpSchema);