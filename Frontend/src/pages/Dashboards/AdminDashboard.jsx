import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = ""; // Uses Vite proxy → http://localhost:9090

const Icon = ({ name, size = 18 }) => {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    dashboard: <svg {...s}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    analytics: <svg {...s}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    users: <svg {...s}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    projects: <svg {...s}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>,
    verification: <svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
    report: <svg {...s}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    aiusage: <svg {...s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    activitylogs: <svg {...s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    notifications: <svg {...s}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    logout: <svg {...s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    shield: <svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    flag: <svg {...s}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    bolt: <svg {...s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    dollar: <svg {...s}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    server: <svg {...s}><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
    arrowRight: <svg {...s}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    chevronLeft: <svg {...s}><polyline points="15 18 9 12 15 6"/></svg>,
    search: <svg {...s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    trendUp: <svg {...s}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    trendDown: <svg {...s}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  };
  return <span style={{display:"inline-flex",alignItems:"center"}}>{icons[name] || null}</span>;
};

const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:"10px",width:"100%",padding:"9px 12px",borderRadius:"8px",border:"none",cursor:"pointer",background:active?"rgba(139,92,246,0.2)":"transparent",color:active?"#a78bfa":"#94a3b8",fontWeight:active?"600":"400",fontSize:"13.5px",textAlign:"left",transition:"all 0.15s",position:"relative"}}
    onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color="#cbd5e1";}}}
    onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#94a3b8";}}}
  >
    {active&&<span style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:"3px",height:"60%",background:"#8b5cf6",borderRadius:"0 2px 2px 0"}}/>}
    <span style={{flexShrink:0,opacity:active?1:0.75}}><Icon name={icon} size={16}/></span>
    <span style={{flex:1}}>{label}</span>
    {badge>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:"999px",fontSize:"10px",fontWeight:"700",padding:"1px 6px",minWidth:"18px",textAlign:"center",lineHeight:"16px"}}>{badge}</span>}
  </button>
);

const SideSection = ({label}) => (
  <div style={{padding:"14px 12px 4px",fontSize:"10px",fontWeight:"700",color:"#475569",letterSpacing:"1.2px",textTransform:"uppercase"}}>{label}</div>
);

const KpiCard = ({title,value,subtitle,trend,trendLabel,icon,iconBg,iconColor}) => (
  <div style={{background:"#131929",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"14px",padding:"20px 22px",display:"flex",flexDirection:"column",gap:"8px",cursor:"default"}}
    onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(139,92,246,0.3)"}
    onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}
  >
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <span style={{fontSize:"11px",fontWeight:"700",color:"#64748b",letterSpacing:"0.9px",textTransform:"uppercase"}}>{title}</span>
      <span style={{width:"36px",height:"36px",borderRadius:"10px",background:iconBg,display:"flex",alignItems:"center",justifyContent:"center",color:iconColor,flexShrink:0}}>
        <Icon name={icon} size={17}/>
      </span>
    </div>
    <div style={{fontSize:"30px",fontWeight:"800",color:"#f1f5f9",letterSpacing:"-1px",lineHeight:1}}>{value}</div>
    {subtitle&&<div style={{fontSize:"12px",color:"#64748b"}}>{subtitle}</div>}
    {trendLabel&&<div style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"12px",color:trend==="up"?"#4ade80":trend==="down"?"#f87171":"#94a3b8",marginTop:"2px"}}>
      {trend==="up"&&<Icon name="trendUp" size={12}/>}
      {trend==="down"&&<Icon name="trendDown" size={12}/>}
      <span>{trendLabel}</span>
    </div>}
  </div>
);

