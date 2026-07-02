import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    useEffect(() => {
        const filterCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filterCompany);

    }, [companies, searchCompanyByText])

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-4">
            <Table className="min-w-full border-separate border-spacing-y-2">
                <TableCaption className="text-gray-500">
                    A list of your recent registered companies
                </TableCaption>

                <TableHeader>
                    <TableRow className="bg-gray-100 rounded-lg">
                        <TableHead className="rounded-l-lg font-semibold text-gray-700">
                            Logo
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                            Date
                        </TableHead>
                        <TableHead className="rounded-r-lg font-semibold text-gray-700 text-center">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        !companies || companies.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-6 text-gray-500 font-medium"
                                >
                                    You haven't registered any company yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filterCompany.map(company => (
                                <TableRow
                                    key={company._id}
                                    className="hover:bg-gray-50 transition-all duration-200 rounded-xl shadow-sm"
                                >
                                    {/* Logo */}
                                    <TableCell className="py-4">
                                        <Avatar className="h-10 w-10 ring-1 ring-gray-200">
                                            <AvatarImage
                                                src={
                                                    company?.logo ||
                                                    "https://www.freepnglogos.com/uploads/company-logo-png/company-logo-transparent-png-19.png"
                                                }
                                                className="object-contain"
                                            />
                                        </Avatar>
                                    </TableCell>

                                    {/* Name */}
                                    <TableCell className="font-medium text-gray-800">
                                        {company.name}
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className="text-gray-500">
                                        {company.createdAt?.split("T")[0]}
                                    </TableCell>

                                    {/* Direct Edit Button (no popover) */}
                                    <TableCell className="text-center">
                                        <div
                                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                                            className="
      inline-flex items-center gap-1 
      bg-[#cabae5] 
      text-white 
      px-3 py-1 
      rounded-full 
      cursor-pointer 
      transition-all duration-200
      hover:shadow-xl 
      hover:scale-105 
      hover:bg-[#b795e0] 
      hover:text-gray-100 
      hover:-translate-y-1 
      hover:rotate-1
      hover:ring-2 
      hover:ring-purple-300
    "
                                        >
                                            <Edit2 className="w-4" />
                                            <span className="text-sm font-medium">Edit</span>
                                        </div>
                                    </TableCell>


                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );


}

export default CompaniesTable
