import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const currentUser = localStorage.getItem("current_user");
        if (!currentUser) {
            navigate("/");
            return;
        }
        const parsed = JSON.parse(currentUser);
        if (parsed.email !== "admin@gmail.com") {
            navigate(`/${parsed.role}/dashboard`);
            return;
        }

        // Fetch users registered in localStorage
        const storedUsersRaw = localStorage.getItem("job_platform_users");
        const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        setUsers(storedUsers);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("current_user");
        navigate("/");
    };

    const handleDeleteUser = (email) => {
        const updated = users.filter(u => u.email !== email);
        setUsers(updated);
        localStorage.setItem("job_platform_users", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">A</span>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight m-0">JobRefferer Admin</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 m-0">System Administrator</p>
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-semibold text-sm rounded-full transition-all duration-200">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
                
                {/* Welcome Card */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold m-0 text-white mb-2">Admin Dashboard</h2>
                        <p className="text-slate-300 max-w-lg leading-relaxed text-sm md:text-base">System-wide monitoring dashboard. Review registered platform users, monitor database integrity, and run system audits.</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stored Users</span>
                        <span className="text-3xl font-black text-slate-800">{users.length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidates</span>
                        <span className="text-3xl font-black text-indigo-600">{users.filter(u => u.role === "candidate").length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referrers</span>
                        <span className="text-3xl font-black text-violet-600">{users.filter(u => u.role === "referrer").length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recruiters</span>
                        <span className="text-3xl font-black text-emerald-600">{users.filter(u => u.role === "recruiter").length}</span>
                    </div>
                </div>

                {/* User management list */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="text-lg font-bold text-slate-800 m-0">Registered Platform Users</h3>
                    
                    {users.length === 0 ? (
                        <p className="text-sm text-slate-500 py-4 text-center">No platform users registered yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Role Badge</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.email} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5">
                                                <p className="font-semibold text-slate-800 text-sm m-0">{u.fullName}</p>
                                            </td>
                                            <td className="py-3.5 text-sm text-slate-600">{u.email}</td>
                                            <td className="py-3.5 text-sm text-slate-500">{u.phone}</td>
                                            <td className="py-3.5">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    u.role === "candidate" ? "bg-indigo-50 text-indigo-600" :
                                                    u.role === "referrer" ? "bg-violet-50 text-violet-600" :
                                                    "bg-emerald-50 text-emerald-600"
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-right">
                                                <button onClick={() => handleDeleteUser(u.email)} className="px-3 py-1 hover:bg-red-50 text-red-500 font-semibold text-xs rounded-full border border-transparent hover:border-red-100 transition-all">
                                                    Remove User
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;
