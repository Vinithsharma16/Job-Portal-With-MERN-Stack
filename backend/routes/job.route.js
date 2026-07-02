import express from "express";
import { postJob, getAllJobs, getJobById, getAdminJobs, deleteJob ,getAppliedJobs} from "../controllers/job.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);
router.route("/applied-jobs").get(isAuthenticated, getAppliedJobs);

export default router;