const LineChart = ({data,width=520,height=200}) => {
  if(!data||data.length===0)return <div style={{color:"#64748b",textAlign:"center",paddingTop:"60px"}}>No data yet</div>;
  const uv=data.map(d=>d.users),pv=data.map(d=>d.projects);
  const maxV=Math.max(...uv,...pv,1);
  const pad={l:40,r:20,t:20,b:30};
  const w=width-pad.l-pad.r,h=height-pad.t-pad.b;
  const step=w/Math.max(data.length-1,1);
  const tx=i=>pad.l+i*step,ty=v=>pad.t+h-(v/maxV)*h;
  const path=vs=>vs.map((v,i)=>`${i===0?"M":"L"} ${tx(i).toFixed(1)} ${ty(v).toFixed(1)}`).join(" ");
  const area=vs=>{const pts=vs.map((v,i)=>`${tx(i).toFixed(1)} ${ty(v).toFixed(1)}`).join(" L ");return `M ${tx(0).toFixed(1)} ${(pad.t+h).toFixed(1)} L ${pts} L ${tx(vs.length-1).toFixed(1)} ${(pad.t+h).toFixed(1)} Z`;};
  const yl=[0,Math.round(maxV/4),Math.round(maxV/2),Math.round(3*maxV/4),maxV];
  return(
    <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%",height:"100%"}}>
      <defs>
        <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/></linearGradient>
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/><stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/></linearGradient>
      </defs>
      {yl.map((v,i)=><g key={i}><line x1={pad.l} y1={ty(v)} x2={width-pad.r} y2={ty(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/><text x={pad.l-6} y={ty(v)+4} textAnchor="end" fill="#475569" fontSize="9" fontFamily="inherit">{v>=1000?`${(v/1000).toFixed(0)}k`:v}</text></g>)}
      {data.map((d,i)=><text key={i} x={tx(i)} y={height-4} textAnchor="middle" fill="#475569" fontSize="9" fontFamily="inherit">{d.month}</text>)}
      <path d={area(uv)} fill="url(#ug)"/>
      <path d={area(pv)} fill="url(#pg)"/>
      <path d={path(uv)} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={path(pv)} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3"/>
      {uv.map((v,i)=><circle key={i} cx={tx(i)} cy={ty(v)} r="3" fill="#8b5cf6" stroke="#0f172a" strokeWidth="2"/>)}
    </svg>
  );
};

const BarChart = ({data,height=190}) => {
  if(!data||data.length===0)return null;
  const maxV=Math.max(...data.map(d=>d.requests),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:"8px",height:`${height}px`,width:"100%",padding:"0 4px"}}>
      {data.map((d,i)=>{const pct=maxV>0?(d.requests/maxV)*100:0;return(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",height:"100%"}}>
          <div style={{flex:1,width:"100%",display:"flex",alignItems:"flex-end"}}>
            <div title={`${d.day}: ${d.requests.toLocaleString()}`} style={{width:"100%",height:pct>0?`${Math.max(pct,4)}%`:"4%",background:pct>50?"linear-gradient(180deg,#a78bfa,#8b5cf6)":"linear-gradient(180deg,#6d5da4,#4c3d8a)",borderRadius:"4px 4px 0 0",opacity:pct>0?1:0.3}}/>
          </div>
          <span style={{fontSize:"10px",color:"#475569"}}>{d.day}</span>
        </div>
      );})}
    </div>
  );
};

