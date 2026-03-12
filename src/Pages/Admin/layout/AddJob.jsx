import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import supabase from '@/supabase-client'

export default function AddJob() {
    const [name, setName] = useState('')
    const [jobType, setJobType] = useState('')
    const [description, setDescription] = useState('')
    const [responsibilities, setResponsibilities] = useState([''])
    const [requirements, setRequirements] = useState([''])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [successOpen, setSuccessOpen] = useState(false)

    const handleDynamicFieldChange = (setter, index, value) => {
        setter((prev) => {
            const next = [...prev]
            next[index] = value
            return next
        })
    }

    const addDynamicField = (setter) => {
        setter((prev) => [...prev, ''])
    }

    const removeDynamicField = (setter, index) => {
        setter((prev) => {
            if (prev.length === 1) return prev
            return prev.filter((_, itemIndex) => itemIndex !== index)
        })
    }

    const resetForm = () => {
        setName('')
        setJobType('')
        setDescription('')
        setResponsibilities([''])
        setRequirements([''])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatusMessage('')

        const normalizedResponsibilities = responsibilities
            .map((item) => item.trim())
            .filter(Boolean)
        const normalizedRequirements = requirements
            .map((item) => item.trim())
            .filter(Boolean)

        if (!name.trim() || !jobType || !description.trim()) {
            setStatusMessage('Please complete name, job type, and description.')
            return
        }

        if (normalizedResponsibilities.length === 0 || normalizedRequirements.length === 0) {
            setStatusMessage('Please add at least one responsibility and one requirement.')
            return
        }

        setIsSubmitting(true)

        const { error } = await supabase.from('career_tbl').insert([
            {
                name: name.trim(),
                job_type: jobType,
                description: description.trim(),
                responsibilities: normalizedResponsibilities,
                requirements: normalizedRequirements,
            },
        ])

        if (error) {
            setStatusMessage(`Failed to save job: ${error.message}`)
            setIsSubmitting(false)
            return
        }

        setStatusMessage('')
        resetForm()
        setSuccessOpen(true)
        setIsSubmitting(false)
    }

    return (
        <>
            <div className="h-[calc(100vh-49px)] px-6 pt-8 pb-8 overflow-y-auto">
                <Card className="max-w-4xl">
                    <CardHeader>
                        <CardTitle>Add New Job</CardTitle>
                        <CardDescription>
                            Fill in the fields below to create a job posting.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="job-name">Name</Label>
                                    <Input
                                        id="job-name"
                                        placeholder="Enter job title"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Job Type</Label>
                                    <Select value={jobType} onValueChange={setJobType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Voice">Voice</SelectItem>
                                            <SelectItem value="Mixed">Mixed</SelectItem>
                                            <SelectItem value="Non-Voice">Non-Voice</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job-description">Description</Label>
                                <textarea
                                    id="job-description"
                                    rows={5}
                                    placeholder="Enter job description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Responsibilities</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addDynamicField(setResponsibilities)}
                                    >
                                        Add Item
                                    </Button>
                                </div>

                                {responsibilities.map((item, index) => (
                                    <div key={`responsibility-${index}`} className="flex items-center gap-2">
                                        <Input
                                            placeholder={`Responsibility ${index + 1}`}
                                            value={item}
                                            onChange={(e) => handleDynamicFieldChange(setResponsibilities, index, e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => removeDynamicField(setResponsibilities, index)}
                                            disabled={responsibilities.length === 1}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Requirements</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addDynamicField(setRequirements)}
                                    >
                                        Add Item
                                    </Button>
                                </div>

                                {requirements.map((item, index) => (
                                    <div key={`requirement-${index}`} className="flex items-center gap-2">
                                        <Input
                                            placeholder={`Requirement ${index + 1}`}
                                            value={item}
                                            onChange={(e) => handleDynamicFieldChange(setRequirements, index, e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => removeDynamicField(setRequirements, index)}
                                            disabled={requirements.length === 1}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {statusMessage && (
                                <p className="text-sm text-cyan-700">{statusMessage}</p>
                            )}

                            <Button
                                type="submit"
                                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Job'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={successOpen} onOpenChange={setSuccessOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Success</AlertDialogTitle>
                        <AlertDialogDescription>
                            New job added successfully.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-cyan-600 hover:bg-cyan-700">OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
