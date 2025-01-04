`use strict`

let Announcements_list = new Set();
class Announcement{
    static count =  0;
    constructor(content, creator){
        this.id = Announcement.count++;
        this.content = content;
        this.creator = creator;
        this.createdAt = new Date();
    }
};
// Fetch all announcements
export const getAllAnnouncements = ()   => {
    return Array.from(Announcements_list);
};

// Create a new announcement
export const createAnnouncement = ({ content, adminId }) => {
    const temp = new Announcement(content,adminId)
    Announcements_list.add(temp);
    return temp;
};

// Delete an announcement by ID
export const deleteAnnouncement =  (announcementId) => {
    const announcement = Announcements_list.find((announcement) => announcement.id === announcementId);
    if (!announcement) {
        throw new Error("Announcement not found");
    }
    Announcements_list = Announcements_list.filter((announcement) => announcement.id !== announcementId);
    return Announcements_list;
};

export const updateAnnouncement =  (announcementId, content) => {
    const announcement = Announcements_list.find((announcement) => announcement.id === announcementId);
    if (!announcement) {
        throw new Error("Announcement not found");
    }
    announcement.content = content;
    return Array.from(announcement);
}
