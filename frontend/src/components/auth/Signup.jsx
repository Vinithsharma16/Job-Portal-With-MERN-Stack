import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';

import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/authSlice';
import { Loader2 } from 'lucide-react'




export const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`,formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                },
                withCredentials:true,
            });
            if(res.data.success){
                navigate("/login")
                toast.success(res.data.message);
            }
        } catch (error) {
    console.log("Signup failed:", error.response?.data || error.message);
    toast.error("Signup failed!");
} finally{
    dispatch(setLoading(false));
}

        
    }
    useEffect(()=>{
          if(user){
            navigate("/");
          }
        },[])
    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-purple-50 to-purple-200 px-4 pt-20">
                <form onSubmit={submitHandler}  className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 backdrop-blur-lg">
                    <h1 className='font-extrabold text-2xl text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>Sign Up</h1>
                    <div className='my-2'>
                        <Label> Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname||""}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="NAME"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email ||""}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="abc@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber || ""}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="8080808080"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password || ""}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="abc@gmail.com"
                        />
                    </div>
                    <div className="my-4">
                        <RadioGroup className="flex gap-8">
  <div className="flex items-center gap-2">
    <Input
      type="radio"
      id="student"
      name="role"
      value="student"
      checked={input.role === "student"}
      onChange={(e) => setInput({ ...input, role: e.target.value })}
     className="accent-[#6A38C2]"/>
    <Label htmlFor="student">Student</Label>
  </div>
  <div className="flex items-center gap-2">
    <Input
      type="radio"
      id="recruiter"
      name="role"
      value="recruiter"
      checked={input.role === "recruiter"}
      onChange={(e) => setInput({ ...input, role: e.target.value })}
     className="accent-[#6A38C2]"/>
    <Label htmlFor="recruiter">Recruiter</Label>
  </div>
</RadioGroup>

                        <div className='flex items-center gap-2'>
                            <label>Profile</label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                   {
                     loading ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait</Button> :  <Button type="submit" className="bg-[#6A38C2] hover:bg-[#371474] w-full my-4">SignUp</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-[#6A38C2]'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

