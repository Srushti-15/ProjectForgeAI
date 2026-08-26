import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SKILL_COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#3b82f6"];

const CompleteProfile = () => {
    const navigate  = useNavigate();
    const fileRef   = useRef();
    const [user, setUser]         = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors]     = useState({});

    const [form, setForm] = useState({
        name: "", photo: "", college: "", degree: "", graduationYear: "",
        skills: [], interests: [], experienceLevel: "Intermediate",
        github: "", linkedin: "", projectDomain: "", availability: "Part-time",
    });

    const [newSkillName,  setNewSkillName]  = useState("");
    const [newSkillLevel, setNewSkillLevel] = useState(80);
    const [newInterest,   setNewInterest]   = useState("");

    /* ── Auth guard + skip if profile already done ── */
    useEffect(() => {
        const raw = localStorage.getItem("current_user");
        if (!raw) { navigate("/"); return; }
        const u = JSON.parse(raw);
        if (u.role !== "candidate") { navigate("/"); return; }
        // Already completed? → skip to dashboard
        if (localStorage.getItem(`skillforge_profile_${u.email}`)) {
            navigate("/candidate/dashboard"); return;
        }
        setForm(prev => ({
            ...prev,
            name:           u.fullName        || "",
            college:        u.college         || "",
            graduationYear: u.graduationYear  || "",
        }));
        setUser(u);
    }, [navigate]);

    /* ── Photo handler ── */
    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setForm(p => ({ ...p, photo: ev.target.result }));
        reader.readAsDataURL(file);
    };

    /* ── Skills ── */
    const addSkill = () => {
        const nm = newSkillName.trim();
        if (!nm) return;
        if (form.skills.some(s => s.name.toLowerCase() === nm.toLowerCase())) return;
        setForm(p => ({ ...p, skills: [...p.skills, { name: nm, level: newSkillLevel }] }));
        setNewSkillName(""); setNewSkillLevel(80);
    };
    const removeSkill = (name) =>
        setForm(p => ({ ...p, skills: p.skills.filter(s => s.name !== name) }));

    /* ── Interests ── */
    const addInterest = () => {
        const val = newInterest.trim();
        if (!val || form.interests.includes(val)) return;
        setForm(p => ({ ...p, interests: [...p.interests, val] }));
        setNewInterest("");
    };
    const removeInterest = (i) =>
        setForm(p => ({ ...p, interests: p.interests.filter(x => x !== i) }));

    /* ── Save ── */
    const handleSave = async () => {
        const errs = {};
        if (!form.name.trim())           errs.name = true;
        if (!form.college.trim())        errs.college = true;
        if (!form.degree.trim())         errs.degree = true;
        if (!form.graduationYear.trim()) errs.graduationYear = true;
        if (form.skills.length === 0)    errs.skills = true;
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setIsLoading(true);

        const profilePayload = {
            ...form,
            email: user.email,
            skills: JSON.stringify(form.skills),
            interests: JSON.stringify(form.interests),
        };

        try {
            // Save to backend database
            await fetch("/api/profile/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profilePayload),
            });
        } catch (e) {
            console.warn("Backend save failed, saved locally", e);
        }

        // Cache in localStorage for offline / instant availability
        localStorage.setItem(
            `skillforge_profile_${user.email}`,
            JSON.stringify({ ...form, email: user.email, completedAt: new Date().toISOString() })
        );

        setIsLoading(false);
        navigate("/candidate/dashboard");
    };

    if (!user) return null;

    /* ── Style helpers ── */
    const inp = (err) => ({
        width: "100%", padding: "11px 16px", borderRadius: 10, boxSizing: "border-box",
        border: `1.5px solid ${err ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
        background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14,
        outline: "none", fontFamily: "inherit",
    });
    const lbl = { fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase",
        letterSpacing: "0.07em", marginBottom: 6, display: "block" };
    const section = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "28px 32px", marginBottom: 20 };
    const secTitle = { fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 20,
        paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 8, margin: "0 0 20px" };
    const g2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 };

    return (
        <div style={{ minHeight:"100vh", background:"#090d16",
            fontFamily:"'Inter','Segoe UI',sans-serif", padding:"40px 20px 60px", position:"relative" }}>

            {/* BG blobs */}
            <div style={{ position:"fixed", top:-120, left:-120, width:480, height:480,
                background:"rgba(99,102,241,0.07)", borderRadius:"50%", filter:"blur(90px)", pointerEvents:"none" }}/>
            <div style={{ position:"fixed", bottom:-120, right:-120, width:480, height:480,
                background:"rgba(139,92,246,0.07)", borderRadius:"50%", filter:"blur(90px)", pointerEvents:"none" }}/>

            <div style={{ maxWidth:840, margin:"0 auto" }}>

                {/* ── Header ── */}
                <div style={{ textAlign:"center", marginBottom:36 }}>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:16 }}>
                        <div style={{ width:38, height:38, borderRadius:10,
                            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:16, fontWeight:800, color:"#fff" }}>SF</div>
                        <span style={{ fontSize:17, fontWeight:800, color:"#fff" }}>SkillForge</span>
                    </div>
                    <h1 style={{ fontSize:27, fontWeight:800, color:"#fff", margin:"0 0 8px" }}>
                        Complete Your Developer Profile
                    </h1>
                    <p style={{ fontSize:14, color:"#64748b", margin:0 }}>
                        Help teammates and collaborators understand who you are before entering your dashboard.
                    </p>
                </div>

                {/* Progress steps */}
                <div style={{ display:"flex", gap:8, marginBottom:30 }}>
                    {[["👤","Identity"],["⚡","Skills"],["🎯","Interests"],["🌐","Social"]].map(([icon, label]) => (
                        <div key={label} style={{ flex:1, textAlign:"center" }}>
                            <div style={{ height:4, borderRadius:2, marginBottom:6,
                                background:"linear-gradient(90deg,#6366f1,#8b5cf6)" }}/>
                            <span style={{ fontSize:11, color:"#6366f1", fontWeight:700 }}>{icon} {label}</span>
                        </div>
                    ))}
                </div>

                {/* ══ SECTION 1: Identity ══ */}
                <div style={section}>
                    <div style={secTitle}><span>👤</span> Your Identity</div>

                    {/* Photo */}
                    <div style={{ display:"flex", alignItems:"center", gap:24, marginBottom:24 }}>
                        <div onClick={() => fileRef.current?.click()} style={{
                            width:90, height:90, borderRadius:"50%", flexShrink:0, cursor:"pointer",
                            border:"2px dashed rgba(99,102,241,0.5)", overflow:"hidden",
                            background:"rgba(30,36,51,0.8)",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {form.photo
                                ? <img src={form.photo} alt="Preview" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                                : <div style={{ textAlign:"center" }}>
                                    <div style={{ fontSize:26 }}>📷</div>
                                    <div style={{ fontSize:9, color:"#64748b", marginTop:3 }}>Upload</div>
                                  </div>
                            }
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto}/>
                        <div>
                            <div style={{ fontSize:13.5, color:"#cbd5e1", fontWeight:600, marginBottom:4 }}>Profile Photo</div>
                            <div style={{ fontSize:12, color:"#475569", lineHeight:1.6 }}>
                                Upload a clear photo. Helps teammates recognise you.<br/>
                                JPG or PNG, under 2 MB recommended.
                            </div>
                            <button onClick={() => fileRef.current?.click()} style={{
                                marginTop:10, padding:"7px 16px", background:"rgba(99,102,241,0.15)",
                                color:"#818cf8", border:"1px solid rgba(99,102,241,0.3)",
                                borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                                Choose Photo
                            </button>
                        </div>
                    </div>

                    <div style={g2}>
                        {[
                            { key:"name",           label:"Full Name *",           ph:"Your full name",               err:errors.name },
                            { key:"college",        label:"College / University *", ph:"e.g. IIT Bombay",             err:errors.college },
                            { key:"degree",         label:"Degree *",              ph:"e.g. B.Tech Computer Science", err:errors.degree },
                            { key:"graduationYear", label:"Graduation Year *",     ph:"e.g. 2026",                   err:errors.graduationYear },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={lbl}>{f.label}</label>
                                <input style={inp(f.err)} value={form[f.key]} placeholder={f.ph}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}/>
                                {f.err && <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>Required</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══ SECTION 2: Skills ══ */}
                <div style={section}>
                    <div style={{ ...secTitle, justifyContent:"space-between" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:8 }}><span>⚡</span> Your Skills</span>
                        {errors.skills && <span style={{ fontSize:11, color:"#ef4444", fontWeight:400 }}>Add at least one skill</span>}
                    </div>

                    {/* Add row */}
                    <div style={{ display:"flex", gap:12, alignItems:"flex-end", marginBottom:20 }}>
                        <div style={{ flex:1.2 }}>
                            <label style={lbl}>Skill Name</label>
                            <input style={inp(false)} value={newSkillName}
                                placeholder="e.g. React, Java, Python, SQL..."
                                onChange={e => setNewSkillName(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addSkill()}/>
                        </div>
                        <div style={{ flex:1.5 }}>
                            <label style={lbl}>Proficiency — <span style={{ color:"#6366f1" }}>{newSkillLevel}%</span></label>
                            <div style={{ paddingBottom:4 }}>
                                <input type="range" min={10} max={100} step={5} value={newSkillLevel}
                                    style={{ width:"100%", accentColor:"#6366f1", cursor:"pointer", marginTop:6 }}
                                    onChange={e => setNewSkillLevel(Number(e.target.value))}/>
                            </div>
                        </div>
                        <button onClick={addSkill} style={{
                            padding:"11px 22px", background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
                            color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700,
                            cursor:"pointer", flexShrink:0, marginBottom:4 }}>
                            + Add
                        </button>
                    </div>

                    {/* Skills list */}
                    {form.skills.length > 0
                        ? <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                            {form.skills.map((sk, i) => (
                                <div key={sk.name} style={{ display:"flex", alignItems:"center", gap:12 }}>
                                    <div style={{ width:120, fontSize:13.5, fontWeight:600, color:"#e2e8f0",
                                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                        {sk.name}
                                    </div>
                                    <div style={{ flex:1, height:7, background:"rgba(255,255,255,0.08)", borderRadius:99 }}>
                                        <div style={{ height:"100%", width:`${sk.level}%`, borderRadius:99,
                                            background: SKILL_COLORS[i % SKILL_COLORS.length],
                                            transition:"width 0.4s ease" }}/>
                                    </div>
                                    <div style={{ width:38, fontSize:12, fontWeight:700, textAlign:"right",
                                        color: SKILL_COLORS[i % SKILL_COLORS.length] }}>{sk.level}%</div>
                                    <button onClick={() => removeSkill(sk.name)} style={{
                                        background:"none", border:"none", color:"#475569",
                                        cursor:"pointer", fontSize:18, padding:"0 4px", lineHeight:1 }}>×</button>
                                </div>
                            ))}
                          </div>
                        : <div style={{ textAlign:"center", padding:"18px 0", color:"#475569", fontSize:13 }}>
                            No skills added yet. Add your technical skills above.
                          </div>
                    }
                </div>

                {/* ══ SECTION 3: Interests ══ */}
                <div style={section}>
                    <div style={secTitle}><span>🎯</span> Interests & Preferences</div>

                    {/* Interests tags */}
                    <div style={{ marginBottom:22 }}>
                        <label style={lbl}>Interests</label>
                        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                            <input style={{ ...inp(false), flex:1 }} value={newInterest}
                                placeholder="e.g. Machine Learning, Open Source, Web Dev..."
                                onChange={e => setNewInterest(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && addInterest()}/>
                            <button onClick={addInterest} style={{
                                padding:"11px 18px", background:"rgba(99,102,241,0.18)",
                                color:"#818cf8", border:"1px solid rgba(99,102,241,0.3)",
                                borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>Add</button>
                        </div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                            {form.interests.map(int => (
                                <span key={int} style={{
                                    background:"rgba(99,102,241,0.14)", border:"1px solid rgba(99,102,241,0.28)",
                                    color:"#818cf8", padding:"5px 12px", borderRadius:99, fontSize:12.5,
                                    fontWeight:500, display:"flex", alignItems:"center", gap:6 }}>
                                    {int}
                                    <button onClick={() => removeInterest(int)} style={{
                                        background:"none", border:"none", color:"#6366f1",
                                        cursor:"pointer", fontSize:15, padding:0, lineHeight:1 }}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={g2}>
                        <div>
                            <label style={lbl}>Experience Level</label>
                            <select style={{ ...inp(false), cursor:"pointer" }} value={form.experienceLevel}
                                onChange={e => setForm(p => ({ ...p, experienceLevel: e.target.value }))}>
                                {["Beginner","Intermediate","Advanced","Expert"].map(l =>
                                    <option key={l} value={l} style={{ background:"#1e2433" }}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={lbl}>Preferred Project Domain</label>
                            <select style={{ ...inp(false), cursor:"pointer" }} value={form.projectDomain}
                                onChange={e => setForm(p => ({ ...p, projectDomain: e.target.value }))}>
                                <option value="" style={{ background:"#1e2433" }}>Select a domain…</option>
                                {["Web Development","Mobile Apps","AI / Machine Learning","Data Science",
                                  "Cybersecurity","Cloud & DevOps","Blockchain","Game Development",
                                  "IoT / Embedded","Open Source"].map(d =>
                                    <option key={d} value={d} style={{ background:"#1e2433" }}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ══ SECTION 4: Social ══ */}
                <div style={section}>
                    <div style={secTitle}><span>🌐</span> Social & Availability</div>

                    <div style={{ ...g2, marginBottom:22 }}>
                        <div>
                            <label style={lbl}>GitHub Profile URL</label>
                            <input style={inp(false)} value={form.github}
                                placeholder="https://github.com/username"
                                onChange={e => setForm(p => ({ ...p, github: e.target.value }))}/>
                        </div>
                        <div>
                            <label style={lbl}>LinkedIn Profile URL</label>
                            <input style={inp(false)} value={form.linkedin}
                                placeholder="https://linkedin.com/in/username"
                                onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))}/>
                        </div>
                    </div>

                    <div>
                        <label style={lbl}>Availability for Collaboration</label>
                        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                            {["Full-time","Part-time","Weekends Only","Flexible"].map(opt => (
                                <button key={opt} onClick={() => setForm(p => ({ ...p, availability: opt }))} style={{
                                    padding:"9px 20px", borderRadius:99, fontSize:13, fontWeight:600,
                                    cursor:"pointer", transition:"all 0.2s",
                                    background: form.availability === opt
                                        ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.05)",
                                    color: form.availability === opt ? "#fff" : "#64748b",
                                    border: form.availability === opt
                                        ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                                }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Save button ── */}
                <div style={{ textAlign:"center", marginTop:8 }}>
                    {Object.keys(errors).length > 0 && (
                        <div style={{ marginBottom:14, color:"#ef4444", fontSize:13, fontWeight:500 }}>
                            Please fill in all required fields (*) and add at least one skill.
                        </div>
                    )}
                    <button onClick={handleSave} disabled={isLoading} style={{
                        padding:"14px 56px",
                        background: isLoading ? "#374151" : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                        color:"#fff", border:"none", borderRadius:99, fontSize:15, fontWeight:700,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        boxShadow:"0 4px 24px rgba(99,102,241,0.4)", transition:"all 0.2s",
                        letterSpacing:"0.01em",
                    }}>
                        {isLoading ? "Saving Profile…" : "Complete Profile & Enter Dashboard →"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CompleteProfile;
