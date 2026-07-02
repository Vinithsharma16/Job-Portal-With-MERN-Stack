import React from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage } from "./ui/avatar";

const AppliesJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  console.log("Redux state allAppliedJobs:", allAppliedJobs);

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return <p className="text-center my-4">You haven't applied to any jobs yet.</p>;
  }
return (
    <div className="w-full p-4">
      <div className="overflow-x-auto">
        <Table className="min-w-full">

          {/* Title */}
          <TableCaption className="text-left text-purple-800 font-medium mb-2">
            Your recently applied jobs
          </TableCaption>

          {/* Header */}
          <TableHeader>
            <TableRow>
              <TableHead className="text-purple-900 font-semibold">Date</TableHead>
              <TableHead className="text-purple-900 font-semibold">Job Role</TableHead>
              <TableHead className="text-purple-900 font-semibold">Company</TableHead>
              <TableHead className="text-purple-900 font-semibold text-right">Status</TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            {allAppliedJobs.map((job) => {
              const appliedJob = job.job || {};
              const company = appliedJob.company || {};
              const status = job.status || "pending";

              return (
                <TableRow key={job._id} className="cursor-pointer">
                  <TableCell className="text-gray-800">
                    {job.createdAt?.split("T")[0] || "N/A"}
                  </TableCell>

                  <TableCell className="font-medium text-gray-900">
                    {appliedJob.title || "N/A"}
                  </TableCell>

                  {/* Company */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={company.logo || "https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png"}
                          alt={company.name || "Company Logo"}
                          className="object-contain"
                        />
                      </Avatar>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="text-right">
                    <Badge
                      className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm
                        ${status === "rejected"
                          ? "bg-red-500 text-white"
                          : status === "pending"
                            ? "bg-gray-500 text-white"
                            : "bg-green-600 text-white"
                        }`}
                    >
                      {status.toUpperCase()}
                    </Badge>
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>

        </Table>
      </div>
    </div>
  );
};

export default AppliesJobTable;
