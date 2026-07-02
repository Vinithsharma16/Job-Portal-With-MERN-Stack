import React from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { User2, LogOut } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import { setUser } from '../../redux/authSlice';
import axios from 'axios';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/login");
                toast.success("Logged Out!");
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Logout failed!";
            toast.error(message);
        }
    }

    return (
        <div className="bg-white shadow-md w-screen">
            <div className='flex items-center justify-between mx-auto h-16 px-4'>

                {/* ✅ Logo + Title */}
                <div className="flex items-center gap-1">
                    
                    <h1 className="text-2xl font-bold text-gray-800">
                        Job<span className="text-[#CB6BE6]">Portal</span>
                    </h1>
                </div>

                {/* Navigation Menu */}
                <div className='flex items-center gap-2'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className='text-[#6A38C2]'>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className='text-[#6A38C2]'>Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className='text-[#6A38C2]'>Home</Link></li>
                                    <li><Link to="/jobs" className='text-[#6A38C2]'>Jobs</Link></li>
                                    <li><Link to="/browse" className='text-[#6A38C2]'>Browse</Link></li>
                                </>
                            )
                        }
                    </ul>

                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button className='text-[#6A38C2]' variant="outline">login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#6A38C2]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto}
                                            alt="profile-photo"
                                            className="object-contain"
                                        />
                                    </Avatar>
                                </PopoverTrigger>

                                <PopoverContent className="w-80">
                                    <div className="flex gap-4 items-center">
                                        <Avatar>
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto}
                                                alt="profile-photo"
                                                className="object-cover"
                                            />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium">{user?.fullname}</h4>
                                            {user?.role === "student" && (
                                                <p className="text-sm text-muted-foreground">
                                                    {user?.profile?.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {user?.role === 'student' && (
                                        <div className="flex flex-col my-2 items-start gap-2 mt-4">
                                            <Link to="/profile">
                                                <Button
                                                    variant="link"
                                                    className="flex items-center gap-2 w-full justify-start text-gray-800 hover:text-[#6A38C2] hover:bg-gray-100 !bg-transparent !border-0"
                                                >
                                                    <User2 size={18} />
                                                    <span>View Profile</span>
                                                </Button>
                                            </Link>
                                        </div>
                                    )}

                                    <div>
                                        <Button
                                            variant="link"
                                            onClick={logoutHandler}
                                            className="flex items-center gap-2 w-full justify-start text-gray-800 hover:text-[#6A38C2] hover:bg-gray-100 !bg-transparent !border-0"
                                        >
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;
