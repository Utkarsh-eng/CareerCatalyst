import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  showStats,
  getMyJobs,
  applyForJob,
  getApplicants
} from "../controllers/jobsController.js";

import express from "express";
const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/stats").get(showStats);
router.route("/myJobs").get(getMyJobs);  
router.route("/:id").delete(deleteJob).patch(updateJob).post(applyForJob)
router.route("/applicant/:id").get(getApplicants);

// router.route("/applicants").get(getApplicants);
//router.route("/:jobId/apply").post(applyForJob)

export default router;
