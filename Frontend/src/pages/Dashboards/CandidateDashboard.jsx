import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [referrals, setReferrals] = useState([
        { id: 1, jobTitle: "Frontend Developer", company: "Google", referrerName: "Sarah Jenkins", status: "Under Review", date: "2026-07-10" },
        { id: 2, jobTitle: "Software Engineer", company: "Meta", referrerName: "David Chen", status: "Approved", date: "2026-07-08" },
        { id: 3, jobTitle: "Product Designer", company: "Stripe", referrerName: "Emily Watson", status: "Pending", date: "2026-07-12" }
    ]);
    const [newJob, setNewJob] = useState("");
    const [newCompany, setNewCompany] = useState("");
    const [newReferrer, setNewReferrer] = useState("");

    useEffect(() => {
        const currentUser = localStorage.getItem("current_user");
        if (!currentUser) {
            navigate("/");
            return;
        }
        const parsed = JSON.parse(currentUser);
        if (parsed.role !== "candidate") {
            // Redirect to their own dashboard if wrong role
            navigate(`/${parsed.role}/dashboard`);
            return;
        }
        setUser(parsed);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("current_user");
        navigate("/");
    };

    const handleRequestReferral = (e) => {
        e.preventDefault();
        if (!newJob || !newCompany || !newReferrer) return;
        const newRef = {
            id: Date.now(),
            jobTitle: newJob,
            company: newCompany,
            referrerName: newReferrer,
            status: "Pending",
            date: new Date().toISOString().split("T")[0]
        };
        setReferrals([newRef, ...referrals]);
        setNewJob("");
        setNewCompany("");
        setNewReferrer("");
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
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{user.role}</span>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-semibold text-sm rounded-full transition-all duration-200">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
                
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold m-0 text-white mb-2">Hello, {user.fullName}!</h2>
                        <p className="text-indigo-100 max-w-lg leading-relaxed text-sm md:text-base">Welcome back to your Candidate Dashboard. Track your referral requests and request endorsements from industry professionals.</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Referrals</span>
                        <span className="text-3xl font-black text-indigo-600">{referrals.length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Requests</span>
                        <span className="text-3xl font-black text-emerald-600">{referrals.filter(r => r.status === "Approved").length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
                        <span className="text-3xl font-black text-amber-500">{referrals.filter(r => r.status === "Pending").length}</span>
                    </div>
                </div>

                {/* Content split grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Request Form */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5 lg:col-span-1">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 m-0">Request a Referral</h3>
                            <p className="text-xs text-slate-400 mt-1">Ask a referrer to endorse you for a role</p>
                        </div>

                        <form onSubmit={handleRequestReferral} className="flex flex-col gap-4">
                            <div className="flex flex-col text-left">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Frontend Developer"
                                    className="px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
                                    value={newJob}
                                    onChange={(e) => setNewJob(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col text-left">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 mb-1">Company</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Google"
                                    className="px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
                                    value={newCompany}
                                    onChange={(e) => setNewCompany(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col text-left">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 mb-1">Referrer Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sarah Jenkins"
                                    className="px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
                                    value={newReferrer}
                                    onChange={(e) => setNewReferrer(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full py-2.5 mt-2 rounded-full bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200">
                                Send Request
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Referrals List */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col gap-5">
                        <h3 className="text-lg font-bold text-slate-800 m-0">Recent Referral Requests</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Company</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Referrer</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Requested</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrals.map((ref) => (
                                        <tr key={ref.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5">
                                                <p className="font-semibold text-slate-800 text-sm m-0">{ref.jobTitle}</p>
                                                <span className="text-xs text-slate-400">{ref.company}</span>
                                            </td>
                                            <td className="py-3.5 text-sm text-slate-600">{ref.referrerName}</td>
                                            <td className="py-3.5 text-sm text-slate-500">{ref.date}</td>
                                            <td className="py-3.5 text-right">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    ref.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                    ref.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                                    "bg-blue-50 text-blue-600"
                                                }`}>
                                                    {ref.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default CandidateDashboard;
