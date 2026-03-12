import React, { useEffect, useState } from 'react';
import Carousel from '../../layout/Carousel';
import { Button } from '@/components/ui/button';
import { BsBriefcaseFill, BsFillGiftFill, BsArrowRightCircleFill, BsRobot } from "react-icons/bs";
import { FaHeartbeat, FaGraduationCap, FaRegClock, FaLaptopHouse, FaTrophy, FaRegCalendarCheck, FaDumbbell, FaUsers, FaChartLine, FaInstagram, FaYoutube } from 'react-icons/fa';
import { GiMuscleUp, GiGiftOfKnowledge } from 'react-icons/gi';
import { FiClock, FiUsers } from 'react-icons/fi';
import { MdStars } from 'react-icons/md';
import { FaFacebook } from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input';
import supabase from '@/supabase-client';
import { Link } from 'react-router-dom';

export default function Home() {
    const [openChatBot, setOpenChatBot] = React.useState(false);
    const [activeLegalModal, setActiveLegalModal] = useState(null);
    const initialGreeting = 'Hi! I\'m Talent Hatch AI. How can I help you today?';

    const toggleChatBot = () => {
        setOpenChatBot((active) => !active);
    }

    const [userInput, setUserInput] = useState(''); // User input
    const [messages, setMessages] = useState([]); // Chat history (user and bot messages)
    const [loading, setLoading] = useState(false); // Loading state for waiting response

    const cleanAiAnswer = (text) => {
        if (typeof text !== 'string') return '';

        return text
            .replace(/^\s*\*{0,2}\s*FAQ\s*Answer\s*:\s*\*{0,2}\s*/i, '')
            .replace(/\n/g, '<br />')
            .trim();
    };

    useEffect(() => {
        if (openChatBot && messages.length === 0) {
            setMessages([
                { sender: 'ai', question: '', answer: initialGreeting }
            ]);
        }
    }, [openChatBot, messages.length]);

    const sendMessageToWebhook = async () => {
        if (!userInput) return; // Do nothing if input is empty

        // Add user question to messages array
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'applicant', question: userInput, answer: '' }
        ]);

        setLoading(true); // Show loading animation

        try {
            const response = await fetch('https://alexandretzy.app.n8n.cloud/webhook/talent-hatch-chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_query: userInput }),
            });

            // Check if the response is valid and JSON parsable
            if (!response.ok) {
                throw new Error('Failed to fetch data from n8n');
            }

            const data = await response.json();

            // Check if the response has an 'output' field and handle accordingly
            if (data && data[0] && data[0].output) {
                const formattedAnswer = cleanAiAnswer(data[0].output);

                // Add AI response to messages array
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'ai', question: userInput, answer: formattedAnswer }
                ]);
            } else {
                // Handle empty or invalid response
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'ai', question: userInput, answer: "Sorry, I couldn't process your request." }
                ]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'ai', question: userInput, answer: "Sorry, I couldn't process your request." }
            ]);
        } finally {
            setLoading(false); // Hide loading animation
            setUserInput(''); // Clear the input field
        }
    };

    const clearChatHistory = () => {
        setMessages([]); // Clear all chat history
        toggleChatBot(); // Close the chatbot
    };

    const openLegalModal = (modalKey) => {
        setActiveLegalModal(modalKey);
    };

    const closeLegalModal = () => {
        setActiveLegalModal(null);
    };


    const images = [
        { src: '/carousel/slide1.jpg', label: 'Unlock Your Next Career Opportunity' },
        { src: '/carousel/slide2.jpg', label: 'Insights for a Brighter Future' },
        { src: '/carousel/slide3.jpg', label: 'Embark on a New Journey Today' },
    ];

    const benefits = [
        {
            title: 'Comprehensive Health Insurance',
            description: 'We offer top-tier health coverage to ensure you and your loved ones are always taken care of.',
            icon: <FaHeartbeat />
        },
        {
            title: 'Professional Development Opportunities',
            description: 'Take part in continuous learning through workshops, training, and access to career-enhancing resources.',
            icon: <FaGraduationCap />
        },
        {
            title: 'Flexible Working Hours',
            description: 'Enjoy the flexibility to manage your work-life balance with our adaptable work schedules.',
            icon: <FiClock />
        },
        {
            title: 'Remote Work Option',
            description: 'Work from the comfort of your home, empowering you to deliver great results wherever you are.',
            icon: <FaLaptopHouse />
        },
        {
            title: 'Performance-Based Bonuses',
            description: 'We reward hard work with performance bonuses to recognize and appreciate your contributions.',
            icon: <FaTrophy />
        },
        {
            title: 'Paid Time Off (PTO)',
            description: 'Enjoy paid vacation and personal days to recharge and maintain a healthy work-life balance.',
            icon: <FaRegCalendarCheck />
        },
        {
            title: 'Employee Wellness Programs',
            description: 'Participate in programs that focus on physical and mental health, helping you stay at your best.',
            icon: <FaDumbbell />
        },
        {
            title: 'Collaborative Work Culture',
            description: 'Be part of a team-oriented environment where your voice is heard, and your contributions are valued.',
            icon: <FaUsers />
        },
        {
            title: 'Career Growth and Advancement',
            description: 'We provide opportunities for internal promotions, ensuring your career path evolves with us.',
            icon: <FaChartLine />
        },
    ];

    const [careerData, setCareerData] = useState([]);

    const extractList = (value, nestedKey) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'object' && Array.isArray(value[nestedKey])) return value[nestedKey];
        return [];
    };

    const toTextList = (value, nestedKey, textKey) => {
        const items = extractList(value, nestedKey);

        return items
            .map((item) => {
                if (typeof item === 'string') return item;
                if (!item || typeof item !== 'object') return '';
                if (typeof item[textKey] === 'string') return item[textKey];

                const firstStringValue = Object.values(item).find((field) => typeof field === 'string');
                return firstStringValue || '';
            })
            .filter(Boolean);
    };

    const normalizeCareerData = (rows) => {
        if (!Array.isArray(rows)) return [];

        return rows.map((career) => ({
            ...career,
            responsibilities: toTextList(career?.responsibilities, 'responsibilities', 'task'),
            requirements: toTextList(career?.requirements, 'requirements', 'requirement'),
        }));
    };

    useEffect(() => {
        careerOpportunities();
    }, []);

    const careerOpportunities = async () => {
        const { data, error } = await supabase.from('career_tbl').select('*');
        console.log(data);

        // Check if there's an error during fetching data
        if (error) return console.log('Error fetching career opportunities:', error);

        // Pass to useState
        setCareerData(normalizeCareerData(data));
    }

    return (
        <div className="w-full h-full">

            {/* Landing Page Content */}
            <div id='home' className="w-full h-screen">
                <Carousel slides={images} />
            </div>

            {/* Career Section */}
            <section id="career" className="px-16 py-[9rem] h-full">
                <div className="flex flex-col justify-center items-center gap-2 mb-16">
                    <BsBriefcaseFill className="text-6xl text-cyan-500" />
                    <h2 className="text-4xl font-bold border-b-2 border-cyan-500 w-fit pb-2">Career Opportunities</h2>
                </div>

                <div className="grid grid-cols-3 gap-16">
                    {/* Voice */}
                    <div>
                        <h4 className="text-2xl text-cyan-600 font-bold mb-4">Voice</h4>
                        {
                            careerData.map((career) => (
                                career.job_type === 'Voice' && (
                                    <div className="min-h-fit mb-4" key={career.id}>
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1" className="bg-gray-200 drop-shadow-sm">
                                                <AccordionTrigger
                                                    className="font-bold text-md hover:bg-cyan-700 hover:text-white hover:no-underline px-4"
                                                >
                                                    {career.name}
                                                </AccordionTrigger>
                                                <AccordionContent className='px-4 mt-4'>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Description</h6>
                                                        <p className="text-sm text-justify">{career.description}</p>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Responsibilities</h6>
                                                        <ul className="list-disc pl-6 space-y-2">
                                                            {
                                                                (Array.isArray(career.responsibilities) ? career.responsibilities : []).map((responsibility, index) => (
                                                                    <li key={index}>{responsibility}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Requirements:</h6>
                                                        <ul className="list-disc pl-6 space-y-2">
                                                            {
                                                                (Array.isArray(career.requirements) ? career.requirements : []).map((requirement, index) => (
                                                                    <li key={index}>{requirement}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                )
                            ))
                        }
                    </div>

                    {/* Mixed */}
                    <div>
                        <h4 className="text-2xl text-cyan-600 font-bold mb-4">Mixed</h4>
                        {
                            careerData.map((career) => (
                                career.job_type === 'Mixed' && (
                                    <div className="min-h-fit mb-4" key={career.id}>
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1" className="bg-gray-200 drop-shadow-sm">
                                                <AccordionTrigger
                                                    className="font-bold text-md hover:bg-cyan-700 hover:text-white hover:no-underline px-4"
                                                >
                                                    {career.name}
                                                </AccordionTrigger>
                                                <AccordionContent className='px-4 mt-4'>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Description</h6>
                                                        <p className="text-sm text-justify">{career.description}</p>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Responsibilities</h6>
                                                        <ul className="list-disc pl-6 space-y-2">
                                                            {
                                                                (Array.isArray(career.responsibilities) ? career.responsibilities : []).map((responsibility, index) => (
                                                                    <li key={index}>{responsibility}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Requirements:</h6>
                                                        <ul className="list-disc pl-6 space-y-2">
                                                            {
                                                                (Array.isArray(career.requirements) ? career.requirements : []).map((requirement, index) => (
                                                                    <li key={index}>{requirement}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                )
                            ))
                        }
                    </div>

                    {/* Non-Voice */}
                    <div>
                        <h4 className="text-2xl text-cyan-600 font-bold mb-4">Non-Voice</h4>
                        {
                            careerData.map((career) => (
                                career.job_type === 'Non-Voice' && (
                                    <div className="min-h-fit mb-4" key={career.id}>
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1" className="bg-gray-200 drop-shadow-sm">
                                                <AccordionTrigger
                                                    className="font-bold text-md hover:bg-cyan-700 hover:text-white hover:no-underline px-4"
                                                >
                                                    {career.name}
                                                </AccordionTrigger>
                                                <AccordionContent className='px-4 mt-4'>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Description</h6>
                                                        <p className="text-sm text-justify">{career.description}</p>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Responsibilities</h6>
                                                        <ul className="list-disc pl-6 space-y-2">
                                                            {
                                                                (Array.isArray(career.responsibilities) ? career.responsibilities : []).map((responsibility, index) => (
                                                                    <li key={index}>{responsibility}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h6 className="text-md font-bold mb-2">Requirements:</h6>
                                                        <ul className="list-disc pl-6 space-y-2">
                                                            {
                                                                (Array.isArray(career.requirements) ? career.requirements : []).map((requirement, index) => (
                                                                    <li key={index}>{requirement}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                )
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="aboutUs" className="bg-cyan-700 px-16 py-[7rem] h-full">
                <div className="mb-8">
                    <h2 className="text-4xl text-white font-bold mb-2">"Nurturing Potential, Cultivating Excellence."</h2>
                    <p className="text-sm text-white max-w-[80%] text-justify pl-4">
                        Talent Hatch is a platform dedicated to unlocking the full potential of individuals by providing guidance, support, and opportunities for growth. We focus on empowering individuals to develop their skills and reach new heights in their personal and professional lives. Through our innovative approach, we create an environment where talent thrives, and individuals are equipped to make a meaningful impact in their industries.
                    </p>
                </div>

                <div className="pl-4">
                    <h3 className="text-2xl text-white font-bold mb-2">Meet the Leaders Behind the Mission</h3>
                    <p className="text-sm text-white max-w-[80%] text-justify mb-4">
                        Our leadership team is composed of experienced professionals who are passionate about empowering individuals and fostering growth. With a shared vision of excellence, they guide Talent Hatch in creating impactful opportunities for all members of our community.
                    </p>
                    <p className="text-sm text-white max-w-[80%] text-justify">
                        Today, Talent Hatch has become a trailblazer in the talent development and business support sector, recognized for its unwavering commitment to innovation, quality, and integrity. Serving businesses both locally and globally, Talent Hatch is dedicated to cultivating lasting partnerships that not only help organizations grow but also transform the lives of the professionals who drive success.
                    </p>
                </div>
            </section>
            <section className="px-16 py-[6rem] h-full">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[5rem]">
                    <div className="min-h-[400px] bg-cyan-600 w-full rounded-lg drop-shadow text-white relative">
                        {/* Element #1 */}
                        <div className="w-full h-full flex justify-center items-stretch relative">
                            <img src="leaders/CEO.png" alt="image" className='object-cover w-fit h-full absolute -top-[15%] bottom-0' />
                        </div>

                        {/* Element #2 */}
                        <div className=" bg-cyan-500 py-4 absolute bottom-0 left-0 right-0">
                            <p className="text-lg font-semibold text-white text-center">Alfred Salmon</p>
                        </div>

                        <div
                            className="bg-white text-slate-700 text-xs font-bold border-2 border-cyan-400 rounded-full px-4 py-2 text-center min-w-[100px] absolute -top-[5%] -right-[10%]"
                        >
                            CEO
                        </div>
                    </div>

                    <div className="min-h-[400px] bg-cyan-600 w-full rounded-lg drop-shadow text-white relative">
                        {/* Element #1 */}
                        <div className="w-full h-full flex justify-center items-stretch relative">
                            <img src="leaders/CTO.png" alt="image" className='object-cover w-fit h-full absolute bottom-0' />
                        </div>

                        {/* Element #2 */}
                        <div className=" bg-cyan-500 py-4 absolute bottom-0 left-0 right-0">
                            <p className="text-lg font-semibold text-white text-center">Mark Tagud</p>
                        </div>

                        <div
                            className="bg-white text-slate-700 text-xs font-bold border-2 border-cyan-400 rounded-full px-4 py-2 text-center min-w-[100px] absolute -top-[5%] -right-[10%]"
                        >
                            Chief Technology Officer
                        </div>
                    </div>

                    <div className="min-h-[400px] bg-cyan-600 w-full rounded-lg drop-shadow text-white relative">
                        {/* Element #1 */}
                        <div className="w-full h-full flex justify-center items-stretch relative">
                            <img src="leaders/COO.png" alt="image" className='object-cover w-fit h-full absolute bottom-0' />
                        </div>

                        {/* Element #2 */}
                        <div className=" bg-cyan-500 py-4 absolute bottom-0 left-0 right-0">
                            <p className="text-lg font-semibold text-white text-center">Mica Salamanca</p>
                        </div>

                        <div
                            className="bg-white text-slate-700 text-xs font-bold border-2 border-cyan-400 rounded-full px-4 py-2 text-center min-w-[100px] absolute -top-[5%] -right-[10%]"
                        >
                            Chief Operating Officer
                        </div>
                    </div>

                    <div className="min-h-[400px] bg-cyan-600 w-full rounded-lg drop-shadow text-white relative">
                        {/* Element #1 */}
                        <div className="w-full h-full flex justify-center items-stretch relative">
                            <img src="leaders/CFO.png" alt="image" className='object-cover w-fit h-full pl-8 absolute bottom-0' />
                        </div>

                        {/* Element #2 */}
                        <div className=" bg-cyan-500 py-4 absolute bottom-0 left-0 right-0">
                            <p className="text-lg font-semibold text-white text-center">Alfred Salmon</p>
                        </div>

                        <div
                            className="bg-white text-slate-700 text-xs font-bold border-2 border-cyan-400 rounded-full px-4 py-2 text-center min-w-[100px] absolute -top-[5%] -right-[10%]"
                        >
                            Chief Financial Officer
                        </div>
                    </div>

                    <div className="min-h-[400px] bg-cyan-600 w-full rounded-lg drop-shadow text-white relative">
                        {/* Element #1 */}
                        <div className="w-full h-full flex justify-center items-stretch relative">
                            <img src="leaders/CPO.png" alt="image" className='object-cover w-fit h-full pl-8 absolute bottom-0' />
                        </div>

                        {/* Element #2 */}
                        <div className=" bg-cyan-500 py-4 absolute bottom-0 left-0 right-0">
                            <p className="text-lg font-semibold text-white text-center">Hance Fernandez</p>
                        </div>

                        <div
                            className="bg-white text-slate-700 text-xs font-bold border-2 border-cyan-400 rounded-full px-4 py-2 text-center min-w-[100px] absolute -top-[5%] -right-[10%]"
                        >
                            Chief Product Officer
                        </div>
                    </div>

                    <div className="min-h-[400px] bg-cyan-600 w-full rounded-lg drop-shadow text-white relative">
                        {/* Element #1 */}
                        <div className="w-full h-full flex justify-center items-stretch relative">
                            <img src="leaders/CPM.png" alt="image" className='object-cover w-fit h-full pl-8 absolute bottom-0' />
                        </div>

                        {/* Element #2 */}
                        <div className=" bg-cyan-500 py-4 absolute bottom-0 left-0 right-0">
                            <p className="text-lg font-semibold text-white text-center">John Smith</p>
                        </div>

                        <div
                            className="bg-white text-slate-700 text-xs font-bold border-2 border-cyan-400 rounded-full px-4 py-2 text-center min-w-[100px] absolute -top-[5%] -right-[10%]"
                        >
                            Chief Product Manager
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join Us Section */}
            <section id="joinUs" className="py-[3rem] h-full">
                <div className="h-[350px] w-full relative">
                    {/* Background Image */}
                    <img
                        src='joinUs.jpg'
                        alt='image'
                        className="w-full h-full object-cover object-center rounded-lg"
                    />

                    {/* Black Opacity Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-80"></div>

                    {/* Heading with increased z-index and padding for better visibility */}
                    <h2 className="text-[34px] font-bold text-white text-center absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Unlock Your Potential at Talent Hatch <br /> Where Growth Meets Opportunity
                    </h2>
                </div>
                <div className="px-16 py-16 h-full">
                    <p className="text-md text-center mb-24">
                        At <span className="font-bold text-cyan-600">Talent Hatch</span>, we believe that our company's success is driven by the hard work and achievements of each employee. That's why we prioritize the well-being and growth of our team, providing a supportive environment where everyone has the opportunity to thrive. When you join Talent Hatch, you become part of a company that cares about your personal and professional development. We ensure that our employees have everything they need to stay productive, grow, and reach their full potential.
                    </p>

                    <div className="flex flex-col justify-center items-center gap-2 mb-16">
                        <BsFillGiftFill className="text-6xl text-cyan-500" />
                        <h2 className="text-4xl font-bold border-b-2 border-cyan-500 w-fit pb-2">Perks and Benefits</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {
                            benefits.map((benefit, index) => (
                                <div className="min-h-[200px] px-4 py-6" key={`${benefit.title}-${index}`}>
                                    <div className="flex flex-col text-center">
                                        <div className="text-[80px] text-cyan-500 mb-4 mx-auto">
                                            {benefit.icon}
                                        </div>
                                        <h4 className="text-xl font-bold">{benefit.title}</h4>
                                        <p className="text-sm">{benefit.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <section id="footer" className="mx-auto bg-cyan-500/10 h-full">
                <div className="flex justify-between border-b border-slate-700 py-[3rem]  mx-[2rem]">
                    {/* Company Info */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2">
                            <img src="logo.png" alt="Talent Hatch Logo" className="object-cover w-10 h-10" />
                            <h6 className="text-lg font-bold">Talent Hatch</h6>
                        </div>

                        <div className="space-y-4">
                            <h6 className="text-md font-bold mb-2">Social Media</h6>

                            <div className="flex items-center gap-4">
                                <a href="#">
                                    <FaFacebook className="text-3xl hover:text-blue-700" />
                                </a>
                                <a href="#">
                                    <FaInstagram className="text-3xl hover:text-red-700" />
                                </a>
                                <a href="#">
                                    <FaYoutube className="text-3xl hover:text-red-700" />
                                </a>
                                <a href="#">
                                    <FaXTwitter className="text-3xl hover:text-slate-700" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="flex flex-col">
                        <h6 className="text-md font-bold mb-4">Company</h6>

                        <ul className='flex flex-col text-sm gap-4'>
                            <a href="#home">
                                <li>Home</li>
                            </a>
                            <a href="#career">
                                <li>Careers</li>
                            </a>
                            <a href="#aboutUs">
                                <li>About Us</li>
                            </a>
                            <a href="#joinUs">
                                <li>Why Join Us</li>
                            </a>
                            <Link to="/form">
                                <li>Apply Now</li>
                            </Link>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col">
                        <h6 className="text-md font-bold mb-4">Legal</h6>

                        <ul className='flex flex-col text-sm gap-4'>
                            <li>
                                <button
                                    type="button"
                                    className="hover:text-cyan-700 transition-colors duration-200"
                                    onClick={() => openLegalModal('terms')}
                                >
                                    Terms of service
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="hover:text-cyan-700 transition-colors duration-200"
                                    onClick={() => openLegalModal('privacy')}
                                >
                                    Privacy policy
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="hover:text-cyan-700 transition-colors duration-200"
                                    onClick={() => openLegalModal('license')}
                                >
                                    License
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* News Letter */}
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <h6 className="text-md font-bold">Subscribe to our newsletter</h6>
                            <p className="text-sm">The latest news, articles, and resources, sent to your inbox weekly.</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Input placeholder='Enter your email' className="bg-white border-cyan-600 focus:border-slate-700 focus:border-1" />
                            <Button className='active:scale-95 transform transition-all duration-300 rounded-lg'>Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center py-8 mx-[2rem]">
                    <p className="text-sm">© 2026 Talent Hatch, Inc. All rights reserved.</p>
                </div>
            </section>

            {/* AI CHATBOT */}
            {
                openChatBot ? (
                    <div className="w-[350px] bg-slate-300 rounded-lg drop-shadow fixed bottom-4 right-4 z-10">
                        {/* Header */}
                        <div className="flex justify-between items-center bg-cyan-700 px-1 py-2">
                            <div className="flex items-center">
                                <img src="logo.png" alt="Talent Hatch Logo" className="object-contain w-fit h-8" />
                                <h6 className="text-sm text-white font-bold">Talent Hatch AI Assistant</h6>
                            </div>

                            <BsArrowRightCircleFill
                                className='text-white hover:text-slate-200 text-3xl pr-2 cursor-pointer'
                                onClick={clearChatHistory}
                            />
                        </div>
                        {/* Body */}
                        <div className="h-[350px] space-y-4 p-4 overflow-y-auto">
                            {messages.map((message, index) => (
                                message.sender === 'ai' ? (
                                    <div className="flex justify-start" key={index}>
                                        <div className="w-fit flex items-end gap-1">
                                            <img src="logo.png" alt="Talent Hatch Logo" className="object-cover w-10 h-10" />

                                            <div className="bg-gray-50 h-full drop-shadow-lg rounded-lg px-4 py-2 max-w-[260px]">
                                                <strong className="text-xs text-gray-700">Talent Hatch AI</strong>
                                                {message.answer && (
                                                    <p className="text-xs text-gray-700 mt-1">
                                                        <span dangerouslySetInnerHTML={{ __html: message.answer }} />
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end" key={index}>
                                        <div className="w-fit flex justify-end items-end gap-1">
                                            <div className="bg-cyan-100 text-black h-full drop-shadow-lg rounded-lg px-4 py-2 max-w-[260px]">
                                                <strong className="text-xs">You</strong>
                                                {message.question && (
                                                    <p className="text-xs mt-1">{message.question}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                        {/* Footer */}
                        <div className='flex items-center gap-2 bg-slate-100 px-4 py-3'>
                            <Input
                                className='border border-slate-700  focus:border-cyan-500 focus:ring-0 focus-visible:ring-0'
                                placeholder="Type your message here..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                            />
                            <Button onClick={sendMessageToWebhook} disabled={loading}>
                                <AiOutlineSend /> Send
                            </Button>
                        </div>
                    </div>
                ) : (
                    <BsRobot
                        className='text-6xl text-white bg-cyan-500 rounded-full shadow-lg p-4 fixed bottom-4 right-4 z-20 cursor-pointer animate-bounce'
                        onClick={toggleChatBot}
                    />
                )
            }

            {/* TERMS OF SERVICE MODAL */}
            {
                activeLegalModal === 'terms' && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-cyan-700">Terms of Service</h3>
                                <Button onClick={closeLegalModal} className="bg-cyan-600 hover:bg-cyan-700">Close</Button>
                            </div>
                            <div className="text-sm text-slate-700 space-y-3 max-h-[60vh] overflow-y-auto text-justify pr-2">
                                <p>By using Talent Hatch, you agree to use our platform for lawful purposes only and to provide accurate information when applying for opportunities.</p>
                                <p>We may update features, job listings, or platform content at any time. Continued use of this site means you accept the latest terms and policies.</p>
                                <p>Talent Hatch reserves the right to suspend access if there is misuse, fraud, or any activity that may harm our users, partners, or platform operations.</p>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* PRIVACY POLICY MODAL */}
            {
                activeLegalModal === 'privacy' && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-cyan-700">Privacy Policy</h3>
                                <Button onClick={closeLegalModal} className="bg-cyan-600 hover:bg-cyan-700">Close</Button>
                            </div>
                            <div className="text-sm text-slate-700 space-y-3 max-h-[60vh] overflow-y-auto text-justify pr-2">
                                <p>We collect personal details you submit, such as name, email, and career information, to process applications and improve your experience on Talent Hatch.</p>
                                <p>Your data is stored securely and only shared with authorized teams or trusted services required for recruitment, communications, and technical operations.</p>
                                <p>You may request access, correction, or deletion of your personal data by contacting our support team through official Talent Hatch channels.</p>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* LICENSE MODAL */}
            {
                activeLegalModal === 'license' && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-cyan-700">License</h3>
                                <Button onClick={closeLegalModal} className="bg-cyan-600 hover:bg-cyan-700">Close</Button>
                            </div>
                            <div className="text-sm text-slate-700 space-y-3 max-h-[60vh] overflow-y-auto text-justify pr-2">
                                <p>All website content, branding, visuals, and original materials on Talent Hatch are protected and are intended for personal and non-commercial use.</p>
                                <p>You may not copy, redistribute, modify, or republish any Talent Hatch content without prior written permission from the Talent Hatch team.</p>
                                <p>Third-party logos, icons, or libraries remain the property of their respective owners and are subject to their own licensing terms.</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}