import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// APPLY JOB
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();

        // Return fully populated application
        const populatedApplication = await Application.findById(newApplication._id)
            .populate({
                path: "job",
                populate: { path: "company" }
            })
            .populate("applicant", "_id fullname email phoneNumber");

        return res.status(201).json({
            message: "Job applied successfully",
            success: true,
            application: populatedApplication
        });

    } catch (error) {
        console.error("Error applying to job:", error);
        return res.status(500).json({
            message: "An error occurred while applying for the job.",
            success: false
        });
    }
};

// GET APPLIED JOBS (USER SIDE)
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                populate: { path: "company" }
            })
            .populate("applicant", "_id fullname email phoneNumber");

        return res.status(200).json({
            applications,
            success: true
        });
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return res.status(500).json({ success: false });
    }
};

// GET APPLICANTS FOR A JOB (ADMIN SIDE)
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        const applications = await Application.find({ job: jobId })
            .sort({ createdAt: -1 })
            .populate("applicant", "_id fullname email phoneNumber profile createdAt")
            .populate({
                path: "job",
                populate: { path: "company" }
            });

        return res.status(200).json({
            success: true,
            applicants: applications
        });
    } catch (error) {
        console.error("Error fetching applicants:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// UPDATE APPLICATION STATUS
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            });
        }

        application.status = status.toLowerCase();
        await application.save();

        const updatedApplication = await Application.findById(applicationId)
            .populate({
                path: "job",
                populate: { path: "company" }
            })
            .populate("applicant", "_id fullname email phoneNumber");

        return res.status(200).json({
            message: "Status updated successfully",
            success: true,
            application: updatedApplication
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
};

// CHECK IF USER HAS APPLIED
export const hasApplied = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.jobId;

        const exists = await Application.findOne({ job: jobId, applicant: userId });

        return res.status(200).json({
            applied: !!exists,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }
};
