import Link from "next/link";
import { myAppHook } from "@/context/AppProvider";

const Sidebar = ({ active, page }: { active: boolean, page: string }) => {
    const { logout, authToken, userdata } = myAppHook();

    return <>
        <div className={"sidebar " + (active ? "active" : "")} id="sidebar" style={{ width: "250px" }}>
            <div className="px-3 mb-4">
                <h4 className="text-center"><Link href="/" className="text-decoration-none">JobFinder</Link></h4>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className={"nav-link " + (page === "dashboard" ? "active" : "")} href="/dashboard">
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className={"nav-link " + (page === "profile" ? "active" : "")} href="/profile">
                        <i className="fas fa-user"></i> My Profile
                    </Link>
                </li>
                {
                    (userdata?.role === 'company') ? (<>
                        <li className="nav-item">
                            <Link className={"nav-link " + (page === "postjob" ? "active" : "")} href="/postjob">
                                <i className="fas fa-briefcase"></i> My Job Posts
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link " + (page === "applications" ? "active" : "")} href="/applications">
                                <i className="fas fa-paper-plane"></i> Appilications
                            </Link>
                        </li>
                    </>
                    ) : (
                        <li className="nav-item">
                            <Link className={"nav-link " + (page === "myapplications" ? "active" : "")} href="/myapplications">
                                <i className="fas fa-paper-plane"></i> My Appilications
                            </Link>
                        </li>
                    )
                }
                <li className="nav-item mt-4">
                    <Link className="nav-link user-logout" href="/auth" onClick={logout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </Link>
                </li>
            </ul>
        </div>

    </>
};

export default Sidebar;