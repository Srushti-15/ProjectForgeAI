import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReferrerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [referrals, setReferrals] = useState([
        { id: 1, candidateName: "Alex Rivera", jobTitle: "React Engineer", company: "Netflix", status: "Hired", date: "2026-07-01", reward: "$500" },
        { id: 2, candidateName: "Marcus Vance", jobTitle: "Backend Dev", company: "Uber", status: "Under Review", date: "2026-07-09", reward: "$400" },
        { id: 3, candidateName: "Clara Oswald", jobTitle: "Product Specialist", company: "Airbnb", status: "Pending", date: "2026-07-11", reward: "$300" }
    ]);
    const [newCand, setNewCand] = useState("");
    const [newJob, setNewJob] = useState("");
    const [newComp, setNewComp] = useState("");

    useEffect(() => {
        const currentUser = localStorage.getItem("current_user");
        if (!currentUser) {
            navigate("/");
            return;
        }
        const parsed = JSON.parse(currentUser);
        if (parsed.role !== "referrer") {
            navigate(`/${parsed.role}/dashboard`);
            return;
        }
        setUser(parsed);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("current_user");
        navigate("/");
    };

    const handleAddReferral = (e) => {
        e.preventDefault();
        if (!newCand || !newJob || !newComp) return;
        const newRef = {
            id: Date.now(),
            candidateName: newCand,
            jobTitle: newJob,
            company: newComp,
            status: "Pending",
            date: new Date().toISOString().split("T")[0],
            reward: "$" + (Math.floor(Math.random() * 3) * 100 + 300)
        };
        setReferrals([newRef, ...referrals]);
        setNewCand("");
        setNewJob("");
        setNewComp("");
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
                        <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{user.role}</span>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-semibold text-sm rounded-full transition-all duration-200">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
                
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold m-0 text-white mb-2">Welcome Back, {user.fullName}!</h2>
                        <p className="text-indigo-100 max-w-lg leading-relaxed text-sm md:text-base">Provide referrals for talented candidates in your network, trace hiring pipelines, and collect rewards on placements.</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidates Referred</span>
                        <span className="text-3xl font-black text-indigo-600">{referrals.length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placements / Hired</span>
                        <span className="text-3xl font-black text-emerald-600">{referrals.filter(r => r.status === "Hired").length}</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Earnings</span>
                        <span className="text-3xl font-black text-violet-600">$900</span>
                    </div>
                </div>

                {/* Split Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Panel: Refer form */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-5 lg:col-span-1">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 m-0">Refer a Candidate</h3>
                            <p className="text-xs text-slate-400 mt-1">Submit information to begin the endorsement</p>
                        </div>

                        <form onSubmit={handleAddReferral} className="flex flex-col gap-4">
                            <div className="flex flex-col text-left">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 mb-1">Candidate Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Alex Rivera"
                                    className="px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
                                    value={newCand}
                                    onChange={(e) => setNewCand(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col text-left">
                                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. React Engineer"
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
                                    placeholder="e.g. Netflix"
                                    className="px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all"
                                    value={newComp}
                                    onChange={(e) => setNewComp(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full py-2.5 mt-2 rounded-full bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 shadow-md hover:shadow-lg transition-all duration-200">
                                Submit Referral
                            </button>
                        </form>
                    </div>

                    {/* Right Panel: List */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col gap-5">
                        <h3 className="text-lg font-bold text-slate-800 m-0">Recent Referrals Log</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Role & Co.</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Potential Reward</th>
                                        <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrals.map((ref) => (
                                        <tr key={ref.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5">
                                                <p className="font-semibold text-slate-800 text-sm m-0">{ref.candidateName}</p>
                                                <span className="text-xs text-slate-400">{ref.date}</span>
                                            </td>
                                            <td className="py-3.5 text-sm text-slate-600">
                                                <span className="font-medium">{ref.jobTitle}</span>
                                                <span className="block text-xs text-slate-400">{ref.company}</span>
                                            </td>
                                            <td className="py-3.5 text-sm text-indigo-600 font-bold">{ref.reward}</td>
                                            <td className="py-3.5 text-right">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    ref.status === "Hired" ? "bg-emerald-50 text-emerald-600" :
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

export default ReferrerDashboard;
