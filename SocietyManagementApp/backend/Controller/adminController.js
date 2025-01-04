`use strict`;

import User from "../Model/userModel.js";
import validateDate from "./misc.js";
class Recruitment{
    static count =  0;
    constructor(content, contact, creator, jobPosition, deadline){
        this.id = Recruitment.count++;
        this.content = content;
        this.contact = contact;
        this.creator = creator;
        this.jobPosition = jobPosition,
        this.deadline = validateDate(deadline),
        this.createdAt = new Date();
    }
};


let job_list = [];

export const postRecruitment = async (req, res) => {
  const {description, jobPosition, deadline} = req.body;
  const admin = await User.findById(req.user.id);
  
  try{
      const jobPost = new Recruitment(description, admin.contactno, admin.name, jobPosition,deadline);
      job_list.push(jobPost);
      return res.status(200).json({job_list,
          redirectUrl: '/society/homepage/admin'
      });
  } catch (error) {
      res.status(500).json({
          error: "Failed to post job",
          details: error.message,
      });
  }
};
export const getRecruitment = async (req, res) => {
  return res.status(200).json(job_list);
}

export const deleteRecruitment = async (req, res) => {
  const { serial } = req.params;
  try {
      job_list =  job_list.filter((job) => job.id !== serial);
      return res.status(200).json({job_list,
          redirectUrl: '/society/homepage/admin'
      });
  } catch (error) {
      res.status(500).json({
          error: "Failed to delete job",
          details: error.message,
      });
  }
};

export const updateRecruitment = async (req, res) => {
  const { serial } = req.params;
  const { description,contact,jobPosition, deadline } = req.body;
  try {
        job_list.forEach((job) => {
            if (job.id === serial) {
                job.contact = contact ? contact : job.contact;
                job.description = description ? description : job.description;
                job.jobPosition = jobPosition ? jobPosition : job.jobPosition;
                job.deadline = deadline ? deadline : job.deadline;
            }
        });
    
        return res.status(200).json({job_list,
          redirectUrl: '/society/homepage/admin'
        });
  } catch (error) {
      res.status(500).json({
          error: "Failed to update job",
          details: error.message,
      });
  }
};

