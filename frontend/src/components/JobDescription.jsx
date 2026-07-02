import React, { useEffect, useState, useCallback } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "../utils/constant";
import { setSingleJob } from "../redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const MIN_LOADING_TIME = 3000;

  const [form, setForm] = useState({
    step: 1,
    fullName: "",
    email: "",
    contact: "",
    experience: "",
    rotationalShift: "",
    immediateJoin: "",
    expectedSalary: "",
    noticePeriod: "",
    relocate: "",
    resume: null,
    message: "",
    strengths: "",
    projects: "",
  });

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

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-white">

   

      {showModal && (
        <>
          {/* Full-screen Loader */}
          {showLoader && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white font-semibold">Submitting...</p>
              </div>
            </div>
          )}

          {/* Modal Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

            {/* Enhanced Styled Modal */}
            <div className="
              w-full max-w-xl p-8 rounded-3xl shadow-2xl relative 
              bg-white/70 backdrop-blur-xl border border-white/40 
              animate-[slideUp_0.35s_ease]
            ">

              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Apply for <span >{singleJob?.title}</span>
              </h2>

              {/* Step Indicators */}
<div className="flex justify-center items-center mb-8 gap-6 px-2">
  {[1, 2, 3].map((num, idx) => (
    <div key={num} className="flex items-center">
      {/* Circle with number */}
      <div
        className={`
          w-8 h-8 flex items-center justify-center rounded-full border-2 
          ${form.step === num 
            ? "bg-purple-600 border-purple-600 text-white font-bold" 
            : "bg-gray-200 border-gray-300 text-gray-600"}
        `}
      >
        {num}
      </div>

      {/* Line connecting steps, except after last */}
      {idx !== 2 && (
        <div className="w-12 h-1 bg-gray-300 mx-2 rounded-full"></div>
      )}
    </div>
  ))}
</div>



             
              {form.step === 1 && (
                <div className="grid gap-4">
                  {["fullName", "email", "contact", "experience"].map((field) => (
                    <div key={field} className="relative w-full">
                      
                      <input
                        type={field === "email" ? "email" : "text"}
                        id={field}
                        value={form[field]}
                        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                        className="
                          peer border border-gray-300/70 p-3 pt-6 rounded-xl w-full 
                          focus:outline-none focus:border-purple-600 shadow-sm focus:shadow-md 
                          transition-all bg-white/80 backdrop-blur-sm
                        "
                        placeholder=" "
                      />

                      <label
                        htmlFor={field}
                        className="
                          absolute left-4 top-2 text-gray-500 text-xs transition-all
                          peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm
                          peer-focus:top-2 peer-focus:text-purple-600 peer-focus:text-xs
                        "
                      >
                        {field === "fullName"
                          ? "Your Full Name"
                          : field === "email"
                          ? "Your Email"
                          : field === "contact"
                          ? "Your Phone Number"
                          : "Years of Experience"}
                      </label>
                    </div>
                  ))}

                  <div className="flex justify-between mt-4">
  <Button
    className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl shadow-sm transition-all"
    onClick={() => setShowModal(false)}
  >
    Back
  </Button>

  <Button
    className="bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md hover:shadow-lg transition-all"
    onClick={() => setForm({ ...form, step: 2 })}
  >
    Save & Continue
  </Button>
</div>

                </div>
              )}

              
              {form.step === 2 && (
                <div className="grid gap-4">

                  {/* Rotational Shift */}
                  <div>
                    <label className="font-semibold">Are you comfortable to work in Rotational Shift?</label>
                    <div className="flex gap-6 mt-3">
                      {["Yes", "No"].map((val) => (
                        <label key={val} className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-purple-600 transition-all">
                          <input
                            type="radio"
                            name="rotationalShift"
                            value={val}
                            checked={form.rotationalShift === val}
                            onChange={(e) => setForm({ ...form, rotationalShift: e.target.value })}
                          />
                          {val}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Join */}
                  <div>
                    <label className="font-semibold">Can you join immediately if selected?</label>
                    <div className="flex gap-6 mt-3">
                      {["Yes", "No"].map((val) => (
                        <label key={val} className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-purple-600 transition-all">
                          <input
                            type="radio"
                            name="immediateJoin"
                            value={val}
                            checked={form.immediateJoin === val}
                            onChange={(e) => setForm({ ...form, immediateJoin: e.target.value })}
                          />
                          {val}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Salary */}
                  <input
                    className="border border-gray-300/60 p-3 rounded-xl w-full shadow-sm focus:shadow-md focus:border-purple-600 bg-white/70 backdrop-blur-sm outline-none transition-all"
                    placeholder="Expected Salary (in LPA)"
                    value={form.expectedSalary}
                    onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                  />

                  {/* Notice Period */}
                  <input
                    className="border border-gray-300/60 p-3 rounded-xl w-full shadow-sm focus:shadow-md focus:border-purple-600 bg-white/70 backdrop-blur-sm outline-none transition-all"
                    placeholder="Notice Period (in days)"
                    value={form.noticePeriod}
                    onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })}
                  />

                  {/* Relocate */}
                  <div>
                    <label className="font-semibold">Willing to relocate?</label>
                    <div className="flex gap-6 mt-3">
                      {["Yes", "No"].map((val) => (
                        <label key={val} className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-purple-600 transition-all">
                          <input
                            type="radio"
                            name="relocate"
                            value={val}
                            checked={form.relocate === val}
                            onChange={(e) => setForm({ ...form, relocate: e.target.value })}
                          />
                          {val}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl shadow-sm transition-all"
                      onClick={() => setForm({ ...form, step: 1 })}
                    >
                      Back
                    </Button>

                    <Button
                      className="bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => setForm({ ...form, step: 3 })}
                    >
                      Save & Continue
                    </Button>
                  </div>
                </div>
              )}

             
              {form.step === 3 && (
                <div className="grid gap-4">

                  {/* Resume Upload */}
                  <div className="border-2 border-dashed border-purple-300 bg-purple-50/40 
                    p-6 rounded-2xl text-center shadow-sm hover:border-purple-500 
                    transition-all backdrop-blur-sm">

                    <p className="text-gray-700 font-medium mb-2">Upload Your Resume</p>

                    <label className="cursor-pointer">
                      <div className="bg-purple-600 text-white px-4 py-2 rounded-lg inline-block shadow-md hover:bg-purple-700">
                        Choose File
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setForm({ ...form, resume: e.target.files[0] })}
                      />
                    </label>

                    {form.resume && (
                      <p className="mt-2 text-sm text-gray-600">📄 {form.resume.name}</p>
                    )}
                  </div>

                  {/* Textareas */}
                  {["message", "strengths", "projects"].map((field) => (
                    <textarea
                      key={field}
                      className="border border-gray-300/60 p-3 rounded-xl w-full h-24
                      shadow-sm focus:shadow-md focus:border-purple-600 
                      bg-white/70 backdrop-blur-sm outline-none transition-all"
                      placeholder={
                        field === "message"
                          ? "Why should we hire you?"
                          : field === "strengths"
                          ? "Describe your strengths"
                          : "Describe relevant projects"
                      }
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    />
                  ))}

                  <div className="flex justify-between mt-6">
                    <Button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl shadow-sm transition-all"
                      onClick={() => setForm({ ...form, step: 2 })}
                    >
                      Back
                    </Button>

                    <Button
                      className="bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={async () => {
                        if (!form.resume) {
                          toast.error("Please upload your resume");
                          return;
                        }

                        const startTime = Date.now();

                        // Show loader
                        const loaderElement = document.createElement("div");
                        loaderElement.id = "global-loader";
                        loaderElement.innerHTML = `
                          <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div class="flex flex-col items-center gap-4">
                              <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                              <p class="text-white font-semibold">Submitting...</p>
                            </div>
                          </div>`;
                        document.body.appendChild(loaderElement);

                        try {
                          await axios.post(
                            `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                            {},
                            { withCredentials: true }
                          );
                          toast.success("Application submitted!");
                          setIsApplied(true);
                          setShowModal(false);

                        } catch (err) {
                          toast.error(err.response?.data?.message || "Something went wrong");
                        } finally {
                          const elapsed = Date.now() - startTime;
                          const remaining = MIN_LOADING_TIME - elapsed;
                          setTimeout(() => {
                            const el = document.getElementById("global-loader");
                            if (el) el.remove();
                          }, remaining > 0 ? remaining : 0);
                        }
                      }}
                    >
                      Submit Application
                    </Button>

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Animation CSS */}
          <style>
            {`
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            `}
          </style>
        </>
      )}

      

      <div className="w-full mx-auto px-4 md:px-8 py-10">
        
        <div className="w-full bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{singleJob?.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-purple-100 text-purple-800">{singleJob?.position} Positions</Badge>
                <Badge className="bg-blue-100 text-blue-700">{singleJob?.jobType}</Badge>
                <Badge className="bg-green-100 text-green-700">{singleJob?.salary} LPA</Badge>
              </div>
            </div>

            <Button
              onClick={() => !isApplied && setShowModal(true)}
              disabled={isApplied}
              className={`rounded-xl px-6 py-2 font-semibold text-white ${
                isApplied ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
        </div>

        {/* Info & Description */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Location</h3>
            <p className="text-gray-700 mt-1">{singleJob?.location}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900">Posted On</h3>
            <p className="text-gray-700 mt-1">
              {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "NA"}
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
