import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate } from "react-router-dom";

const sliderImages = [
  "https://images.unsplash.com/photo-1521791055366-0d553872125f",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
];

const HeroSection = () => {
  const[query,setQuery] = useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();


  const searchJobHandler =() => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");

  }


  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[550px] overflow-hidden rounded-b-[60px] shadow-lg">

      {/* Background Slider */}
      <img
        src={sliderImages[currentIndex]}
        alt="slider"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        
        <span className="px-4 py-2 rounded-full bg-white/70 text-[#6A38C2] font-semibold backdrop-blur">
          Job Hunt Website
        </span>

        <h1 className="text-6xl font-extrabold mt-6 drop-shadow-md">
          Search, Apply & <br /> Get Your
          <span className="text-[#bfa4ff]"> Dream Jobs </span>
        </h1>

        <p className="text-lg mt-2">Find the right job that fits your skills.</p>

        {/* Search Box */}
        <div className="flex w-[45%] mt-6 border border-gray-200 bg-white/90 backdrop-blur rounded-full pl-4 items-center shadow-lg">
          <input
            type="text"
            placeholder="Find your dream job"
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-black"
          />
          <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2] hover:bg-[#552da0]">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
