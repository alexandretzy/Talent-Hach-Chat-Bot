import React, { useState, useEffect } from 'react'
import { BsFillBriefcaseFill, BsArrowLeftSquare } from "react-icons/bs";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PiCubeFill } from "react-icons/pi";

export default function Dashboard() {
    const location = useLocation();

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formattedDateTime = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }) + ' - ' + now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const links = [
        {
            name: "Dashboard",
            icon: <PiCubeFill className="text-lg" />,
            url: "/admin/dashboard"
        },
        {
            name: "Jobs",
            icon: <BsFillBriefcaseFill className="text-lg" />,
            url: "/admin/jobs"
        },
        {
            name: "Add Job",
            icon: <BsFillBriefcaseFill className="text-lg" />,
            url: "/admin/add-job"
        }
    ]

    return (
        <>
            <div className="flex overflow-hidden bg-white h-screen">
                {/* Sidebar Content */}
                <div className="flex flex-col justify-between bg-white drop-shadow min-w-[225px] h-screen">
                    {/* Sidebar Header */}
                    <div>
                        <div className="flex items-center p-2 mb-2">
                            <img src="/logo.png" alt="Logo" className='object-cover w-fit h-8' />
                            <h5 className="text-md font-bold text-cyan-600">Talent Hatch</h5>
                        </div>
                        {/* Sidebar Links */}
                        <div className="px-2">
                            <p className="text-[10px] font-bold pl-2 mb-2">PLATFORM</p>
                            <ul className='flex flex-col space-y-1'>
                                {
                                    links.map((link, index) => {
                                        const isActive = location.pathname === link.url;
                                        return (
                                            <Link to={link.url} key={index}>
                                                <li
                                                    className={`flex items-center gap-2 text-sm px-3 py-2 cursor-pointer rounded hover:bg-cyan-700 hover:text-white ${isActive ? 'bg-cyan-700 text-white' : ''
                                                        }`}
                                                >
                                                    {link.icon}
                                                    <span>{link.name}</span>
                                                </li>
                                            </Link>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    {/* Sidebar Footer */}
                    <Link to='/admin' className='px-2 mb-2'>
                        <li
                            className='flex items-center gap-2 text-sm px-3 py-2 cursor-pointer rounded hover:bg-cyan-700 hover:text-white'
                        >
                            <BsArrowLeftSquare className="text-lg" />
                            <span>Logout</span>
                        </li>
                    </Link>

                </div>

                {/* Body Content */}
                <section className="flex-1">
                    {/* Navbar Content */}
                    <nav className="w-full h-[49px] flex justify-between items-center bg-white border-b-2 px-4 py-2">
                        <h1 className="text-md font-bold">
                            {links.find((l) => l.url === location.pathname)?.name ?? 'Dashboard'}
                        </h1>

                        <h2 className="text-sm font-bold">{formattedDateTime}</h2>
                    </nav>

                    {/* Dynamic Content */}
                    <Outlet />
                </section>

            </div>
        </>
    )
}
