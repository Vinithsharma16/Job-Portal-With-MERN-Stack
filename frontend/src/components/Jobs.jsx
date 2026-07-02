import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import{ motion } from 'framer-motion';

//const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];
const Jobs = () => {
    const {allJobs,searchedQuery} = useSelector(store=>store.job);
    const[filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
    if (searchedQuery?.value) {

        const query = searchedQuery.value.toLowerCase();

        const filteredJobs = allJobs.filter((job) => {
            return (
                job.title.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query)
            );
        });

        setFilterJobs(filteredJobs);

    } else {
        setFilterJobs(allJobs);
    }
}, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar/>
     
        <div className='w-full px-5 mt-5'>
  <div className='flex gap-5 relative'>
    {/* Left Filter Card */}
    <div className='w-[20%]'>
      <FilterCard />
    </div>

    {
      filterJobs.length === 0 ? <span>Job Not Found</span> : (
        <div className='flex-1 h-[88vh] overflow-y-auto pb-10 pr-8'>
        {/* The pr-2 adds space between content and scrollbar */}
        <div className='grid grid-cols-3 gap-6'>
            {filterJobs.map((job) => (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                key={job?._id}
              >
                <Job job={job} />
              </motion.div>
            ))}
          </div>
           <div className='w-6 absolute top-0 right-0 h-full'></div> 
        </div>
      )
    }
  </div>
</div>
   </div>

    )
}

export default Jobs