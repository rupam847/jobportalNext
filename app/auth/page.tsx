"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";


interface formData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    role: string;
}

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [formData, setFormData] = useState<formData>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        role: ""
    });

    const router = useRouter();

    const { login, register, isLoading, authToken } = myAppHook();
    
    useEffect(() => {
        if (authToken) {
            router.push('/dashboard');
        }
    }, [authToken, isLoading, router]);


    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLogin) {
            try {
                await login(formData.email, formData.password);
            } catch (error) {
                console.log("Auth error", error);
            }
        } else {
            try {
                await register(formData.name, formData.email, formData.password, formData.password_confirmation, formData.phone, formData.role);
            } catch (error) {
                console.log("Auth error", error);
            }
        }
        console.log(formData);
    }

    return <>
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: "400px" }}>
                <h3 className="text-center">{isLogin ? "Login" : "Register"}</h3>
                <form onSubmit={handleFormSubmit}>
                    {
                        !isLogin && (<input className="form-control mb-2" name="name" type="text" placeholder="Name"
                            value={formData.name} onChange={handleChangeInput} required />)
                    }
                    <input className="form-control mb-2" name="email" type="email" placeholder="Email" value={formData.email}
                    onChange={handleChangeInput} required />
                    <input className="form-control mb-2" name="password" type="password" placeholder="Password" onChange={handleChangeInput} required />
                    {
                        !isLogin && (<>
                            <input className="form-control mb-2" name="password_confirmation" type="password"
                            onChange={handleChangeInput} placeholder="Confirm Password" required />
                            <input className="form-control mb-2" name="phone" type="text" placeholder="Phone" value={formData.phone}
                            onChange={handleChangeInput} required />
                            <select className="form-control mb-2" name="role" onChange={handleChangeSelect} defaultValue={formData.role} required>
                                <option value="">Select Type</option>
                                <option value="user">User</option>
                                <option value="company">Company</option>
                            </select>
                        </>)
                    }
                    <button className="btn btn-primary w-100 mt-3" type="submit">{isLogin ? "Login" : "Register"}</button>
                </form>

                {isLogin ? (
                    <p className="mt-3 text-center">Don't have an account? <Link href="/auth" onClick={() => setIsLogin(false)}>Register</Link></p>
                ) : (
                    <p className="mt-3 text-center">Already have an account? <Link href="/auth" onClick={() => setIsLogin(true)}>Login</Link></p>
                )}
            </div>
        </div>
    </>
};

export default Auth;