import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (location.state && location.state.successMessage) {
            setSuccessMessage(location.state.successMessage);
            // Clear the state so it doesn't persist on page reload
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        // Simulate interactive verification loading
        setTimeout(() => {
            const trimmedEmail = email.toLowerCase().trim();

            // Admin check
            if (trimmedEmail === "admin@gmail.com") {
                if (password === "admin1234") {
                    const adminUser = { fullName: "System Admin", email: "admin@gmail.com", role: "admin" };
                    localStorage.setItem("current_user", JSON.stringify(adminUser));
                    setIsLoading(false);
                    navigate("/admin/dashboard");
                } else {
                    setErrorMessage("Invalid email or password.");
                    setIsLoading(false);
                }
                return;
            }

            // Normal user check
            const existingUsersRaw = localStorage.getItem("job_platform_users");
            const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

            const matchedUser = existingUsers.find(
                u => u.email.toLowerCase().trim() === trimmedEmail && u.password === password
            );

            if (matchedUser) {
                localStorage.setItem("current_user", JSON.stringify(matchedUser));
                setIsLoading(false);
                navigate(`/${matchedUser.role}/dashboard`);
            } else {
                setErrorMessage("Invalid email or password.");
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] p-4 md:p-6 font-sans relative overflow-hidden">
            {/* Background subtle glowing accents */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            {/* Split Card Wrapper */}
            <div className="w-full max-w-[850px] min-h-[500px] bg-[#111728]/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-black/70 overflow-hidden flex flex-col md:flex-row relative z-10">

                {/* Left Column: Sign In Form */}
                <div className="flex-[1.1] p-8 md:p-12 flex flex-col justify-center bg-[#111728]/60">

                    {/* Header Row: Title */}
                    <div className="flex justify-center items-center mb-6">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight text-center">Sign In</h2>
                    </div>

                    {/* Alert Messages */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl text-center font-medium">
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-950/60 border border-red-500/30 text-red-300 text-xs rounded-2xl text-center font-medium animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    {/* Inputs & Form Control */}
                    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 mt-2">

                        {/* Email Input Group */}
                        <div className="flex flex-col text-left">
                            <label htmlFor="email" className="text-[12px] font-bold uppercase tracking-wider text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-5 py-3.5 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[15px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Password Input Group */}
                        <div className="flex flex-col text-left">
                            <label htmlFor="password" className="text-[12px] font-bold uppercase tracking-wider text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-5 py-3.5 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[15px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full py-3.5 mt-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[15px] shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>

                        {/* Form Options: Forgot Password Only */}
                        <div className="flex justify-end items-center text-sm font-medium mt-1">
                            <Link to="/forgot-password" className="text-slate-400 hover:text-indigo-400 hover:underline transition-colors">
                                Forgot Password
                            </Link>
                        </div>

                    </form>
                </div>

                {/* Right Column: Welcome Panel */}
                <div className="flex-[0.9] bg-[#161f38]/90 border-t md:border-t-0 md:border-l border-slate-800/80 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden backdrop-blur-sm">

                    {/* Visual blobs inside background */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight text-white">Welcome to login</h2>
                    <p className="text-[14px] md:text-[15px] text-slate-400 max-w-[260px] leading-relaxed mb-8">Don't have an account?</p>
                    <Link to="/register" className="px-9 py-2.5 border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-full font-semibold text-[14px] shadow-md shadow-indigo-950/40 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                        Sign Up
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Login;