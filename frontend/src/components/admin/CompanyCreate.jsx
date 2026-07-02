import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from "../../utils/constant";
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '../../redux/companySlice';
import Footer from '../Footer';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [name, setName] = useState();
    const dispatch = useDispatch();
    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {name}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
     return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
            <Navbar />

            <div className="max-w-xl mx-auto mt-16 p-8 rounded-3xl shadow-2xl border border-white/30 bg-white/70 backdrop-blur-lg animate-fade-in">
                
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="font-extrabold text-4xl text-purple-900 mb-2">
                        Create Your Company
                    </h1>
                    <p className="text-gray-700 text-sm sm:text-base">
                        Enter your company name. You can update this later if needed.
                    </p>
                </div>

                {/* Form */}
                <div className="mb-6">
                    <Label className="text-gray-800 font-medium">Company Name</Label>
                    <Input
                        type="text"
                        className="mt-2 placeholder-gray-400 focus:ring-2 focus:ring-purple-300 transition-all"
                        placeholder="JobHunt, Microsoft etc."
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-4 mt-10">
                    <Button
                        variant="outline"
                        className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-purple-50 transition"
                        onClick={() => navigate("/admin/companies")}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
                        onClick={registerNewCompany}
                    >
                        Continue
                    </Button>
                </div>
            </div>
           
        </div>
    );
}

export default CompanyCreate