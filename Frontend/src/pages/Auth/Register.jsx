import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [college, setCollege] = useState("");
    const [course, setCourse] = useState("");
    const [graduationYear, setGraduationYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Programmatically block registering with admin@gmail.com
        if (email.toLowerCase().trim() === "admin@gmail.com") {
            setErrorMessage("The email address 'admin@gmail.com' is reserved for system admin and cannot be registered.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email: email.toLowerCase().trim(),
                    password,
                    college,
                    course,
                    graduationYear,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || "Registration failed. Please try again.");
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            // Redirect to login page with success message state
            navigate("/", { state: { successMessage: "Registration successful! Please sign in using your credentials." } });
        } catch (err) {
            setErrorMessage("Unable to connect to server. Please try again.");
            setIsLoading(false);
        }
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
                        <h2 className="text-3xl font-extrabold text-white tracking-tight text-center">Student Registration</h2>
                        <p className="text-slate-400 text-sm mt-1 text-center">Enter your details to create a student account</p>
                    </div>

                    {/* Error Alerts */}
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-950/60 border border-red-500/30 text-red-300 text-xs rounded-2xl text-center font-medium animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    {/* Inputs & Form Control */}
                    <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                        
                        {/* Name and Email Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="flex flex-col text-left">
                                <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Email Address */}
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
                        </div>

                        {/* College and Course Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* College */}
                            <div className="flex flex-col text-left">
                                <label htmlFor="college" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">College</label>
                                <input
                                    type="text"
                                    id="college"
                                    className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                    placeholder="e.g. Stanford University"
                                    value={college}
                                    onChange={(e) => setCollege(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Course */}
                            <div className="flex flex-col text-left">
                                <label htmlFor="course" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Course</label>
                                <input
                                    type="text"
                                    id="course"
                                    className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                    placeholder="e.g. B.Tech Computer Science"
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Graduation Year and Password Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Graduation Year */}
                            <div className="flex flex-col text-left">
                                <label htmlFor="graduationYear" className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">Graduation Year</label>
                                <input
                                    type="text"
                                    id="graduationYear"
                                    className="w-full px-5 py-3 rounded-full border border-slate-700/80 bg-slate-900/90 focus:bg-slate-900 text-white text-[14px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-500 text-left"
                                    placeholder="e.g. 2026"
                                    value={graduationYear}
                                    onChange={(e) => setGraduationYear(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

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
