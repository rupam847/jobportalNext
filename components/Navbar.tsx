"use client";
import { myAppHook } from "@/context/AppProvider";
import Link from "next/link";
import { usePathname } from 'next/navigation'; 

const Navbar = () => {
    const { logout, authToken } = myAppHook();
    const pathname = usePathname();
    const currentpath = pathname.split("/")[1];
    const hideNav = ['dashboard', 'postjob', 'applications', 'profile', 'myapplications'];
    if (hideNav.includes(currentpath)) return null;
    
    return <>
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <Link className="navbar-brand" href="/">JobFinder</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link active" href="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/">Jobs</Link>
                        </li>
                    </ul>
                    <div className="d-flex">
                        {
                            authToken ? (<>
                                <Link href="/dashboard" className="btn btn-outline-primary me-2">Dashboard</Link>
                                <button className="btn btn-outline-primary me-2 user-logout" onClick={logout}>Logout</button>
                            </>) : (<>
                                <Link href="/auth" className="btn btn-outline-primary me-2">Login</Link>
                            </>)
                        }
                    </div>
                </div>
            </div>
        </nav>
    </>
}

export default Navbar;