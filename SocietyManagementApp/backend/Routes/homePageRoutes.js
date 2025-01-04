`use strict`;
//routes from this page will be visited to authenticated users only;
import express from "express";


import User from "../Model/userModel.js";
const router = express.Router();
//controllers

import {getStaffAndResident,getAdmin,createHelpPost,getPosts, getSinglePost, updateHelpPost,
    deleteHelpPost,addCommentToHelpPost, updateComment, deleteComment,
    addBloodDonation,getAvailableBloodDonor, getSingleBloodDonor, updateDonorInfo,
} from "../Controller/homePageController.js";
import {getServiceRequests, postServiceRequest, updateServiceRequest,
    resolveServiceRequest, deleteServiceRequest} from "../Controller/serviceController.js";
import { postVisitorReq, showVisitorReq, updateVisitorReq, 
    deleteVisitorReq, resolveVisitorReq, visitorNotify} from "../Controller/visitorController.js";

import {getAllAnnouncements} from "../Controller/announcementController.js";
import { deleteRentPost, getALLrents, postRent, updateRentPost ,getAllLostAndFound,
    createLostAndFound,
    updateLostAndFoundStatus,
    deleteLostAndFound,} from "../Controller/misc.js";


//HomePage  router
router.get("/",async (req,res) =>{ 
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user){
        res.status(400).json({error : `Could not find the user`}).redirect('/scoiety/login');
    }
    const notice = getAllAnnouncements();
    res.status(200).json({user, notice});
});

//staff directory
router.get('/staff', getStaffAndResident);
router.get('/admin', getAdmin);

// Services route
router.get('/services', getServiceRequests); 

router.post('/services/:serviceType', postServiceRequest);
router.put('/services/:serviceId', async(req,res) =>{
    const user = await User.findById(req.user.id).select('-password');
    if (user.usertype === 'resident'){
        await updateServiceRequest(req,res);
    } else if(user.usertype === 'maintenance'){
        await resolveServiceRequest(req,res);
    }
});
router.delete('/services/:serviceId',deleteServiceRequest);


//help wall
router.get('/wall', getPosts);
router.post('/wall', createHelpPost);
router.put('/wall/:postId', updateHelpPost); //only the user who has posted can update or resolve it
router.delete('/wall/:postId', deleteHelpPost);//admin can delete the post

router.get('/wall/:postId', getSinglePost); //showing a single post with comments
//comments
router.post('/wall/:helpPostId/comment', addCommentToHelpPost);
router.put('/wall/:helpPostId/comment/:commentId', updateComment)
router.delete('/wall/:helpPostId/comment/:commentId', deleteComment)

//requesting for a visitor to the gatekeep
router.get('/visitor', showVisitorReq); 

router.post('/visitor', async (req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (user.usertype === 'resident') {
        await postVisitorReq(req, res);
    } else if (user.usertype === 'maintenance' && user.role === 'Gatekeeper') {
        await visitorNotify(req, res);    //gatekeeper notifying users about people 
    }else {
        return res.status(403).json({message : `Not auhtorized for this page`});
    }
});
router.delete('/visitor/:visitorPostId', deleteVisitorReq); 
router.put('/visitor/:visitorPostId/:action',async(req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    const { action } = req.params;
    if (action === 'update' && user.usertype === 'resident') {
        await updateVisitorReq(req, res);
    } else if(action === 'resolve' && user.usertype === 'maintenance' && user.role === 'Gatekeeper'){
        await resolveVisitorReq(req, res);}
    else {
        return res.status(400).json({ message: 'Invalid action' });
    }
});

router.post('/rent-post', postRent);
router.get('/rent-post', getALLrents);
router.put('/rent-post/rentPostId', updateRentPost);
router.delete('/rent-post/rentPostId', deleteRentPost);

// POST: Signing up for bood donation
router.post("/blood-donation",addBloodDonation);

router.get('/getBloodDonor', getAvailableBloodDonor);
router.get("/singleDonor", getSingleBloodDonor);
router.put('/singleDonor', updateDonorInfo);


router.get('/:id/lostAndFound', (req, res) => {
    try {
        const items = getAllLostAndFound(req,res);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lost and found items.', details: error.message });
    }
});

// POST: Create a new Lost and Found item
router.post('/:id/lostAndFound', (req, res) => {
    try {
        const newItem = createLostAndFound(req,res);
        res.status(201).json({
            message: 'Lost and Found item added successfully.',
            data: newItem,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add new lost and found item.', details: error.message });
    }
});

// PATCH: Update an existing Lost and Found item
router.patch('/:id/lostAndFound/:itemId', (req, res) => {
    try {
        const updatedItem = updateLostAndFoundStatus(req,res)
        if (updatedItem) {
            res.status(200).json({
                message: 'Lost and Found item updated successfully.',
                data: updatedItem,
            });
        } else {
            res.status(404).json({ error: 'Item not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update lost and found item.', details: error.message });
    }
});

// DELETE: Delete a Lost and Found item
router.delete('/:id/lostAndFound/:itemId', (req, res) => {
    try {
        const result = deleteLostAndFound(req, res);
        if (result) {
            res.status(200).json({ message: 'Lost and Found item deleted successfully.' });
        } else {
            res.status(404).json({ error: 'Item not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete lost and found item.', details: error.message });
    }
});


export default router;
