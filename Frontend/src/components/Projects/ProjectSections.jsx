import React, { useState, useEffect } from "react";

// Reusable SVG Icon component
const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
        stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d={d}/>
    </svg>
);

const projectIcons = {
    folder:      "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
    zap:         "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    eye:         "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 100-6 3 3 0 000 6z",
    check:       "M20 6L9 17l-5-5",
    plus:        "M12 5v14M5 12h14",
    calendar:    "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18",
    tasks:       "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
    users:       "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    filter:      "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    arrowRight:  "M5 12h14M12 5l7 7-7 7",
    milestone:   "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
    crown:       "M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z",
};

const avatarColors = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#3b82f6","#0ea5e9","#14b8a6"];
const getAvatarColor = (str) => avatarColors[(str || "A").charCodeAt(0) % avatarColors.length];

const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
};

/* ══════════════════════════════════════════════════════════════════
   1. MY PROJECTS SECTION (Image 1 Style)
══════════════════════════════════════════════════════════════════ */
export const MyProjectsSection = ({ user, profileData, teamMembers, onNavigateToKanban }) => {
    const [projects, setProjects]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const loadProjects = () => {
        if (!user?.email) return;
        setLoading(true);
        fetch(`/api/projects/user?email=${encodeURIComponent(user.email)}`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                setProjects(data || []);
                setLoading(false);
            })
            .catch(() => {
                setProjects([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadProjects();
    }, [user?.email]);

    // Summary counts
    const totalCount     = projects.length;
    const activeCount    = projects.filter(p => (p.status || "").toLowerCase() === "active").length;
    const reviewCount    = projects.filter(p => (p.status || "").toLowerCase() === "review").length;
    const completedCount = projects.filter(p => (p.status || "").toLowerCase() === "completed").length;

    const filtered = projects.filter(p => {
        if (filterStatus === "All") return true;
        return (p.status || "").toLowerCase() === filterStatus.toLowerCase();
    });

    const statusBadge = (status) => {
        const s = (status || "active").toLowerCase();
        if (s === "completed") {
            return { label: "completed", bg: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" };
        }
        if (s === "review") {
            return { label: "review", bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" };
        }
        return { label: "active", bg: "rgba(6,182,212,0.12)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.25)" };
    };

    const progressGradient = (status) => {
        const s = (status || "active").toLowerCase();
        if (s === "completed") return "linear-gradient(90deg, #10b981, #34d399)";
        if (s === "review") return "linear-gradient(90deg, #f59e0b, #fbbf24)";
        return "linear-gradient(90deg, #6366f1, #a855f7)";
    };

    return (
        <div style={{ background: "#0b0f19", minHeight: "100%", margin: "-28px -28px -40px", padding: "28px 28px 40px", color: "#f8fafc" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>My Projects</h1>
                    <div style={{ fontSize: 13.5, color: "#94a3b8", marginTop: 4 }}>
                        Manage and track all your collaborative projects
                    </div>
                </div>
                <button onClick={() => setShowCreateModal(true)} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6)", color: "#fff",
                    border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                    cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.35)", transition: "all 0.18s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <Icon d={projectIcons.plus} size={16} stroke="#fff"/> + New Project
                </button>
            </div>

            {/* Top Stat Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                    { label: "Total Projects", count: totalCount, icon: projectIcons.folder, iconBg: "rgba(99,102,241,0.18)", iconColor: "#818cf8" },
                    { label: "Active", count: activeCount, icon: projectIcons.zap, iconBg: "rgba(6,182,212,0.18)", iconColor: "#22d3ee" },
                    { label: "In Review", count: reviewCount, icon: projectIcons.eye, iconBg: "rgba(245,158,11,0.18)", iconColor: "#fbbf24" },
                    { label: "Completed", count: completedCount, icon: projectIcons.check, iconBg: "rgba(16,185,129,0.18)", iconColor: "#34d399" },
                ].map((stat, i) => (
                    <div key={i} style={{
                        background: "#131b2e", borderRadius: 14, padding: "20px 22px",
                        border: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between"
                    }}>
                        <div>
                            <div style={{ fontSize: 12.5, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>{stat.label}</div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{stat.count}</div>
                        </div>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12, background: stat.iconBg,
                            display: "flex", alignItems: "center", justifyContent: "center", color: stat.iconColor
                        }}>
                            <Icon d={stat.icon} size={20} stroke={stat.iconColor}/>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
                {["All", "Active", "Review", "Completed"].map(tab => (
                    <button key={tab} onClick={() => setFilterStatus(tab)} style={{
                        padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                        background: filterStatus === tab ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#131b2e",
                        color: filterStatus === tab ? "#fff" : "#94a3b8",
                        border: filterStatus === tab ? "1px solid transparent" : "1px solid #1e293b",
                        transition: "all 0.15s"
                    }}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Loading / Empty States */}
            {loading && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 14 }}>
                    Loading your projects...
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    minHeight: 280, background: "#131b2e", borderRadius: 16, border: "1px solid #1e293b", padding: 40
                }}>
                    <div style={{ fontSize: 44, marginBottom: 14 }}>🚀</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>No projects found</div>
                    <div style={{ fontSize: 13.5, color: "#94a3b8", textAlign: "center", maxWidth: 360, marginBottom: 20 }}>
                        {projects.length === 0
                            ? "You haven't created any collaborative projects yet. Click '+ New Project' to get started and automatically become the Team Leader!"
                            : `No projects currently in '${filterStatus}' status.`}
                    </div>
                    {projects.length === 0 && (
                        <button onClick={() => setShowCreateModal(true)} style={{
                            padding: "9px 20px", background: "linear-gradient(90deg,#6366f1,#8b5cf6)", color: "#fff",
                            border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer"
                        }}>
                            + Create First Project
                        </button>
                    )}
                </div>
            )}

            {/* Projects Grid (Image 1 Style) */}
            {!loading && filtered.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                    {filtered.map(p => {
                        const sb = statusBadge(p.status);
                        const skillsArray = (() => {
                            if (Array.isArray(p.skills)) return p.skills;
                            if (typeof p.skills === "string") {
                                try {
                                    const parsed = JSON.parse(p.skills);
                                    if (Array.isArray(parsed)) return parsed.map(s => typeof s === "object" ? s.name : s);
                                } catch {
                                    return p.skills.split(",").map(s => s.trim()).filter(Boolean);
                                }
                            }
                            return [];
                        })();

                        const membersList = p.members || [];

                        return (
                            <div key={p.id} style={{
                                background: "#131b2e", borderRadius: 16, padding: "24px 24px 20px",
                                border: "1px solid #1e293b", display: "flex", flexDirection: "column",
                                transition: "all 0.2s ease", cursor: "pointer", position: "relative"
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#334155";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.35)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "#1e293b";
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                            onClick={() => onNavigateToKanban(p.id)}>
                                {/* Card Header */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{p.name}</span>
                                        {p.category && (
                                            <span style={{
                                                background: "rgba(99,102,241,0.18)", color: "#818cf8",
                                                padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700
                                            }}>
                                                {p.category}
                                            </span>
                                        )}
                                    </div>
                                    <span style={{
                                        background: sb.bg, color: sb.color, border: sb.border,
                                        padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700
                                    }}>
                                        {sb.label}
                                    </span>
                                </div>

                                {/* Description */}
                                <div style={{ fontSize: 12.8, color: "#94a3b8", lineHeight: 1.55, marginBottom: 14, minHeight: 38 }}>
                                    {p.description || "Collaborative project created to build modern solutions with teammates."}
                                </div>

                                {/* Skills / Tech Tags */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                    {skillsArray.slice(0, 5).map((sk, idx) => (
                                        <span key={idx} style={{
                                            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                                            color: "#cbd5e1", padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600
                                        }}>
                                            {sk}
                                        </span>
                                    ))}
                                    {skillsArray.length > 5 && (
                                        <span style={{
                                            background: "rgba(99,102,241,0.12)", color: "#818cf8",
                                            padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600
                                        }}>
                                            +{skillsArray.length - 5}
                                        </span>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 6 }}>
                                        <span style={{ color: "#94a3b8", fontWeight: 600 }}>Progress</span>
                                        <span style={{ color: "#fff", fontWeight: 700 }}>{p.progress || 0}%</span>
                                    </div>
                                    <div style={{ height: 6, background: "#1e293b", borderRadius: 99, overflow: "hidden" }}>
                                        <div style={{
                                            height: "100%", width: `${Math.min(100, Math.max(0, p.progress || 0))}%`,
                                            background: progressGradient(p.status), borderRadius: 99, transition: "width 0.6s ease"
                                        }}/>
                                    </div>
                                </div>

                                {/* Card Footer: Members, Tasks, Due Date */}
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11.5, color: "#94a3b8"
                                }}>
                                    {/* Member Avatars Cluster */}
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {membersList.slice(0, 4).map((m, idx) => (
                                            <div key={idx} title={`${m.name || m.email} ${m.isLeader ? "(Team Leader)" : ""}`} style={{
                                                width: 28, height: 28, borderRadius: "50%",
                                                background: m.photo ? "transparent" : getAvatarColor(m.name || m.email),
                                                border: m.isLeader ? "2px solid #f59e0b" : "2px solid #131b2e",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 10, fontWeight: 800, color: "#fff", overflow: "hidden",
                                                marginLeft: idx > 0 ? -8 : 0, zIndex: 10 - idx, position: "relative"
                                            }}>
                                                {m.photo
                                                    ? <img src={m.photo} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                                                    : getInitials(m.name || m.email)
                                                }
                                            </div>
                                        ))}
                                        {membersList.length > 4 && (
                                            <div style={{
                                                width: 28, height: 28, borderRadius: "50%", background: "#1e293b",
                                                border: "2px solid #131b2e", display: "flex", alignItems: "center",
                                                justifyContent: "center", fontSize: 9.5, fontWeight: 700, color: "#94a3b8",
                                                marginLeft: -8, zIndex: 1
                                            }}>
                                                +{membersList.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    {/* Tasks count & due date */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                            <Icon d={projectIcons.tasks} size={14} stroke="#94a3b8"/>
                                            <span>{p.completedTasks || 0}/{p.totalTasks || 0} tasks</span>
                                        </div>
                                        {p.dueDate && (
                                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                                <Icon d={projectIcons.calendar} size={14} stroke="#94a3b8"/>
                                                <span>{p.dueDate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Project Modal */}
            {showCreateModal && (
                <CreateProjectModal
                    user={user}
                    profileData={profileData}
                    teamMembers={teamMembers}
                    onClose={() => setShowCreateModal(false)}
                    onProjectCreated={(newProj) => {
                        setShowCreateModal(false);
                        loadProjects();
                        if (newProj?.id) onNavigateToKanban(newProj.id);
                    }}
                />
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════
   2. KANBAN BOARD SECTION (Image 2 Style)
══════════════════════════════════════════════════════════════════ */
export const KanbanBoardSection = ({ user, profileData, teamMembers, selectedProjectId, onSelectProject }) => {
    const [projects, setProjects]       = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [tasks, setTasks]             = useState([]);
    const [loading, setLoading]         = useState(true);
    const [memberFilter, setMemberFilter] = useState("all");
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [modalColumn, setModalColumn] = useState("Backlog");

    // 1. Fetch user projects
    useEffect(() => {
        if (!user?.email) return;
        fetch(`/api/projects/user?email=${encodeURIComponent(user.email)}`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list = data || [];
                setProjects(list);
                if (list.length > 0) {
                    const found = selectedProjectId ? list.find(p => p.id === Number(selectedProjectId)) : list[0];
                    setCurrentProject(found || list[0]);
                } else {
                    setCurrentProject(null);
                }
                setLoading(false);
            })
            .catch(() => {
                setProjects([]);
                setLoading(false);
            });
    }, [user?.email, selectedProjectId]);

    // 2. Fetch tasks for the current project
    const loadTasks = (projId) => {
        if (!projId) { setTasks([]); return; }
        fetch(`/api/projects/${projId}/tasks`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setTasks(data || []))
            .catch(() => setTasks([]));
    };

    useEffect(() => {
        if (currentProject?.id) {
            loadTasks(currentProject.id);
        }
    }, [currentProject?.id]);

    const handleUpdateTaskStatus = (taskId, newStatus) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        fetch(`/api/projects/tasks/${taskId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        }).catch(() => {
            if (currentProject?.id) loadTasks(currentProject.id);
        });
    };

    const columns = [
        { id: "Backlog",     label: "Backlog",     bullet: "#94a3b8" },
        { id: "In Progress", label: "In Progress", bullet: "#6366f1" },
        { id: "Review",      label: "Review",      bullet: "#f59e0b" },
        { id: "Done",        label: "Done",        bullet: "#10b981" },
    ];

    const filteredTasks = tasks.filter(t => {
        if (memberFilter === "all") return true;
        return t.assignedEmail === memberFilter;
    });

    const priorityBadge = (priority) => {
        const p = (priority || "medium").toLowerCase();
        if (p === "high")   return { label: "high", bg: "rgba(239,68,68,0.15)", color: "#f87171" };
        if (p === "low")    return { label: "low", bg: "rgba(16,185,129,0.15)", color: "#34d399" };
        return { label: "medium", bg: "rgba(245,158,11,0.15)", color: "#fbbf24" };
    };

    const projectMembers = currentProject?.members || [];

    if (loading) {
        return (
            <div style={{ background: "#0b0f19", minHeight: "100%", margin: "-28px -28px -40px", padding: 40, color: "#94a3b8", textAlign: "center" }}>
                Loading Kanban Board...
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div style={{ background: "#0b0f19", minHeight: "100%", margin: "-28px -28px -40px", padding: "28px 28px 40px", color: "#f8fafc" }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Kanban Board</h1>
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    minHeight: 320, background: "#131b2e", borderRadius: 16, border: "1px solid #1e293b", padding: 40
                }}>
                    <div style={{ fontSize: 44, marginBottom: 14 }}>📋</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>No Projects Found</div>
                    <div style={{ fontSize: 13.5, color: "#94a3b8", textAlign: "center", maxWidth: 360 }}>
                        Create a project first in <strong>My Projects</strong> to manage its Kanban board, assign tasks, and track sprints!
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#0b0f19", minHeight: "100%", margin: "-28px -28px -40px", padding: "28px 28px 40px", color: "#f8fafc" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Kanban Board</h1>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                        <span style={{ color: "#818cf8", fontWeight: 600 }}>{currentProject.name}</span> · {currentProject.category || "Sprint 1"} · Due {currentProject.dueDate || "Flexible"}
                    </div>
                </div>

                {/* Right controls: Project switcher, member filter, Add Task */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Project Selector */}
                    {projects.length > 1 && (
                        <select
                            value={currentProject.id}
                            onChange={e => {
                                const selected = projects.find(p => p.id === Number(e.target.value));
                                if (selected) {
                                    setCurrentProject(selected);
                                    if (onSelectProject) onSelectProject(selected.id);
                                }
                            }}
                            style={{
                                background: "#131b2e", border: "1px solid #1e293b", borderRadius: 8,
                                color: "#f8fafc", padding: "8px 12px", fontSize: 12.5, outline: "none", cursor: "pointer"
                            }}>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    )}

                    {/* Filter by member */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#131b2e", border: "1px solid #1e293b", borderRadius: 8, padding: "4px 10px" }}>
                        <Icon d={projectIcons.filter} size={14} stroke="#94a3b8"/>
                        <select
                            value={memberFilter}
                            onChange={e => setMemberFilter(e.target.value)}
                            style={{ background: "transparent", border: "none", color: "#cbd5e1", fontSize: 12.5, outline: "none", cursor: "pointer" }}>
                            <option value="all" style={{ background: "#131b2e", color: "#fff" }}>All Members</option>
                            {projectMembers.map(m => (
                                <option key={m.email} value={m.email} style={{ background: "#131b2e", color: "#fff" }}>
                                    {m.name} {m.isLeader ? "★" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Add Task Button */}
                    <button onClick={() => { setModalColumn("Backlog"); setShowAddTaskModal(true); }} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                        background: "linear-gradient(90deg,#6366f1,#8b5cf6)", color: "#fff", border: "none",
                        borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(99,102,241,0.3)"
                    }}>
                        <Icon d={projectIcons.plus} size={15} stroke="#fff"/> + Add Task
                    </button>
                </div>
            </div>

            {/* Top Status Summary Bar (Image 2 Style) */}
            <div style={{
                display: "flex", alignItems: "center", gap: 24, padding: "10px 18px",
                background: "#131b2e", borderRadius: 10, border: "1px solid #1e293b", marginBottom: 20, fontSize: 12.5
            }}>
                {columns.map(col => {
                    const count = tasks.filter(t => (t.status || "").toLowerCase() === col.id.toLowerCase()).length;
                    return (
                        <div key={col.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.bullet }}/>
                            <span style={{ color: "#94a3b8" }}>{col.label}</span>
                            <span style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "1px 7px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* 4 Kanban Columns */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {columns.map(col => {
                    const colTasks = filteredTasks.filter(t => (t.status || "").toLowerCase() === col.id.toLowerCase());
                    return (
                        <div key={col.id} style={{
                            background: "#131b2e", borderRadius: 14, border: "1px solid #1e293b",
                            padding: "16px 14px", minHeight: 520, display: "flex", flexDirection: "column"
                        }}>
                            {/* Column Header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.bullet }}/>
                                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{col.label}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", background: "#1e293b", padding: "1px 6px", borderRadius: 99 }}>
                                        {colTasks.length}
                                    </span>
                                </div>
                                <button onClick={() => { setModalColumn(col.id); setShowAddTaskModal(true); }} style={{
                                    background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
                                    fontSize: 16, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                                    borderRadius: 4, transition: "background 0.15s"
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                                onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                                title={`Add task to ${col.label}`}>
                                    +
                                </button>
                            </div>

                            {/* Task Cards List */}
                            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                                {colTasks.length === 0 && (
                                    <div style={{
                                        border: "1.5px dashed #1e293b", borderRadius: 10, padding: "28px 10px",
                                        textAlign: "center", color: "#64748b", fontSize: 12
                                    }}>
                                        No tasks in {col.label}
                                    </div>
                                )}

                                {colTasks.map(task => {
                                    const pb = priorityBadge(task.priority);
                                    return (
                                        <div key={task.id} style={{
                                            background: "#182239", borderRadius: 12, padding: "14px 14px 12px",
                                            border: "1px solid #23304c", display: "flex", flexDirection: "column", gap: 10,
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)", transition: "all 0.15s"
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = "#3b4b72";
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = "#23304c";
                                            e.currentTarget.style.transform = "none";
                                        }}>
                                            {/* Task Title */}
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "#f8fafc", lineHeight: 1.45 }}>
                                                {task.title}
                                            </div>

                                            {/* Tags */}
                                            {task.categoryTag && (
                                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                                    <span style={{
                                                        background: "rgba(99,102,241,0.15)", color: "#818cf8",
                                                        padding: "2px 7px", borderRadius: 4, fontSize: 10.5, fontWeight: 600
                                                    }}>
                                                        {task.categoryTag}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Task Bottom Row: Assignee, Priority, Points, Due Date */}
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    {/* Assignee Avatar */}
                                                    <div title={task.assignedName || task.assignedEmail || "Unassigned"} style={{
                                                        width: 24, height: 24, borderRadius: "50%",
                                                        background: task.assignedPhoto ? "transparent" : getAvatarColor(task.assignedName || task.assignedEmail || "A"),
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 9.5, fontWeight: 800, color: "#fff", overflow: "hidden"
                                                    }}>
                                                        {task.assignedPhoto
                                                            ? <img src={task.assignedPhoto} alt="Assignee" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                                                            : getInitials(task.assignedName || task.assignedEmail || "U")
                                                        }
                                                    </div>

                                                    {/* Priority badge */}
                                                    <span style={{
                                                        background: pb.bg, color: pb.color,
                                                        padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700
                                                    }}>
                                                        {pb.label}
                                                    </span>

                                                    {/* Story points */}
                                                    {task.points && (
                                                        <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>
                                                            {task.points}p
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Due Date */}
                                                {task.dueDate && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, color: "#94a3b8" }}>
                                                        <Icon d={projectIcons.calendar} size={11} stroke="#94a3b8"/>
                                                        <span>{task.dueDate}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quick Status Mover Dropdown */}
                                            <div style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8, marginTop: 2
                                            }}>
                                                <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Move to:</span>
                                                <div style={{ display: "flex", gap: 4 }}>
                                                    {columns.filter(c => c.id !== col.id).map(c => (
                                                        <button key={c.id} onClick={() => handleUpdateTaskStatus(task.id, c.id)} style={{
                                                            padding: "2px 7px", background: "rgba(255,255,255,0.06)",
                                                            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4,
                                                            color: c.bullet, fontSize: 9.5, fontWeight: 700, cursor: "pointer",
                                                            transition: "all 0.15s"
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}>
                                                            {c.id.slice(0, 3)} →
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Task Modal */}
            {showAddTaskModal && (
                <CreateTaskModal
                    projectId={currentProject.id}
                    defaultColumn={modalColumn}
                    members={projectMembers}
                    currentUser={user}
                    onClose={() => setShowAddTaskModal(false)}
                    onTaskCreated={() => {
                        setShowAddTaskModal(false);
                        loadTasks(currentProject.id);
                    }}
                />
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════
   3. MILESTONES SECTION
══════════════════════════════════════════════════════════════════ */
export const MilestonesSection = ({ user, profileData, teamMembers, selectedProjectId, onSelectProject }) => {
    const [projects, setProjects]             = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [milestones, setMilestones]         = useState([]);
    const [loading, setLoading]               = useState(true);
    const [showAddModal, setShowAddModal]     = useState(false);

    useEffect(() => {
        if (!user?.email) return;
        fetch(`/api/projects/user?email=${encodeURIComponent(user.email)}`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list = data || [];
                setProjects(list);
                if (list.length > 0) {
                    const found = selectedProjectId ? list.find(p => p.id === Number(selectedProjectId)) : list[0];
                    setCurrentProject(found || list[0]);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user?.email, selectedProjectId]);

    const loadMilestones = (projId) => {
        if (!projId) return;
        fetch(`/api/projects/${projId}/milestones`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setMilestones(data || []))
            .catch(() => setMilestones([]));
    };

    useEffect(() => {
        if (currentProject?.id) {
            loadMilestones(currentProject.id);
        }
    }, [currentProject?.id]);

    const handleToggleMilestone = (mId, currentStatus) => {
        const nextStatus = currentStatus === "Completed" ? "In Progress" : "Completed";
        setMilestones(prev => prev.map(m => m.id === mId ? { ...m, status: nextStatus, progress: nextStatus === "Completed" ? 100 : 50 } : m));
        fetch(`/api/projects/milestones/${mId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: nextStatus }),
        }).catch(() => {
            if (currentProject?.id) loadMilestones(currentProject.id);
        });
    };

    if (loading) {
        return (
            <div style={{ background: "#0b0f19", minHeight: "100%", margin: "-28px -28px -40px", padding: 40, color: "#94a3b8", textAlign: "center" }}>
                Loading Milestones...
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div style={{ background: "#0b0f19", minHeight: "100%", margin: "-28px -28px -40px", padding: "28px 28px 40px", color: "#f8fafc" }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Milestones</h1>
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    minHeight: 320, background: "#131b2e", borderRadius: 16, border: "1px solid #1e293b", padding: 40
                }}>
                    <div style={{ fontSize: 44, marginBottom: 14 }}>🎯</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>No Projects Found</div>
                    <div style={{ fontSize: 13.5, color: "#94a3b8", textAlign: "center", maxWidth: 360 }}>
                        Create a project first in <strong>My Projects</strong> to track major deliverables and milestones!
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#0b0f19", minHeight: "100%", margin: "-28px -28px -40px", padding: "28px 28px 40px", color: "#f8fafc" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Project Milestones</h1>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                        Key deliverables & achievements for <strong style={{ color: "#818cf8" }}>{currentProject.name}</strong>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {projects.length > 1 && (
                        <select
                            value={currentProject.id}
                            onChange={e => {
                                const selected = projects.find(p => p.id === Number(e.target.value));
                                if (selected) {
                                    setCurrentProject(selected);
                                    if (onSelectProject) onSelectProject(selected.id);
                                }
                            }}
                            style={{
                                background: "#131b2e", border: "1px solid #1e293b", borderRadius: 8,
                                color: "#f8fafc", padding: "8px 12px", fontSize: 12.5, outline: "none", cursor: "pointer"
                            }}>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    )}

                    <button onClick={() => setShowAddModal(true)} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                        background: "linear-gradient(90deg,#6366f1,#8b5cf6)", color: "#fff", border: "none",
                        borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer"
                    }}>
                        <Icon d={projectIcons.plus} size={15} stroke="#fff"/> + Add Milestone
                    </button>
                </div>
            </div>

            {/* Milestones List */}
            {milestones.length === 0 && (
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    minHeight: 260, background: "#131b2e", borderRadius: 16, border: "1px solid #1e293b", padding: 40
                }}>
                    <div style={{ fontSize: 44, marginBottom: 14 }}>🚩</div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 6 }}>No Milestones Defined Yet</div>
                    <div style={{ fontSize: 13.5, color: "#94a3b8", textAlign: "center", maxWidth: 360, marginBottom: 18 }}>
                        Add key project deliverables (e.g. Architecture Setup, Core API Integration, Final MVP Launch) to monitor progress!
                    </div>
                    <button onClick={() => setShowAddModal(true)} style={{
                        padding: "8px 18px", background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                        color: "#fff", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer"
                    }}>
                        + Add Milestone
                    </button>
                </div>
            )}

            {milestones.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {milestones.map((m, idx) => {
                        const isDone = (m.status || "").toLowerCase() === "completed";
                        return (
                            <div key={m.id || idx} style={{
                                background: "#131b2e", borderRadius: 16, padding: "22px 24px",
                                border: isDone ? "1px solid rgba(16,185,129,0.3)" : "1px solid #1e293b",
                                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                        <span style={{ fontSize: 16, fontWeight: 800, color: isDone ? "#34d399" : "#fff" }}>
                                            {m.title}
                                        </span>
                                        <span style={{
                                            background: isDone ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.15)",
                                            color: isDone ? "#34d399" : "#818cf8", border: isDone ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(99,102,241,0.3)",
                                            padding: "2px 9px", borderRadius: 99, fontSize: 11, fontWeight: 700
                                        }}>
                                            {m.status || "In Progress"}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>
                                        {m.description || "Key project phase deliverable."}
                                    </div>

                                    {/* Progress Bar & Linked tasks */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div style={{ flex: 1, maxWidth: 300 }}>
                                            <div style={{ height: 6, background: "#1e293b", borderRadius: 99, overflow: "hidden" }}>
                                                <div style={{
                                                    height: "100%", width: `${m.progress || (isDone ? 100 : 0)}%`,
                                                    background: isDone ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                                                    borderRadius: 99, transition: "width 0.6s ease"
                                                }}/>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 11.5, color: "#cbd5e1", fontWeight: 600 }}>{m.progress || (isDone ? 100 : 0)}%</span>
                                        {m.targetDate && (
                                            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#94a3b8" }}>
                                                <Icon d={projectIcons.calendar} size={13} stroke="#94a3b8"/>
                                                <span>Target: {m.targetDate}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button onClick={() => handleToggleMilestone(m.id, m.status)} style={{
                                    padding: "8px 18px", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                                    background: isDone ? "rgba(16,185,129,0.15)" : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                                    color: isDone ? "#34d399" : "#fff",
                                    border: isDone ? "1px solid rgba(16,185,129,0.3)" : "none",
                                    flexShrink: 0
                                }}>
                                    {isDone ? "✓ Completed" : "Mark Complete"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Milestone Modal */}
            {showAddModal && (
                <CreateMilestoneModal
                    projectId={currentProject.id}
                    onClose={() => setShowAddModal(false)}
                    onCreated={() => {
                        setShowAddModal(false);
                        loadMilestones(currentProject.id);
                    }}
                />
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════════════════════════ */

const modalInputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8, boxSizing: "border-box",
    border: "1px solid #1e293b", background: "#0b0f19", color: "#f8fafc",
    fontSize: 13, outline: "none", fontFamily: "inherit"
};

const modalLabelStyle = {
    fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: 6, display: "block"
};

// 1. Create Project Modal
const CreateProjectModal = ({ user, profileData, teamMembers, onClose, onProjectCreated }) => {
    const [name, setName]               = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory]       = useState("Web Development");
    const [skills, setSkills]           = useState("");
    const [dueDate, setDueDate]         = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [submitting, setSubmitting]   = useState(false);

    const toggleMember = (email) => {
        setSelectedMembers(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) { alert("Please enter a project name."); return; }

        setSubmitting(true);
        const leaderEmail = user.email;
        const leaderName  = profileData?.name || user.fullName || leaderEmail;
        const leaderPhoto = profileData?.photo || null;

        // Parse skills
        const skillsArr = skills.split(",").map(s => s.trim()).filter(Boolean);

        fetch("/api/projects/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                description,
                category,
                skills: JSON.stringify(skillsArr),
                dueDate: dueDate || "Flexible",
                leaderEmail,
                leaderName,
                leaderPhoto,
                memberEmails: selectedMembers, // Leader is automatically included on backend
            })
        })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            setSubmitting(false);
            if (data) onProjectCreated(data);
        })
        .catch(() => {
            setSubmitting(false);
            alert("Could not create project. Please try again.");
        });
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#131b2e", border: "1px solid #23304c", borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", padding: "26px 28px", color: "#f8fafc", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Create New Project</div>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 22 }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                        <label style={modalLabelStyle}>Project Name *</label>
                        <input
                            required
                            placeholder="e.g. EduFlow AI, CampusConnect"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={modalInputStyle}
                        />
                    </div>

                    <div>
                        <label style={modalLabelStyle}>Description</label>
                        <textarea
                            rows={3}
                            placeholder="Brief overview of what this project accomplishes..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={{ ...modalInputStyle, resize: "vertical" }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <label style={modalLabelStyle}>Category / Domain</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                style={{ ...modalInputStyle, cursor: "pointer" }}>
                                {["Web Development", "AI / Machine Learning", "Mobile Apps", "Cloud & DevOps", "Cybersecurity", "Data Science", "FinTech", "EdTech", "HealthTech", "Sustainability", "Social"].map(cat => (
                                    <option key={cat} value={cat} style={{ background: "#131b2e" }}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={modalLabelStyle}>Target Due Date</label>
                            <input
                                placeholder="e.g. Dec 15, 2026"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                style={modalInputStyle}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={modalLabelStyle}>Skills & Technologies (comma separated)</label>
                        <input
                            placeholder="e.g. React, Spring Boot, MySQL, Docker"
                            value={skills}
                            onChange={e => setSkills(e.target.value)}
                            style={modalInputStyle}
                        />
                    </div>

                    {/* Team Leader & Connected Teammates Assignment */}
                    <div style={{ background: "#0b0f19", border: "1px solid #1e293b", borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Team Leader</span>
                            <span style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)", padding: "1px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700 }}>
                                You (Creator)
                            </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                            As the project creator, you will automatically lead this project. Select connected teammates to add as team members:
                        </div>

                        {teamMembers.length === 0 ? (
                            <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic" }}>
                                No connected teammates yet. You can invite teammates via 'Find Teammates' at any time.
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 160, overflowY: "auto" }}>
                                {teamMembers.map(m => (
                                    <label key={m.email} style={{
                                        display: "flex", alignItems: "center", gap: 10, padding: "6px 10px",
                                        borderRadius: 8, background: selectedMembers.includes(m.email) ? "#182239" : "transparent",
                                        cursor: "pointer", transition: "background 0.15s"
                                    }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(m.email)}
                                            onChange={() => toggleMember(m.email)}
                                            style={{ accentColor: "#6366f1", cursor: "pointer" }}
                                        />
                                        <div style={{
                                            width: 24, height: 24, borderRadius: "50%",
                                            background: m.photo ? "transparent" : getAvatarColor(m.name),
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 10, fontWeight: 800, color: "#fff", overflow: "hidden"
                                        }}>
                                            {m.photo
                                                ? <img src={m.photo} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                                                : getInitials(m.name)
                                            }
                                        </div>
                                        <div style={{ flex: 1, fontSize: 12.5, color: "#f8fafc" }}>{m.name}</div>
                                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{m.projectDomain || m.degree || ""}</div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={{
                            flex: 1, padding: "10px 0", background: "#1e293b", color: "#94a3b8",
                            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer"
                        }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} style={{
                            flex: 1.5, padding: "10px 0", background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                            color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                            cursor: submitting ? "not-allowed" : "pointer"
                        }}>
                            {submitting ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 2. Create Task Modal
const CreateTaskModal = ({ projectId, defaultColumn, members, currentUser, onClose, onTaskCreated }) => {
    const [title, setTitle]             = useState("");
    const [description, setDescription] = useState("");
    const [categoryTag, setCategoryTag] = useState("backend");
    const [status, setStatus]           = useState(defaultColumn || "Backlog");
    const [priority, setPriority]       = useState("medium");
    const [points, setPoints]           = useState(5);
    const [dueDate, setDueDate]         = useState("");
    const [assignedEmail, setAssignedEmail] = useState(currentUser?.email || "");
    const [submitting, setSubmitting]   = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) { alert("Please enter a task title."); return; }

        setSubmitting(true);
        const assignedMember = members.find(m => m.email === assignedEmail);

        fetch(`/api/projects/${projectId}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                categoryTag,
                status,
                priority,
                points: Number(points) || 5,
                dueDate: dueDate || "Upcoming",
                assignedEmail: assignedMember?.email || currentUser?.email,
                assignedName: assignedMember?.name || currentUser?.fullName || "Teammate",
                assignedPhoto: assignedMember?.photo || null,
            })
        })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            setSubmitting(false);
            if (data) onTaskCreated();
        })
        .catch(() => {
            setSubmitting(false);
            alert("Could not create task. Please try again.");
        });
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#131b2e", border: "1px solid #23304c", borderRadius: 16, width: "100%", maxWidth: 500, padding: "24px 26px", color: "#f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Add Task to {status}</div>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 22 }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                        <label style={modalLabelStyle}>Task Title *</label>
                        <input
                            required
                            placeholder="e.g. Implement OAuth2 authentication"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={modalInputStyle}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <label style={modalLabelStyle}>Category Tag</label>
                            <select
                                value={categoryTag}
                                onChange={e => setCategoryTag(e.target.value)}
                                style={{ ...modalInputStyle, cursor: "pointer" }}>
                                {["backend", "frontend", "auth", "ml", "db", "devops", "ui", "design", "setup"].map(cat => (
                                    <option key={cat} value={cat} style={{ background: "#131b2e" }}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={modalLabelStyle}>Column</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                style={{ ...modalInputStyle, cursor: "pointer" }}>
                                {["Backlog", "In Progress", "Review", "Done"].map(col => (
                                    <option key={col} value={col} style={{ background: "#131b2e" }}>{col}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <label style={modalLabelStyle}>Priority</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                style={{ ...modalInputStyle, cursor: "pointer" }}>
                                <option value="high" style={{ background: "#131b2e" }}>High</option>
                                <option value="medium" style={{ background: "#131b2e" }}>Medium</option>
                                <option value="low" style={{ background: "#131b2e" }}>Low</option>
                            </select>
                        </div>
                        <div>
                            <label style={modalLabelStyle}>Story Points</label>
                            <select
                                value={points}
                                onChange={e => setPoints(e.target.value)}
                                style={{ ...modalInputStyle, cursor: "pointer" }}>
                                {[1, 2, 3, 5, 8, 13].map(p => (
                                    <option key={p} value={p} style={{ background: "#131b2e" }}>{p} points</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <label style={modalLabelStyle}>Due Date</label>
                            <input
                                placeholder="e.g. Nov 28"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                style={modalInputStyle}
                            />
                        </div>
                        <div>
                            <label style={modalLabelStyle}>Assign To</label>
                            <select
                                value={assignedEmail}
                                onChange={e => setAssignedEmail(e.target.value)}
                                style={{ ...modalInputStyle, cursor: "pointer" }}>
                                {members.map(m => (
                                    <option key={m.email} value={m.email} style={{ background: "#131b2e" }}>
                                        {m.name} {m.isLeader ? "(Leader)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={{
                            flex: 1, padding: "9px 0", background: "#1e293b", color: "#94a3b8",
                            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer"
                        }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} style={{
                            flex: 1.4, padding: "9px 0", background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                            color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                            cursor: submitting ? "not-allowed" : "pointer"
                        }}>
                            {submitting ? "Adding..." : "Add Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 3. Create Milestone Modal
const CreateMilestoneModal = ({ projectId, onClose, onCreated }) => {
    const [title, setTitle]             = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate]   = useState("");
    const [status, setStatus]           = useState("In Progress");
    const [submitting, setSubmitting]   = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) { alert("Please enter a milestone title."); return; }

        setSubmitting(true);
        fetch(`/api/projects/${projectId}/milestones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                targetDate: targetDate || "Upcoming",
                status,
            })
        })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            setSubmitting(false);
            if (data) onCreated();
        })
        .catch(() => {
            setSubmitting(false);
            alert("Could not create milestone.");
        });
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#131b2e", border: "1px solid #23304c", borderRadius: 16, width: "100%", maxWidth: 480, padding: "24px 26px", color: "#f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Add Project Milestone</div>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 22 }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                        <label style={modalLabelStyle}>Milestone Title *</label>
                        <input
                            required
                            placeholder="e.g. Phase 2: Recommendation Engine API"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={modalInputStyle}
                        />
                    </div>

                    <div>
                        <label style={modalLabelStyle}>Description</label>
                        <textarea
                            rows={3}
                            placeholder="Key deliverables and goals for this milestone..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            style={{ ...modalInputStyle, resize: "vertical" }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                            <label style={modalLabelStyle}>Target Date</label>
                            <input
                                placeholder="e.g. Dec 15, 2026"
                                value={targetDate}
                                onChange={e => setTargetDate(e.target.value)}
                                style={modalInputStyle}
                            />
                        </div>
                        <div>
                            <label style={modalLabelStyle}>Initial Status</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                style={{ ...modalInputStyle, cursor: "pointer" }}>
                                <option value="In Progress" style={{ background: "#131b2e" }}>In Progress</option>
                                <option value="Upcoming" style={{ background: "#131b2e" }}>Upcoming</option>
                                <option value="Completed" style={{ background: "#131b2e" }}>Completed</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button type="button" onClick={onClose} style={{
                            flex: 1, padding: "9px 0", background: "#1e293b", color: "#94a3b8",
                            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer"
                        }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} style={{
                            flex: 1.4, padding: "9px 0", background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
                            color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
                            cursor: submitting ? "not-allowed" : "pointer"
                        }}>
                            {submitting ? "Adding..." : "Add Milestone"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
