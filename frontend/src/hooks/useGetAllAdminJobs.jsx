import { setAllAdminJobs } from '../redux/jobSlice';
import { JOB_API_END_POINT } from "../utils/constant";
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { 
                    withCredentials: true 
                });

                console.log("ADMIN JOBS RESPONSE => ", res.data);

                if (res.data.success) {
                    // FIX: use ONE correct key
                    const jobs = 
                        res.data.jobs || 
                        res.data.allJobs ||
                        res.data.alljobs ||
                        res.data.jobList ||     // <-- added
                        res.data.data || 
                        [];

                    dispatch(setAllAdminJobs(jobs));
                }

            } catch (error) {
                console.log("ADMIN JOBS ERROR => ", error.response?.data || error.message);
            }
        };

        fetchAllAdminJobs();
    }, [dispatch]);
};

export default useGetAllAdminJobs;
