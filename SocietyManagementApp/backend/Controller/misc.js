`use strict`

import User from "../Model/userModel.js";

function validateDate(date) { 
        const parsedDate = new Date(date); 
        if (isNaN(parsedDate.getTime())) { 
            throw new Error("Invalid date format. Please provide a valid date."); 
        } 
        return parsedDate.toLocaleDateString();
};
class Rent{
    static count= 0;
    constructor(userId, rent_amount, availablefrom, flat_no, description, contact){
        this.id = count++;
        this.userId = userId
        this.rent_amount = rent_amount;
        this.availablefrom = validateDate(availablefrom);
        this.flat = flat_no,
        this.description = description;
        this.contact = contact;
    }
};

let flats_for_rent = [];
export const postRent = async (req,res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const {rent_amount, availablefrom, flat_no, description} = req.body;
    try{
        if (!rent_amount || !availablefrom || !flat_no){
            return res.status(400).json({error : "Please provide all the details"});
        }
        const rent_post = new Rent(userId,rent_amount, availablefrom, flat_no, description, user.contactno);
        flats_for_rent.push(rent_post);
        return res.status(200).json(flats_for_rent);
    } catch(error){
        return res.status(500).json({error : error.message});
    }
};
export const getALLrents = async(req,res) => {
    const userId = req.user ? req.user.id : null;
    if (userId){
        const user = await User.findById(userId)
        const userPosts = flats_for_rent.filter(post => post.userId === userId || post.flat === user.flatno);
        return res.status(200).json(userPosts);
    }else{
        return res.status(200).json(flats_for_rent);
    }
};

export const deleteRentPost = async (req,res) => {
    try {
        const userId = req.user.id;
        const { rentPostId } = req.params;
        const user = await User.findById(userId)
        const rentPostIndex = flats_for_rent.findIndex(post => (post.id === rentPostId && post.userId === userId) || post.flat === user.flatno)

        if (rentPostIndex === -1) {
            return res.status(404).json({ error: 'Rent post not found or you are not authorized to delete this post' });
        }
        flats_for_rent.splice(rentPostIndex, 1);
        return res.status(200).json({ message: 'Rent post deleted successfully',
            flats_for_rent
         });
    } catch (error) {
        console.error('Error deleting rent post:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateRentPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rentPostId } = req.params;
        const { rent_amount, availablefrom, flat_no, description, contact } = req.body;

        const rentPostIndex = flats_for_rent.findIndex(post => post.id === rentPostId && post.userId === userId);

        if (rentPostIndex === -1) {
            return res.status(404).json({ error: 'Rent post not found or you are not authorized to update this post' });
        }

        flats_for_rent[rentPostIndex] = {
            ...flats_for_rent[rentPostIndex],
            rent_amount: rent_amount !== undefined ? rent_amount : flats_for_rent[rentPostIndex].rent_amount,
            availablefrom: availablefrom !== undefined ? availablefrom : flats_for_rent[rentPostIndex].availablefrom,
            flat: flat_no !== undefined ? flat_no : flats_for_rent[rentPostIndex].flat,
            description: description !== undefined ? description : flats_for_rent[rentPostIndex].description,
            contact: contact !== undefined ? contact : flats_for_rent[rentPostIndex].contact
        };

        return res.status(200).json({
            message: 'Rent post updated successfully',
            flats_for_rent
        });
    } catch (error) {
        console.error('Error updating rent post:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
class LostAndFound {
    static count = 0; // Static counter for generating unique IDs
    constructor(userId, itemName, description, status, contact) {
        this.id = LostAndFound.count++;
        this.userId = userId;
        this.itemName = itemName;
        this.description = description;
        this.status = status || "Pending"; // Default status is "Pending"
        this.contact = contact;
    }
}

let lostAndFoundItems = []; // Array to store lost and found items

// Controller to post a new lost or found item
export const createLostAndFound = async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId); // Fetch user details
    const { itemName, description, status } = req.body;

    try {
        // Validation
        if (!itemName || !description) {
            return res.status(400).json({ error: "Please provide all required details." });
        }

        // Create new lost or found item
        const newItem = new LostAndFound(
            userId,
            itemName,
            description,
            status,
            user.contactno
        );
        lostAndFoundItems.push(newItem); // Add the new item to the array

        return res.status(200).json({
            message: "Lost and found item posted successfully.",
            data: newItem,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller to fetch all lost and found items
export const getAllLostAndFound = (req, res) => {
    try {
        return res.status(200).json({
            message: "Lost and found items retrieved successfully.",
            data: lostAndFoundItems,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const updateLostAndFoundStatus = (req, res) => {
    const { itemId } = req.params;
    const { status } = req.body;

    try {
        const item = lostAndFoundItems.find((item) => item.id == itemId);

        if (!item) {
            return res.status(404).json({ error: "Item not found." });
        }

        item.status = status || item.status; // Update the status if provided
        return res.status(200).json({
            message: "Item status updated successfully.",
            data: item,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller to delete a lost or found item
export const deleteLostAndFound = (req, res) => {
    const { itemId } = req.params;

    try {
        const index = lostAndFoundItems.findIndex((item) => item.id == itemId);

        if (index === -1) {
            return res.status(404).json({ error: "Item not found." });
        }

        const deletedItem = lostAndFoundItems.splice(index, 1); // Remove the item
        return res.status(200).json({
            message: "Item deleted successfully.",
            data: deletedItem,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export default validateDate;