import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        setTimeout(() => {
            setIsLoading(false);
            setMessage("Password reset instructions have been sent if an account with this email exists.");
        }, 1200);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] p-4 md:p-6 font-sans relative overflow-hidden">
            {/* Background subtle glowing accents */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="w-full max-w-[450px] bg-[#111728]/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-black/70 p-8 md:p-12 flex flex-col justify-center relative z-10">
                
                {/* Header Row */}
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight text-center">Reset Password</h2>
                    <p className="text-slate-400 text-sm mt-1 text-center leading-relaxed">Enter your email and we'll send reset instructions</p>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm rounded-2xl text-center font-medium">
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
                    
                    {/* Email Input */}
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

                    {/* Submit Button */}
                    <button type="submit" className="w-full py-3.5 mt-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[15px] shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <span>Send Code</span>
                        )}
                    </button>

                    {/* Back to Login */}
                    <div className="flex justify-center items-center text-sm font-medium mt-2">
                        <Link to="/" className="text-slate-400 hover:text-indigo-400 hover:underline transition-colors">
                            Back to Sign In
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
