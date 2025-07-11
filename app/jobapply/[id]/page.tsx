"use client";
import { useEffect, useState } from "react";
import { myAppHook } from "@/context/AppProvider";
import style from "../jobapply.module.css";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";

interface JobApplyProps {
    jobid: any,
    name: string,
    email: string,
    phone: string,
    cover_letter: string,
    resume: File | null
}
const JobApply = () => {
    const params = useParams();
    const jobid = params.id;
    const { authToken, singleJob, setLoading, userdata } = myAppHook();
    const [jobData, setJobData] = useState<any>([]);
    const [jobApplyData, setJobApplyData] = useState<JobApplyProps>({
        jobid: jobid,
        name: "",
        email: "",
        phone: "",
        cover_letter: "",
        resume: null
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleInputChange = (e: any) => {
        setJobApplyData({ ...jobApplyData, [e.target.id]: e.target.value });
    }

    const handleResumeChange = (e: any) => {
        setJobApplyData({ ...jobApplyData, resume: e.target.files[0] });
    }

    const handleJobApply = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (jobApplyData.resume == null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please upload your resume',
            });
            return;
        }
        console.log(jobApplyData);
        try {
            setIsLoading(true);
            const formData = new FormData();
            Object.keys(jobApplyData).map((key) => {
                formData.append(key, jobApplyData[key]);
            });

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/apply-job`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authToken}`
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setJobApplyData({
                    jobid: jobid,
                    name: "",
                    email: "",
                    phone: "",
                    cover_letter: "",
                    resume: null
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error('Server errror');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const getJobs = async (jobid: any) => {
            const job_data: any = await singleJob(jobid);
            setJobData(job_data.data);
            console.log(job_data.data);
        }

        getJobs(jobid);
    }, [jobid]);

    const checkLogin = () => {
        if (userdata?.role != 'user') {
            toast.error('Please login first to apply for job');
            router.push('/auth');
        }
    }

    if (!jobData) {
        return <div>Loading...</div>;
    }

    return (<div className="container my-5">
        <div className="row">
            <div className="col-lg-12">
                <div className={style['job-header']}>
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h1 className={style['job-title']}>{jobData.job_title}</h1>
                            <p className={style['company-name']}>{(jobData.user) ? jobData.user.name : "NA"}</p>
                        </div>
                        <div>
                            <span className={style['job-type']}>Full-time</span>
                        </div>
                    </div>

                    <div className={style['job-meta']}>
                        <span><i className="fas fa-map-marker-alt"></i> {jobData.job_location}</span>
                        <span><i className="fas fa-dollar-sign"></i>{jobData.job_salary}</span>
                        <span><i className="fas fa-clock"></i> Posted {
                            (jobData.created_at) ?
                                formatDistanceToNow(new Date(jobData.created_at), { addSuffix: true }) : ''
                        }</span>
                    </div>

                    <div className="d-flex">
                        {
                            (userdata?.role === 'user') ?
                                <button className={'btn me-2 ' + style['btn-apply']} style={{ width: "200px" }}
                                    onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth', }) }}>Apply
                                    Now</button> :
                                (userdata?.role === 'company') ? '' :
                                    <button className={'btn me-2 ' + style['btn-apply']} style={{ width: "200px" }}
                                        onClick={() => { checkLogin() }}>Apply
                                        Now</button>
                        }
                    </div>
                </div>

                <div className={style['job-content-card']}>
                    <h3 className={style['section-title']}>Job Description</h3>
                    <div className="job-description">{jobData.job_description}</div>
                </div>

                <div className={style['job-content-card']}>
                    <h3 className={style['section-title']}>Benefits</h3>
                    <div className="row">
                        <div className="col-md-6">
                            <div className={style['benefit-item']}>
                                <div className={style['benefit-icon']}>
                                    <i className="fas fa-medal"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0">Competitive Salary</h6>
                                    <p className="text-muted mb-0">We offer salaries that match the top of the market</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={style['benefit-item']}>
                                <div className={style['benefit-icon']}>
                                    <i className="fas fa-heart"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0">Health Insurance</h6>
                                    <p className="text-muted mb-0">Comprehensive medical, dental, and vision plans</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={style['benefit-item']}>
                                <div className={style['benefit-icon']}>
                                    <i className="fas fa-coffee"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0">Flexible Work</h6>
                                    <p className="text-muted mb-0">Remote work options and flexible hours</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={style['benefit-item']}>
                                <div className={style['benefit-icon']}>
                                    <i className="fas fa-graduation-cap"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0">Learning Budget</h6>
                                    <p className="text-muted mb-0">Annual stipend for conferences and courses</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    (userdata?.role === 'user') &&
                    <div className={'row ' + style['job-content-card']}>
                        <h3 className={style['section-title']}>Please fill out the form below</h3>
                        <form onSubmit={handleJobApply} encType="multipart/form-data">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="name">Name*</label>
                                <input type="text" className="form-control" id="name" name="name" value={jobApplyData.name}
                                    onChange={handleInputChange} placeholder="Enter your name" required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="email">Email*</label>
                                <input type="email" className="form-control" id="email" name="email" value={jobApplyData.email}
                                    onChange={handleInputChange} placeholder="Enter your email" required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="phone">Phone*</label>
                                <input type="tel" className="form-control" id="phone" name="phone" value={jobApplyData.phone}
                                    onChange={handleInputChange} placeholder="Enter your phone number" required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="cover_letter">Cover Letter</label>
                                <textarea className="form-control" id="cover_letter" name="cover_letter"
                                    onChange={handleInputChange} placeholder="Write your cover letter" defaultValue={jobApplyData.cover_letter}></textarea>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="resume">Resume*</label>
                                <input type="file" className="form-control" id="resume" name="resume"
                                    onChange={handleResumeChange} accept=".pdf,.doc,.docx" required />
                            </div>
                            <div className="col-6 mb-3">
                                {
                                    (!isLoading) ? 
                                    <button type="submit" className={'btn ' + style['btn-apply']} style={{ width: "200px" }}>Apply Now</button>
                                    :
                                    <button type="button" className={'btn disabled ' + style['btn-apply']} style={{ width: "200px" }} disabled>Applying...</button>
                                }
                            </div>
                        </form>
                    </div>
                }

            </div>
        </div>
    </div>
    )
}

export default JobApply;