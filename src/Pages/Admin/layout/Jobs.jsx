import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { BsBuildings } from "react-icons/bs";
import { Button } from '@/components/ui/button';
import { GoPeople } from "react-icons/go";
import { Label } from '@/components/ui/label';
import { FiFilter } from "react-icons/fi";
import supabase from '@/supabase-client';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Jobs() {
    const [filterOpen, setFilterOpen] = useState(true);
    const [selectedJobType, setSelectedJobType] = useState('All');

    const toggleFilter = () => {
        setFilterOpen((filter) => !filter);
        console.log(filterOpen);
    }

    // --------------------------------------------------------------------------------------------

    // Fetch all jobs
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        listJobs();
    }, []);

    const listJobs = async () => {
        const { data, error } = await supabase
            .from('career_tbl')
            .select('*');

        if (error) {
            console.error('Error fetching jobs:', error);
        } else {
            // console.log('Jobs:', data);
            setJobs(data);
        }
    }

    // --------------------------------------------------------------------------------------------

    // Remove Specific Job

    const [successOpen, setSuccessOpen] = useState(false);
    const [removedJobName, setRemovedJobName] = useState('');
    const removeJob = async (id, name) => {
        const { error } = await supabase
            .from('career_tbl')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting this jobs in supabase:', error);
        } else {
            setJobs((listJobs) => listJobs.filter((job) => job.id !== id)); // Remove automatically from the list without refetching
            setRemovedJobName(name);
            setSuccessOpen(true);
        }
    }

    // --------------------------------------------------------------------------------------------

    // View Details of a Specific Job

    const [jobDetails, setJobDetails] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const viewJob = async (id) => {
        const { data, error } = await supabase
            .from('career_tbl')
            .select('*')
            .eq('id', id)
            .single();

        // console.log('Job Details:', data);

        if (error) {
            console.error('Error fetching job details in supabase:', error);
        } else {
            setJobDetails(data);
            setDetailsOpen(true);
        }
    }

    // --------------------------------------------------------------------------------------------

    const normalizeJobType = (value = '') => value.toLowerCase().replace(/[-\s]/g, '');

    const filteredJobs = selectedJobType === 'All'
        ? jobs
        : jobs.filter((job) => normalizeJobType(job.job_type) === normalizeJobType(selectedJobType));

    const responsibilitiesList = Array.isArray(jobDetails?.responsibilities)
        ? jobDetails.responsibilities
        : Array.isArray(jobDetails?.responsibilities?.responsibilities)
            ? jobDetails.responsibilities.responsibilities
            : [];

    const requirementsList = Array.isArray(jobDetails?.requirements)
        ? jobDetails.requirements
        : Array.isArray(jobDetails?.requirements?.requirements)
            ? jobDetails.requirements.requirements
            : [];

    return (
        <>
            <div className="h-full flex">
                {
                    filterOpen && (
                        <section className="w-[18%] h-screen bg-white border-r p-4">
                            <h6 className="text-md font-semibold mb-4">Filters</h6>

                            <div className="mb-4">
                                <h6 className="text-xs font-semibold mb-3">Job Type</h6>
                                <RadioGroup
                                    value={selectedJobType}
                                    onValueChange={setSelectedJobType}
                                    className="space-y-1"
                                >
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem
                                            value="All"
                                            id="option-one"
                                            className="border-slate-400 text-slate-400 data-[state=checked]:border-cyan-600 data-[state=checked]:text-cyan-600"
                                        />
                                        <Label htmlFor="option-one">All</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem
                                            value="Voice"
                                            id="option-two"
                                            className="border-slate-400 text-slate-400 data-[state=checked]:border-cyan-600 data-[state=checked]:text-cyan-600"
                                        />
                                        <Label htmlFor="option-two">Voice</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem
                                            value="Mixed"
                                            id="option-three"
                                            className="border-slate-400 text-slate-400 data-[state=checked]:border-cyan-600 data-[state=checked]:text-cyan-600"
                                        />
                                        <Label htmlFor="option-three">Mixed</Label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem
                                            value="Non-Voice"
                                            id="option-four"
                                            className="border-slate-400 text-slate-400 data-[state=checked]:border-cyan-600 data-[state=checked]:text-cyan-600"
                                        />
                                        <Label htmlFor="option-four">Non-Voice</Label>
                                    </div>
                                </RadioGroup>
                            </div>


                        </section>
                    )
                }

                <section className="flex-1 p-4 overflow-y-auto h-[95%] pr-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className='hover:bg-gray-200 hover:text-cyan-600 p-2 rounded-lg cursor-pointer'
                            onClick={toggleFilter}
                        >
                            <FiFilter />
                        </div>

                        <h1 className="text-xl text-cyan-600">{filteredJobs.length} Jobs</h1>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                        {
                            filteredJobs.map((job) => (
                                <Card className='shadow-none bg-cyan-100 h-full' key={job.id}>
                                    <CardContent className='flex h-full flex-col justify-between p-4'>
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <img src="/admin_img/briefcase.png" alt="Image" className="object-cover w-8 h-8" />
                                                <h5 className="text-lg font-bold">{job.name}</h5>
                                            </div>

                                            <div className="flex items-center gap-2 mb-8">
                                                <Badge className='border border-cyan-500 bg-transparent text-cyan-600 rounded-full hover:bg-transparent'>
                                                    {job.job_type || 'N/A'}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2">
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <FaRegMoneyBillAlt className='text-[20px] inline-block' /> $500 / monthly
                                                </div>
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <BsBuildings className='text-[20px] inline-block' /> Onsite
                                                </div>
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <GoPeople className='text-[20px] inline-block' /> 5 Applicants
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                className='w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white'
                                                onClick={() => viewJob(job.id)}
                                            >View Details</Button>
                                            <Button
                                                className='w-full mt-6 bg-slate-600 hover:bg-slate-700 text-white'
                                                onClick={() => removeJob(job.id, job.name)}
                                            >Remove</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </section>
            </div>

            <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Job removed successfully</AlertDialogTitle>
                        <AlertDialogDescription>
                            {removedJobName
                                ? `${removedJobName} has been removed from the job list.`
                                : 'The selected job has been removed from the job list.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className='bg-cyan-600 hover:bg-cyan-700'>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{jobDetails?.name}</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4 mt-4 text-left">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Job Type</h4>
                                    <p className="text-sm">{jobDetails?.job_type || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">Description</h4>
                                    <p className="text-sm whitespace-pre-wrap">{jobDetails?.description || 'No description provided.'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2">Responsibilities</h4>
                                    <ul className="text-sm list-disc list-inside space-y-1">
                                        {responsibilitiesList.length > 0
                                            ? responsibilitiesList.map((resp, idx) => (
                                                <li key={idx}>{resp}</li>
                                            ))
                                            : <li>No responsibilities listed.</li>
                                        }
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2">Requirements</h4>
                                    <ul className="text-sm list-disc list-inside space-y-1">
                                        {requirementsList.length > 0
                                            ? requirementsList.map((req, idx) => (
                                                <li key={idx}>{req}</li>
                                            ))
                                            : <li>No requirements listed.</li>
                                        }
                                    </ul>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction autoFocus={false} className='bg-cyan-600 hover:bg-cyan-700'>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
