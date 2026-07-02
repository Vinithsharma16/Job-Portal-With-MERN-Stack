import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'

import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'sonner'
import { USER_API_END_POINT } from '../../utils/constant';
import { useDispatch, useSelector } from 'react-redux'
;
import { Loader, Loader2 } from 'lucide-react'
import { setLoading, setUser } from '../../redux/authSlice'


export const Login = () => {
  const [input, setInput]= useState({
    email:"",
    password:"",
    role:"student",
  });
  const {loading,user} = useSelector(store=>store.auth);
 const navigate = useNavigate();
 const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({...input, [ e.target.name]:e.target.value});
  }


const submitHandler = async (e) => {
        e.preventDefault();
        
       
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`,input,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true,
            });
            if(res.data.success){
                dispatch(setUser(res.data.user));
                navigate("/")
                toast.success(res.data.message);
            }
        } catch (error){
          console.log(error);
           console.log("Login failed:", error.response?.data || error.message);
              toast.error("Login failed!");
        }finally{
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
                    <h1 className='font-extrabold text-2xl text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>Login</h1>
                    
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                             value= {input.email || ""}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="abc@gmail.com"
                        />
                    </div>
                    
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                             value= {input.password || ""}
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

                        
                    </div>
                    {
                     loading ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin'/> Please wait</Button> :  <Button type="submit" className="bg-[#6A38C2] hover:bg-[#2e1061] w-full my-4">Login</Button>
                    }
                   
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-[#6A38C2]'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