const dotClr={blue:"#60a5fa",green:"#4ade80",yellow:"#facc15",red:"#f87171",gray:"#94a3b8"};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState("J. Admin");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchStats = useCallback(async()=>{
    try{
      const res=await fetch(`${API_BASE}/api/admin/dashboard`);
      if(!res.ok)throw new Error("Failed to fetch dashboard data");
      const data=await res.json();
      setStats(data);setError(null);
    }catch(err){setError(err.message);}
    finally{setLoading(false);}
  },[]);

  useEffect(()=>{
    const cu=localStorage.getItem("current_user");
    if(!cu){navigate("/");return;}
    const p=JSON.parse(cu);
    if(p.email!=="admin@gmail.com"){navigate(`/${p.role}/dashboard`);return;}
    if(p.fullName||p.name)setAdminName(p.fullName||p.name||"J. Admin");
    fetchStats();
    const iv=setInterval(fetchStats,30000);
    return()=>clearInterval(iv);
  },[navigate,fetchStats]);

  const handleLogout=()=>{localStorage.removeItem("current_user");navigate("/");};
  const todayStr=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});

  const navSections=[
    {label:"Overview",items:[{key:"dashboard",icon:"dashboard",label:"Dashboard"},{key:"analytics",icon:"analytics",label:"Analytics"}]},
    {label:"Management",items:[{key:"users",icon:"users",label:"Users"},{key:"projects",icon:"projects",label:"Projects"},{key:"verification",icon:"verification",label:"Verification",badgeKey:"verificationBadge"},{key:"reported",icon:"report",label:"Reported Content",badgeKey:"reportsBadge"}]},
    {label:"AI & System",items:[{key:"aiusage",icon:"aiusage",label:"AI Usage"},{key:"activitylogs",icon:"activitylogs",label:"Activity Logs"}]},
    {label:"Account",items:[{key:"notifications",icon:"notifications",label:"Notifications",badgeKey:"notificationsBadge"}]},
  ];

  const allNavItems=navSections.flatMap(s=>s.items);

  const Sidebar=()=>(
    <aside style={{width:sidebarCollapsed?"64px":"210px",minHeight:"100vh",background:"#0b1120",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",flexShrink:0,transition:"width 0.25s ease",overflow:"hidden",position:"sticky",top:0,height:"100vh"}}>
      <div style={{padding:"18px 16px 14px",display:"flex",alignItems:"center",gap:"10px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{width:"34px",height:"34px",borderRadius:"10px",flexShrink:0,background:"linear-gradient(135deg,#7c3aed,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:"800",color:"#fff"}}>✦</div>
        {!sidebarCollapsed&&<div><div style={{fontSize:"13px",fontWeight:"700",color:"#e2e8f0",lineHeight:1}}>SkillForge AI</div><div style={{fontSize:"9px",color:"#475569",letterSpacing:"1.2px",textTransform:"uppercase",marginTop:"2px"}}>Admin Console</div></div>}
      </div>
      <nav style={{flex:1,overflowY:"auto",padding:"6px 8px",scrollbarWidth:"none"}}>
        {navSections.map(section=>(
          <div key={section.label}>
            {!sidebarCollapsed&&<SideSection label={section.label}/>}
            {sidebarCollapsed&&<div style={{height:"10px"}}/>}
            {section.items.map(item=>(
              <NavItem key={item.key} icon={item.icon} label={sidebarCollapsed?"":item.label} active={activeSection===item.key} badge={item.badgeKey&&stats?(stats[item.badgeKey]||0):0} onClick={()=>setActiveSection(item.key)}/>
            ))}
          </div>
        ))}
      </nav>
      <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"12px 10px",display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{width:"32px",height:"32px",borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,#7c3aed,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"12px",fontWeight:"700"}}>
          {adminName.split(" ").map(n=>n[0]).slice(0,2).join("")}
        </div>
        {!sidebarCollapsed&&<div style={{flex:1,overflow:"hidden"}}><div style={{fontSize:"12px",fontWeight:"600",color:"#e2e8f0",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{adminName}</div><div style={{fontSize:"10px",color:"#475569"}}>Super Admin</div></div>}
        {!sidebarCollapsed&&<button onClick={handleLogout} title="Logout" style={{background:"transparent",border:"none",color:"#64748b",cursor:"pointer",padding:"4px",borderRadius:"6px",display:"flex"}} onMouseEnter={e=>e.currentTarget.style.color="#f87171"} onMouseLeave={e=>e.currentTarget.style.color="#64748b"}><Icon name="logout" size={15}/></button>}
      </div>
    </aside>
  );

  const Header=()=>(
    <header style={{height:"56px",background:"#0b1120",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",padding:"0 20px",gap:"12px",position:"sticky",top:0,zIndex:100}}>
      <button onClick={()=>setSidebarCollapsed(v=>!v)} style={{background:"transparent",border:"none",color:"#64748b",cursor:"pointer",padding:"6px",borderRadius:"6px",display:"flex"}}><Icon name="chevronLeft" size={18}/></button>
      <div style={{fontSize:"15px",fontWeight:"700",color:"#e2e8f0"}}>{allNavItems.find(i=>i.key===activeSection)?.label||"Dashboard"}</div>
      <div style={{flex:1}}/>
      <div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"6px 12px",maxWidth:"220px",width:"100%"}}>
        <span style={{color:"#64748b",display:"flex"}}><Icon name="search" size={14}/></span>
        <input placeholder="Search platform..." style={{background:"transparent",border:"none",outline:"none",color:"#94a3b8",fontSize:"13px",width:"100%"}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:"8px",padding:"5px 10px",fontSize:"12px",fontWeight:"600",color:"#4ade80"}}>
        <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>API Healthy
      </div>
      <div style={{position:"relative"}}>
        <button style={{background:"transparent",border:"none",color:"#94a3b8",cursor:"pointer",padding:"6px",display:"flex",borderRadius:"6px"}}><Icon name="notifications" size={18}/></button>
        {stats&&stats.notificationsBadge>0&&<span style={{position:"absolute",top:"2px",right:"2px",background:"#ef4444",color:"#fff",borderRadius:"999px",fontSize:"9px",fontWeight:"700",padding:"0 4px",minWidth:"14px",textAlign:"center",lineHeight:"14px"}}>{stats.notificationsBadge}</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",padding:"6px 10px",cursor:"pointer"}}>
        <div style={{width:"26px",height:"26px",borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#4f46e5)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"10px",fontWeight:"700"}}>{adminName.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
        <span style={{fontSize:"13px",fontWeight:"600",color:"#e2e8f0"}}>{adminName}</span>
      </div>
    </header>
  );

  const DashboardContent=()=>{
    if(loading)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"400px",color:"#64748b",fontSize:"14px"}}><div style={{textAlign:"center"}}><div style={{fontSize:"28px",marginBottom:"12px"}}>⏳</div>Loading dashboard data…</div></div>;
    if(error)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"400px",color:"#f87171",fontSize:"14px"}}><div style={{textAlign:"center"}}><div style={{fontSize:"28px",marginBottom:"12px"}}>⚠️</div><div style={{fontWeight:"600",marginBottom:"6px"}}>Failed to load dashboard</div><div style={{color:"#64748b",fontSize:"12px",marginBottom:"16px"}}>{error}</div><div style={{color:"#64748b",fontSize:"11px",marginBottom:"12px"}}>Make sure the backend is running on port 9090</div><button onClick={()=>{setLoading(true);fetchStats();}} style={{background:"#7c3aed",color:"#fff",border:"none",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontWeight:"600",fontSize:"13px"}}>Retry</button></div></div>;
    if(!stats)return null;
    const{totalUsers,activeUsers,activeUsersPct,totalProjects,projectsThisWeek,pendingVerifications,oldestVerificationDays,openReports,connectionsThisMonth,aiRequestsToday,aiRequestsLimit,aiCostThisMonth,aiCostBudget,platformUptime,platformGrowth,recentActivity,aiWeeklyUsage}=stats;
    const growthPeriod=platformGrowth&&platformGrowth.length>=2?`${platformGrowth[0].month} ${platformGrowth[0].year} – ${platformGrowth[platformGrowth.length-1].month} ${platformGrowth[platformGrowth.length-1].year}`:"Last 12 Months";
    const totalAiThisWeek=(aiWeeklyUsage||[]).reduce((s,d)=>s+d.requests,0);
    const qaBtn=(onClick,bg,border,ic,icClr,label)=>(
      <button onClick={onClick} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:bg,border,borderRadius:"10px",padding:"13px 16px",cursor:"pointer",color:"#e2e8f0"}} onMouseEnter={e=>{e.currentTarget.style.opacity="0.85"}} onMouseLeave={e=>{e.currentTarget.style.opacity="1"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{color:icClr}}><Icon name={ic} size={15}/></span><span style={{fontSize:"13px",fontWeight:"500"}}>{label}</span></div>
        <Icon name="arrowRight" size={14}/>
      </button>
    );
    return(
      <div style={{padding:"28px 28px 48px"}}>
        <div style={{marginBottom:"28px"}}>
          <h1 style={{fontSize:"26px",fontWeight:"800",color:"#f1f5f9",margin:0,lineHeight:1.2}}>Dashboard Overview</h1>
          <p style={{margin:"6px 0 0",fontSize:"13px",color:"#64748b"}}>Platform health, growth, and AI usage at a glance — {todayStr}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"16px"}}>
          <KpiCard title="Total Users" value={totalUsers.toLocaleString()} subtitle={projectsThisWeek>0?`↑ ${projectsThisWeek} projects this week`:"No new projects this week"} trend="up" trendLabel={activeUsersPct>0?`${activeUsersPct}% completed profiles`:"No profiles yet"} icon="users" iconBg="rgba(99,102,241,0.15)" iconColor="#818cf8"/>
          <KpiCard title="Active Users" value={activeUsers.toLocaleString()} subtitle={totalUsers>0?`${activeUsersPct}% of total`:"No users yet"} trend="up" trendLabel={activeUsers===0?"No active users yet":`${activeUsers} with full profile`} icon="analytics" iconBg="rgba(16,185,129,0.15)" iconColor="#34d399"/>
          <KpiCard title="Total Projects" value={totalProjects.toLocaleString()} subtitle={projectsThisWeek>0?`${projectsThisWeek} created this week`:"No new projects this week"} trend={projectsThisWeek>0?"up":null} trendLabel={projectsThisWeek>0?`+${projectsThisWeek} this week`:"0 this week"} icon="projects" iconBg="rgba(6,182,212,0.15)" iconColor="#22d3ee"/>
          <KpiCard title="Pending Verifications" value={pendingVerifications.toString()} subtitle={pendingVerifications>0?`Oldest: ${oldestVerificationDays}d ago`:"No pending verifications"} trend={pendingVerifications>0?"down":null} trendLabel={pendingVerifications>0?"Needs review":"All clear"} icon="shield" iconBg="rgba(245,158,11,0.15)" iconColor="#fbbf24"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"28px"}}>
          <KpiCard title="Open Reports" value={openReports.toString()} subtitle={connectionsThisMonth>0?`${connectionsThisMonth} total this month`:"No reports this month"} trend={openReports>0?"down":null} trendLabel={openReports>0?"Pending review":"No open reports"} icon="flag" iconBg="rgba(239,68,68,0.15)" iconColor="#f87171"/>
          <KpiCard title="AI Requests Today" value={aiRequestsToday===0?"0":aiRequestsToday.toLocaleString()} subtitle={aiRequestsLimit>0?`${Math.round((aiRequestsToday/aiRequestsLimit)*100)}% of ${aiRequestsLimit.toLocaleString()} limit`:"No AI tracking configured"} trend={null} trendLabel={aiRequestsToday===0?"No AI module active":null} icon="bolt" iconBg="rgba(139,92,246,0.15)" iconColor="#a78bfa"/>
          <KpiCard title="AI Cost (This Month)" value={`$${aiCostThisMonth.toLocaleString("en-US",{minimumFractionDigits:2})}`} subtitle={aiCostBudget>0?`Budget: $${aiCostBudget.toLocaleString()}`:"No budget configured"} trend={null} trendLabel={aiCostThisMonth===0?"No AI spending":null} icon="dollar" iconBg="rgba(16,185,129,0.15)" iconColor="#34d399"/>
          <KpiCard title="Platform Uptime" value={`${platformUptime}%`} subtitle="Server is operational" trend="up" trendLabel="All systems running" icon="server" iconBg="rgba(16,185,129,0.15)" iconColor="#34d399"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 400px",gap:"20px",marginBottom:"20px"}}>
          <div style={{background:"#131929",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"14px",padding:"22px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}>
              <div><div style={{fontSize:"15px",fontWeight:"700",color:"#e2e8f0"}}>Platform Growth</div><div style={{fontSize:"12px",color:"#64748b",marginTop:"2px"}}>Users &amp; projects over 12 months</div></div>
              <span style={{fontSize:"11px",background:"rgba(139,92,246,0.15)",color:"#a78bfa",padding:"4px 10px",borderRadius:"6px",fontWeight:"600",border:"1px solid rgba(139,92,246,0.2)"}}>{growthPeriod}</span>
            </div>
            <div style={{height:"200px"}}>{platformGrowth&&platformGrowth.length>0?<LineChart data={platformGrowth} width={520} height={200}/>:<div style={{color:"#64748b",textAlign:"center",paddingTop:"80px",fontSize:"13px"}}>No growth data yet — create users and projects to see trends</div>}</div>
            <div style={{display:"flex",gap:"20px",marginTop:"14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"12px",color:"#94a3b8"}}><div style={{width:"24px",height:"3px",background:"#8b5cf6",borderRadius:"2px"}}/> Users</div>
              <div style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"12px",color:"#94a3b8"}}><div style={{width:"24px",height:"2px",borderTop:"2px dashed #06b6d4"}}/> Projects</div>
            </div>
          </div>
          <div style={{background:"#131929",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"14px",padding:"22px 24px",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
              <div style={{fontSize:"15px",fontWeight:"700",color:"#e2e8f0"}}>Recent Activity</div>
              <button style={{background:"transparent",border:"none",color:"#8b5cf6",cursor:"pointer",fontSize:"12px",fontWeight:"600",display:"flex",alignItems:"center",gap:"4px"}}>View all <Icon name="arrowRight" size={12}/></button>
            </div>
            <div style={{display:"flex",flexDirection:"column"}}>
              {recentActivity&&recentActivity.length>0?recentActivity.map((act,i)=>(
                <div key={i} style={{display:"flex",gap:"10px",padding:"10px 0",borderBottom:i<recentActivity.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                  <div style={{flexShrink:0,marginTop:"4px"}}><div style={{width:"8px",height:"8px",borderRadius:"50%",background:dotClr[act.color]||"#94a3b8"}}/></div>
                  <div style={{flex:1}}><div style={{fontSize:"12.5px",color:"#cbd5e1",fontWeight:"500",lineHeight:1.4}}>{act.label}</div><div style={{fontSize:"11px",color:"#475569",marginTop:"2px"}}>{act.formattedTime}</div></div>
                </div>
              )):<div style={{color:"#475569",textAlign:"center",padding:"40px 0",fontSize:"13px"}}><div style={{fontSize:"24px",marginBottom:"8px"}}>🔔</div>No recent activity yet.<br/><span style={{fontSize:"11px"}}>Events will appear when users create projects or connect.</span></div>}
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 400px",gap:"20px"}}>
          <div style={{background:"#131929",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"14px",padding:"22px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}>
              <div><div style={{fontSize:"15px",fontWeight:"700",color:"#e2e8f0"}}>AI API Usage — This Week</div><div style={{fontSize:"12px",color:"#64748b",marginTop:"2px"}}>Daily request volume</div></div>
              {totalAiThisWeek>0&&<span style={{fontSize:"13px",fontWeight:"700",color:"#4ade80"}}>{totalAiThisWeek.toLocaleString()} total</span>}
            </div>
            <div style={{height:"190px"}}>
              {totalAiThisWeek===0?<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:"#475569",fontSize:"13px",textAlign:"center"}}><div style={{fontSize:"28px",marginBottom:"10px"}}>🤖</div>No AI usage recorded yet.<br/><span style={{fontSize:"11px",marginTop:"4px"}}>AI tracking will appear here once integrated.</span></div>:<BarChart data={aiWeeklyUsage} height={190}/>}
            </div>
          </div>
          <div style={{background:"#131929",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"14px",padding:"22px 24px"}}>
            <div style={{fontSize:"15px",fontWeight:"700",color:"#e2e8f0",marginBottom:"18px"}}>Quick Actions</div>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {pendingVerifications>0&&qaBtn(()=>setActiveSection("verification"),"rgba(245,158,11,0.08)","1px solid rgba(245,158,11,0.2)","verification","#fbbf24",`Review ${pendingVerifications} pending verification${pendingVerifications!==1?"s":""}`)}
              {openReports>0&&qaBtn(()=>setActiveSection("reported"),"rgba(239,68,68,0.08)","1px solid rgba(239,68,68,0.2)","report","#f87171",`Resolve ${openReports} open report${openReports!==1?"s":""}`)}
              {qaBtn(()=>setActiveSection("aiusage"),"rgba(139,92,246,0.08)","1px solid rgba(139,92,246,0.2)","aiusage","#a78bfa","View AI usage report")}
              {stats.notificationsBadge>0&&qaBtn(()=>setActiveSection("notifications"),"rgba(96,165,250,0.08)","1px solid rgba(96,165,250,0.2)","notifications","#60a5fa",`${stats.notificationsBadge} unread notification${stats.notificationsBadge!==1?"s":""}`)}
              <div style={{marginTop:"8px",padding:"14px 16px",background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:"10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}><div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#4ade80"}}/><span style={{fontSize:"13px",fontWeight:"600",color:"#4ade80"}}>All systems operational</span></div>
                <div style={{fontSize:"11px",color:"#475569",paddingLeft:"16px"}}>API · Database · Auth — all green</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PlaceholderSection=({label})=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"400px",color:"#64748b",fontSize:"14px"}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:"36px",marginBottom:"12px"}}>🚧</div><div style={{fontWeight:"600",color:"#e2e8f0",marginBottom:"6px"}}>{label}</div><div>This section is coming soon.</div></div>
    </div>
  );

  const renderContent=()=>{
    if(activeSection==="dashboard")return<DashboardContent/>;
    return<PlaceholderSection label={allNavItems.find(i=>i.key===activeSection)?.label||activeSection}/>;
  };

  return(
    <div style={{minHeight:"100vh",background:"#0f172a",fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",color:"#e2e8f0"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <Header/>
        <main style={{flex:1,overflowY:"auto"}}>{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
