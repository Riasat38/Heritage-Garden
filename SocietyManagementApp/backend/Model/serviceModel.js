`use strict`
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    serviceType:{
        type: String,
        required: true,
        enums: ['Electrician', 'Plumber', 'Other']
    },
    description:{
        type: String,
        required: false 
    }, 
    resolve_status:{
        type: Boolean,
        default: false
    },
    flatno:{
        type: String,
        required: true
},
},{timestamps : true});

export default mongoose.model("Service", serviceSchema);