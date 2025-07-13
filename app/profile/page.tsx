"use client";
import React, { act, useEffect, useState } from "react";
import Image from "next/image";
import style from "../dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Profile = () => {
    const router = useRouter();
    const [active, setActive] = React.useState(false);
    const { isLoading, authToken, userdata, getprofile, profileupdate, passwordupdate } = myAppHook();
    const [profileData, setProfile] = useState<any>([]);
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        password: "",
        password_confirmation: ""
    })
    const toggleSidebar = () => {
        setActive(!active);
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profileData, [e.target.name]: e.target.value });
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(profileData);
        const response = await profileupdate(profileData);
    }

    const handlePasswordChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    }

    const handlePasswordFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(passwordData);
        const response = await passwordupdate(passwordData);
        if (response.success) {
            setPasswordData({ current_password: "", password: "", password_confirmation: "" });
        }
    }

    useEffect(() => {
        if (!authToken) {
            router.push('/auth');
            return;
        } else {
            const getProfile = async () => {
                const response = await getprofile();
                console.log(response);
                setProfile(response);
            }
            getProfile();
        }
    }, [authToken, isLoading]);

    return <>
        <Sidebar active={active} page={"profile"} />
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

                <div className="row">
                    <div className="py-8">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                                <div className="max-w-xl">
                                    <section>
                                        <header>
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Profile Information
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-600">
                                                Update your account's profile information and email address.
                                            </p>
                                        </header>

                                        <form className="mt-6 space-y-6" onSubmit={handleFormSubmit}>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <label htmlFor="name">
                                                        Name
                                                    </label>
                                                    <input className="form-control p-3 mb-4" onChange={handleChangeInput} 
                                                        id="name" name="name" type="text" value={profileData?.name} required />
                                                </div>

                                                <div className="col-md-8">
                                                    <label htmlFor="email">
                                                        Email
                                                    </label>
                                                    <input className="form-control p-3 mb-4" onChange={handleChangeInput}
                                                        id="email" name="email" type="email" value={profileData?.email} required />
                                                </div>

                                                <div className="col-md-8">
                                                    <label htmlFor="phone">
                                                        Phone
                                                    </label>
                                                    <input className="form-control p-3 mb-4" onChange={handleChangeInput}
                                                        id="phone" name="phone" type="text" value={profileData?.phone} />
                                                </div>

                                                <div className="col-md-8">
                                                    <label htmlFor="address">
                                                        Address
                                                    </label>
                                                    <input className="form-control p-3 mb-4" onChange={handleChangeInput}
                                                        id="address" name="address" type="text" value={profileData?.address} />
                                                </div>

                                                <div className="flex items-center gap-4 col-md-8">
                                                    <button type="submit" className="btn btn-primary">
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </section>
                                </div>
                            </div>

                            <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg mt-4">
                                <div className="max-w-xl">
                                    <section>
                                        <header>
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Update Password
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-600">
                                                Ensure your account is using a long, random password to stay secure.
                                            </p>
                                        </header>

                                        <form className="mt-6 space-y-6" onSubmit={handlePasswordFormSubmit}>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <label className="block font-medium text-sm text-gray-700" htmlFor="current_password">
                                                        Current Password
                                                    </label>
                                                    <input className="form-control p-3 mb-4" id="current_password" value={passwordData.current_password}
                                                    name="current_password" type="password" onChange={handlePasswordChangeInput} required />
                                                </div>

                                                <div className="col-md-8">
                                                    <label className="block font-medium text-sm text-gray-700" htmlFor="password">
                                                        New Password
                                                    </label>
                                                    <input className="form-control p-3 mb-4" id="password" name="password" value={passwordData.password}
                                                    type="password" onChange={handlePasswordChangeInput} required />
                                                </div>

                                                <div className="col-md-8">
                                                    <label className="block font-medium text-sm text-gray-700" htmlFor="password_confirmation">
                                                        Confirm Password
                                                    </label>
                                                    <input className="form-control p-3 mb-4" id="password_confirmation" name="password_confirmation" 
                                                    value={passwordData.password_confirmation} type="password" onChange={handlePasswordChangeInput} required />
                                                </div>

                                                <div className="flex items-center gap-4 col-md-8">
                                                    <button type="submit" className="btn btn-primary">
                                                        Save
                                                    </button>

                                                </div>
                                            </div>
                                        </form>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Profile