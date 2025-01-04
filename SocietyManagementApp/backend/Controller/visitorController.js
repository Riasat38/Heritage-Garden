`use strict`
import Visitor from "../Model/visitorModel.js";
import User from "../Model/userModel.js";
import { sendNotification } from "../config/mailer.js";
import moment from 'moment';
//an user expecting a visitor/delivery/package letting it known to the gatekeeper
// route : "/visitor", method : POST
export const postVisitorReq = async (req,res) => {
    try{
        const {delivery, deliveryType, expectedArrival, description } = req.body;
        console.log(delivery, deliveryType, expectedArrival, description)
        const userId = req.user.id;
        const visitorData = {
            user : userId,
            delivery: delivery,
            deliveryType : delivery && deliveryType ? deliveryType: null,
            expectedArrival: moment(expectedArrival).format('MM/DD/YYYY HH:mm'),
            description : description ? description: null
        }

        if (!delivery || !expectedArrival){
            return res.status(400).json({
                message : 'Required Data Missing',
                redirectUrl: '/society/homepage/visitor'
            })
        }
        
        const visitor_req = await Visitor.create(visitorData);
        return res.status(201).json({
            message : "RequestPosted",
            data : visitor_req,
            redirectUrl : '/society/homepage/visitor'
        })
    } catch (error){
        return res.status(400).json({
            message : 'Something is wrong' + error.message,
            redirectUrl: '/society/homepage/visitor'
        })
    }   
};

//route: "/visitor", method: GET, viewer: gatekeeper
export const showVisitorReq = async (req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    try{
        
        if ((user.usertype === 'maintenance' &&user.role === "Gatekeeper") || user.admin){
            const visitorQueue = await Visitor.find({resolve_status: false})
            .populate({
                path: 'user',
                select: "name username flatno"}).sort({ createdAt: 1 }).lean();
            return res.status(200).json(visitorQueue)
        } else{      //requests are filtered based on flatno
            const filtered_visitor_req = await Visitor.find({ resolve_status: false, $or: [ 
                { 'user': userId }, 
                { 'user.flatno': user.flatno }]
            }).populate('user', 'name username flatno').lean();
              
            return res.status(200).json(filtered_visitor_req);
        }      
    }catch (error){
        return res.status(500).json({
            message:'Error while fetching data' + error.message,
            redirectUrl: '/society/homepage/visitor'
        })
    }  
};
// route : "/visitor/:visitorPostId", method : PUT, viewer: user
export const updateVisitorReq = async (req,res) => {
    try { 
        const { visitorPostId } = req.params; 
        const { delivery, deliveryType, expectedArrival, description } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');

        const visitorReq = await Visitor.findById(visitorPostId).populate('user', 'flatno');
        if (!visitorReq) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/visitor'
            });
        }
        if (visitorReq.user.toString() !== userId || visitorReq.user.flatno !== user.flatno) { 
            return res.status(403).json({ message: 'Unauthorized access', 
                redirectUrl: '/society/homepage/visitor' }); 
        }
        const updatedVisitorData = { 
            ...(delivery !== undefined && { delivery }), 
            ...(deliveryType !== undefined && delivery &&{ deliveryType }), 
            ...(expectedArrival !== undefined && { expectedArrival: moment(expectedArrival, 'MM/DD/YYYY HH:mm') }), 
            ...(description !== undefined && { description }) 
        };

        const updatedVisitor = await Visitor.findByIdAndUpdate(visitorPostId, updatedVisitorData, { new: true });
        if (!updatedVisitor) { 
            return res.status(404).json({ message: 'Visitor request not found', 
                redirectUrl: '/society/homepage/visitor' }); 
        }

        return res.status(200).json({ message: 'Visitor request updated successfully', 
            data: updatedVisitor, 
            redirectUrl: '/society/homepage/visitor' });
    }catch (error) { 
        return res.status(500)
        .json({ message: 'Error updating visitor request: ' + error.message, 
            redirectUrl: '/society/homepage/visitor' }); }
};

