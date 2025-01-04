`use strict`

import mongoose from "mongoose";



const apartmentSchema = new mongoose.Schema({
    flatno: {
        type: String,
        required: true,
        unique: true
    },
    natives:[],
    
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {timestamps: true});

export default mongoose.model("Apartment", apartmentSchema);