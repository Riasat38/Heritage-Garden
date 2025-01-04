`use strict`

import User from "../Model/userModel.js";
import Help from '../Model/helpPost.js';
import BloodDonation from "../Model/bloodDonationModel.js";

export const getStaffAndResident = async (req,res) => {
    try{
        const staffs = await User.find({ usertype: 'maintenance'}).select('-password').lean();
        const residents = await User.find({ usertype: 'resident'}).select('-password').lean();
        if (!staffs || !residents){
            throw new Error("Data were not found");
        }
        res.status(200).json({staffs,residents});
    } catch(error){
        console.log(error);
        return res.status(400).json({error:error.message});
    }
};

export const getAdmin = async(req,res) =>{
    try{
        const admin = await User.find({admin:true}).select('-password');
        if(!admin){
            throw new Error("No Admin Found")
        }
        res.status(200).json(admin);
    } catch(error){
        res.status(400).json({error:error.message})
    }
};

export const createHelpPost = async (req,res) => {
     try {
        const {help_descr,bloodDonation} = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); 
         if (!user) { 
            throw new Error("User not found"); 
        }  
        if (!help_descr) { 
            return res.status(400).json({ error: 'Description cannot be empty',
                redirectUrl : `/society/homepage/wall`
             }); 
        }
        const helpPost = await Help.create({ 
            user: userId, 
            description: help_descr,
            bloodDonation: bloodDonation        
        });
        console.log('Help Post Created:', helpPost); 
        return res.status(201).json({
            message : "Post Created Successfully!",
            helpPost,
            redirectUrl : "/society/homepage/wall"
        })
    } catch (error) { 
        console.error('Error creating help post:', error);
        return res.status(400).json(error);
    } 
};

export const getPosts = async(req,res) => {
    try{
        const userId = req.user.id;
        const posts = await Help.find({resolve_status : false }).sort({ bloodDonation: -1 }) 
        .populate('user','name flatno contactno').lean();
        if (!posts){
            return res.status(400).json({error : "No Posts Available"});
        }
        return res.status(200).json(posts);        //returning an object containing alll unresolved posts
    } catch(error){
        return res.status(400).json(error);
    }  
};

export const getSinglePost = async (req, res) => {
    try {
      const userId = req.user.id;    // From middleware
      const { postId } = req.params;    // Get the specific post ID from the URL
      const helpPost = await Help.findById(postId).populate('comments.user', 'name flatno contactno').lean(); 
      
      if (!helpPost) {
        return res.status(404).json({ error: 'Help post not found' });
      }
      
      return res.status(200).json(helpPost); // Return the specific post data
    } catch (error) {
      console.error('Error fetching help post:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const updateHelpPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { description} =  req.body;
        console.log(postId,modifyType);
        const helpPost = await Help.findById(postId);
        
        const userId = req.user.id;

        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }
        if (helpPost.user.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this post' });
        }
        if (helpPost.resolve_status.resolved) {
            return res.status(400).json({ error: 'Cannot update a resolved post' });
        }
        
        if (!description || description.trim() === '') {
            return res.status(400).json({ error: 'Description cannot be empty' });
        }
            
        helpPost.description = description;
        await helpPost.save();

        res.status(200).json({
            message: 'Help post updated successfully',
            helpPost,
            redirectUrl: `/society/homepage/wall/${postId}`, 
        });
    } catch (error) {
        console.error('Error updating help post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteHelpPost = async (req, res) => {
    try {
        const helpPostId = req.params.postId;
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');

        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }
        if (helpPost.user.toString() !== userId && !user.admin) { //admin can only delete a post
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }
        await helpPost.deleteOne();
        return res.status(302).json({
            message: 'Help post deleted successfully',
            redirectUrl: '/society/homepage/wall',
        });
    } catch (error) {
        console.error('Error deleting help post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const addCommentToHelpPost = async (req, res) => { 
    try { 
        const { content } = req.body; 
        const userId = req.user.id;  
        const {helpPostId} = req.params;
        const helpPost = await Help.findById(helpPostId).populate('comments.user', 'name');; 
        if (!helpPost) { 
            return res.status(404).json({ error: 'Help post not found' }); 
        }
        if (!userId) {
            return res.status(401).json({ error: 'User must be logged in to comment' });
        } 
        if (!content || content.trim() === "") {
            return res.status(400).json({ error: 'Comment content cannot be empty' });
        }
        const newComment = { user: userId, content: content};

        helpPost.comments.push(newComment); 
        await helpPost.save();
        return res.status(201).json({
            comments:helpPost.comments,
            redirectUrl: `/society/homepage/wall/${helpPostId}`
        });
    } catch (error) { 
        console.error('Error adding comment:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } 
};

export const updateComment = async (req, res) => {
    try {
        const { helpPostId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }

        const comment = helpPost.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to update this comment' });
        }
        comment.content = content;
        await helpPost.save();

        return res.status(200).json({
            message: 'Comment updated successfully',
            post : helpPost.comments
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { helpPostId, commentId } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);
        const helpPost = await Help.findById(helpPostId);
        if (!helpPost) {
            return res.status(404).json({ error: 'Help post not found' });
        }

        const comment = helpPost.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user.toString() !== userId && !user.admin) { //user can delte comment
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        comment.deleteOne();
        await helpPost.save();

        return res.status(200).json({
            message: 'Comment deleted successfully',
            post : helpPost.comments
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//bloodDonation
//signing up for blood donation
export const addBloodDonation = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password'); 
    try {
        const {  bloodGroup,  lastBloodGiven} =  req.body;

        if (!bloodGroup || !lastBloodGiven) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const donorInfo= await BloodDonation.create({
            donor: userId,
            bloodGroup: bloodGroup,
            lastBloodGiven: lastBloodGiven,
        });
        await donorInfo.populate('donor','name email contactno flatno');
        console.log('Blood Donation Record Created:', donorInfo);
        return res.status(201).json({ message: "Blood donation record added successfully",donorInfo });
    } catch (error) {
        console.error('Error adding blood donation record:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAvailableBloodDonor = async(req,res) => {
    try{
        const available_donors = await BloodDonation.find({available:true}).populate('donor', 'name contactno email flatno');
        console.log(available_donors);
        if (available_donors.length === 0){
            throw new Error("No available Donors Found")
        }
        return res.status(200).json(available_donors);
    } catch(error){
        return res.status(400).json({error: error.message});
    }
};

export const getSingleBloodDonor = async(req,res) =>{
    try{
        const donor = await BloodDonation.findById(req.user.id).populate('user', "name username contactno flatno");
    if (!donor){
        throw new Error("No user Found")
    }
    return res.status(200).json(donor)
    }catch (error){
        return res.status(400).json({error: error.message})
    }
};

export const updateDonorInfo = async(req,res) => {
    const userId = req.user.id;
    const {lastBloodGiven, availibility} =  req.body;
    try{
        if (!lastBloodGiven){
            throw new Error("No data given to be updated")
        }
        if (typeof(availibility) !== Boolean){
            throw new Error("Wrong Data type");
        }
        const donor = await BloodDonation.findOneAndUpdate({ donor: userId }, {
            lastBloodGiven: lastBloodGiven,
            available: availibility
        }).populate('donor', "name username contactno flatno");
        if(!donor){
            throw new Error("No data found")
        }
        donor.lastBloodGiven = lastBloodGiven;
        donor.available = availibility;
        await donor.save();
        return res.status(200).json(donor);
    } catch(error){
        return res.status(400).json({error:error.message});
    }
};

