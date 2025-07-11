"use client";
import React, { act, useEffect, useState } from "react";
import Image from "next/image";
import style from "../dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const MyApplications = () => {
    const [active, setActive] = React.useState(false);
    const [isDelated, setIsDeleted] = useState(false);
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
    }, [authToken, isLoading, isDelated]);

    return <>
        <Sidebar active={active} page={"myapplications"} />
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
                                                    <th>Apoication ID</th>
                                                    <th>Job Title</th>
                                                    <th>Company Name</th>
                                                    <th>Applicant Resume</th>
                                                    <th>Application Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {applicationData?.data?.map((item: any) => (
                                                    <tr key={item.id}>
                                                        <td>{item.job_id + item.id + item.user_id}</td>
                                                        <td><Link href={`/jobapply/${item.job_id}`}>{item.job.job_title}</Link></td>
                                                        <td>{item.job?.user.name}</td>
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

export default MyApplications;