// route : "/visitor/:visitorPostId", method : DELETE, viewer: user
export const deleteVisitorReq = async (req, res) => {
    try {
        const { visitorPostId } = req.params;
        const userId = req.user.id;  // Assuming you have a middleware to set req.userId
        const visitorReq = await Visitor.findById(visitorPostId).populate('user', 'flatno');
        const user = await User.findById(userId).select('-password');
        if (!visitorReq) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/visitor'
            });
        }
        if (visitorReq.user.toString() !== userId && !user.admin && visitorReq.user.flatno !== user.flatno) {
            return res.status(403).json({
                message: 'Unauthorized access',
                redirectUrl: '/society/homepage/visitor'
            });
        }

        await visitorReq.deleteOne();

        return res.status(200).json({
            message: 'Visitor request deleted successfully',
            redirectUrl: '/society/homepage/visitor'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting visitor request: ' + error.message,
            redirectUrl: '/society/homepage/visitor'
        });
    }
};
// route : "/visitor/:visitorPostId", method : PUT, viewer: gatekeeper
export const resolveVisitorReq = async (req, res) => {
    try {
        const { visitorPostId } = req.params;
        const {resolve} = req.body;
        const userId = req.user.id;  
        const visitor_obj = await Visitor.findById(visitorPostId).populate('user', 'name email username flatno');
        const user = await User.findById(userId).select('-password');
        if (!visitor_obj) {
            return res.status(404).json({
                message: 'Visitor request not found',
                redirectUrl: '/society/homepage/visitor'
            });
        }
        if ((user.role !== "Gatekeeper" && user.usertype !== "maintenance") && !user.admin ) {
            return res.status(403).json({
                message: 'Unauthorized access',
                redirectUrl: '/society/homepage/visitor'
            });
        };
        if (visitor_obj.resolve_status){
            return res.status(400).json({
                message: 'Visitor request already resolved',
                redirectUrl: '/society/homepage//visitor'
            });
        }
         
        visitor_obj.resolve_status = resolve;
        if (!visitor_obj.destination) {  
            if (user)  visitor_obj.destination = visitor_obj.user.flatno;  
        };
        await visitor_obj.save();

        const requester_email = visitor_obj.user.email;
        const requester = visitor_obj.user.name;
        
        const resolver = user.name;
        let message;
        if (visitor_obj.delivery) {
            message = `Dear ${requester},\n\n Your expected delivery ${visitor_obj.deliveryType} has arrived`;
        }else{
            message = `Dear ${requester},\n\nYour expected visitor has arrived.\n\n`;
        }
        message += `resolved by ${resolver}`;
        await sendNotification(requester_email, "Visitor Post Resolved",message);
        return res.status(200).json({
            message: 'Visitor request resolved successfully',
            redirectUrl: '/society/homepage/visitor'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error resolving visitor request: ' + error.message,
            redirectUrl: '/society/homepage/visitor'
        });
    }
};
// route : "/visitor/notify", method : POST, viewer: gatekeeper
export const visitorNotify = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    const { description, delivery, deliverytype, guestname, guests, destination, contact } =  req.body;
    
    if (!guests || !destination || !contact ){ 
        return res.status(400).json({
            message: 'Required data missing',
            redirectUrl: '/society/homepage/visitor'
        });
    }
    if (user.role !== 'Gatekeeper' || user.admin){
        res.status(403).json({message:`Unauthorized Access`})
    }
    if (delivery && !deliverytype){
        res.status(400).json({message:`Fields missing.`});
    }
    try{
        const visitorData = {
            user: userId,
            delivery: delivery ? true : false,
            deliveryType: delivery && deliverytype ? deliverytype : null,
            description: description ? description : null,
            resolve_status: true,    //resolve status true is essential for showing unresolved requests also this visitor has arrived
            guestname: guestname,
            guests: guests,
            destination: destination,
            contact: contact
        };
        const guest = await Visitor.create(visitorData);
        const to_whom = await User.find({usertype: "resident", flatno: destination});
        if (!to_whom){
            return res.status(404).json({message:`No users in that flat. No where to go.`})
        }
        console.log(to_whom);
        let message;
        to_whom.forEach(async (person) => { 
            if (delivery){
                message = `Dear ${person.name},\n There is a ${guest.deliveryType} intended for ${person.flatno}.`}
            else{
                message = `Dear ${person.name},\n ${guest.guestname} guest/guests intended for ${person.flatno}.`}
            message += `notified by ${user.name}`;
            await sendNotification(person.email, "Visitor/Guest Arrival" ,message);
        }   )       
        return res.status(200).json({redirectUrl:'society/homepage/visitor'});
    }catch(error){
        return res.status(500).json(error);
    } 
};
