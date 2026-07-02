import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from "../../utils/constant";
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '../../hooks/useGetCompanyById';


const CompanySetup = () => {
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    useGetCompanyById(params.id);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });

    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const fromData = new FormData();
        fromData.append("name", input.name);
        fromData.append("description", input.description);
        fromData.append("website", input.website);
        fromData.append("location", input.location);
        if (input.file) {
            fromData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description||"",
            website:singleCompany.website|| "",
            location: singleCompany.location || "",
            file: singleCompany.file || null

        })
    },[singleCompany])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
            <Navbar />

            <div className="max-w-xl mx-auto mt-16 p-8 rounded-3xl shadow-2xl border border-white/30 bg-white/70 backdrop-blur-lg animate-fade-in">
                
                {/* Header */}
                <div className="flex items-center gap-5 mb-8">
                    <Button
                        onClick={() => navigate("/admin/companies")}
                        variant="outline"
                        className="flex items-center gap-2 text-gray-500 font-semibold hover:bg-purple-50 transition"
                    >
                        <ArrowLeft />
                        <span>Back</span>
                    </Button>
                    <h6 className="font-bold text-2xl text-purple-900">Company Setup</h6>
                </div>

                {/* Form */}
                <form onSubmit={submitHandler}>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label className="text-gray-800 font-medium">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="mt-2 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 transition-all"
                            />
                        </div>

                        <div>
                            <Label className="text-gray-800 font-medium">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="mt-2 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 transition-all"
                            />
                        </div>

                        <div>
                            <Label className="text-gray-800 font-medium">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="mt-2 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 transition-all"
                            />
                        </div>

                        <div>
                            <Label className="text-gray-800 font-medium">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="mt-2 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 transition-all"
                            />
                        </div>

                        <div className="col-span-2">
                            <Label className="text-gray-800 font-medium">Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
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
                                Update
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CompanySetup