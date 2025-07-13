"use client"
import Loader from "@/components/Loader";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AppProviderType{
    isLoading: boolean,
    authToken: string|null,
    userdata: any,
    setLoading: (isLoading: boolean) => void,
    login: (email: string, password: string) => Promise<void>,
    register: (name: string, email: string, password: string, password_confirmation: string, phone: string, role: string) => Promise<void>,
    logout: () => void,
    getprofile: () => Promise<void>,
    profileupdate: any,
    passwordupdate: any,
    categories: () => Promise<void>,
    allJobs: (filter: any) => Promise<void>,
    singleJob: (jobid: string) => Promise<void>,
    dashboard: () => Promise<void>,
    applications: () => Promise<void>,
    postjobs: () => Promise<void>,
    createjob: any,
    getjob: (id: string) => Promise<void>,
    updatejob: any,
}

const AppContext = createContext<AppProviderType|undefined>(undefined)

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

export const AppProvider = ({
    children
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [authToken, setAuthToken] = useState<string>('');
    const [userdata, setUserdata] = useState<any>([]);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token && token !== 'undefined') {
            const username = Cookies.get('name');
            const userrole = Cookies.get('role');
            setAuthToken(token);
            setUserdata({ name: username, role: userrole });
        } else {
            // router.push('/auth');
        }
        setIsLoading(false);
    }, [authToken]);

    const setLoading = (isLoading: boolean) => {
        setIsLoading(isLoading);
    }

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data.success) {
                Cookies.set('authToken', response.data.data.token, { expires: 1 });
                Cookies.set('name', response.data.data.name, { expires: 1 });
                Cookies.set('role', response.data.data.role, { expires: 1 });
                toast.success(response.data.message);
                setAuthToken(response.data.data.token);
                router.push('/dashboard');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    const register = async (name: string, email: string, password: string, password_confirmation: string, phone: string, role: string) => {
        try {
            if (password !== password_confirmation) {
                toast.error('Password and Confirm Password must be same');
                return;
            }
            const response = await axios.post(`${API_URL}/register`, { name, email, password, password_confirmation, phone, role });
            if (response.data.success) {
                Cookies.set('authToken', response.data.data.token, { expires: 1 });
                Cookies.set('name', response.data.data.name, { expires: 1 });
                Cookies.set('role', response.data.data.role, { expires: 1 });
                toast.success(response.data.message);
                setAuthToken(response.data.data.token);
                router.push('/dashboard');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const logout = () => {
        setAuthToken('');
        Cookies.remove('authToken');
        setIsLoading(false);
        toast.success('Logout successfully');
        router.push('/auth');
    }

    const categories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`);
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const allJobs = async (filter: any) => {
        try {
            const response = await axios.post(`${API_URL}/get-jobs`, filter);
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const singleJob = async (jobid: string) => {
        try {
            const response = await axios.get(`${API_URL}/getsinglejob/${jobid}`);
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const dashboard = async () => {
        try {
            const response = await axios.get(`${API_URL}/dashboard`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const getprofile = async () => {
        try {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const profileupdate = async (profileData: any) => {
        try {
            const response = await axios.post(`${API_URL}/profile-update`, { ...profileData }, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            return response.data;
        } catch (error: any) {
            toast.error(error.response.data.message);
            console.log(error);
        } finally {
        }
    }

    const passwordupdate = async (passwordData: any) => {
        try {
            if (passwordData.password !== passwordData.password_confirmation) {
                toast.error('Password and Confirm Password must be same');
                return;
            }
            const response = await axios.post(`${API_URL}/password-update`, passwordData, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }

            return response.data;
        } catch (error: any) {
            console.log('error: ', error);
            toast.error(error.response.data.message);
        } finally {
        }
    }


    const applications = async () => {
        try {
            const response = await axios.get(`${API_URL}/applications`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const postjobs = async () => {
        try {
            const response = await axios.get(`${API_URL}/postjobs`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const createjob = async (jobData: any) => {
        try {
            const response = await axios.post(`${API_URL}/postjobs`, jobData, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                router.push('/postjob');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const getjob = async (id: any) => {
        try {
            const response = await axios.get(`${API_URL}/postjobs/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const updatejob = async (jobData: any) => {
        try {
            const response = await axios.put(`${API_URL}/postjobs/${jobData.job_id}`, jobData, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                router.push('/postjob');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
        }
    }
    

    return (
        <AppContext.Provider value={{setLoading, login, register, isLoading, authToken, userdata, logout, categories, allJobs, singleJob, 
        dashboard, getprofile, profileupdate, passwordupdate, applications, postjobs, createjob, getjob, updatejob}}>
            { isLoading ? <Loader /> : children }
        </AppContext.Provider>
    )
}

export const myAppHook = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within a AppProvider')
    }
    return context
}