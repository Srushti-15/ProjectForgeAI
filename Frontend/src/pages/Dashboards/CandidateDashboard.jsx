import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SKILL_COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#3b82f6"];

/* ── Icon helper ── */
const Icon = ({ d, size = 20, stroke = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d={d}/>
    </svg>
);

const icons = {
    dashboard:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
    profile:     "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
    teammates:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    ideas:       "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    projects:    "M3 7h18M3 12h18M3 17h18",
    notif:       "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    settings:    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    logout:      "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
    star:        "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    folder:      "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
    task:        "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
    bell:        "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    edit:        "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    github:      "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
    linkedin:    "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
    save:        "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h8",
};

/* ── Skill bar ── */
const SkillBar = ({ label, pct, color }) => (
    <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{label}</span>
            <span style={{ fontSize:12, fontWeight:700, color }}>{pct}%</span>
        </div>
        <div style={{ height:7, background:"#f1f5f9", borderRadius:99 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99, transition:"width 0.8s ease" }}/>
        </div>
    </div>
);

/* ── Progress ring ── */
const Ring = ({ pct, size=80, stroke=8, color="#6366f1" }) => {
    const r    = (size-stroke)/2;
    const circ = 2*Math.PI*r;
    return (
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke}/>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={circ-(pct/100)*circ} strokeLinecap="round"
                style={{ transition:"stroke-dashoffset 1s ease" }}/>
        </svg>
    );
};

