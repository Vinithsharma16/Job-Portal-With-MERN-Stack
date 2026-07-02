import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAllAppliedJobs } from '../redux/jobSlice';
import { APPLICATION_API_END_POINT } from '../utils/constant';

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        console.log("Applied Jobs API response:", res.data);

        if (res.data.success) {
          // Correct key here
          dispatch(setAllAppliedJobs(res.data.applications));
        } else {
          dispatch(setAllAppliedJobs([]));
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        dispatch(setAllAppliedJobs([]));
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);
};

export default useGetAppliedJobs;
