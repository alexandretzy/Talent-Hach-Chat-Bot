import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import supabase from '@/supabase-client'
import { List } from 'lucide-react'

export default function Form() {
    const [data, setData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        job: '',
        uploaded_resume: null
    });

    const [triggerModal, setTriggerModal] = useState(false);

    async function submitForm(e) {
        e.preventDefault();
        // console.log(data);

        if (data.uploaded_resume) {
            try {
                const response = await axios.post(
                    'https://alexandretzy.app.n8n.cloud/webhook/talent_hatch',
                    data,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                // Check the response status from n8n
                if (response.status === 200) {
                    // Display the response from the webhook
                    console.log('Response from n8n:', response.data);
                    setTriggerModal(true);
                } else {
                    alert('Error submitting form.');
                    setTriggerModal(false);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    }

    // Fetch All Job List from Supabase
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        jobList();
    }, []);

    const jobList = async () => {
        const { data, error } = await supabase.from('career_tbl').select('name');

        if (error) {
            console.error('Error fetching job list in supabase:', error);
        } else {
            setJobs(data);
        }
    }

    return (
        <>
            <div className="bg-gradient-to-t from-cyan-500 to-blue-300 flex flex-col justify-center gap-y-2 h-[200px] w-full px-16">
                <h2 className="text-4xl font-bold text-white drop-shadow-2xl">Job Application Form</h2>

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            {/* <BreadcrumbLink href="/">Home</BreadcrumbLink> */}
                            <Link
                                to="/"
                                className="text-white hover:text-slate-700"
                            >
                                Back to Home
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-white" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-gray-100">Bookkeeper</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="bg-white h-full w-full px-16 py-8">
                <div className="border border-cyan-500 bg-cyan-50 rounded-lg shadow-md p-4 mb-8">
                    <p className="text-sm text-cyan-800 text-justify">
                        This application form is for the Bookkeeper position. Please provide all the necessary details to help us assess your qualifications and determine if you're a good fit for the role. Rest assured, all your information will be kept confidential and will not be shared or used for any unauthorized purposes.
                    </p>
                </div>

                <form onSubmit={submitForm}>
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <Label htmlFor="firstname" className="text-sm font-medium text-gray-700"> Firstname</Label>
                            <Input
                                type='text'
                                placeholder='e.g Ben'
                                className='h-[50px] text-md font-semibold border focus:border-cyan-600 focus:border-2 focus-visible:ring-0'
                                required
                                id='firstname'
                                value={data.firstname}
                                onChange={(e) => setData({ ...data, firstname: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="lastname" className="text-sm font-medium text-gray-700"> Lastname</Label>
                            <Input
                                type='text'
                                placeholder='e.g Tagud'
                                className='h-[50px] text-md font-semibold border focus:border-cyan-600 focus:border-2 focus-visible:ring-0'
                                required
                                id='lastname'
                                value={data.lastname}
                                onChange={(e) => setData({ ...data, lastname: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700"> Email</Label>
                            <Input
                                type='email'
                                placeholder='e.g ben@example.com'
                                className='h-[50px] text-md font-semibold border focus:border-cyan-600 focus:border-2 focus-visible:ring-0'
                                required
                                id='email'
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="job" className="text-sm font-medium text-gray-700"> Job</Label>
                            <Select
                                value={data.job}
                                onValueChange={(value) => setData({ ...data, job: value })}
                            >
                                <SelectTrigger className="w-full h-[50px] text-md font-semibold">
                                    <SelectValue placeholder="Job" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            jobs.map((job, index) => (
                                                <SelectItem key={index} value={job.name}>
                                                    {job.name}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='w-[49%] mb-8'>
                        <label htmlFor="resume" className="text-sm font-medium text-gray-700">Upload your Resume</label>
                        <Input
                            type="file"
                            id="resume"
                            accept=".pdf"
                            className='pt-2'
                            onChange={(e) => setData({ ...data, uploaded_resume: e.target.files?.[0] || null })}
                        />
                    </div>

                    <Button className='bg-cyan-500 hover:bg-cyan-700 text-white'>Submit Application</Button>
                </form>
            </div >

            <AlertDialog open={triggerModal} onOpenChange={setTriggerModal}>
                <AlertDialogContent>
                    <AlertDialogHeader className='items-center text-center'>
                        <AlertDialogTitle className="flex flex-col items-center gap-4 text-center">
                            <img src="formSubmit.gif" alt="image" className='w-[100px] h-[100px] mx-auto' />
                            <span className="text-lg">Application Submitted Successfully!</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-center'>
                            <p className="text-sm text-center">
                                Thank you for submitting your application. We have received your details and will review them shortly. If your profile matches our requirements, we will reach out to you for the next steps. Please wait and stay tuned for updates to your email within 1-3 days after your form submission. Rest assured, your information is safe with us and will only be used for this recruitment process.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='sm:justify-center'>
                        <AlertDialogCancel className='w-full sm:w-auto'>Got it</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
