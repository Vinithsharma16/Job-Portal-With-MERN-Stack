import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from "../../utils/constant";
import { toast } from 'sonner'
import { Check, X } from 'lucide-react';

const ApplicantsTable = () => {

    const { applicants } = useSelector((state) => state.application);

    // Loader state (stores applicant id being updated)
    const [loadingApplicant, setLoadingApplicant] = useState(null);

    const MIN_LOADING_TIME = 3000;

    const statusHandler = async (status, id) => {
        setLoadingApplicant(id);

        const startTime = Date.now();

        // Add Fullscreen Loader
        const loader = document.createElement("div");
        loader.id = "global-loader";
        loader.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p class="text-white font-semibold">Updating...</p>
          </div>
        </div>`;
        document.body.appendChild(loader);

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            const elapsed = Date.now() - startTime;
            const remaining = MIN_LOADING_TIME - elapsed;

            setTimeout(() => {
                const loaderElement = document.getElementById("global-loader");
                if (loaderElement) loaderElement.remove();
                setLoadingApplicant(null);
            }, remaining > 0 ? remaining : 0);
        }
    };

    const [filterApplicants, setFilterApplicants] = useState([]);

    useEffect(() => {
        if (Array.isArray(applicants)) {
            setFilterApplicants(applicants);
        } else {
            setFilterApplicants([]);
        }
    }, [applicants]);


    return (
        <div className="p-6 bg-gray-50 rounded-2xl shadow-lg overflow-x-auto">
            <Table className="min-w-full border-separate border-spacing-y-2">
                <TableCaption className="text-gray-500 mb-4">A list of your recent applied users</TableCaption>

                <TableHeader className="bg-purple-100 rounded-t-lg">
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filterApplicants.length > 0 ? (
                        filterApplicants.map((item) => (
                            <TableRow key={item._id} className="bg-white hover:bg-purple-100 rounded-xl transition">
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>

                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <a href={item.applicant.profile.resume} className="text-blue-600 underline" target="_blank">
                                            {item.applicant.profile.resumeOriginalName}
                                        </a>
                                    ) : <span className="text-gray-400">NA</span>}
                                </TableCell>

                                <TableCell>{item?.createdAt?.split("T")[0] || "N/A"}</TableCell>

                                <TableCell className="text-center">

                                    <div className="flex justify-center gap-3">

                                        <button
                                            disabled={loadingApplicant === item._id}
                                            onClick={() => statusHandler("Accepted", item._id)}
                                            className={`flex items-center gap-1 text-white px-4 py-1 rounded-lg shadow transition 
                                            ${loadingApplicant === item._id
                                                ? "bg-gray-400 cursor-wait"
                                                : "bg-purple-500 hover:bg-purple-600"}`}>
                                            <Check size={16} />
                                            Accept
                                        </button>

                                        <button
                                            disabled={loadingApplicant === item._id}
                                            onClick={() => statusHandler("Rejected", item._id)}
                                            className={`flex items-center gap-1 text-white px-4 py-1 rounded-lg shadow transition
                                            ${loadingApplicant === item._id
                                                ? "bg-gray-400 cursor-wait"
                                                : "bg-red-500 hover:bg-red-600"}`}>
                                            <X size={16} />
                                            Reject
                                        </button>

                                    </div>

                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                                No applicants found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
