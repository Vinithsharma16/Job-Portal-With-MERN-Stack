import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Edit2, Eye, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeJob } from '../../redux/jobSlice'
import { toast } from 'sonner'
import { JOB_API_END_POINT } from '../../utils/constant'
import axios from 'axios'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDelete = async (jobId) => {
        const confirmDelete = window.confirm("Are you sure?");
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(
                `${JOB_API_END_POINT}/delete/${jobId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(removeJob(jobId));
                toast.success("Job deleted successfully");
            } else {
                toast.error(res.data.message || "Failed to delete job");
            }
        } catch (error) {
            toast.error("Server error");
        }
    };

    useEffect(() => {
        const filtered = allAdminJobs?.filter(job => {
            if (!searchJobByText) return true;

            return (
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
            );
        }) || [];

        setFilterJobs(filtered);
    }, [allAdminJobs, searchJobByText]);

   return (
    <div 
    className="relative w-full 
    bg-gray-50

    border border-gray-200 
    rounded-3xl 
    shadow-lg 
    p-6 
    overflow-hidden"
>

        <Table className="min-w-full border-separate border-spacing-y-2">

            <TableHeader>
                <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="text-left">Company Name</TableHead>
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {filterJobs.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                            No jobs found.
                        </TableCell>
                    </TableRow>
                ) : (
                    filterJobs.map(job => (
                        <TableRow
                            key={job._id}
                            className="group hover:bg-purple-50/60 transition rounded-xl"
                        >
                            <TableCell className="py-4">
                                <Avatar className="h-10 w-10 ring-1 ring-gray-300 shadow-sm">
                                    <AvatarImage
                                        src={
                                            job.company?.logo ||
                                            "https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png"
                                        }
                                        className="object-contain"
                                    />
                                </Avatar>
                            </TableCell>

                            <TableCell className="font-medium text-purple-900">
                                {job.company?.name}
                            </TableCell>

                            <TableCell className="text-gray-700">{job.title}</TableCell>

                            <TableCell className="text-gray-500">
                                {job.createdAt?.split("T")[0]}
                            </TableCell>

                            {/* ACTION BAR */}
                            <TableCell className="border-none">
    <div className="opacity-100">
        <div className="flex gap-4 justify-center">

            {/* EDIT */}
            <button
               onClick={() => navigate(`/admin/companies/${job.company._id}`)} 
                className="
                    flex items-center gap-1 
                    text-gray-600 
                    transition-all duration-200
                    hover:text-gray-700
                    hover:shadow-xl 
                    hover:scale-105
                    px-2 py-1 
                    rounded-lg
                "
            >
                <Edit2 size={16} />
                <span className="text-sm">Edit</span>
            </button>

            {/* APPLICANTS */}
            <button
                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                className="
                    flex items-center gap-1 
                    text-gray-600 
                    transition-all duration-200
                    hover:text-gray-800
                    hover:shadow-xl 
                    hover:scale-105
                    px-2 py-1 
                    rounded-lg
                "
            >
                <Eye size={16} />
                <span className="text-sm">Applicants</span>
            </button>

            {/* DELETE */}
            <button
                onClick={() => handleDelete(job._id)}
                className="
                    flex items-center gap-1 
                    text-red-500 
                    transition-all duration-200
                    hover:text-red-600
                    hover:shadow-xl 
                    hover:scale-105
                    px-2 py-1 
                    rounded-lg
                "
            >
                <Trash2 size={16} />
                <span className="text-sm">Delete</span>
            </button>

        </div>
    </div>
</TableCell>




                        </TableRow>
                    ))
                )}
            </TableBody>

        </Table>
    </div>
);

};

export default AdminJobsTable;
