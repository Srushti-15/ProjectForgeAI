import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("candidate"); // 'candidate', 'referrer', 'recruiter'
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Validate password match
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // Programmatically block registering with admin@gmail.com
        if (email.toLowerCase().trim() === "admin@gmail.com") {
            setErrorMessage("The email address 'admin@gmail.com' is reserved for system admin and cannot be registered.");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            // Retrieve existing users
            const existingUsersRaw = localStorage.getItem("job_platform_users");
            const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

            // Check if user already exists
            const userExists = existingUsers.some(u => u.email.toLowerCase().trim() === email.toLowerCase().trim());
            if (userExists) {
                setErrorMessage("An account with this email address already exists.");
                setIsLoading(false);
                return;
            }

            // Create new user object
            const newUser = {
                fullName,
                email: email.toLowerCase().trim(),
                phone,
                password,
                role
            };

            // Save user
            existingUsers.push(newUser);
            localStorage.setItem("job_platform_users", JSON.stringify(existingUsers));

            setIsLoading(false);
            // Redirect to login page with success message state
            navigate("/", { state: { successMessage: "Registration successful! Please sign in using your credentials." } });
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] p-4 md:p-6 font-sans relative overflow-hidden">
            {/* Background subtle glowing accents */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            {/* Split Card Wrapper */}
            <div className="w-full max-w-[850px] min-h-[550px] bg-[#111728]/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-black/70 overflow-hidden flex flex-col md:flex-row relative z-10">
                
                {/* Left Column: Register Form */}
                <div className="flex-[1.2] p-6 md:p-10 flex flex-col justify-center bg-[#111728]/60">
                    
                    {/* Header Row: Title */}
                    <div className="flex flex-col items-center mb-6">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight text-center">Create Account</h2>
                        <p className="text-slate-400 text-sm mt-1 text-center">Get started on the Job Referral Platform</p>
                    </div>

                    {/* Role Selection Tabs */}
                    <div className="flex bg-slate-900/90 border border-slate-800/90 p-1.5 rounded-full mb-6">
                        {["candidate", "referrer", "recruiter"].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-full capitalize transition-all duration-200 cursor-pointer ${
                                    role === r
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Error Alerts */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-950/60 border border-red-500/30 text-red-300 text-xs rounded-2xl text-center font-medium animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    {/* Inputs & Form Control */}
                    <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                        
                        {/* Full Name */}
                        <div className="flex flex-col text-left">
                            <label htmlFor="fullName" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Email and Phone Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div className="flex flex-col text-left">
                                <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="flex flex-col text-left">
                                <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                    placeholder="+1 (555) 000-0000"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password and Confirm Password Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password */}
                            <div className="flex flex-col text-left">
                                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col text-left">
                                <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full py-3.5 mt-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[15px] shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>Registering...</span>
                                </>
                            ) : (
                                <span>Sign Up</span>
                            )}
                        </button>

                    </form>
                </div>

                {/* Right Column: Register Panel Info */}
                <div className="flex-[0.8] bg-[#161f38]/90 border-t md:border-t-0 md:border-l border-slate-800/80 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden backdrop-blur-sm">
                    {/* Visual blobs inside background */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-white">Welcome Back</h2>
                    <p className="text-[14px] text-slate-400 max-w-[260px] leading-relaxed mb-8">Already have an account? Sign in to access your platform dashboard.</p>
                    <Link to="/" className="px-9 py-2.5 border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-full font-semibold text-[14px] shadow-md shadow-indigo-950/40 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Register;
