import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    delivery:{
        type: Boolean,
        required:true
    },
    deliveryType: {
        type: String,
        required: function () {
            return this.delivery; 
        },
        enum: ['Package', 'Document', 'Food', 'Other'],
    }, 
    expectedArrival :{
        type: Date,
        required: function(){
            return this.user && this.user.usertype === 'resident';}  
    },
    description:{
        type: String,
        required: false 
    }, 
    resolve_status:{
        type: Boolean,
        default: false,
        required: function(){
            return this.user && this.user.usertype === 'resident'; 
        }
    }, 
    guestname:{
        type: String,
        required: function(){
            return this.user && this.user.usertype === 'Gatekeeper';  
        }
    },
    guests:{
        type: Number,
        required: function(){
            return this.user && this.user.usertype === 'Gatekeeper';  
        }
    },
    destination:{
        type: String,
        required: false
    },
    contact:{
        type:String,
        requied: function(){
            return this.user && this.user.usertype === 'gatekeeper'; 
        }
    }
},
{timestamps : true});




export default mongoose.model("Visitor", visitorSchema);

