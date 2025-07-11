"use client";
import React, { act, useEffect, useState } from "react";
import Image from "next/image";
import style from "../../dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import { myAppHook } from "@/context/AppProvider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface PostJobEditProps {
    'job_id': any,
    'job_title': string,
    'job_description': string,
    'job_category_id': string,
    'job_salary': string,
    'job_location': string,
    'job_city': string,
    'job_state': string,
    'job_country': string,
    'job_zip_code': string,
    'job_status': string
}

const PostJobEdit = () => {
    const router = useRouter();
    const params = useParams();
    const jobid = params.id;
    const [active, setActive] = useState(false);
    const [postjob, setPostjob] = useState<PostJobEditProps>({
        'job_id': jobid,
        'job_title': '',
        'job_description': '',
        'job_category_id': '',
        'job_salary': '',
        'job_location': '',
        'job_city': '',
        'job_state': '',
        'job_country': '',
        'job_zip_code': '',
        'job_status': 'active'
    });
    const [categoryData, setCategoryData] = useState([]);
    const { isLoading, authToken, categories, getjob, updatejob } = myAppHook();

    const toggleSidebar = () => {
        setActive(!active);
    }

    const handleInputChange = (e: any) => {
        setPostjob({ ...postjob, [e.target.id]: e.target.value });
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await updatejob(postjob);
    }

    useEffect(() => {
        if (!authToken) {
            router.push('/auth');
            return;
        } else {
            const getCategories = async (jobid: any) => {
                const category_data: any = await categories();
                if (category_data.success) {
                    setCategoryData(category_data.data);
                }
                
                const job_data: any = await getjob(jobid);
                if (job_data.success) {
                    setPostjob(job_data.data);
                }
            }

            getCategories(jobid);
        }
    }, [authToken]);

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
                                Edit Job
                            </h2>
                            <Link href="/postjob/create"
                                className="btn btn-primary font-bold py-2 px-4 rounded-md hover:bg-sky-700">Post New Job</Link>
                        </div>
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <div className="row">
                                <form onSubmit={handleFormSubmit}>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_title" className="form-label">Title*</label>
                                        <input type="text" className="form-control" id="job_title" name="job_title"
                                            onChange={handleInputChange} value={postjob.job_title} required />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_description" className="form-label mt-3">Description*</label>
                                        <textarea className="form-control" id="job_description" name="job_description"
                                            rows={5} defaultValue={postjob.job_description} onChange={handleInputChange} required></textarea>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_category" className="form-label mt-3">Job Category*</label>
                                        <select name="job_category_id" id="job_category_id" className="form-select"
                                            value={postjob.job_category_id} onChange={handleInputChange} required>
                                            <option value="">Select Category</option>
                                            {categoryData.map((category: any) => (
                                                <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_salary" className="form-label mt-3">Salary*</label>
                                        <input type="text" className="form-control" id="job_salary" name="job_salary"
                                            onChange={handleInputChange} value={postjob.job_salary} required />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_location" className="form-label mt-3">Location*</label>
                                        <input type="text" className="form-control" id="job_location" name="job_location"
                                            onChange={handleInputChange} value={postjob.job_location} required />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_city" className="form-label mt-3">City</label>
                                        <input type="text" className="form-control" id="job_city" name="job_city"
                                            onChange={handleInputChange} value={postjob.job_city} />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_state" className="form-label mt-3">State</label>
                                        <input type="text" className="form-control" id="job_state" name="job_state"
                                            onChange={handleInputChange} value={postjob.job_state} />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_country" className="form-label mt-3">Country</label>
                                        <input type="text" className="form-control" id="job_country" name="job_country"
                                            onChange={handleInputChange} value={postjob.job_country} />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_zip_code" className="form-label mt-3">Zip Code</label>
                                        <input type="text" className="form-control" id="job_zip_code" name="job_zip_code"
                                            onChange={handleInputChange} value={postjob.job_zip_code} />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="job_status" className="form-label mt-3">Status*</label>
                                        <select name="job_status" id="job_status" className="form-select"
                                            onChange={handleInputChange} defaultValue={postjob.job_status} required>
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