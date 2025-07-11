"use client";
import React, { act, useEffect } from "react";
import Image from "next/image";
import style from "../dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PostJob = () => {
    const [active, setActive] = React.useState(false);
    const { isLoading, authToken } = myAppHook();
    const router = useRouter();
    const toggleSidebar = () => {
        setActive(!active);
    }

    useEffect(() => {
        if (!authToken) {
            // router.push('/auth');
            // return;
        }
    }, [authToken, isLoading]);

    const deleteJob = (jobId: string) => {
        alert(jobId);
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
                                <span className="d-none d-sm-inline">User Name</span>
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

                                <p className="text-center">No jobs found.</p>

                                <table className="table" id="jobTable" style={{ width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Job Description</th>
                                            <th>Total Applicants</th>
                                            <th>Job Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        <tr>
                                            <td><Link href="">Title</Link></td>
                                            <td>Desc</td>
                                            <td>12</td>
                                            <td>Active</td>
                                            <td>
                                                <Link href={`/postjob/${'12'}`}>Edit</Link>
                                                <button className="btn btn-danger ms-2" onClick={() => deleteJob('12')}>Delete</button>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default PostJob;