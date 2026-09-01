import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MyProjectsSection, KanbanBoardSection, MilestonesSection } from "../../components/Projects/ProjectSections";

const SKILL_COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#3b82f6"];

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
    teamMembers: "M12 5a3 3 0 100 6 3 3 0 000-6z M17 21v-1a5 5 0 00-10 0v1 M22 11a2 2 0 11-4 0 2 2 0 014 0 M20 14v-1a3 3 0 00-3-3h-.5 M2 11a2 2 0 114 0 2 2 0 01-4 0 M4 14v-1a3 3 0 013-3h.5",
    teamChat:    "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    ideas:       "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    projects:    "M3 7h18M3 12h18M3 17h18",
    kanban:      "M4 4h4v16H4V4zm6 0h4v10h-4V4zm6 0h4v16h-4V4z",
    milestones:  "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
    plus:        "M12 5v14M5 12h14",
    check:       "M20 6L9 17l-5-5",
    clock:       "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    zap:         "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    eye:         "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
    calendar:    "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18",
    users:       "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    filter:      "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
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
    send:        "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
    search:      "M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35",
};

const avatarColors = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#3b82f6","#0ea5e9","#14b8a6"];
const getAvatarColor = (str) => avatarColors[(str||"A").charCodeAt(0) % avatarColors.length];

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
        } catch (e) { console.warn("Backend save failed, saved locally", e); }
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

    const skills    = form.skills    || [];
    const interests = form.interests || [];

    if (!editMode) return (
        <div>
            <div style={{ background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
                borderRadius:20, padding:"32px 32px 28px", marginBottom:20,
                display:"flex", alignItems:"center", gap:24, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180,
                    background:"rgba(255,255,255,0.07)", borderRadius:"50%", filter:"blur(20px)" }}/>
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
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
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
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", border:"1px solid #e2e8f0", marginBottom:16 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b", marginBottom:14 }}>Profile Photo</div>
                <div style={{ display:"flex", alignItems:"center", gap:18 }}>
                    <div onClick={() => fileRef.current?.click()} style={{
                        width:72, height:72, borderRadius:"50%", flexShrink:0, cursor:"pointer",
                        border:"2px dashed #c7d2fe", overflow:"hidden",
                        background:"#f0f0ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
                        {form.photo ? <img src={form.photo} alt="Preview" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : "📷"}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto}/>
                    <button onClick={() => fileRef.current?.click()} style={{
                        padding:"8px 16px", background:"#ede9fe", color:"#6366f1",
                        border:"1px solid #c4b5fd", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                        Change Photo
                    </button>
                </div>
            </div>
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", border:"1px solid #e2e8f0", marginBottom:16 }}>
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
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", border:"1px solid #e2e8f0", marginBottom:16 }}>
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
                                    cursor:"pointer", fontSize:17, padding:"0 4px" }}>x</button>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", border:"1px solid #e2e8f0", marginBottom:16 }}>
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
                                        cursor:"pointer", fontSize:14, padding:0 }}>x</button>
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
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", border:"1px solid #e2e8f0", marginBottom:16 }}>
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

/* MATCH SCORE CALCULATOR */
const computeMatchScore = (myProfile, other) => {
    if (!myProfile) return Math.floor(60 + Math.random() * 30);
    let score = 0, total = 0;
    const mySkillNames  = (myProfile.skills  || []).map(s => (s.name||"").toLowerCase());
    const itsSkillNames = (other.skills || []).map(s => (s.name||"").toLowerCase());
    if (mySkillNames.length && itsSkillNames.length) {
        const overlap = mySkillNames.filter(s => itsSkillNames.includes(s)).length;
        const union   = new Set([...mySkillNames, ...itsSkillNames]).size;
        score += (overlap / Math.max(union,1)) * 50; total += 50;
    } else { total += 50; score += 20; }
    const myInt  = (myProfile.interests || []).map(s => (s||"").toLowerCase());
    const itsInt = (other.interests || []).map(s => (s||"").toLowerCase());
    if (myInt.length && itsInt.length) {
        const overlap = myInt.filter(i => itsInt.includes(i)).length;
        const union   = new Set([...myInt, ...itsInt]).size;
        score += (overlap / Math.max(union,1)) * 30; total += 30;
    } else { total += 30; score += 12; }
    if (myProfile.projectDomain && other.projectDomain) {
        if (myProfile.projectDomain === other.projectDomain) score += 20;
        total += 20;
    } else { total += 20; score += 10; }
    const pct = Math.round((score / Math.max(total,1)) * 100);
    return Math.min(99, Math.max(30, pct));
};



