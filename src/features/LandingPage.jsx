import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Import images 
import hydroImage from '../assets/images/landing/hydro.jpg';
import solarImage from '../assets/images/landing/solar.jpg';
import windImage from '../assets/images/landing/wind.webp';
import logo from '../assets/images/logo.png';

const carouselData = [
    {
      image: hydroImage,
      title: "Hydro Power Energy",
      description: "Hydropower energy uses flowing or falling water to generate electricity, making it one of the most widely used renewable energy sources globally.",
      details: "In the Philippines, hydropower supplies about 10-12% of the country's electricity. With its abundant rivers and high rainfall, the nation hosts significant projects."
    },
    {
      image: solarImage,
      title: "Solar Energy",
      description: "Solar power harnesses the sun's energy to generate clean electricity, providing a sustainable solution for our growing energy needs.",
      details: "The Philippines has great potential for solar energy with an average of 5.1 kWh/m² per day of solar radiation."
    },
    {
      image: windImage,
      title: "Wind Power",
      description: "Wind energy captures the natural power of wind through turbines, converting it into renewable electricity.",
      details: "The Philippines' wind energy sector is growing, with several wind farms contributing to the national power grid."
    }
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselData.length);
      }, 5000);
  
      return () => clearInterval(timer);
    }, []);
  
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    };
  
    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    };
  
    const goToSlide = (index) => {
      setCurrentSlide(index);
    };

   return (
    <div className="relative min-h-screen">
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="EcoPulse Logo"
                className="w-20 h-20 object-cover"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                EcoPulse
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <Link to="/about" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                About us
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Contact
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Login
              </Link>
              <button 
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Rest of your component remains the same */}
      <div className="absolute inset-0 transition-all duration-500 ease-in-out">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={carouselData[currentSlide].image}
          alt={carouselData[currentSlide].title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content sections remain the same */}
      <div className="relative z-20 container mx-auto px-6 pt-32">
        {/* Your existing content */}
        <div className="grid lg:grid-cols-2 gap-12 min-h-[80vh] items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl font-bold leading-tight transition-all duration-500">
              {carouselData[currentSlide].title}
            </h1>
            <p className="text-lg text-gray-200 max-w-xl transition-all duration-500">
              {carouselData[currentSlide].description}
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all group">
              Learn More
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Content - Info Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-3xl font-bold text-green-800 transition-all duration-500">
              {carouselData[currentSlide].title}
            </h2>
            <div className="space-y-4 text-gray-600 transition-all duration-500">
              <p>{carouselData[currentSlide].description}</p>
              <p>{carouselData[currentSlide].details}</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
              Read full article
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'w-8 bg-green-500' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;