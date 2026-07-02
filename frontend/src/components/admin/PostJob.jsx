import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

import { useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '../../utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Avatar, AvatarImage } from '../ui/avatar'


const companyArray = [];

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading,setLoading]= useState(false);
    const navigate = useNavigate();
    

    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

const selectChangeHandler = (value)=>{
    const selectedCompany = companies.find((company)=>company.name.toLowerCase() === value);
    setInput({...input, companyId:selectedCompany._id});
};

const submitHandler =async (e) => {
    e.preventDefault();
    try{
      setLoading(true) ;
      const res= await axios.post(`${JOB_API_END_POINT}/post`,input,{
        header:{
            'Content-Type':'application/json'
        },
        withCredentials:true
      });
      if(res.data.success){
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    }catch(error){
        toast.error(error.response.data.message);

    }finally{
        setLoading(false);
    }

    
 
}


     return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
            <Navbar />
            <div className="flex items-center justify-center w-full py-10">
                <form onSubmit={submitHandler} className="w-full max-w-4xl p-8 bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl">
                    
                    <h2 className="text-2xl font-bold text-purple-900 mb-6 text-center">Post a New Job</h2>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Job Details */}
                        {[
                            { label: "Title", name: "title" },
                            { label: "Description", name: "description" },
                            { label: "Requirements", name: "requirements" },
                            { label: "Salary", name: "salary" },
                            { label: "Location", name: "location" },
                            { label: "Job Type", name: "jobType" },
                            { label: "Experience Level", name: "experience" },
                            { label: "No of Positions", name: "position", type: "number" }
                        ].map((field) => (
                            <div key={field.name}>
                                <Label className="text-gray-800 font-medium">{field.label}</Label>
                                <Input
                                    type={field.type || "text"}
                                    name={field.name}
                                    value={input[field.name]}
                                    onChange={changeEventHandler}
                                    className="mt-2 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 transition-all"
                                />
                            </div>
                        ))}

                        {/* Company Selection */}
                        {companies.length > 0 && (
                            <div className="col-span-2">
                                <Label className="text-gray-800 font-medium">Select Company</Label>
                                <Select onValueChange={selectChangeHandler} className="mt-2 w-full">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage
                                                                src={company.logo || "https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png"}
                                                                alt={company.name}
                                                                className="object-contain"
                                                            />
                                                        </Avatar>
                                                        <span>{company.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="mt-8">
                        {loading ? (
                            <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 flex justify-center items-center gap-2 shadow-md">
                                <Loader2 className="h-4 w-4 animate-spin" /> Please wait
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 shadow-md rounded-lg transition-all transform hover:-translate-y-0.5"
                            >
                                Post New Job
                            </Button>
                        )}

                        {companies.length === 0 && (
                            <p className="text-xs text-red-600 font-bold text-center mt-3">
                                *Please register a company first before posting a job
                            </p>
                        )}
                    </div>
                </form>
            </div>
           
        </div>
    );
}

export default PostJob