/* FIND TEAMMATES SECTION */
const FindTeammatesSection = ({ profileData, currentUserEmail, onNavigateToChat, teamMembers }) => {
    const [candidates, setCandidates] = useState([]);
    const [filtered,   setFiltered]   = useState([]);
    const [search,     setSearch]     = useState("");
    const [activeSkillFilter, setActiveSkillFilter] = useState(null);
    const [invitedSet, setInvitedSet] = useState(new Set());
    const [viewProfile, setViewProfile] = useState(null);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        // Load all candidate profiles from backend
        fetch("/api/profile/all")
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const parsed = data.filter(p => p.email !== currentUserEmail).map(p => ({
                    ...p,
                    skills:    typeof p.skills    === "string" ? JSON.parse(p.skills    || "[]") : (p.skills    || []),
                    interests: typeof p.interests === "string" ? JSON.parse(p.interests || "[]") : (p.interests || []),
                    matchScore: computeMatchScore(profileData, {
                        skills:    typeof p.skills    === "string" ? JSON.parse(p.skills    || "[]") : (p.skills    || []),
                        interests: typeof p.interests === "string" ? JSON.parse(p.interests || "[]") : (p.interests || []),
                        projectDomain: p.projectDomain,
                    }),
                })).sort((a,b) => b.matchScore - a.matchScore);
                setCandidates(parsed); setFiltered(parsed); setLoading(false);
            })
            .catch(() => {
                setCandidates([]); setFiltered([]); setLoading(false);
            });
        // Load already-sent invites from backend to pre-populate invitedSet
        fetch(`/api/team/invites/sent?email=${encodeURIComponent(currentUserEmail)}`)
            .then(r => r.ok ? r.json() : [])
            .then(sent => {
                // sent = [{toEmail, status}] — mark as invited if pending or accepted
                const emails = (sent || []).map(s => s.toEmail);
                setInvitedSet(new Set(emails));
            })
            .catch(() => {});
    }, [currentUserEmail, profileData]);

    useEffect(() => {
        let list = candidates;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(c =>
                (c.name||"").toLowerCase().includes(q) ||
                (c.college||"").toLowerCase().includes(q) ||
                (c.skills||[]).some(s => s.name.toLowerCase().includes(q))
            );
        }
        if (activeSkillFilter) {
            list = list.filter(c => (c.skills||[]).some(s => s.name.toLowerCase() === activeSkillFilter.toLowerCase()));
        }
        setFiltered(list);
    }, [search, activeSkillFilter, candidates]);

    const sendInvite = (candidate) => {
        if (!profileData) { alert("Please complete your profile before sending invitations."); return; }
        // Optimistically update UI immediately
        setInvitedSet(prev => new Set([...prev, candidate.email]));
        // Persist to backend
        fetch("/api/team/invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fromEmail:        currentUserEmail,
                toEmail:          candidate.email,
                fromName:         profileData.name         || currentUserEmail,
                fromPhoto:        profileData.photo        || null,
                fromCollege:      profileData.college      || "",
                fromDegree:       profileData.degree       || "",
                fromDomain:       profileData.projectDomain || "",
                fromAvailability: profileData.availability || "",
                fromSkills:       JSON.stringify(profileData.skills || []),
            }),
        }).catch(() => {
            // Rollback on failure
            setInvitedSet(prev => { const n = new Set(prev); n.delete(candidate.email); return n; });
        });
    };

    const allSkills = [...new Set(candidates.flatMap(c => (c.skills||[]).map(s => s.name)))].slice(0, 8);
    const matchColor = (pct) => pct >= 85 ? "#10b981" : pct >= 70 ? "#6366f1" : "#f59e0b";
    const matchBg    = (pct) => pct >= 85 ? "#d1fae5" : pct >= 70 ? "#ede9fe" : "#fef3c7";
    const teamMemberEmails = new Set((teamMembers||[]).map(m => m.email));

    return (
        <div>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
                <div>
                    <div style={{ fontSize:22, fontWeight:800, color:"#1e293b", marginBottom:4 }}>Find Teammates</div>
                    <div style={{ fontSize:13.5, color:"#64748b" }}>AI-matched collaborators based on your skills and project needs</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, background:"#ede9fe",
                    padding:"7px 14px", borderRadius:99, fontSize:12, fontWeight:600, color:"#6366f1" }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#6366f1" }}/>
                    AI matching active
                </div>
            </div>

            <div style={{ background:"#fff", borderRadius:16, padding:"18px 20px",
                border:"1px solid #e2e8f0", marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, background:"#f8fafc",
                    border:"1.5px solid #e2e8f0", borderRadius:10, padding:"8px 14px", marginBottom:14 }}>
                    <Icon d={icons.search} size={16} stroke="#94a3b8"/>
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or skill..."
                        style={{ flex:1, border:"none", background:"transparent", outline:"none",
                            fontSize:13.5, color:"#1e293b", fontFamily:"inherit" }}/>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {allSkills.map(sk => (
                        <button key={sk} onClick={() => setActiveSkillFilter(activeSkillFilter===sk ? null : sk)}
                            style={{ padding:"5px 14px", borderRadius:99, fontSize:12, fontWeight:600,
                                cursor:"pointer", transition:"all 0.18s",
                                background: activeSkillFilter===sk ? "#6366f1" : "#f1f5f9",
                                color: activeSkillFilter===sk ? "#fff" : "#475569",
                                border: activeSkillFilter===sk ? "1px solid #6366f1" : "1px solid #e2e8f0" }}>
                            {sk}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <div style={{ textAlign:"center", padding:"40px 0", color:"#94a3b8", fontSize:14 }}>Loading matches...</div>}

            {!loading && filtered.length === 0 && (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                    justifyContent:"center", minHeight:260, background:"#fff",
                    borderRadius:16, border:"1px solid #e2e8f0", padding:40 }}>
                    <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
                    <div style={{ fontSize:16, fontWeight:700, color:"#374151", marginBottom:8 }}>No candidates found</div>
                    <div style={{ fontSize:13.5, color:"#94a3b8", textAlign:"center", maxWidth:320 }}>
                        {candidates.length === 0
                            ? "No other candidates have completed their profiles yet. Check back soon!"
                            : "No candidates match your current search or filter."}
                    </div>
                </div>
            )}

            {!loading && filtered.length > 0 && (
                <>
                    <div style={{ fontSize:12.5, color:"#64748b", marginBottom:14, fontWeight:500 }}>
                        {filtered.length} teammate{filtered.length !== 1 ? "s" : ""} found
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
                        {filtered.map(c => {
                            const isTeammate = teamMemberEmails.has(c.email);
                            const isInvited  = invitedSet.has(c.email);
                            const mc = matchColor(c.matchScore);
                            const mb = matchBg(c.matchScore);
                            return (
                                <div key={c.email} style={{ background:"#fff", borderRadius:16,
                                    padding:"20px 20px 16px", border:"1px solid #e2e8f0",
                                    boxShadow:"0 1px 4px rgba(0,0,0,0.04)", transition:"box-shadow 0.2s, transform 0.2s" }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow="0 6px 24px rgba(99,102,241,0.13)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform="none"; }}>
                                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                            <div style={{ width:46, height:46, borderRadius:"50%", flexShrink:0,
                                                background: c.photo ? "transparent" : getAvatarColor(c.name),
                                                display:"flex", alignItems:"center", justifyContent:"center",
                                                fontSize:16, fontWeight:800, color:"#fff", overflow:"hidden" }}>
                                                {c.photo ? <img src={c.photo} alt={c.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (c.name||"?").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>{c.name || "Candidate"}</div>
                                                <div style={{ fontSize:11.5, color:"#64748b" }}>{[c.college, c.experienceLevel].filter(Boolean).join(" · ") || "—"}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign:"right", flexShrink:0 }}>
                                            <div style={{ fontSize:18, fontWeight:800, color:mc }}>{c.matchScore}%</div>
                                            <div style={{ fontSize:10, color:"#94a3b8", fontWeight:500 }}>match</div>
                                        </div>
                                    </div>
                                    <div style={{ height:3, background:"#f1f5f9", borderRadius:99, marginBottom:12 }}>
                                        <div style={{ height:"100%", width:`${c.matchScore}%`, background:mc, borderRadius:99, transition:"width 0.8s ease" }}/>
                                    </div>
                                    <div style={{ fontSize:12.5, color:"#475569", lineHeight:1.55, marginBottom:12, minHeight:36 }}>
                                        {c.projectDomain ? `${c.experienceLevel || "Developer"} focused on ${c.projectDomain}.` : "Passionate developer looking for collaborative projects."}
                                    </div>
                                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                                        {(c.skills||[]).slice(0,4).map(sk => (
                                            <span key={sk.name} style={{ background:"#f1f5f9", color:"#475569",
                                                padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600 }}>{sk.name}</span>
                                        ))}
                                        {(c.skills||[]).length > 4 && (
                                            <span style={{ background:"#ede9fe", color:"#6366f1",
                                                padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600 }}>
                                                +{c.skills.length - 4}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                                        marginBottom:12, fontSize:11.5, color:"#64748b" }}>
                                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                            <div style={{ width:7, height:7, borderRadius:"50%",
                                                background: c.availability ? "#10b981" : "#cbd5e1" }}/>
                                            {c.availability || "Not set"}
                                        </div>
                                        {c.interests?.length > 0 && (
                                            <div style={{ fontSize:10.5, color:"#94a3b8" }}>🎯 {c.interests.slice(0,2).join(", ")}</div>
                                        )}
                                    </div>
                                    <div style={{ display:"flex", gap:8 }}>
                                        <button onClick={() => setViewProfile(c)}
                                            style={{ flex:1, padding:"8px 0", background:"#f8fafc",
                                                color:"#374151", border:"1px solid #e2e8f0", borderRadius:8,
                                                fontSize:12, fontWeight:600, cursor:"pointer" }}
                                            onMouseEnter={e => e.currentTarget.style.background="#f1f5f9"}
                                            onMouseLeave={e => e.currentTarget.style.background="#f8fafc"}>
                                            View Profile
                                        </button>
                                        {isTeammate ? (
                                            <button onClick={() => onNavigateToChat(c.email)}
                                                style={{ flex:1, padding:"8px 0",
                                                    background:"linear-gradient(90deg,#10b981,#059669)",
                                                    color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                                                Chat
                                            </button>
                                        ) : (
                                            <button onClick={() => sendInvite(c)} disabled={isInvited}
                                                style={{ flex:1, padding:"8px 0",
                                                    background: isInvited ? "#f1f5f9" : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                                                    color: isInvited ? "#94a3b8" : "#fff",
                                                    border:"none", borderRadius:8, fontSize:12, fontWeight:700,
                                                    cursor: isInvited ? "not-allowed" : "pointer" }}>
                                                {isInvited ? "Invited" : "Invite"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* View Profile Modal */}
            {viewProfile && (
                <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000,
                    display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
                    onClick={() => setViewProfile(null)}>
                    <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:540,
                        maxHeight:"88vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                            padding:"28px 28px 24px", borderRadius:"20px 20px 0 0", position:"relative" }}>
                            <button onClick={() => setViewProfile(null)}
                                style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.2)",
                                    border:"none", borderRadius:8, color:"#fff", cursor:"pointer",
                                    fontSize:20, width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>x</button>
                            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                                <div style={{ width:70, height:70, borderRadius:"50%", flexShrink:0,
                                    background: viewProfile.photo ? "transparent" : "rgba(255,255,255,0.25)",
                                    border:"3px solid rgba(255,255,255,0.4)",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    fontSize:24, fontWeight:800, color:"#fff", overflow:"hidden" }}>
                                    {viewProfile.photo ? <img src={viewProfile.photo} alt={viewProfile.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (viewProfile.name||"?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>{viewProfile.name}</div>
                                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)", marginBottom:8 }}>
                                        {[viewProfile.degree, viewProfile.college, viewProfile.graduationYear].filter(Boolean).join(" · ")}
                                    </div>
                                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                                        {[viewProfile.experienceLevel, viewProfile.projectDomain].filter(Boolean).map(t => (
                                            <span key={t} style={{ background:"rgba(255,255,255,0.2)", color:"#fff",
                                                padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600 }}>{t}</span>
                                        ))}
                                        <span style={{ background:matchBg(viewProfile.matchScore), color:matchColor(viewProfile.matchScore),
                                            padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700 }}>
                                            {viewProfile.matchScore}% match
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding:"24px 28px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
                                <div style={{ width:8, height:8, borderRadius:"50%", background: viewProfile.availability ? "#10b981" : "#cbd5e1" }}/>
                                <span style={{ fontSize:13, color:"#64748b", fontWeight:500 }}>{viewProfile.availability || "Availability not set"}</span>
                            </div>
                            {viewProfile.skills?.length > 0 && (
                                <div style={{ marginBottom:20 }}>
                                    <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:12 }}>Skills</div>
                                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                                        {viewProfile.skills.map((sk,i) => (
                                            <SkillBar key={sk.name} label={sk.name} pct={sk.level} color={SKILL_COLORS[i%SKILL_COLORS.length]}/>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {viewProfile.interests?.length > 0 && (
                                <div style={{ marginBottom:20 }}>
                                    <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:10 }}>Interests</div>
                                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                                        {viewProfile.interests.map(int => (
                                            <span key={int} style={{ background:"#ede9fe", color:"#6366f1",
                                                padding:"4px 12px", borderRadius:99, fontSize:12, fontWeight:500 }}>{int}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div style={{ display:"flex", gap:10, marginBottom:24 }}>
                                {viewProfile.github && (
                                    <a href={viewProfile.github} target="_blank" rel="noreferrer"
                                        style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
                                            background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8,
                                            textDecoration:"none", fontSize:12, fontWeight:600, color:"#1e293b" }}>
                                        <Icon d={icons.github} size={14}/> GitHub
                                    </a>
                                )}
                                {viewProfile.linkedin && (
                                    <a href={viewProfile.linkedin} target="_blank" rel="noreferrer"
                                        style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
                                            background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8,
                                            textDecoration:"none", fontSize:12, fontWeight:600, color:"#0077b5" }}>
                                        <Icon d={icons.linkedin} size={14}/> LinkedIn
                                    </a>
                                )}
                            </div>
                            <div style={{ display:"flex", gap:10 }}>
                                <button onClick={() => setViewProfile(null)}
                                    style={{ flex:1, padding:"11px 0", background:"#f1f5f9", color:"#64748b",
                                        border:"1px solid #e2e8f0", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                                    Close
                                </button>
                                {teamMemberEmails.has(viewProfile.email) ? (
                                    <button onClick={() => { onNavigateToChat(viewProfile.email); setViewProfile(null); }}
                                        style={{ flex:1.5, padding:"11px 0", background:"linear-gradient(90deg,#10b981,#059669)",
                                            color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                                        Open Chat
                                    </button>
                                ) : (
                                    <button onClick={() => { sendInvite(viewProfile); setViewProfile(null); }}
                                        disabled={invitedSet.has(viewProfile.email)}
                                        style={{ flex:1.5, padding:"11px 0",
                                            background: invitedSet.has(viewProfile.email) ? "#f1f5f9" : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                                            color: invitedSet.has(viewProfile.email) ? "#94a3b8" : "#fff",
                                            border:"none", borderRadius:10, fontSize:13, fontWeight:700,
                                            cursor: invitedSet.has(viewProfile.email) ? "not-allowed" : "pointer",
                                            display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                                        {invitedSet.has(viewProfile.email) ? "Invitation Sent" : <><Icon d={icons.send} size={14}/> Send Invite</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* TEAM MEMBERS SECTION */
const TeamMembersSection = ({ currentUserEmail, teamMembers, onNavigateToChat }) => {
    if (teamMembers.length === 0) return (
        <div>
            <div style={{ fontSize:22, fontWeight:800, color:"#1e293b", marginBottom:4 }}>Team Members</div>
            <div style={{ fontSize:13.5, color:"#64748b", marginBottom:28 }}>Your connected teammates</div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                minHeight:280, background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:40 }}>
                <div style={{ fontSize:52, marginBottom:16 }}>👥</div>
                <div style={{ fontSize:17, fontWeight:700, color:"#374151", marginBottom:8 }}>No teammates yet</div>
                <div style={{ fontSize:13.5, color:"#94a3b8", textAlign:"center", maxWidth:320 }}>
                    Go to Find Teammates to discover and invite collaborators. Once they accept, they will appear here.
                </div>
            </div>
        </div>
    );
    return (
        <div>
            <div style={{ fontSize:22, fontWeight:800, color:"#1e293b", marginBottom:4 }}>Team Members</div>
            <div style={{ fontSize:13.5, color:"#64748b", marginBottom:20 }}>
                {teamMembers.length} connected teammate{teamMembers.length !== 1 ? "s" : ""}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {teamMembers.map(member => (
                    <div key={member.email} style={{ background:"#fff", borderRadius:16, padding:"22px 22px",
                        border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                            <div style={{ width:56, height:56, borderRadius:"50%", flexShrink:0,
                                background: member.photo ? "transparent" : getAvatarColor(member.name),
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:20, fontWeight:800, color:"#fff", overflow:"hidden", border:"2px solid #e2e8f0" }}>
                                {member.photo ? <img src={member.photo} alt={member.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (member.name||"?").charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex:1 }}>
                                <div style={{ fontSize:15, fontWeight:700, color:"#1e293b", marginBottom:2 }}>{member.name}</div>
                                <div style={{ fontSize:12, color:"#64748b" }}>{[member.degree, member.college].filter(Boolean).join(" · ") || member.email}</div>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                <div style={{ width:7, height:7, borderRadius:"50%", background:"#10b981" }}/>
                                <span style={{ fontSize:11, color:"#10b981", fontWeight:600 }}>Connected</span>
                            </div>
                        </div>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                            {[member.projectDomain, member.availability, member.experienceLevel].filter(Boolean).map(tag => (
                                <span key={tag} style={{ background:"#f1f5f9", color:"#475569",
                                    padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600 }}>{tag}</span>
                            ))}
                        </div>
                        {Array.isArray(member.skills) && member.skills.length > 0 && (
                            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
                                {member.skills.slice(0,4).map((sk, idx) => (
                                    <span key={sk?.name || idx} style={{ background:"#ede9fe", color:"#6366f1",
                                        padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600 }}>{sk?.name || sk}</span>
                                ))}
                                {member.skills.length > 4 && (
                                    <span style={{ background:"#f1f5f9", color:"#64748b",
                                        padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600 }}>+{member.skills.length - 4}</span>
                                )}
                            </div>
                        )}
                        <button onClick={() => onNavigateToChat(member.email)}
                            style={{ width:"100%", padding:"9px 0",
                                background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
                                color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer",
                                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
                            onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
                            onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                            <Icon d={icons.teamChat} size={14}/> Open Chat
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* TEAM CHAT SECTION */
const TeamChatSection = ({ currentUserEmail, currentUserName, teamMembers, initialChatTarget }) => {
    const [selectedEmail, setSelectedEmail] = useState(initialChatTarget || (teamMembers[0]?.email || null));
    const [messages, setMessages]           = useState([]);
    // lastMsgPreviews: { [email]: lastMsgText } for sidebar preview
    const [lastMsgPreviews, setLastMsgPreviews] = useState({});
    const [input, setInput]                 = useState("");
    const messagesEndRef                    = useRef(null);
    const pollRef                           = useRef(null);

    useEffect(() => { if (initialChatTarget) setSelectedEmail(initialChatTarget); }, [initialChatTarget]);

    // Load and poll messages for the selected conversation
    useEffect(() => {
        if (!selectedEmail) return;
        const loadMessages = () => {
            fetch(`/api/team/chat/messages?e1=${encodeURIComponent(currentUserEmail)}&e2=${encodeURIComponent(selectedEmail)}`)
                .then(r => r.ok ? r.json() : [])
                .then(data => {
                    setMessages(data || []);
                    if (data && data.length > 0) {
                        const last = data[data.length - 1];
                        setLastMsgPreviews(prev => ({ ...prev, [selectedEmail]: last.text }));
                    }
                })
                .catch(() => {});
        };
        loadMessages();
        // Poll every 3 seconds for real-time feel
        pollRef.current = setInterval(loadMessages, 3000);
        return () => clearInterval(pollRef.current);
    }, [selectedEmail, currentUserEmail]);

    // Load last message previews for all teammates (for sidebar)
    useEffect(() => {
        if (!teamMembers.length) return;
        teamMembers.forEach(member => {
            fetch(`/api/team/chat/messages?e1=${encodeURIComponent(currentUserEmail)}&e2=${encodeURIComponent(member.email)}`)
                .then(r => r.ok ? r.json() : [])
                .then(data => {
                    if (data && data.length > 0) {
                        const last = data[data.length - 1];
                        setLastMsgPreviews(prev => ({ ...prev, [member.email]: last.text }));
                    }
                })
                .catch(() => {});
        });
    }, [teamMembers, currentUserEmail]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

    const sendMessage = () => {
        const text = input.trim(); if (!text || !selectedEmail) return;
        // Optimistic update
        const optimistic = { from: currentUserEmail, fromName: currentUserName, text, time: new Date().toISOString() };
        setMessages(prev => [...prev, optimistic]);
        setInput("");
        // Persist to backend
        fetch("/api/team/chat/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fromEmail: currentUserEmail,
                toEmail:   selectedEmail,
                fromName:  currentUserName,
                text,
            }),
        })
        .then(r => r.ok ? r.json() : null)
        .then(saved => {
            if (saved) {
                // Replace optimistic with server-confirmed message
                setMessages(prev => {
                    const withoutLast = prev.slice(0, -1);
                    return [...withoutLast, saved];
                });
                setLastMsgPreviews(prev => ({ ...prev, [selectedEmail]: saved.text }));
            }
        })
        .catch(() => {});
    };

    const selectedMember = teamMembers.find(m => m.email === selectedEmail);

    if (teamMembers.length === 0) return (
        <div>
            <div style={{ fontSize:22, fontWeight:800, color:"#1e293b", marginBottom:4 }}>Team Chat</div>
            <div style={{ fontSize:13.5, color:"#64748b", marginBottom:28 }}>Communicate with your teammates</div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                minHeight:280, background:"#fff", borderRadius:16, border:"1px solid #e2e8f0", padding:40 }}>
                <div style={{ fontSize:52, marginBottom:16 }}>💬</div>
                <div style={{ fontSize:17, fontWeight:700, color:"#374151", marginBottom:8 }}>No teammates yet</div>
                <div style={{ fontSize:13.5, color:"#94a3b8", textAlign:"center", maxWidth:320 }}>
                    Connect with teammates first via Find Teammates. Once accepted, you can chat here.
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div style={{ fontSize:22, fontWeight:800, color:"#1e293b", marginBottom:4 }}>Team Chat</div>
            <div style={{ fontSize:13.5, color:"#64748b", marginBottom:20 }}>Communicate with your teammates</div>
            <div style={{ display:"flex", gap:16, height:540 }}>
                {/* Member list */}
                <div style={{ width:220, background:"#fff", borderRadius:16, border:"1px solid #e2e8f0",
                    overflow:"hidden", display:"flex", flexDirection:"column" }}>
                    <div style={{ padding:"14px 16px", borderBottom:"1px solid #f1f5f9",
                        fontSize:12, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                        Teammates
                    </div>
                    <div style={{ flex:1, overflowY:"auto" }}>
                        {teamMembers.map(member => {
                            const isSelected = member.email === selectedEmail;
                            const preview    = lastMsgPreviews[member.email];
                            return (
                                <div key={member.email} onClick={() => setSelectedEmail(member.email)}
                                    style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px",
                                        cursor:"pointer", background: isSelected ? "#ede9fe" : "transparent",
                                        borderLeft: isSelected ? "3px solid #6366f1" : "3px solid transparent",
                                        transition:"all 0.15s" }}
                                    onMouseEnter={e => !isSelected && (e.currentTarget.style.background="#f8fafc")}
                                    onMouseLeave={e => !isSelected && (e.currentTarget.style.background="transparent")}>
                                    <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0,
                                        background: member.photo ? "transparent" : getAvatarColor(member.name),
                                        display:"flex", alignItems:"center", justifyContent:"center",
                                        fontSize:14, fontWeight:700, color:"#fff", overflow:"hidden" }}>
                                        {member.photo ? <img src={member.photo} alt={member.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (member.name||"?").charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex:1, overflow:"hidden" }}>
                                        <div style={{ fontSize:13, fontWeight:700, color: isSelected ? "#6366f1" : "#1e293b",
                                            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{member.name}</div>
                                        <div style={{ fontSize:11, color:"#94a3b8", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                            {preview || "No messages yet"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Chat window */}
                <div style={{ flex:1, background:"#fff", borderRadius:16, border:"1px solid #e2e8f0",
                    display:"flex", flexDirection:"column", overflow:"hidden" }}>
                    {selectedMember && (
                        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderBottom:"1px solid #f1f5f9" }}>
                            <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0,
                                background: selectedMember.photo ? "transparent" : getAvatarColor(selectedMember.name),
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:14, fontWeight:700, color:"#fff", overflow:"hidden" }}>
                                {selectedMember.photo ? <img src={selectedMember.photo} alt={selectedMember.name} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (selectedMember.name||"?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>{selectedMember.name}</div>
                                <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:"#10b981" }}>
                                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981" }}/>
                                    Connected teammate
                                </div>
                            </div>
                        </div>
                    )}
                    <div style={{ flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:10 }}>
                        {messages.length === 0 && (
                            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, color:"#94a3b8" }}>
                                <div style={{ fontSize:36, marginBottom:10 }}>👋</div>
                                <div style={{ fontSize:13.5, fontWeight:600 }}>Start the conversation!</div>
                                <div style={{ fontSize:12, marginTop:4 }}>Say hi to {selectedMember?.name?.split(" ")[0] || "your teammate"}</div>
                            </div>
                        )}
                        {messages.map((msg, i) => {
                            const isMe = msg.from === currentUserEmail;
                            return (
                                <div key={i} style={{ display:"flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                                    <div style={{ maxWidth:"70%" }}>
                                        {!isMe && <div style={{ fontSize:11, color:"#94a3b8", marginBottom:3, paddingLeft:4 }}>{msg.fromName || selectedMember?.name}</div>}
                                        <div style={{ padding:"10px 14px",
                                            borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                            background: isMe ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#f1f5f9",
                                            color: isMe ? "#fff" : "#1e293b", fontSize:13.5, lineHeight:1.5 }}>
                                            {msg.text}
                                        </div>
                                        <div style={{ fontSize:10.5, color:"#94a3b8", marginTop:3,
                                            textAlign: isMe ? "right" : "left", paddingLeft:4, paddingRight:4 }}>
                                            {new Date(msg.time).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef}/>
                    </div>
                    <div style={{ padding:"12px 18px", borderTop:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:10 }}>
                        <input value={input} onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key==="Enter" && !e.shiftKey && sendMessage()}
                            placeholder={`Message ${selectedMember?.name?.split(" ")[0] || "teammate"}...`}
                            style={{ flex:1, padding:"10px 14px", border:"1.5px solid #e2e8f0",
                                borderRadius:10, outline:"none", fontSize:13.5, fontFamily:"inherit",
                                background:"#f8fafc", color:"#1e293b", transition:"border-color 0.15s" }}
                            onFocus={e => e.currentTarget.style.borderColor="#6366f1"}
                            onBlur={e => e.currentTarget.style.borderColor="#e2e8f0"}/>
                        <button onClick={sendMessage}
                            style={{ width:40, height:40, background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                                border:"none", borderRadius:10, cursor:"pointer",
                                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                            onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
                            onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                            <Icon d={icons.send} size={16} stroke="#fff"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* INVITATION POPUP */
const InvitePopup = ({ invite, onAccept, onReject }) => {
    const rawSkills = invite?.fromSkills;
    const skillsList = Array.isArray(rawSkills)
        ? rawSkills
        : (typeof rawSkills === "string" ? (() => {
            try {
                const parsed = JSON.parse(rawSkills);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        })() : []);

    return (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:2000,
            background:"#fff", borderRadius:16, padding:"20px 22px",
            boxShadow:"0 8px 40px rgba(99,102,241,0.22)", border:"1px solid #e2e8f0",
            width:320, animation:"slideInRight 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", flexShrink:0,
                    background: invite.fromPhoto ? "transparent" : getAvatarColor(invite.fromName),
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, fontWeight:800, color:"#fff", overflow:"hidden", border:"2px solid #e2e8f0" }}>
                    {invite.fromPhoto ? <img src={invite.fromPhoto} alt={invite.fromName} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : (invite.fromName||"?").charAt(0).toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:2 }}>Teammate Invitation</div>
                    <div style={{ fontSize:12.5, color:"#374151", lineHeight:1.5 }}>
                        <strong>{invite.fromName}</strong> wants to team up with you!
                    </div>
                    {invite.fromCollege && (
                        <div style={{ fontSize:11.5, color:"#64748b", marginTop:2 }}>
                            {[invite.fromDegree, invite.fromCollege].filter(Boolean).join(" · ")}
                        </div>
                    )}
                </div>
            </div>
            {skillsList.length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
                    {skillsList.slice(0,4).map((sk, i) => (
                        <span key={sk?.name || i} style={{ background:"#ede9fe", color:"#6366f1",
                            padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600 }}>{sk?.name || sk}</span>
                    ))}
                </div>
            )}
            {invite.fromAvailability && (
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:14 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:"#10b981" }}/>
                    <span style={{ fontSize:12, color:"#64748b" }}>{invite.fromAvailability}</span>
                </div>
            )}
            <div style={{ display:"flex", gap:8 }}>
                <button onClick={onReject}
                    style={{ flex:1, padding:"9px 0", background:"#f1f5f9", color:"#64748b",
                        border:"1px solid #e2e8f0", borderRadius:9, fontSize:12.5, fontWeight:600, cursor:"pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background="#fee2e2"}
                    onMouseLeave={e => e.currentTarget.style.background="#f1f5f9"}>
                    Reject
                </button>
                <button onClick={onAccept}
                    style={{ flex:1.4, padding:"9px 0", background:"linear-gradient(90deg,#6366f1,#8b5cf6)",
                        color:"#fff", border:"none", borderRadius:9, fontSize:12.5, fontWeight:700, cursor:"pointer" }}
                    onMouseEnter={e => e.currentTarget.style.opacity="0.9"}
                    onMouseLeave={e => e.currentTarget.style.opacity="1"}>
                    Accept Invite
                </button>
            </div>
        </div>
    );
};

/* CANDIDATE DASHBOARD */
const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser]               = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [activeNav, setActiveNav]     = useState("Dashboard");
    const [notifOpen, setNotifOpen]     = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);
    const [pendingInvite, setPendingInvite] = useState(null);
    const [chatTarget, setChatTarget]   = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem("current_user");
        if (!raw) { navigate("/"); return; }
        const parsed = JSON.parse(raw);
        if (parsed.role !== "candidate") { navigate(`/${parsed.role}/dashboard`); return; }
        setUser(parsed);
        const stored = localStorage.getItem(`skillforge_profile_${parsed.email}`);
        if (stored) { try { setProfileData(JSON.parse(stored)); } catch (e) {} }
        fetch(`/api/profile/me?email=${encodeURIComponent(parsed.email)}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    const parsedProfile = {
                        ...data,
                        skills:    typeof data.skills    === "string" ? JSON.parse(data.skills    || "[]") : (data.skills    || []),
                        interests: typeof data.interests === "string" ? JSON.parse(data.interests || "[]") : (data.interests || []),
                    };
                    setProfileData(parsedProfile);
                    localStorage.setItem(`skillforge_profile_${parsed.email}`, JSON.stringify(parsedProfile));
                }
            })
            .catch(err => console.warn("Could not fetch profile from backend", err));
    }, [navigate]);

    // Load teammates from backend (real DB — works across browsers)
    const loadTeammates = (email) => {
        fetch(`/api/team/teammates?email=${encodeURIComponent(email)}`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const parsed = (data || []).map(m => {
                    let skills = [];
                    if (Array.isArray(m.skills)) {
                        skills = m.skills;
                    } else if (typeof m.skills === "string") {
                        try {
                            const p = JSON.parse(m.skills || "[]");
                            skills = Array.isArray(p) ? p : [];
                        } catch {
                            skills = [];
                        }
                    }
                    let interests = [];
                    if (Array.isArray(m.interests)) {
                        interests = m.interests;
                    } else if (typeof m.interests === "string") {
                        try {
                            const p = JSON.parse(m.interests || "[]");
                            interests = Array.isArray(p) ? p : [];
                        } catch {
                            interests = [];
                        }
                    }
                    return {
                        ...m,
                        skills,
                        interests,
                    };
                });
                setTeamMembers(parsed);
            })
            .catch(() => setTeamMembers([]));
    };

    useEffect(() => {
        if (!user) return;
        loadTeammates(user.email);
    }, [user]);

    // Poll backend every 5 seconds for pending invites
    useEffect(() => {
        if (!user) return;
        const checkInvites = () => {
            fetch(`/api/team/invites/pending?email=${encodeURIComponent(user.email)}`)
                .then(r => r.ok ? r.json() : [])
                .then(data => {
                    const raw = (data || [])[0] || null;
                    if (raw) {
                        let parsedSkills = [];
                        if (Array.isArray(raw.fromSkills)) {
                            parsedSkills = raw.fromSkills;
                        } else if (typeof raw.fromSkills === "string") {
                            try {
                                const p = JSON.parse(raw.fromSkills || "[]");
                                parsedSkills = Array.isArray(p) ? p : [];
                            } catch {
                                parsedSkills = [];
                            }
                        }
                        setPendingInvite({ ...raw, fromSkills: parsedSkills });
                    } else {
                        setPendingInvite(null);
                    }
                })
                .catch(() => {});
        };
        checkInvites();
        const interval = setInterval(checkInvites, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const handleAcceptInvite = () => {
        if (!pendingInvite || !user) return;
        const inviteId = pendingInvite.id;
        setPendingInvite(null); // Dismiss popup immediately
        fetch("/api/team/invite/accept", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: inviteId }),
        })
        .then(r => r.ok ? r.json() : null)
        .then(() => {
            // Refresh teammates list from backend
            loadTeammates(user.email);
        })
        .catch(() => {});
    };

    const handleRejectInvite = () => {
        if (!pendingInvite || !user) return;
        const inviteId = pendingInvite.id;
        setPendingInvite(null); // Dismiss popup immediately
        fetch("/api/team/invite/reject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: inviteId }),
        }).catch(() => {});
    };

    const handleLogout = () => { localStorage.removeItem("current_user"); localStorage.removeItem("auth_token"); navigate("/"); };
    if (!user) return null;

    const initials  = (user.fullName||"U").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    const firstName = (user.fullName||"Student").split(" ")[0];
    const hour      = new Date().getHours();
    const greeting  = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
    const profileSkills = profileData?.skills?.length ? profileData.skills : [
        { name:"React / Frontend", level:82 },{ name:"Node.js / Backend", level:67 },
        { name:"UI / UX Design",   level:54 },{ name:"Data Structures",   level:75 }];
    const avgSkill = profileSkills.length ? Math.round(profileSkills.reduce((s,sk)=>s+sk.level,0)/profileSkills.length) : 0;
    const projects = [
        { name:"AI Resume Builder",  progress:72, due:"Sep 10", status:"On Track",   color:"#6366f1" },
        { name:"Campus Event App",   progress:45, due:"Sep 28", status:"In Progress", color:"#8b5cf6" },
        { name:"Study Buddy Finder", progress:90, due:"Aug 31", status:"Review",      color:"#10b981" }];
    const tasks = [
        { text:"Submit project proposal", done:false, due:"Today" },
        { text:"Review teammate PR",      done:true,  due:"Done"  },
        { text:"Update profile skills",   done:false, due:"Aug 28"},
        { text:"Respond to team invitation", done:false, due:"Aug 27"}];
    const invitations = [
        { team:"TechBuilders", project:"Smart Campus App",    role:"Frontend Dev"  },
        { team:"DataForge",    project:"Analytics Dashboard", role:"Fullstack Dev" }];
    const notifications = [
        { text:"TechBuilders sent you a team invite",   time:"2m ago", unread:true  },
        { text:"Your project proposal was approved",    time:"1h ago", unread:true  },
        { text:"New teammate match: Priya S.",          time:"3h ago", unread:false },
        { text:"Task 'Update profile' is due tomorrow", time:"5h ago", unread:false }];
    const unreadCount = notifications.filter(n=>n.unread).length + (pendingInvite ? 1 : 0);
    const navItems = [
        { label:"Dashboard",      icon:icons.dashboard   },
        { label:"My Profile",     icon:icons.profile     },
        { label:"Find Teammates", icon:icons.teammates   },
        { label:"Team Members",   icon:icons.teamMembers },
        { label:"Team Chat",      icon:icons.teamChat    },
        { label:"My Projects",    icon:icons.projects    },
        { label:"Kanban Board",   icon:icons.kanban      },
        { label:"Milestones",     icon:icons.milestones  },
        { label:"Notifications",  icon:icons.notif       },
        { label:"Settings",       icon:icons.settings    }];

    const S = {
        root:    { display:"flex", minHeight:"100vh", fontFamily:"'Inter','Segoe UI',sans-serif", background:"#f8fafc", color:"#1e293b" },
        sidebar: { width:230, minWidth:230, background:"#1e2433", display:"flex", flexDirection:"column", padding:"0 0 24px", position:"sticky", top:0, height:"100vh", overflowY:"auto" },
        brand:   { display:"flex", alignItems:"center", gap:10, padding:"24px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:8 },
        brandDot:{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"#fff" },
        navLabel:{ fontSize:10, fontWeight:700, color:"#64748b", letterSpacing:"0.08em", textTransform:"uppercase", padding:"16px 20px 6px" },
        navItem: (active) => ({ display:"flex", alignItems:"center", gap:11, padding:"9px 20px", borderRadius:8, margin:"1px 10px", cursor:"pointer", fontSize:13.5, fontWeight:500, color: active?"#fff":"#94a3b8", background: active?"linear-gradient(90deg,#6366f1,#8b5cf6)":"transparent", transition:"all 0.18s ease", position:"relative" }),
        sidebarUser: { marginTop:"auto", padding:"16px 16px 0", borderTop:"1px solid rgba(255,255,255,0.06)" },
        userCard: { display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,0.05)", cursor:"pointer" },
        avatar:  (size,fs) => ({ width:size, height:size, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:fs, fontWeight:700, color:"#fff", flexShrink:0 }),
        main:    { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
        topbar:  { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 28px", background:"#fff", borderBottom:"1px solid #e2e8f0", position:"sticky", top:0, zIndex:20 },
        notifBtn:{ position:"relative", background:"none", border:"none", cursor:"pointer", color:"#64748b", display:"flex", alignItems:"center", padding:6, borderRadius:8, transition:"background 0.15s" },
        notifBadge:{ position:"absolute", top:3, right:3, width:16, height:16, background:"#ef4444", borderRadius:"50%", fontSize:9, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" },
        userChip:{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", borderRadius:24, border:"1px solid #e2e8f0", cursor:"pointer", background:"#f8fafc" },
        content: { padding:"28px 28px 40px", flex:1, overflowY:"auto" },
        hero:    { background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 60%,#a855f7 100%)", borderRadius:18, padding:"28px 32px", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", overflow:"hidden" },
        heroIcon:{ width:72, height:72, borderRadius:18, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px solid rgba(255,255,255,0.2)" },
        heroBtn: (primary) => ({ padding:"9px 20px", borderRadius:24, fontSize:13, fontWeight:600, cursor:"pointer", background: primary?"#fff":"rgba(255,255,255,0.15)", color: primary?"#6366f1":"#fff", border: primary?"none":"1px solid rgba(255,255,255,0.3)" }),
        grid3:  { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18, marginBottom:24 },
        grid2:  { display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:24 },
        gridL:  { display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:18, marginBottom:24 },
        card:   (p=24) => ({ background:"#fff", borderRadius:16, padding:p, border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }),
        statCard:{ background:"#fff", borderRadius:16, padding:"20px 22px", border:"1px solid #e2e8f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", display:"flex", alignItems:"center", justifyContent:"space-between" },
        statIcon:(bg) => ({ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center" }),
        secHead: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 },
        secTitle:{ fontSize:15, fontWeight:700, color:"#1e293b" },
        seeAll:  { fontSize:12, fontWeight:600, color:"#6366f1", cursor:"pointer", background:"none", border:"none", padding:0 },
        badge:   (color,bg) => ({ fontSize:11, fontWeight:700, color, background:bg, padding:"3px 10px", borderRadius:99 }),
        taskRow: { display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #f1f5f9" },
        invCard: { background:"#f8fafc", borderRadius:12, padding:"14px 16px", border:"1px solid #e2e8f0", marginBottom:10 },
    };

    const NotifDropdown = () => (
        <div style={{ position:"absolute", top:46, right:0, width:310, background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", boxShadow:"0 8px 32px rgba(0,0,0,0.12)", zIndex:100, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px 10px", borderBottom:"1px solid #f1f5f9", fontWeight:700, fontSize:13, color:"#1e293b" }}>Notifications</div>
            {pendingInvite && (
                <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"11px 18px", background:"#f8f7ff", borderBottom:"1px solid #f8fafc", cursor:"pointer" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", marginTop:4, flexShrink:0, background:"#6366f1" }}/>
                    <div>
                        <div style={{ fontSize:12.5, color:"#374151", lineHeight:1.4 }}>{pendingInvite.fromName} sent you a teammate invitation</div>
                        <div style={{ fontSize:11, color:"#9ca3af", marginTop:3 }}>Just now</div>
                    </div>
                </div>
            )}
            {notifications.map((n,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"11px 18px", background:n.unread?"#f8f7ff":"#fff", borderBottom:"1px solid #f8fafc", cursor:"pointer" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", marginTop:4, flexShrink:0, background:n.unread?"#6366f1":"transparent" }}/>
                    <div>
                        <div style={{ fontSize:12.5, color:"#374151", lineHeight:1.4 }}>{n.text}</div>
                        <div style={{ fontSize:11, color:"#9ca3af", marginTop:3 }}>{n.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
    const sidebarPhoto  = profileData?.photo;
    const navigateToChat = (email) => { setChatTarget(email); setActiveNav("Team Chat"); };

    return (
        <>
        <style>{`@keyframes slideInRight { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }`}</style>
        <div style={S.root} onClick={() => notifOpen && setNotifOpen(false)}>
            <aside style={S.sidebar}>
                <div style={S.brand}>
                    <div style={S.brandDot}>SF</div>
                    <div><div style={{ fontSize:15, fontWeight:800, color:"#fff" }}>SkillForge</div><div style={{ fontSize:10, color:"#94a3b8", marginTop:1 }}>AI Platform</div></div>
                </div>
                <div style={S.navLabel}>Overview</div>
                {navItems.slice(0,1).map(item => (
                    <div key={item.label} style={S.navItem(activeNav===item.label)} onClick={() => setActiveNav(item.label)}>
                        <Icon d={item.icon} size={17}/>{item.label}
                        {activeNav===item.label && <div style={{ position:"absolute", right:0, top:"20%", height:"60%", width:3, background:"#fff", borderRadius:"2px 0 0 2px" }}/>}
                    </div>
                ))}
                <div style={S.navLabel}>Collaborate</div>
                {navItems.slice(1,5).map(item => (
                    <div key={item.label} style={S.navItem(activeNav===item.label)} onClick={() => { setActiveNav(item.label); if(item.label!=="Team Chat") setChatTarget(null); }}>
                        <Icon d={item.icon} size={17}/>{item.label}
                        {item.label==="Team Members" && teamMembers.length > 0 && (
                            <span style={{ marginLeft:"auto", background: activeNav===item.label ? "rgba(255,255,255,0.25)" : "#6366f1", color:"#fff", fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:99 }}>{teamMembers.length}</span>
                        )}
                        {activeNav===item.label && <div style={{ position:"absolute", right:0, top:"20%", height:"60%", width:3, background:"#fff", borderRadius:"2px 0 0 2px" }}/>}
                    </div>
                ))}
                <div style={S.navLabel}>Projects</div>
                {navItems.slice(5,8).map(item => (
                    <div key={item.label} style={S.navItem(activeNav===item.label)} onClick={() => setActiveNav(item.label)}>
                        <Icon d={item.icon} size={17}/>{item.label}
                        {activeNav===item.label && <div style={{ position:"absolute", right:0, top:"20%", height:"60%", width:3, background:"#fff", borderRadius:"2px 0 0 2px" }}/>}
                    </div>
                ))}
                <div style={{ flex:1 }}/>
                {navItems.slice(8).map(item => (
                    <div key={item.label} style={S.navItem(activeNav===item.label)} onClick={() => setActiveNav(item.label)}>
                        <Icon d={item.icon} size={17}/>{item.label}
                        {item.label==="Notifications" && unreadCount>0 && (
                            <span style={{ marginLeft:"auto", background:"#ef4444", color:"#fff", fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:99 }}>{unreadCount}</span>
                        )}
                    </div>
                ))}
                <div style={S.sidebarUser}>
                    <div style={S.userCard}>
                        <div style={{ ...S.avatar(32,13), overflow:"hidden" }}>
                            {sidebarPhoto ? <img src={sidebarPhoto} alt="User" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : initials}
                        </div>
                        <div style={{ flex:1, overflow:"hidden" }}>
                            <div style={{ fontSize:12.5, fontWeight:700, color:"#e2e8f0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.fullName}</div>
                            <div style={{ fontSize:10.5, color:"#64748b" }}>{user.college||"Student"}</div>
                        </div>
                        <button onClick={handleLogout} title="Logout" style={{ background:"none", border:"none", cursor:"pointer", color:"#64748b", display:"flex", padding:4, borderRadius:6 }}>
                            <Icon d={icons.logout} size={15}/>
                        </button>
                    </div>
                </div>
            </aside>

            <div style={S.main}>
                <header style={S.topbar}>
                    <div>
                        <span style={{ fontSize:13, color:"#94a3b8" }}>{greeting}, <span style={{ fontWeight:700, color:"#1e293b" }}>{firstName}</span> 👋</span>
                        <div style={{ fontSize:11.5, color:"#cbd5e1", marginTop:1 }}>{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
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
                                {sidebarPhoto ? <img src={sidebarPhoto} alt="User" style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : initials}
                            </div>
                            <div>
                                <div style={{ fontSize:12.5, fontWeight:700, color:"#1e293b" }}>{user.fullName}</div>
                                <div style={{ fontSize:10.5, color:"#64748b" }}>{user.course||"Candidate"}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div style={S.content}>
                    {activeNav==="My Profile" && <MyProfileSection profileData={profileData} userEmail={user.email} onProfileSaved={(u) => setProfileData(u)}/>}
                    {activeNav==="Find Teammates" && <FindTeammatesSection profileData={profileData} currentUserEmail={user.email} onNavigateToChat={navigateToChat} teamMembers={teamMembers}/>}
                    {activeNav==="Team Members" && <TeamMembersSection currentUserEmail={user.email} teamMembers={teamMembers} onNavigateToChat={navigateToChat}/>}
                    {activeNav==="Team Chat" && <TeamChatSection currentUserEmail={user.email} currentUserName={profileData?.name || user.fullName || user.email} teamMembers={teamMembers} initialChatTarget={chatTarget}/>}
                    {activeNav==="My Projects" && <MyProjectsSection user={user} profileData={profileData} teamMembers={teamMembers} onNavigateToKanban={(pid) => { setSelectedProjectId(pid); setActiveNav("Kanban Board"); }}/>}
                    {activeNav==="Kanban Board" && <KanbanBoardSection user={user} profileData={profileData} teamMembers={teamMembers} selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId}/>}
                    {activeNav==="Milestones" && <MilestonesSection user={user} profileData={profileData} teamMembers={teamMembers} selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId}/>}

                    {activeNav==="Dashboard" && (<>
                        <div style={S.hero}>
                            <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, background:"rgba(255,255,255,0.08)", borderRadius:"50%", filter:"blur(30px)" }}/>
                            <div style={{ position:"relative", zIndex:1 }}>
                                <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginBottom:6 }}>{greeting} 👋</div>
                                <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:8 }}>Welcome back, {firstName}!</div>
                                <div style={{ fontSize:13.5, color:"rgba(255,255,255,0.8)", marginBottom:18, maxWidth:400 }}>
                                    You have <strong style={{ color:"#fff" }}>3 tasks due this week</strong> and&nbsp;<strong style={{ color:"#fff" }}>2 new team invitations</strong> waiting.
                                </div>
                                <div style={{ display:"flex", gap:10 }}>
                                    <button style={S.heroBtn(true)}>View Tasks</button>
                                    <button style={S.heroBtn(false)} onClick={() => setActiveNav("Find Teammates")}>Find Teammates</button>
                                </div>
                            </div>
                            <div style={S.heroIcon}>
                                <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                        </div>
                        <div style={S.grid3}>
                            {[
                                { label:"Active Projects", val:"3",            sub:"+1 this month", icon:icons.folder, bg:"#ede9fe", ic:"#6366f1" },
                                { label:"Pending Tasks",   val:"5",            sub:"2 due today",   icon:icons.task,   bg:"#fef3c7", ic:"#f59e0b" },
                                { label:"Skill Score",     val:`${avgSkill}%`, sub:"+4 this week",  icon:icons.star,   bg:"#d1fae5", ic:"#10b981" },
                            ].map(s => (
                                <div key={s.label} style={S.statCard}>
                                    <div>
                                        <div style={{ fontSize:12, color:"#64748b", fontWeight:600, marginBottom:6 }}>{s.label}</div>
                                        <div style={{ fontSize:28, fontWeight:800, color:"#1e293b", lineHeight:1 }}>{s.val}</div>
                                        <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:4 }}>{s.sub}</div>
                                    </div>
                                    <div style={S.statIcon(s.bg)}><Icon d={s.icon} size={20} stroke={s.ic}/></div>
                                </div>
                            ))}
                        </div>
                        <div style={S.gridL}>
                            <div style={S.card(24)}>
                                <div style={S.secHead}>
                                    <span style={S.secTitle}>My Skills</span>
                                    <button style={S.seeAll} onClick={() => setActiveNav("My Profile")}>Edit Skills</button>
                                </div>
                                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                                    {profileSkills.map((sk,i) => <SkillBar key={sk.name} label={sk.name} pct={sk.level} color={SKILL_COLORS[i%SKILL_COLORS.length]}/>)}
                                </div>
                            </div>
                            <div style={S.card(24)}>
                                <div style={S.secHead}><span style={S.secTitle}>Pending Tasks</span><button style={S.seeAll}>See all</button></div>
                                {tasks.map((t,i) => (
                                    <div key={i} style={S.taskRow}>
                                        <div style={{ width:18, height:18, borderRadius:5, flexShrink:0, border:t.done?"none":"2px solid #cbd5e1", background:t.done?"#10b981":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                            {t.done && <svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth={2}><path d="M2 6l3 3 5-5"/></svg>}
                                        </div>
                                        <span style={{ flex:1, fontSize:12.5, color:t.done?"#9ca3af":"#374151", textDecoration:t.done?"line-through":"none" }}>{t.text}</span>
                                        <span style={{ fontSize:11, fontWeight:t.due==="Today"?700:400, color:t.due==="Today"?"#ef4444":"#94a3b8" }}>{t.due}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={S.grid2}>
                            <div style={S.card(24)}>
                                <div style={S.secHead}><span style={S.secTitle}>Active Projects</span><button style={S.seeAll}>View all</button></div>
                                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                                    {projects.map(p => (
                                        <div key={p.name} style={{ display:"flex", alignItems:"center", gap:14 }}>
                                            <Ring pct={p.progress} size={54} stroke={6} color={p.color}/>
                                            <div style={{ flex:1 }}>
                                                <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b" }}>{p.name}</div>
                                                <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:2 }}>Due {p.due}</div>
                                            </div>
                                            <span style={S.badge(p.status==="On Track"?"#10b981":p.status==="Review"?"#6366f1":"#f59e0b",p.status==="On Track"?"#d1fae5":p.status==="Review"?"#ede9fe":"#fef3c7")}>{p.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={S.card(24)}>
                                <div style={S.secHead}>
                                    <span style={S.secTitle}>Team Invitations</span>
                                    <span style={{ fontSize:11.5, fontWeight:700, color:"#fff", background:"#6366f1", padding:"2px 8px", borderRadius:99 }}>{invitations.length} New</span>
                                </div>
                                {invitations.map((inv,i) => (
                                    <div key={i} style={S.invCard}>
                                        <div style={{ marginBottom:8 }}>
                                            <div style={{ fontSize:13.5, fontWeight:700, color:"#1e293b" }}>{inv.team}</div>
                                            <div style={{ fontSize:11.5, color:"#64748b", marginTop:2 }}>{inv.project} · <span style={{ color:"#6366f1" }}>{inv.role}</span></div>
                                        </div>
                                        <div style={{ display:"flex", gap:8 }}>
                                            <button style={{ flex:1, padding:"7px 0", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>Accept</button>
                                            <button style={{ flex:1, padding:"7px 0", background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>Decline</button>
                                        </div>
                                    </div>
                                ))}
                                {profileData && (
                                    <div style={{ marginTop:14, padding:"14px 16px", background:"#f8fafc", borderRadius:12, border:"1px solid #e2e8f0" }}>
                                        <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Your Profile</div>
                                        {[{label:"College",val:profileData.college||"—"},{label:"Degree",val:profileData.degree||"—"},{label:"Grad Year",val:profileData.graduationYear||"—"},{label:"Domain",val:profileData.projectDomain||"—"}].map(row => (
                                            <div key={row.label} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #f1f5f9" }}>
                                                <span style={{ fontSize:12, color:"#94a3b8" }}>{row.label}</span>
                                                <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>)}

                    {!["Dashboard","My Profile","Find Teammates","Team Members","Team Chat","My Projects","Kanban Board","Milestones"].includes(activeNav) && (
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:340, color:"#94a3b8" }}>
                            <div style={{ fontSize:48, marginBottom:16 }}>🚧</div>
                            <div style={{ fontSize:18, fontWeight:700, color:"#374151", marginBottom:8 }}>{activeNav}</div>
                            <div style={{ fontSize:14, color:"#94a3b8" }}>This section is coming soon.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        {pendingInvite && <InvitePopup invite={pendingInvite} onAccept={handleAcceptInvite} onReject={handleRejectInvite}/>}
        </>
    );
};

export default CandidateDashboard;
