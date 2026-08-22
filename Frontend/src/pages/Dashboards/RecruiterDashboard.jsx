import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [pipeline, setPipeline] = useState([
        { id: 1, candidateName: "Jordan Blake", jobTitle: "Fullstack Dev", company: "Aero Corp", referrerName: "Timothy Green", status: "Pending", date: "2026-07-11" },
        { id: 2, candidateName: "Emma Stone", jobTitle: "UX Researcher", company: "Design Pro", referrerName: "Lucas Vance", status: "Under Review", date: "2026-07-10" },
        { id: 3, candidateName: "Ryan Gosling", jobTitle: "Lead DevOps", company: "Cloud Inc", referrerName: "Sarah Jenkins", status: "Approved", date: "2026-07-07" },
        { id: 4, candidateName: "Tom Holland", jobTitle: "React dev", company: "Web Studio", referrerName: "David Chen", status: "Rejected", date: "2026-07-06" }
    ]);

    useEffect(() => {
        const currentUser = localStorage.getItem("current_user");
        if (!currentUser) {
            navigate("/");
            return;
        }
        const parsed = JSON.parse(currentUser);
        if (parsed.role !== "recruiter") {
            navigate(`/${parsed.role}/dashboard`);
            return;
        }
        setUser(parsed);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("current_user");
        navigate("/");
    };

    const updateStatus = (id, newStatus) => {
        setPipeline(prev =>
            prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
        );
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/20">J</span>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight m-0">JobRefferer</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 m-0">{user.fullName}</p>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{user.role}</span>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-semibold text-sm rounded-full transition-all duration-200">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
                
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-emerald-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold m-0 text-white mb-2">Hello, Recruiter {user.fullName}!</h2>
                        <p className="text-indigo-100 max-w-lg leading-relaxed text-sm md:text-base">Review talent referred by top industry professionals. Review candidate portfolios, approve matches, and manage your hiring pipeline.</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Candidates</span>
                        <span className="text-3xl font-black text-indigo-600">{pipeline.length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
                        <span className="text-3xl font-black text-amber-500">{pipeline.filter(p => p.status === "Pending").length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Candidates</span>
                        <span className="text-3xl font-black text-emerald-600">{pipeline.filter(p => p.status === "Approved").length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected Matches</span>
                        <span className="text-3xl font-black text-red-500">{pipeline.filter(p => p.status === "Rejected").length}</span>
                    </div>
                </div>

                {/* Pipeline List */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5">
                    <h3 className="text-lg font-bold text-slate-800 m-0">Candidate Referral Pipeline</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Name</th>
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Role Details</th>
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Referrer</th>
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted</th>
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pipeline.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">
                                            <p className="font-semibold text-slate-800 text-sm m-0">{item.candidateName}</p>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600">
                                            <span className="font-medium">{item.jobTitle}</span>
                                            <span className="block text-xs text-slate-400">{item.company}</span>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600">{item.referrerName}</td>
                                        <td className="py-4 text-sm text-slate-500">{item.date}</td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                item.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                item.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                                item.status === "Rejected" ? "bg-red-50 text-red-600" :
                                                "bg-blue-50 text-blue-600"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            {item.status === "Pending" || item.status === "Under Review" ? (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => updateStatus(item.id, "Approved")} className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-full transition-all">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => updateStatus(item.id, "Rejected")} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs rounded-full transition-all">
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default RecruiterDashboard;
