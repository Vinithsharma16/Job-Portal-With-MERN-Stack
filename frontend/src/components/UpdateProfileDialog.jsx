import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Label } from '@radix-ui/react-label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { USER_API_END_POINT } from '../utils/constant'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '../redux/authSlice'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio,
       skills: user?.profile?.skills?.join(", ") || "",
        file: null 
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

   const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

        // ⬅️ IMPORTANT: send file directly to backend
        if (input.file instanceof File) {
            formData.append("file", input.file);
        }

        const res = await axios.post(
            `${USER_API_END_POINT}/profile/update`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            }
        );

        if (res.data.success) {
            dispatch(setUser(res.data.user));
            toast.success("Profile updated");
            setOpen(false);
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};




     return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent 
                className="sm:max-w-md w-full rounded-2xl bg-white shadow-xl p-6 sm:p-8"
                onInteractOutside={() => setOpen(false)}
            >
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-bold text-purple-800 text-center">
                        Update Profile
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 text-center mt-1">
                        Update your personal information below
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); submitHandler(e); }}>
                    <div className="space-y-4">
                        {[
                            { label: "Full Name", name: "fullname", type: "text" },
                            { label: "Email", name: "email", type: "email" },
                            { label: "Phone Number", name: "phoneNumber", type: "text" },
                            { label: "Bio", name: "bio", type: "text" },
                            { label: "Skills (comma separated)", name: "skills", type: "text" },
                            { label: "Resume", name: "file", type: "file", accept: "application/pdf" }
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <Label className="mb-1 font-medium text-gray-700">{field.label}</Label>
                                <Input
                                    type={field.type}
                                    name={field.name}
                                    accept={field.accept}
                                    value={field.type !== "file" ? input[field.name] : undefined}
                                    onChange={field.type === "file" ? fileChangeHandler : changeEventHandler}
                                    className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 placeholder-gray-400"
                                    placeholder={field.type !== "file" ? `Enter ${field.label.toLowerCase()}` : undefined}
                                />
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button 
                            type="submit" 
                            className={`w-full py-2 rounded-lg font-semibold transition-all ${
                                loading 
                                ? "bg-purple-400 cursor-not-allowed" 
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                            }`}
                            disabled={loading}
                        >
                            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin inline-block"/> Updating...</> : "Update Profile"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog
