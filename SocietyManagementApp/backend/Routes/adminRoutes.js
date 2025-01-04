`use strict`
import express from "express";
import { body, validationResult } from "express-validator";
import { postRecruitment, getRecruitment, deleteRecruitment, updateRecruitment } from "../Controller/adminController.js";
import User from "../Model/userModel.js";
import {
    getAllAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    updateAnnouncement
} from "../Controller/announcementController.js";

const router = express.Router();

router.get("/:id", (req, res) => {
    res.send("Admin Panel");
});

//Fetch all announcements
router.get("/announcements", (req, res) => {
    try {
        const announcements =  getAllAnnouncements();
        return res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch announcements" + error.message
        });
    }
});

// POST: Create a new announcement
router.post("/announcements",
    body("content").notEmpty().withMessage("Content is required"), // Validate 'content' field
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content } = req.body;
        const adminId = req.user.id; 

        try {
            const announcement = createAnnouncement(content, adminId);
            res.status(201).json({
                message: "Announcement created successfully",
                announcement                
            });
        } catch (error) {
            res.status(500).json({
                error: "Failed to create announcement",
                details: error.message,
            });
        }
    }
);

// DELETE: Delete an announcement by ID
router.delete("/announcements/:announcementId",  (req, res) => {
    const { announcementId } = req.params;
    const adminId = req.user.id;
    try {
        const result =  deleteAnnouncement(announcementId);
        if (result) {
            res.status(200).json({ message: "Announcement deleted successfully" , 
                redirectUrl: '/society/homepage/announcements'
            });
        } else {
            res.status(404).json({ error: "Announcement not found" ,
                redirectUrl: '/society/homepage/announcements'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete announcement",
            details: error.message,
        });
    }
});

router.put("/announcements/:announcementId", (req, res) => {
    const { announcementId } = req.params;
    const { content } = req.body;
    const user = req.user.id;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    try {
        const announcement =  updateAnnouncement(announcementId, content);
        res.status(200).json({ message: "Announcement updated successfully", announcement });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update announcement",
            details: error.message,
        });
    }
});

router.get("/recruitments", getRecruitment);
router.post("/recruitments", postRecruitment);
router.delete("/recruitments/:serial", deleteRecruitment);
router.put("/recruitments/:serial", updateRecruitment);

router.get("/:id/blood-donation", async (req, res) => {
    try {
        await getAllBloodDonations(req, res);
    } catch (error) {
        console.error("Error in fetching blood donations:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});
export default router;
