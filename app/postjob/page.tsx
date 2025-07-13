"use client";
import React, { act, useEffect, useState } from "react";
import Image from "next/image";
import style from "../dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const PostJob = () => {
    const [active, setActive] = useState(false);
    const [postjobData, SetPostjobData] = useState<any>([]);
    const [isDeleted, setIsDeleted] = useState(false);
    const { isLoading, authToken, userdata, postjobs } = myAppHook();
    const router = useRouter();
    const toggleSidebar = () => {
        setActive(!active);
    }

    useEffect(() => {
        if (!authToken) {
            router.push('/auth');
            return;
        } else {
            const getPostJobs = async () => {
                const postjob_data = await postjobs();
                SetPostjobData(postjob_data);
                setIsDeleted(false);
            }

            getPostJobs();
        }
    }, [authToken, isLoading, isDeleted]);

    const deleteJob = async (jobId: string) => {
        Swal.fire({
            title: 'Are you sure you want to delete this Job?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios(`${process.env.NEXT_PUBLIC_API_URL}/postjobs/${jobId}`, {
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
                            'Failed to delete job.',
                            'error'
                        )
                    }
                }).catch(error => {
                    console.error('Error deleting job', error);
                    Swal.fire(
                        'Error',
                        'Failed to delete job.',
                        'error'
                    )
                });
            };
        });
    }

    return <>
        <Sidebar active={active} page={"postjob"} />
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
                                My Jobs
                            </h2>
                            <Link href="/postjob/create"
                                className="btn btn-primary font-bold py-2 px-4 rounded-md hover:bg-sky-700">Post New Job</Link>
                        </div>
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <div className="width-full">
                                {
                                    !postjobData?.data ? (
                                        <p className="text-center">No jobs found.</p>
                                    ) : (
                                        <table className="table" id="jobTable" style={{ width: "100%" }}>
                                            <thead>
                                                <tr>
                                                    <th>Job Title</th>
                                                    <th>Job Category</th>
                                                    <th>Total Applicants</th>
                                                    <th>Job Status</th>
                                                    <th>Job Created</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {postjobData?.data.map((postjob: any) => (
                                                    <tr key={postjob.job_id}>
                                                        <td><Link href={`/jobapply/${postjob.job_id}`}>{postjob.job_title}</Link></td>
                                                        <td>{postjob.category.category_name}</td>
                                                        <td>{postjob.applications_count}</td>
                                                        <td>{postjob.job_status}</td>
                                                        <td>{formatDistanceToNow(new Date(postjob.created_at))}</td>
                                                        <td>
                                                            <Link href={`/postjob/${postjob.job_id}`}>Edit</Link>
                                                            <button className="btn btn-danger ms-2" onClick={() => deleteJob(postjob.job_id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default PostJob;