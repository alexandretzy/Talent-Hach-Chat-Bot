import React, { useState, useEffect } from "react";
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill, BsArrowRight } from "react-icons/bs";

export default function Carousel({ slides }) {
    const [current, setCurrent] = useState(0);

    // Function to go to previous slide
    const previousSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Function to go to next slide
    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    // Auto slide functionality with infinite loop every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide(); // Automatically go to the next slide every 5 seconds
        }, 10000); // 10 seconds interval

        // Clean up the interval on unmount
        return () => clearInterval(interval);
    }, [current]); // Add `current` as dependency so the interval updates correctly

    return (
        <div className="relative w-full h-[60vh] md:h-screen overflow-hidden">
            {/* Carousel Images with smooth sliding effect */}
            <div
                className="flex transition-transform ease-out duration-700"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex-shrink-0 relative"
                    >
                        {/* Background Image */}
                        <img
                            src={slide.src}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover object-center rounded-lg"
                        />

                        {/* Black Opacity Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-75"></div>

                        {/* Centered Text Overlay */}
                        {
                            index === 0 && (
                                <div className="absolute inset-0 flex flex-col justify-start items-center text-center z-10 pt-[35vh]">
                                    <h2 className="text-[32px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        Unlock Your Career Potential.
                                    </h2>
                                    <h2 className="text-[60px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        Talent Hatch,
                                    </h2>
                                    <h4 className="text-[32px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        Where Opportunities Await
                                    </h4>

                                    <button className="flex items-center gap-2 bg-cyan-500 text-white mt-8 px-6 py-3 rounded text-lg font-semibold hover:bg-cyan-600">
                                        Career Jobs <BsArrowRight />
                                    </button>
                                </div>
                            )
                        }
                        {
                            index === 1 && (
                                <div className="absolute inset-0 flex flex-col justify-start items-center text-center z-10 pt-[35vh]">
                                    <h2 className="text-[36px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        Discover the Power of Talent Hatch.
                                    </h2>
                                    <h2 className="text-[60px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        Insightful Growth,
                                    </h2>
                                    <h4 className="text-[32px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        Empowering Your Career Journey
                                    </h4>

                                    <button className="flex items-center gap-2 bg-cyan-500 text-white mt-8 px-6 py-3 rounded text-lg font-semibold hover:bg-cyan-600">
                                        Know More About Us <BsArrowRight />
                                    </button>
                                </div>
                            )
                        }
                        {
                            index === 2 && (
                                <div className="absolute inset-0 flex flex-col justify-start items-center text-center z-10 pt-[35vh]">
                                    <h2 className="text-[36px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        Begin Your Path with Talent Hatch.
                                    </h2>
                                    <h2 className="text-[60px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        A New Journey,
                                    </h2>
                                    <h4 className="text-[32px] font-bold text-white px-6 max-w-[70%] uppercase leading-tight">
                                        Start Today with Endless Opportunities
                                    </h4>

                                    <button className="flex items-center gap-2 bg-cyan-500 text-white mt-8 px-6 py-3 rounded text-lg font-semibold hover:bg-cyan-600">
                                        Grow Your Career With Us <BsArrowRight />
                                    </button>
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>

            {/* Left & Right Arrow Buttons */}
            <div className="absolute top-1/2 left-5 transform -translate-y-1/2 text-white text-4xl z-10">
                <button
                    onClick={previousSlide}
                    className="hover:text-gray-300 transition-colors"
                >
                    <BsFillArrowLeftCircleFill />
                </button>
            </div>
            <div className="absolute top-1/2 right-5 transform -translate-y-1/2 text-white text-4xl z-10">
                <button
                    onClick={nextSlide}
                    className="hover:text-gray-300 transition-colors"
                >
                    <BsFillArrowRightCircleFill />
                </button>
            </div>

            {/* Dot Indicators */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-4 h-4 rounded-full cursor-pointer transition-all ${index === current ? "bg-white scale-125" : "bg-gray-500"}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
