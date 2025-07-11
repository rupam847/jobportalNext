"use client";
import React, { act, useEffect, useState } from "react";
import Image from "next/image";
import style from "./dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Dashboard = () => {
    const [active, setActive] = useState(false);
    const { isLoading, authToken, userdata, dashboard } = myAppHook();
    const [dashboardData, setDashboardData] = useState<any>([]);
    const router = useRouter();
    const toggleSidebar = () => {
        setActive(!active);
    }

    useEffect(() => {
        if (!authToken) {
            router.push('/auth');
            return;
        } else {
            const getdashboard = async () => {
                const dashboard_data = await dashboard();
                console.log(dashboard_data);
                setDashboardData(dashboard_data);
            }
            getdashboard();
        }
    }, [authToken, isLoading]);

    return <>
        <Sidebar active={active} page={"dashboard"} />
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
                <div className={style["dashboard-card"]}>
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h3>Welcome back, User!</h3>
                            <p className="mb-0">Here's what's happening with your job search today.</p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <div className="progress mt-3 mt-md-0">
                                <div className="progress-bar" role="progressbar" style={{ width: "75%" }} aria-valuenow={75}
                                    aria-valuemin={0} aria-valuemax={100}></div>
                            </div>
                            <p className="mb-0">Profile completeness: 75% <a href="javascript:void(0);"
                                className="text-primary">Complete now</a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {
                        (userdata?.role === "company") ?
                            <>
                                <div className="col-md-6 col-lg-3">
                                    <div className={style["stat-card"] + " " + style["interviews"]}>
                                        <div className="number">{dashboardData.total_posts}</div>
                                        <div className="label">Total Job Posts</div>
                                        <i className="fas fa-calendar-alt mt-3" style={{ fontSize: "2rem" }}></i>
                                    </div>
                                </div>
                            </> : ""
                    }
                    <div className="col-md-6 col-lg-3">
                        <div className={style["stat-card"] + " " + style["applications"]}>
                            <div className="number">{dashboardData.total_applications}</div>
                            <div className="label">Total Applications</div>
                            <i className="fas fa-paper-plane mt-3" style={{ fontSize: "2rem" }}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default Dashboard;