import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Pen, MailCheck, Phone } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliesJobTable from "./AppliesJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";

const Profile = () => {
  const [open, setOpen] = useState(false);

  // Fetch applied jobs
  useGetAppliedJobs();

  const { user } = useSelector((store) => store.auth);

   return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 border border-gray-200 rounded-3xl shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <Avatar className="h-28 w-28 shadow-lg ring-2 ring-purple-300">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt="profile"
                className="object-cover rounded-full"
              />
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-purple-900">{user?.fullname}</h2>
              <p className="text-gray-700 mt-1">{user?.profile?.bio || "No bio available"}</p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="border-purple-400 text-purple-700 hover:bg-purple-100 hover:border-purple-500 transition"
          >
            <Pen className="mr-1" /> Edit
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <MailCheck className="text-purple-500" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
            <Phone className="text-purple-500" />
            <span>{user?.phoneNumber || "NA"}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0
              ? user.profile.skills.map((skill, idx) => (
                  <Badge key={idx} className="bg-purple-200 text-purple-800">{skill}</Badge>
                ))
              : <span className="text-gray-500">NA</span>}
          </div>
        </div>

        {/* Resume */}
        <div className="mt-6">
          <Label className="font-semibold text-gray-700">Resume</Label>
          {user?.profile?.resume ? (
            <a
              href={user.profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 text-purple-700 hover:underline font-medium"
            >
              {user.profile.resumeOriginalName}
            </a>
          ) : (
            <span className="text-gray-500 block mt-1">NA</span>
          )}
        </div>
      </div>

      {/* Applied Jobs */}
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded-3xl shadow-lg">
  <h3 className="font-bold text-xl mb-3 text-purple-800">Applied Jobs</h3>
  <AppliesJobTable />
</div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
