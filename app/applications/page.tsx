"use client";
import React, { act, useEffect, useState } from "react";
import Image from "next/image";
import style from "../dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import Swal from "sweetalert2";
import axios from "axios";

const Applications = () => {
    const [active, setActive] = React.useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [applicationData, setApplicationData] = useState<any>([]);
    const { isLoading, authToken, userdata, applications } = myAppHook();
    const router = useRouter();
    const toggleSidebar = () => {
        setActive(!active);
    }

    useEffect(() => {
        if (!authToken) {
            router.push('/auth');
            return;
        } else {
            const getApplications = async () => {
                const response = await applications();
                console.log(response);
                setApplicationData(response);
                setIsDeleted(false);
            }

            getApplications();
        }
    }, [authToken, isLoading, isDeleted]);

    const deleteJob = async (jobId: string) => {
        Swal.fire({
            title: 'Are you sure you want to delete this application?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios(`${process.env.NEXT_PUBLIC_API_URL}/deleteapplication/${jobId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                }).then(response => {
                    if (response.data.success) {
                        setIsDeleted(true);
                        Swal.fire(
                            'Deleted!',
                            response.data.message,
                            'success'
                        )
                    } else {
                        Swal.fire(
                            'Error',
                            'Failed to delete application.',
                            'error'
                        )
                    }
                }).catch(error => {
                    console.error('Error deleting application', error);
                    Swal.fire(
                        'Error',
                        'Failed to delete application.',
                        'error'
                    )
                });
            };
        });
    }

    return <>
        <Sidebar active={active} page={"applications"} />
        <div className={style.dashbody + " " + style["main-content"]}>
            <nav className="navbar navbar-expand-lg mb-4">
                <div className="container-fluid">
                    <button className="btn d-lg-none" id="sidebarToggle" onClick={toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="d-flex align-items-center ms-auto">
                        <div className="dropdown1">
                            <Link href="#" className="d-flex align-items-center text-decoration-none">
                                <Image src="https://dummyimage.com/40x40?text=Logo" alt="User" width={40} height={40} className="user-avatar me-2" />
                                <span className="d-none d-sm-inline">{userdata?.name}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container-fluid">
                <div className="py-8">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        <div className="d-flex flex-wrap justify-content-between mb-4">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Job Applications
                            </h2>
                        </div>
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <div className="width-full">
                                {
                                    !applicationData?.data ? (
                                        <p className="text-center">No jobs found.</p>
                                    ) : (
                                        <table className="table" id="jobTable" style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    <th>Job Title</th>
                                                    <th>Applicant Name</th>
                                                    <th>Applicant Email</th>
                                                    <th>Applicant Phone</th>
                                                    <th>Applicant Cover Letter</th>
                                                    <th>Applicant Resume</th>
                                                    <th>Application Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {applicationData?.data?.map((item: any) => (
                                                    <tr key={item.id}>
                                                        <td><Link href={`/jobapply/${item.job_id}`}>{item.job.job_title}</Link></td>
                                                        <td>{item.applicant_name}</td>
                                                        <td>{item.applicant_email}</td>
                                                        <td>{item.applicant_phone}</td>
                                                        <td>{item.applicant_cover_letter}</td>
                                                        <td>
                                                            <a href={process.env.NEXT_PUBLIC_API_URL + '/resumes/' + item.applicant_resume} target="_blank" 
                                                            rel="noopener noreferrer" className="ms-2 text-decoration-none">
                                                                <i className="fa fa-download"></i> {item.applicant_resume}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            {
                                                                (item.created_at) ?
                                                                    formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : ''
                                                            }
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-danger ms-2" onClick={() => deleteJob(item.id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </>
};

export default Applications;