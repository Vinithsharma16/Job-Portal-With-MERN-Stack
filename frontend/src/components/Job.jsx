import React from 'react'
import { Button } from './ui/button'

import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

      return (
    <div 
      className='
        relative p-6 md:p-8 rounded-2xl shadow-lg bg-white border border-gray-200
        flex flex-col justify-between transition-transform duration-300
        hover:shadow-2xl hover:-translate-y-2 hover:scale-105 overflow-hidden
        h-full
      '
    >
     
      <div>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm text-gray-400'>
            {daysAgoFunction(job?.createdAt) === 0 ? 'Today' : `${daysAgoFunction(job?.createdAt)} days ago`}
          </p>
          
        </div>

      
        <div className='flex items-center gap-4 mb-5 group'>
          <Avatar className='h-14 w-14 border border-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-110'>
            <AvatarImage src={job?.company?.logo} className='object-contain' />
          </Avatar>
          <div>
            <h5 className='font-semibold text-lg text-gray-800 group-hover:text-purple-600 transition-colors'>
              {job?.company?.name}
            </h5>
            <p className='text-sm text-gray-500'>India</p>
          </div>
        </div>

      
        <div>
          <h6 className='font-bold text-xl text-gray-900 mb-3'>{job?.title}</h6>
          <p className='text-gray-600 text-sm line-clamp-4'>{job?.description}</p>
        </div>

     
        <div className='flex flex-wrap gap-2 mt-4'>
          <Badge className='text-blue-700 font-semibold transition-transform duration-300 hover:scale-110' variant='ghost'>
            {job?.position} Positions
          </Badge>
          <Badge className='text-red-500 font-semibold transition-transform duration-300 hover:scale-110' variant='ghost'>
            {job?.jobType}
          </Badge>
          <Badge className='text-indigo-600 font-semibold transition-transform duration-300 hover:scale-110' variant='ghost'>
            {job?.salary} LPA
          </Badge>
        </div>
      </div>

      
      <div className='flex flex-col sm:flex-row items-center gap-4 mt-6'>
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant='outline'
          className='flex-1 text-sm font-medium hover:bg-gray-50 transition-colors'
        >
          Details
        </Button>
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          className='flex-1 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors transform hover:scale-105'
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default Job;
