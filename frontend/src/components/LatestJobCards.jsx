import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom';


const LatestJobCards = ({job}) => {
   const navigate = useNavigate();
  return (
    <div onClick={()=>navigate(`/description/${job._id}`)} className='h-full p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer 
                flex flex-col justify-between'>

<div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center">
          <img
            src={
              job.company?.logo ||
              "https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png"
            }
            alt={job.company?.name || "Company"}
            className="object-contain h-full w-full"
          />
        </div>
        <h6 className='font-medium text-lg'>{job?.company?.name || "Company"}</h6>
      </div>
       <p className='text-sm text-gray-500 mt-1'>India</p>
    <div>
        <h5 className='font-bold text-lg my-2'>{job?.title}</h5>
       <p className='text-sm text-gray-600 line-clamp-3'>{job?.description}</p>

    </div>
    <div className='flex items-center gap-2 mt-4'>
        <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position}</Badge>
        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
        <Badge className={'text-[#7289b7] font-bold'} variant="ghost">{job?.salary}</Badge>

    </div>
    </div>
  )
}

export default LatestJobCards