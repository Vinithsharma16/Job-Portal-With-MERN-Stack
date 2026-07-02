import React, { useEffect, useState, useCallback } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "../utils/constant";
import { setSingleJob } from "../redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import JobApplicationModal from "./JobApplicationModal";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const checkAppliedStatus = useCallback(
    (jobData) => {
      if (!jobData || !user?._id) {
        setIsApplied(false);
        return;
      }

      const applications = jobData.applications || [];
      const applied = applications.some(
        (app) => String(app.applicant._id) === String(user._id)
      );

      setIsApplied(applied);
    },
    [user?._id]
  );

  useEffect(() => {
    const fetchSingleJob = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success && res.data.job) {
          dispatch(setSingleJob(res.data.job));
          checkAppliedStatus(res.data.job);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, checkAppliedStatus]);

  const openApplicationForm = () => {
    if (!isApplied) setOpenModal(true);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {openModal && (
        <JobApplicationModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          jobTitle={singleJob?.title}
        />
      )}

      <div className="w-full mx-auto px-4 md:px-8 py-10">

        <div className="w-full bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{singleJob?.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-purple-100 text-purple-800">
                  {singleJob?.position} Positions
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">{singleJob?.jobType}</Badge>
                <Badge className="bg-green-100 text-green-700">{singleJob?.salary} LPA</Badge>
              </div>
            </div>

            <Button
              onClick={openApplicationForm}
              disabled={isApplied}
              className={`rounded-xl px-6 py-2 font-semibold text-white ${
                isApplied ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Location</h3>
            <p className="text-gray-700 mt-1">{singleJob?.location}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Posted On</h3>
            <p className="text-gray-700 mt-1">
              {singleJob?.createdAt
                ? new Date(singleJob.createdAt).toLocaleDateString()
                : "NA"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Applicants</h3>
            <p className="text-gray-700 mt-1">{singleJob?.applications?.length || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Salary</h3>
            <p className="text-gray-700 mt-1">{singleJob?.salary} LPA</p>
          </div>
        </div>

        <div className="bg-white w-full p-8 rounded-xl shadow-sm border border-gray-200 mt-8">
          <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
          <p className="text-gray-700 mt-2 whitespace-pre-line">{singleJob?.description}</p>

          <h2 className="text-xl font-bold text-gray-900 mt-6">Job Type</h2>
          <p className="text-gray-700">{singleJob?.jobType}</p>

          <h2 className="text-xl font-bold text-gray-900 mt-6">Requirements</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.isArray(singleJob?.requirements) && singleJob.requirements.length > 0 ? (
              singleJob.requirements.map((req, i) => (
                <Badge key={i} className="bg-purple-100 text-purple-800">
                  {req}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">NA</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
