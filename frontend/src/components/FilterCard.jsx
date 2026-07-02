import React, { useEffect, useState } from 'react'
import { RadioGroup } from './ui/radio-group'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'

const filterData = [
    { filterType: "Location", array: ["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai"] },
    { filterType: "Industry", array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Software Engineer","Device Associate","UI/UX Designer"] },
    
    // { filterType: "Salary", array: ["3LPA-5LPA", "5LPA-10LPA", "10LPA-15LPA"] },
]

const FilterCard = () => {

    const [selectedValue, setSelectedValue] = useState(null);
    const dispatch = useDispatch();

    // 🔥 NEW: Sends filter type + value
    const changeHandler = (value, type) => {
        const selected = { type, value };
        setSelectedValue(selected);
    };

    useEffect(() => {
    
    if (selectedValue && selectedValue.value) {
        dispatch(setSearchedQuery(selectedValue));
    } else {
       
        dispatch(setSearchedQuery(""));
    }
}, [selectedValue]);


    return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border border-gray-200">
      
      <h6 className="font-bold text-xl text-gray-800 mb-3">Filter Jobs</h6>
      <hr className="border-gray-300 mb-4" />

      <RadioGroup className="space-y-6">
        {filterData.map((data, index) => (
          <div key={index}>
            <h6 className="font-semibold text-gray-700 mb-3">{data.filterType}</h6>
            <div className="flex flex-col gap-3">
              {data.array.map((item, idx) => {
                const itemId = `id-${index}-${idx}`;
                return (
                  <div key={idx} className="flex items-center space-x-3">
                    <Input
                      type="radio"
                      id={itemId}
                      name={data.filterType}
                      value={item}
                      onChange={() => changeHandler(item, data.filterType)}
                      checked={selectedValue?.value === item}
                      className="w-5 h-5 accent-purple-600 cursor-pointer rounded-full transition-transform hover:scale-110"
                    />
                    <Label htmlFor={itemId} className="cursor-pointer text-sm text-gray-700 hover:text-purple-700 transition-colors">
                      {item}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