/* ══════════════════════════════════════════════════════════════════
   MY PROFILE SECTION
══════════════════════════════════════════════════════════════════ */
const MyProfileSection = ({ profileData, userEmail, onProfileSaved }) => {
    const fileRef  = useRef();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm]         = useState(profileData || {});
    const [newSkillName,  setNewSkillName]  = useState("");
    const [newSkillLevel, setNewSkillLevel] = useState(80);
    const [newInterest,   setNewInterest]   = useState("");
    const [saveMsg, setSaveMsg]   = useState("");

    useEffect(() => { setForm(profileData || {}); }, [profileData]);

    const handlePhoto = (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setForm(p => ({ ...p, photo: ev.target.result }));
        reader.readAsDataURL(file);
    };

    const addSkill = () => {
        const nm = newSkillName.trim(); if (!nm) return;
        if ((form.skills||[]).some(s => s.name.toLowerCase()===nm.toLowerCase())) return;
        setForm(p => ({ ...p, skills:[...(p.skills||[]),{ name:nm, level:newSkillLevel }] }));
        setNewSkillName(""); setNewSkillLevel(80);
    };

    const addInterest = () => {
        const val = newInterest.trim();
        if (!val || (form.interests||[]).includes(val)) return;
        setForm(p => ({ ...p, interests:[...(p.interests||[]), val] }));
        setNewInterest("");
    };

    const handleSave = async () => {
        const updated = { ...form, email: userEmail, completedAt: profileData?.completedAt || new Date().toISOString() };
        
        try {
            await fetch("/api/profile/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...updated,
                    skills: JSON.stringify(updated.skills || []),
                    interests: JSON.stringify(updated.interests || []),
                }),
            });
        } catch (e) {
            console.warn("Backend save failed, saved locally", e);
        }

        localStorage.setItem(`skillforge_profile_${userEmail}`, JSON.stringify(updated));
        onProfileSaved(updated);
        setEditMode(false);
        setSaveMsg("Profile updated successfully!");
        setTimeout(() => setSaveMsg(""), 3000);
    };

    const inp = { width:"100%", padding:"10px 14px", borderRadius:10, boxSizing:"border-box",
        border:"1.5px solid #e2e8f0", background:"#f8fafc", color:"#1e293b",
        fontSize:13.5, outline:"none", fontFamily:"inherit" };
    const lbl = { fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase",
        letterSpacing:"0.07em", marginBottom:5, display:"block" };
    const g2  = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 };

    const skills  = form.skills  || [];
    const interests = form.interests || [];

    /* ── VIEW MODE ── */
    if (!editMode) return (
        <div>
            {/* Header card */}
            <div style={{ background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
                borderRadius:20, padding:"32px 32px 28px", marginBottom:20,
                display:"flex", alignItems:"center", gap:24, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180,
                    background:"rgba(255,255,255,0.07)", borderRadius:"50%", filter:"blur(20px)" }}/>

                {/* Avatar */}
                <div style={{ width:88, height:88, borderRadius:"50%", flexShrink:0, overflow:"hidden",
                    border:"3px solid rgba(255,255,255,0.4)",
                    background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:30, fontWeight:800, color:"#fff" }}>
                    {form.photo
                        ? <img src={form.photo} alt="Profile" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        : (form.name||"?").charAt(0).toUpperCase()
                    }
                </div>

                <div style={{ flex:1, zIndex:1 }}>
                    <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:4 }}>{form.name || "—"}</div>
                    <div style={{ fontSize:13.5, color:"rgba(255,255,255,0.78)", marginBottom:10 }}>
                        {form.degree || "—"} · {form.college || "—"} · {form.graduationYear || "—"}
                    </div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {[form.experienceLevel, form.projectDomain, form.availability]
                            .filter(Boolean).map(tag => (
                            <span key={tag} style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(4px)",
                                color:"#fff", padding:"4px 12px", borderRadius:99, fontSize:11.5,
                                fontWeight:600, border:"1px solid rgba(255,255,255,0.25)" }}>{tag}</span>
                        ))}
                    </div>
                </div>

                <button onClick={() => setEditMode(true)} style={{
                    display:"flex", alignItems:"center", gap:6, padding:"10px 18px",
                    background:"rgba(255,255,255,0.15)", backdropFilter:"blur(4px)",
                    color:"#fff", border:"1px solid rgba(255,255,255,0.3)",
                    borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", flexShrink:0, zIndex:1 }}>
                    <Icon d={icons.edit} size={15}/> Edit Profile
                </button>
            </div>

            {saveMsg && (
                <div style={{ background:"#d1fae5", border:"1px solid #6ee7b7", color:"#065f46",
                    borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:600,
                    marginBottom:16 }}>{saveMsg}</div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:18 }}>
                {/* Skills */}
                <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
                    border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#1e293b", marginBottom:16 }}>⚡ Skills</div>
                    {skills.length > 0
                        ? <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                            {skills.map((sk,i) => <SkillBar key={sk.name} label={sk.name} pct={sk.level}
                                color={SKILL_COLORS[i%SKILL_COLORS.length]}/>)}
                          </div>
                        : <div style={{ fontSize:13, color:"#94a3b8" }}>No skills added yet.</div>
                    }
                </div>

                {/* Info panel */}
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    {/* Interests */}
                    <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
                        border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b", marginBottom:12 }}>🎯 Interests</div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                            {interests.length > 0
                                ? interests.map(int => (
                                    <span key={int} style={{ background:"#ede9fe", color:"#6366f1",
                                        padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:500 }}>{int}</span>
                                ))
                                : <span style={{ fontSize:12, color:"#94a3b8" }}>None added.</span>
                            }
                        </div>
                    </div>

                    {/* Social links */}
                    <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
                        border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b", marginBottom:12 }}>🌐 Social</div>
                        {[
                            { label:"GitHub",   val:form.github,   icon:icons.github,   color:"#1e293b" },
                            { label:"LinkedIn", val:form.linkedin, icon:icons.linkedin, color:"#0077b5" },
                        ].map(s => (
                            <div key={s.label} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                                <Icon d={s.icon} size={15} stroke={s.color}/>
                                {s.val
                                    ? <a href={s.val} target="_blank" rel="noreferrer"
                                        style={{ fontSize:12.5, color:"#6366f1", textDecoration:"none",
                                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                        {s.val.replace("https://","").replace("http://","")}
                                      </a>
                                    : <span style={{ fontSize:12, color:"#94a3b8" }}>Not added</span>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    /* ── EDIT MODE ── */
    return (
        <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ fontSize:18, fontWeight:800, color:"#1e293b" }}>Edit Profile</div>
                <div style={{ display:"flex", gap:10 }}>
                    <button onClick={() => { setForm(profileData||{}); setEditMode(false); }} style={{
                        padding:"9px 18px", background:"#f1f5f9", color:"#64748b",
                        border:"1px solid #e2e8f0", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                        Cancel
                    </button>
                    <button onClick={handleSave} style={{
                        padding:"9px 18px", background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
                        color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700,
                        cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                        <Icon d={icons.save} size={14}/> Save Changes
                    </button>
                </div>
            </div>

            {/* Photo */}
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
                border:"1px solid #e2e8f0", marginBottom:16 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b", marginBottom:14 }}>Profile Photo</div>
                <div style={{ display:"flex", alignItems:"center", gap:18 }}>
                    <div onClick={() => fileRef.current?.click()} style={{
                        width:72, height:72, borderRadius:"50%", flexShrink:0, cursor:"pointer",
                        border:"2px dashed #c7d2fe", overflow:"hidden",
                        background:"#f0f0ff", display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:22 }}>
                        {form.photo
                            ? <img src={form.photo} alt="Preview" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                            : "📷"}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto}/>
                    <button onClick={() => fileRef.current?.click()} style={{
                        padding:"8px 16px", background:"#ede9fe", color:"#6366f1",
                        border:"1px solid #c4b5fd", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                        Change Photo
                    </button>
                </div>
            </div>

            {/* Basic info */}
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
                border:"1px solid #e2e8f0", marginBottom:16 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b", marginBottom:14 }}>👤 Basic Information</div>
                <div style={{ ...g2, marginBottom:14 }}>
                    {[["name","Full Name","Your full name"],["college","College","e.g. IIT Bombay"],
                      ["degree","Degree","e.g. B.Tech CS"],["graduationYear","Graduation Year","e.g. 2026"]].map(([k,l,ph]) => (
                        <div key={k}>
                            <label style={lbl}>{l}</label>
                            <input style={inp} value={form[k]||""} placeholder={ph}
                                onChange={e => setForm(p => ({ ...p, [k]:e.target.value }))}/>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills */}
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
                border:"1px solid #e2e8f0", marginBottom:16 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b", marginBottom:14 }}>⚡ Skills</div>
                <div style={{ display:"flex", gap:10, alignItems:"flex-end", marginBottom:14 }}>
                    <div style={{ flex:1.2 }}>
                        <label style={lbl}>Skill Name</label>
                        <input style={inp} value={newSkillName} placeholder="e.g. React, Java..."
                            onChange={e => setNewSkillName(e.target.value)}
                            onKeyDown={e => e.key==="Enter" && addSkill()}/>
                    </div>
                    <div style={{ flex:1.5 }}>
                        <label style={lbl}>Level — <span style={{ color:"#6366f1" }}>{newSkillLevel}%</span></label>
                        <input type="range" min={10} max={100} step={5} value={newSkillLevel}
                            style={{ width:"100%", accentColor:"#6366f1", cursor:"pointer", marginTop:6 }}
                            onChange={e => setNewSkillLevel(Number(e.target.value))}/>
                    </div>
                    <button onClick={addSkill} style={{
                        padding:"10px 18px", background:"#ede9fe", color:"#6366f1",
                        border:"1px solid #c4b5fd", borderRadius:10, fontSize:13,
                        fontWeight:700, cursor:"pointer", flexShrink:0, marginBottom:2 }}>+ Add</button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {skills.map((sk,i) => (
                        <div key={sk.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:100, fontSize:13, fontWeight:600, color:"#374151",
                                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{sk.name}</div>
                            <div style={{ flex:1, height:6, background:"#f1f5f9", borderRadius:99 }}>
                                <div style={{ height:"100%", width:`${sk.level}%`,
                                    background:SKILL_COLORS[i%SKILL_COLORS.length], borderRadius:99 }}/>
                            </div>
                            <div style={{ width:34, fontSize:12, fontWeight:700,
                                color:SKILL_COLORS[i%SKILL_COLORS.length] }}>{sk.level}%</div>
                            <button onClick={() => setForm(p=>({...p,skills:p.skills.filter(s=>s.name!==sk.name)}))}
                                style={{ background:"none", border:"none", color:"#94a3b8",
                                    cursor:"pointer", fontSize:17, padding:"0 4px" }}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interests + prefs */}
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
                border:"1px solid #e2e8f0", marginBottom:16 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b", marginBottom:14 }}>🎯 Interests & Preferences</div>
                <div style={{ marginBottom:16 }}>
                    <label style={lbl}>Interests</label>
                    <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                        <input style={{ ...inp, flex:1 }} value={newInterest} placeholder="Add an interest..."
                            onChange={e => setNewInterest(e.target.value)}
                            onKeyDown={e => e.key==="Enter" && addInterest()}/>
                        <button onClick={addInterest} style={{ padding:"10px 14px",
                            background:"#ede9fe", color:"#6366f1", border:"1px solid #c4b5fd",
                            borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>Add</button>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        {interests.map(int => (
                            <span key={int} style={{ background:"#ede9fe", color:"#6366f1",
                                padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:500,
                                display:"flex", alignItems:"center", gap:4 }}>
                                {int}
                                <button onClick={() => setForm(p=>({...p,interests:p.interests.filter(x=>x!==int)}))}
                                    style={{ background:"none", border:"none", color:"#6366f1",
                                        cursor:"pointer", fontSize:14, padding:0 }}>×</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div style={g2}>
                    <div>
                        <label style={lbl}>Experience Level</label>
                        <select style={{ ...inp, cursor:"pointer" }} value={form.experienceLevel||""}
                            onChange={e => setForm(p=>({...p,experienceLevel:e.target.value}))}>
                            {["Beginner","Intermediate","Advanced","Expert"].map(l =>
                                <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={lbl}>Preferred Domain</label>
                        <select style={{ ...inp, cursor:"pointer" }} value={form.projectDomain||""}
                            onChange={e => setForm(p=>({...p,projectDomain:e.target.value}))}>
                            <option value="">Select...</option>
                            {["Web Development","Mobile Apps","AI / Machine Learning","Data Science",
                              "Cybersecurity","Cloud & DevOps","Blockchain","Game Development",
                              "IoT / Embedded","Open Source"].map(d =>
                                <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Social + Availability */}
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
                border:"1px solid #e2e8f0", marginBottom:16 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b", marginBottom:14 }}>🌐 Social & Availability</div>
                <div style={{ ...g2, marginBottom:16 }}>
                    {[["github","GitHub URL","https://github.com/username"],
                      ["linkedin","LinkedIn URL","https://linkedin.com/in/username"]].map(([k,l,ph]) => (
                        <div key={k}>
                            <label style={lbl}>{l}</label>
                            <input style={inp} value={form[k]||""} placeholder={ph}
                                onChange={e => setForm(p=>({...p,[k]:e.target.value}))}/>
                        </div>
                    ))}
                </div>
                <div>
                    <label style={lbl}>Availability</label>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {["Full-time","Part-time","Weekends Only","Flexible"].map(opt => (
                            <button key={opt} onClick={() => setForm(p=>({...p,availability:opt}))} style={{
                                padding:"8px 16px", borderRadius:99, fontSize:12.5, fontWeight:600,
                                cursor:"pointer", transition:"all 0.2s",
                                background: form.availability===opt ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#f8fafc",
                                color: form.availability===opt ? "#fff" : "#64748b",
                                border: form.availability===opt ? "1px solid transparent" : "1px solid #e2e8f0",
                            }}>{opt}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════
   CANDIDATE DASHBOARD
══════════════════════════════════════════════════════════════════ */
const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser]             = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [activeNav, setActiveNav]   = useState("Dashboard");
    const [notifOpen, setNotifOpen]   = useState(false);

    /* ── Auth guard + profile loading from database ── */
    useEffect(() => {
        const raw = localStorage.getItem("current_user");
        if (!raw) { navigate("/"); return; }
        const parsed = JSON.parse(raw);
        if (parsed.role !== "candidate") { navigate(`/${parsed.role}/dashboard`); return; }
        setUser(parsed);

        // 1. Initial fast load from local cache if present
        const stored = localStorage.getItem(`skillforge_profile_${parsed.email}`);
        if (stored) {
            try { setProfileData(JSON.parse(stored)); } catch (e) {}
        }

        // 2. Fetch fresh from backend database
        fetch(`/api/profile/me?email=${encodeURIComponent(parsed.email)}`)
            .then(res => {
                if (res.ok) return res.json();
                return null;
            })
            .then(data => {
                if (data) {
                    const parsedProfile = {
                        ...data,
                        skills: typeof data.skills === "string" ? JSON.parse(data.skills || "[]") : (data.skills || []),
                        interests: typeof data.interests === "string" ? JSON.parse(data.interests || "[]") : (data.interests || []),
                    };
                    setProfileData(parsedProfile);
                    localStorage.setItem(`skillforge_profile_${parsed.email}`, JSON.stringify(parsedProfile));
                }
            })
            .catch(err => {
                console.warn("Could not fetch profile from backend", err);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("current_user");
        localStorage.removeItem("auth_token");
        navigate("/");
    };

    if (!user) return null;

    /* ── Derived values ── */
    const initials  = (user.fullName||"U").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    const firstName = (user.fullName||"Student").split(" ")[0];
    const hour      = new Date().getHours();
    const greeting  = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

    /* ── Dynamic skills from profile (fallback to demo) ── */
    const profileSkills = profileData?.skills?.length
        ? profileData.skills
        : [
            { name:"React / Frontend", level:82 },
            { name:"Node.js / Backend", level:67 },
            { name:"UI / UX Design",    level:54 },
            { name:"Data Structures",   level:75 },
          ];

    const avgSkill = profileSkills.length
        ? Math.round(profileSkills.reduce((s,sk)=>s+sk.level,0)/profileSkills.length)
        : 0;

    /* ── Static sample data ── */
    const projects = [
        { name:"AI Resume Builder",  progress:72, due:"Sep 10", status:"On Track",   color:"#6366f1" },
        { name:"Campus Event App",   progress:45, due:"Sep 28", status:"In Progress", color:"#8b5cf6" },
        { name:"Study Buddy Finder", progress:90, due:"Aug 31", status:"Review",      color:"#10b981" },
    ];
    const tasks = [
        { text:"Submit project proposal",    done:false, due:"Today"  },
        { text:"Review teammate PR",         done:true,  due:"Done"   },
        { text:"Update profile skills",      done:false, due:"Aug 28" },
        { text:"Respond to team invitation", done:false, due:"Aug 27" },
    ];
    const invitations = [
        { team:"TechBuilders", project:"Smart Campus App",    role:"Frontend Dev"  },
        { team:"DataForge",    project:"Analytics Dashboard", role:"Fullstack Dev" },
    ];
    const notifications = [
        { text:"TechBuilders sent you a team invite",   time:"2m ago", unread:true  },
        { text:"Your project proposal was approved",    time:"1h ago", unread:true  },
        { text:"New teammate match: Priya S.",          time:"3h ago", unread:false },
        { text:"Task 'Update profile' is due tomorrow", time:"5h ago", unread:false },
    ];
    const unreadCount = notifications.filter(n=>n.unread).length;

    /* ── Nav items ── */
    const navItems = [
        { label:"Dashboard",      icon:icons.dashboard  },
        { label:"My Profile",     icon:icons.profile    },
        { label:"Find Teammates", icon:icons.teammates  },
        { label:"Project Ideas",  icon:icons.ideas      },
        { label:"My Projects",    icon:icons.projects   },
        { label:"Notifications",  icon:icons.notif      },
        { label:"Settings",       icon:icons.settings   },
    ];

    /* ── Styles ── */
    const S = {
        root:    { display:"flex", minHeight:"100vh", fontFamily:"'Inter','Segoe UI',sans-serif",
                    background:"#f8fafc", color:"#1e293b" },
        sidebar: { width:230, minWidth:230, background:"#1e2433", display:"flex",
                    flexDirection:"column", padding:"0 0 24px", position:"sticky", top:0,
                    height:"100vh", overflowY:"auto" },
        brand:   { display:"flex", alignItems:"center", gap:10, padding:"24px 20px 20px",
                    borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:8 },
        brandDot:{ width:34, height:34, borderRadius:10,
                    background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15, fontWeight:800, color:"#fff" },
        navLabel:{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:"0.08em",
                    textTransform:"uppercase", padding:"16px 20px 6px" },
        navItem: (active) => ({
            display:"flex", alignItems:"center", gap:11, padding:"9px 20px",
            borderRadius:8, margin:"1px 10px", cursor:"pointer", fontSize:13.5, fontWeight:500,
            color: active?"#fff":"#94a3b8",
            background: active?"linear-gradient(90deg,#6366f1,#8b5cf6)":"transparent",
            transition:"all 0.18s ease", position:"relative",
        }),
        sidebarUser: { marginTop:"auto", padding:"16px 16px 0",
                        borderTop:"1px solid rgba(255,255,255,0.06)" },
        userCard: { display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                    borderRadius:10, background:"rgba(255,255,255,0.05)", cursor:"pointer" },
        avatar:  (size,fs) => ({
            width:size, height:size, borderRadius:"50%",
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)", overflow:"hidden",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:fs, fontWeight:700, color:"#fff", flexShrink:0
        }),
        main:    { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
        topbar:  { display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"16px 28px", background:"#fff", borderBottom:"1px solid #e2e8f0",
                    position:"sticky", top:0, zIndex:20 },
        notifBtn:{ position:"relative", background:"none", border:"none", cursor:"pointer",
                    color:"#64748b", display:"flex", alignItems:"center", padding:6,
                    borderRadius:8, transition:"background 0.15s" },
        notifBadge:{ position:"absolute", top:3, right:3, width:16, height:16,
                    background:"#ef4444", borderRadius:"50%", fontSize:9, fontWeight:700,
                    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" },
        userChip:{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px",
                    borderRadius:24, border:"1px solid #e2e8f0", cursor:"pointer",
                    background:"#f8fafc" },
        content: { padding:"28px 28px 40px", flex:1, overflowY:"auto" },
        hero:    { background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 60%,#a855f7 100%)",
                    borderRadius:18, padding:"28px 32px", marginBottom:24,
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    position:"relative", overflow:"hidden" },
        heroIcon:{ width:72, height:72, borderRadius:18, background:"rgba(255,255,255,0.15)",
                    backdropFilter:"blur(8px)", display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0, border:"1px solid rgba(255,255,255,0.2)" },
        heroBtn: (primary) => ({
            padding:"9px 20px", borderRadius:24, fontSize:13, fontWeight:600, cursor:"pointer",
            background: primary?"#fff":"rgba(255,255,255,0.15)",
            color: primary?"#6366f1":"#fff",
            border: primary?"none":"1px solid rgba(255,255,255,0.3)",
        }),
        grid3:  { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18, marginBottom:24 },
        grid2:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:24 },
        gridL:  { display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:18, marginBottom:24 },
        card:   (p=24) => ({ background:"#fff", borderRadius:16, padding:p,
                    border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }),
        statCard:{ background:"#fff", borderRadius:16, padding:"20px 22px", border:"1px solid #e2e8f0",
                    boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
                    display:"flex", alignItems:"center", justifyContent:"space-between" },
        statIcon:(bg) => ({ width:44, height:44, borderRadius:12, background:bg,
                    display:"flex", alignItems:"center", justifyContent:"center" }),
        secHead: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 },
        secTitle:{ fontSize:15, fontWeight:700, color:"#1e293b" },
        seeAll:  { fontSize:12, fontWeight:600, color:"#6366f1", cursor:"pointer",
                    background:"none", border:"none", padding:0 },
        badge:   (color,bg) => ({ fontSize:11, fontWeight:700, color, background:bg,
                    padding:"3px 10px", borderRadius:99 }),
        taskRow: { display:"flex", alignItems:"center", gap:10, padding:"8px 0",
                    borderBottom:"1px solid #f1f5f9" },
        invCard: { background:"#f8fafc", borderRadius:12, padding:"14px 16px",
                    border:"1px solid #e2e8f0", marginBottom:10 },
    };

    /* ── Notification dropdown ── */
    const NotifDropdown = () => (
        <div style={{ position:"absolute", top:46, right:0, width:310, background:"#fff",
            borderRadius:14, border:"1px solid #e2e8f0",
            boxShadow:"0 8px 32px rgba(0,0,0,0.12)", zIndex:100, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px 10px", borderBottom:"1px solid #f1f5f9",
                fontWeight:700, fontSize:13, color:"#1e293b" }}>Notifications</div>
            {notifications.map((n,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10,
                    padding:"11px 18px", background:n.unread?"#f8f7ff":"#fff",
                    borderBottom:"1px solid #f8fafc", cursor:"pointer" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", marginTop:4, flexShrink:0,
                        background:n.unread?"#6366f1":"transparent" }}/>
                    <div>
                        <div style={{ fontSize:12.5, color:"#374151", lineHeight:1.4 }}>{n.text}</div>
                        <div style={{ fontSize:11, color:"#9ca3af", marginTop:3 }}>{n.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );

    /* ── Photo in sidebar ── */
    const sidebarPhoto = profileData?.photo;

    return (
        <div style={S.root} onClick={() => notifOpen && setNotifOpen(false)}>

            {/* ══ SIDEBAR ══ */}
            <aside style={S.sidebar}>
                <div style={S.brand}>
                    <div style={S.brandDot}>SF</div>
                    <div>
                        <div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>SkillForge</div>
                        <div style={{ fontSize:10, color:"#94a3b8", marginTop:1 }}>AI Platform</div>
                    </div>
                </div>

                <div style={S.navLabel}>Overview</div>
                {navItems.slice(0,1).map(item => (
                    <div key={item.label} style={S.navItem(activeNav===item.label)}
                        onClick={() => setActiveNav(item.label)}>
                        <Icon d={item.icon} size={17}/>
                        {item.label}
                        {activeNav===item.label && (
                            <div style={{ position:"absolute", right:0, top:"20%", height:"60%",
                                width:3, background:"#fff", borderRadius:"2px 0 0 2px" }}/>
                        )}
                    </div>
                ))}

                <div style={S.navLabel}>Collaborate</div>
                {navItems.slice(1,3).map(item => (
                    <div key={item.label} style={S.navItem(activeNav===item.label)}
                        onClick={() => setActiveNav(item.label)}>
                        <Icon d={item.icon} size={17}/>{item.label}
                    </div>
                ))}

                <div style={S.navLabel}>Projects</div>
                {navItems.slice(3,5).map(item => (
                    <div key={item.label} style={S.navItem(activeNav===item.label)}
                        onClick={() => setActiveNav(item.label)}>
                        <Icon d={item.icon} size={17}/>{item.label}
                    </div>
                ))}

                <div style={{ flex:1 }}/>

                {navItems.slice(5).map(item => (
                    <div key={item.label} style={S.navItem(activeNav===item.label)}
                        onClick={() => setActiveNav(item.label)}>
                        <Icon d={item.icon} size={17}/>{item.label}
                        {item.label==="Notifications" && unreadCount>0 && (
                            <span style={{ marginLeft:"auto", background:"#ef4444", color:"#fff",
                                fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:99 }}>
                                {unreadCount}
                            </span>
                        )}
                    </div>
                ))}

                {/* User card */}
                <div style={S.sidebarUser}>
                    <div style={S.userCard}>
                        <div style={{ ...S.avatar(32,13), overflow:"hidden" }}>
                            {sidebarPhoto
                                ? <img src={sidebarPhoto} alt="User"
                                    style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                                : initials
                            }
                        </div>
                        <div style={{ flex:1, overflow:"hidden" }}>
                            <div style={{ fontSize:12.5, fontWeight:700, color:"#e2e8f0",
                                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                {user.fullName}
                            </div>
                            <div style={{ fontSize:10.5, color:"#64748b" }}>
                                {user.college||"Student"}
                            </div>
                        </div>
                        <button onClick={handleLogout} title="Logout"
                            style={{ background:"none", border:"none", cursor:"pointer",
                                color:"#64748b", display:"flex", padding:4, borderRadius:6 }}>
                            <Icon d={icons.logout} size={15}/>
                        </button>
                    </div>
                </div>
            </aside>

            {/* ══ MAIN ══ */}
            <div style={S.main}>
                {/* Top bar */}
                <header style={S.topbar}>
                    <div>
                        <span style={{ fontSize:13, color:"#94a3b8" }}>
                            {greeting}, <span style={{ fontWeight:700, color:"#1e293b" }}>{firstName}</span> 👋
                        </span>
                        <div style={{ fontSize:11.5, color:"#cbd5e1", marginTop:1 }}>
                            {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
                        </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                        <div style={{ position:"relative" }} onClick={e=>e.stopPropagation()}>
                            <button style={S.notifBtn} onClick={() => setNotifOpen(v=>!v)}>
                                <Icon d={icons.bell} size={19}/>
                                {unreadCount>0 && <span style={S.notifBadge}>{unreadCount}</span>}
                            </button>
                            {notifOpen && <NotifDropdown/>}
                        </div>
                        <div style={S.userChip}>
                            <div style={{ ...S.avatar(28,11), overflow:"hidden" }}>
                                {sidebarPhoto
                                    ? <img src={sidebarPhoto} alt="User"
                                        style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                                    : initials
                                }
                            </div>
                            <div>
                                <div style={{ fontSize:12.5, fontWeight:700, color:"#1e293b" }}>{user.fullName}</div>
                                <div style={{ fontSize:10.5, color:"#64748b" }}>{user.course||"Candidate"}</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── CONTENT ── */}
                <div style={S.content}>

                    {/* ══ MY PROFILE VIEW ══ */}
                    {activeNav==="My Profile" && (
                        <MyProfileSection
                            profileData={profileData}
                            userEmail={user.email}
                            onProfileSaved={(updated) => setProfileData(updated)}
                        />
                    )}

                    {/* ══ DASHBOARD VIEW ══ */}
                    {activeNav==="Dashboard" && (<>

                        {/* Hero */}
                        <div style={S.hero}>
                            <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180,
                                background:"rgba(255,255,255,0.08)", borderRadius:"50%", filter:"blur(30px)" }}/>
                            <div style={{ position:"relative", zIndex:1 }}>
                                <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginBottom:6 }}>
                                    {greeting} 👋
                                </div>
                                <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:8 }}>
                                    Welcome back, {firstName}!
                                </div>
                                <div style={{ fontSize:13.5, color:"rgba(255,255,255,0.8)", marginBottom:18, maxWidth:400 }}>
                                    You have <strong style={{ color:"#fff" }}>3 tasks due this week</strong> and&nbsp;
                                    <strong style={{ color:"#fff" }}>2 new team invitations</strong> waiting.
                                </div>
                                <div style={{ display:"flex", gap:10 }}>
                                    <button style={S.heroBtn(true)}>View Tasks</button>
                                    <button style={S.heroBtn(false)}>Find Teammates</button>
                                </div>
                            </div>
                            <div style={S.heroIcon}>
                                <svg width={36} height={36} viewBox="0 0 24 24" fill="none"
                                    stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                        </div>

                        {/* Stat cards */}
                        <div style={S.grid3}>
                            {[
                                { label:"Active Projects", val:"3",       sub:"+1 this month", icon:icons.folder, bg:"#ede9fe", ic:"#6366f1" },
                                { label:"Pending Tasks",   val:"5",       sub:"2 due today",   icon:icons.task,   bg:"#fef3c7", ic:"#f59e0b" },
                                { label:"Skill Score",     val:`${avgSkill}%`, sub:"+4 this week",  icon:icons.star,   bg:"#d1fae5", ic:"#10b981" },
                            ].map(s => (
                                <div key={s.label} style={S.statCard}>
                                    <div>
                                        <div style={{ fontSize:12, color:"#64748b", fontWeight:600, marginBottom:6 }}>{s.label}</div>
                                        <div style={{ fontSize:28, fontWeight:800, color:"#1e293b", lineHeight:1 }}>{s.val}</div>
                                        <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:4 }}>{s.sub}</div>
                                    </div>
                                    <div style={S.statIcon(s.bg)}>
                                        <Icon d={s.icon} size={20} stroke={s.ic}/>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Skills + Tasks */}
                        <div style={S.gridL}>
                            <div style={S.card(24)}>
                                <div style={S.secHead}>
                                    <span style={S.secTitle}>My Skills</span>
                                    <button style={S.seeAll} onClick={() => setActiveNav("My Profile")}>
                                        Edit Skills
                                    </button>
                                </div>
                                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                                    {profileSkills.map((sk,i) => (
                                        <SkillBar key={sk.name} label={sk.name} pct={sk.level}
                                            color={SKILL_COLORS[i%SKILL_COLORS.length]}/>
                                    ))}
                                </div>
                            </div>

                            <div style={S.card(24)}>
                                <div style={S.secHead}>
                                    <span style={S.secTitle}>Pending Tasks</span>
                                    <button style={S.seeAll}>See all</button>
                                </div>
                                {tasks.map((t,i) => (
                                    <div key={i} style={S.taskRow}>
                                        <div style={{ width:18, height:18, borderRadius:5, flexShrink:0,
                                            border:t.done?"none":"2px solid #cbd5e1",
                                            background:t.done?"#10b981":"transparent",
                                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                                            {t.done && <svg width={10} height={10} viewBox="0 0 12 12" fill="none"
                                                stroke="#fff" strokeWidth={2}><path d="M2 6l3 3 5-5"/></svg>}
                                        </div>
                                        <span style={{ flex:1, fontSize:12.5, color:t.done?"#9ca3af":"#374151",
                                            textDecoration:t.done?"line-through":"none" }}>{t.text}</span>
                                        <span style={{ fontSize:11, fontWeight:t.due==="Today"?700:400,
                                            color:t.due==="Today"?"#ef4444":"#94a3b8" }}>{t.due}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects + Invitations */}
                        <div style={S.grid2}>
                            <div style={S.card(24)}>
                                <div style={S.secHead}>
                                    <span style={S.secTitle}>Active Projects</span>
                                    <button style={S.seeAll}>View all</button>
                                </div>
                                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                                    {projects.map(p => (
                                        <div key={p.name} style={{ display:"flex", alignItems:"center", gap:14 }}>
                                            <Ring pct={p.progress} size={54} stroke={6} color={p.color}/>
                                            <div style={{ flex:1 }}>
                                                <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b" }}>{p.name}</div>
                                                <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:2 }}>Due {p.due}</div>
                                            </div>
                                            <span style={S.badge(
                                                p.status==="On Track"?"#10b981":p.status==="Review"?"#6366f1":"#f59e0b",
                                                p.status==="On Track"?"#d1fae5":p.status==="Review"?"#ede9fe":"#fef3c7"
                                            )}>{p.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={S.card(24)}>
                                <div style={S.secHead}>
                                    <span style={S.secTitle}>Team Invitations</span>
                                    <span style={{ fontSize:11.5, fontWeight:700, color:"#fff",
                                        background:"#6366f1", padding:"2px 8px", borderRadius:99 }}>
                                        {invitations.length} New
                                    </span>
                                </div>
                                {invitations.map((inv,i) => (
                                    <div key={i} style={S.invCard}>
                                        <div style={{ marginBottom:8 }}>
                                            <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b" }}>{inv.team}</div>
                                            <div style={{ fontSize:11.5, color:"#64748b", marginTop:2 }}>
                                                {inv.project} · <span style={{ color:"#6366f1" }}>{inv.role}</span>
                                            </div>
                                        </div>
                                        <div style={{ display:"flex", gap:8 }}>
                                            <button style={{ flex:1, padding:"7px 0", background:"#6366f1",
                                                color:"#fff", border:"none", borderRadius:8, fontSize:12,
                                                fontWeight:600, cursor:"pointer" }}>Accept</button>
                                            <button style={{ flex:1, padding:"7px 0", background:"#f1f5f9",
                                                color:"#64748b", border:"none", borderRadius:8, fontSize:12,
                                                fontWeight:600, cursor:"pointer" }}>Decline</button>
                                        </div>
                                    </div>
                                ))}

                                {/* Profile summary */}
                                {profileData && (
                                    <div style={{ marginTop:14, padding:"14px 16px", background:"#f8fafc",
                                        borderRadius:12, border:"1px solid #e2e8f0" }}>
                                        <div style={{ fontSize:11, fontWeight:700, color:"#64748b",
                                            textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>
                                            Your Profile
                                        </div>
                                        {[
                                            { label:"College",   val:profileData.college||"—" },
                                            { label:"Degree",    val:profileData.degree ||"—" },
                                            { label:"Grad Year", val:profileData.graduationYear||"—" },
                                            { label:"Domain",    val:profileData.projectDomain||"—" },
                                        ].map(row => (
                                            <div key={row.label} style={{ display:"flex",
                                                justifyContent:"space-between", padding:"5px 0",
                                                borderBottom:"1px solid #f1f5f9" }}>
                                                <span style={{ fontSize:12, color:"#94a3b8" }}>{row.label}</span>
                                                <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </>)}

                    {/* Placeholder for other nav sections */}
                    {!["Dashboard","My Profile"].includes(activeNav) && (
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                            justifyContent:"center", minHeight:340, color:"#94a3b8" }}>
                            <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
                            <div style={{ fontSize:18, fontWeight:700, color:"#374151", marginBottom:8 }}>
                                {activeNav}
                            </div>
                            <div style={{ fontSize:14, color:"#94a3b8" }}>
                                This section is coming soon.
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
