"use client";
import React, { act, useEffect } from "react";
import Image from "next/image";
import style from "../../dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import { myAppHook } from "@/context/AppProvider";
import Link from "next/link";

const PostJobEdit = () => {
    const [active, setActive] = React.useState(false);
    const { isLoading, authToken } = myAppHook();

    const toggleSidebar = () => {
        setActive(!active);
    }

    useEffect(() => {
        if (!authToken) {
            // router.push('/auth');
            // return;
        }
    }, [authToken, isLoading]);

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
                                Post New Job
                            </h2>
                        </div>
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <div className="row">
                                <form>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_title" className="form-label">Title*</label>
                                        <input type="text" className="form-control" id="job_title" name="job_title"
                                            value="" required />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_description" className="form-label mt-3">Description*</label>
                                        <textarea className="form-control" id="job_description" name="job_description" 
                                        rows={5} required></textarea>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_category" className="form-label mt-3">Job Category*</label>
                                        <select name="job_category_id" id="job_category_id" className="form-select" required>
                                            <option value="">Select Category</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_salary" className="form-label mt-3">Salary*</label>
                                        <input type="text" className="form-control" id="job_salary" name="job_salary"
                                            value="" required />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_location" className="form-label mt-3">Location*</label>
                                        <input type="text" className="form-control" id="job_location" name="job_location"
                                            value="" required />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_city" className="form-label mt-3">City</label>
                                        <input type="text" className="form-control" id="job_city" name="job_city"
                                            value="" />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_state" className="form-label mt-3">State</label>
                                        <input type="text" className="form-control" id="job_state" name="job_state"
                                            value="" />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_country" className="form-label mt-3">Country</label>
                                        <input type="text" className="form-control" id="job_country" name="job_country"
                                            value="" />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_zip_code" className="form-label mt-3">Zip Code</label>
                                        <input type="text" className="form-control" id="job_zip_code" name="job_zip_code"
                                            value="" />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_status" className="form-label mt-3">Status*</label>
                                        <select name="job_status" id="job_status" className="form-select" required>
                                            <option value="">Select Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                        <div className="col-12 col-md-6 mt-3">
                                            <button type="submit" className="btn btn-primary">Update Job</button>
                                            <Link href="/postjob" className="btn btn-secondary ms-2">Cancel</Link>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default PostJobEdit