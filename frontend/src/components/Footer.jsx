import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-[#1F1B2E] text-white pt-20 pb-12">

      {/* Smooth Curved Top */}
      <div className="absolute top-[-50px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="w-full h-[70px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C360,80 1080,0 1440,40 L1440 80 L0 80 Z"
            fill="#1F1B2E"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Left */}
          <div>
            <h1 className="text-2xl font-bold">
              Job<span className="text-[#6A38C2]">Portal</span>
            </h1>

            <p className="text-gray-300 mt-4 leading-6">
              JOBPORTAL is the most suitable platform to find your job.
              Job seekers and employers are connected through advanced search engines,
              making the right match fast and easy.
            </p>

            <div className="flex gap-4 mt-5">
              <FaFacebookF className="w-6 h-6 text-gray-400 hover:text-blue-500 cursor-pointer" />
              <FaInstagram className="w-6 h-6 text-gray-400 hover:text-pink-500 cursor-pointer" />
              <FaYoutube className="w-6 h-6 text-gray-400 hover:text-red-600 cursor-pointer" />
              <FaLinkedinIn className="w-6 h-6 text-gray-400 hover:text-blue-600 cursor-pointer" />
            </div>
          </div>

          {/* Middle */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Site Map</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-purple-400 cursor-pointer">Home</li>
              <li className="hover:text-purple-400 cursor-pointer">About Us</li>
              <li className="hover:text-purple-400 cursor-pointer">Private Jobs</li>
              <li className="hover:text-purple-400 cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Right */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Contacts</h2>

            <p className="font-semibold">Call Us On:</p>
            <p className="text-gray-300 mb-3">+91 9150014115</p>

            <p className="font-semibold">Address:</p>
            <p className="text-gray-300 leading-6 mb-3">
              Infotech <br />
              #20, Spencers Compound, <br />
              13th Cross Road, <br />
              Thiruvalluvar Salai, <br />
              Chennai - 600019, <br />
              Tamil Nadu
            </p>

            <p className="font-semibold">Email:</p>
            <p className="text-gray-300">admin@jobportal.com</p>
            <p className="text-gray-300">nfotechdg@gmail.com</p>
          </div>

        </div>

        <div className="text-center text-gray-400 mt-12">
          © 2025 JOBPORTAL. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
