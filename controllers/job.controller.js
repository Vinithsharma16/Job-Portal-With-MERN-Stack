import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id; 

    
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      experience === undefined || 
      position === undefined ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    
    let requirementsArray;
    if (typeof requirements === "string") {
      requirementsArray = requirements.split(",").map((req) => req.trim());
    } else if (Array.isArray(requirements)) {
      requirementsArray = requirements;
    } else {
      return res.status(400).json({
        message: "Requirements must be a string or array",
        success: false,
      });
    }

  
    const job = await Job.create({
      title,
      description,
      requirements: requirements,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience, 
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      success: true,
      job, // returning the job document could be helpful
    });
  } catch (error) {
    console.error("POST /api/v1/job/post route error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const jobs = await Job.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
      .populate("company")
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
        },
      }) // returns applications + applicant details
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.log(error);
  }
};

//students
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path:"applications"
    })
    if (!job) {
      return res.status(404).json({
        message: "jobs not found.",
        success: false
      })
    };
    return res.status(200).json({
      job,
      success: true
    });
  } catch (error) {
    console.log(error);
  }
}


export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id; // assuming isAuthenticated adds req.user
    const appliedJobs = await AppliedJobModel.find({ user: userId })
      .populate({
        path: "job",
        populate: { path: "company" }
      });

    res.status(200).json({ success: true, jobs: appliedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


