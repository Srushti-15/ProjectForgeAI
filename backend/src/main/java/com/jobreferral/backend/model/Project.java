package com.jobreferral.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Persists collaborative projects created by candidates.
 * The creator is automatically designated as Team Leader.
 */
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String category; // e.g. EdTech, Social, HealthTech, Sustainability, AI / ML

    /** JSON string array of skills/technologies e.g. ["React", "Python", "TensorFlow"] */
    @Column(columnDefinition = "TEXT")
    private String skills;

    /** active | review | completed */
    @Column(length = 50, nullable = false)
    private String status = "active";

    @Column(name = "leader_email", nullable = false, length = 255)
    private String leaderEmail;

    @Column(name = "leader_name", length = 255)
    private String leaderName;

    @Column(name = "leader_photo", columnDefinition = "LONGTEXT")
    private String leaderPhoto;

    @Column(name = "due_date", length = 100)
    private String dueDate; // e.g. "Dec 15, 2026"

    /** JSON string array of member emails on this project: includes leader + selected teammates */
    @Column(name = "member_emails", columnDefinition = "TEXT")
    private String memberEmails;

    /** approved | pending | rejected */
    @Column(name = "verification_status", length = 50)
    private String verificationStatus = "pending";

    @Column(name = "team_capacity")
    private Integer teamCapacity = 5;

    @Column(name = "report_count")
    private Integer reportCount = 0;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
        if (status == null || status.isBlank()) status = "active";
        if (verificationStatus == null || verificationStatus.isBlank()) verificationStatus = "pending";
        if (teamCapacity == null) teamCapacity = 5;
        if (reportCount == null) reportCount = 0;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ──────────────────────────────────────────────────

    public Long getId()                          { return id; }
    public String getName()                      { return name; }
    public void setName(String name)             { this.name = name; }
    public String getDescription()               { return description; }
    public void setDescription(String d)         { this.description = d; }
    public String getCategory()                  { return category; }
    public void setCategory(String category)     { this.category = category; }
    public String getSkills()                    { return skills; }
    public void setSkills(String skills)         { this.skills = skills; }
    public String getStatus()                    { return status; }
    public void setStatus(String status)         { this.status = status; }
    public String getLeaderEmail()               { return leaderEmail; }
    public void setLeaderEmail(String le)        { this.leaderEmail = le; }
    public String getLeaderName()                { return leaderName; }
    public void setLeaderName(String ln)         { this.leaderName = ln; }
    public String getLeaderPhoto()               { return leaderPhoto; }
    public void setLeaderPhoto(String lp)        { this.leaderPhoto = lp; }
    public String getDueDate()                   { return dueDate; }
    public void setDueDate(String dueDate)       { this.dueDate = dueDate; }
    public String getMemberEmails()              { return memberEmails; }
    public void setMemberEmails(String me)       { this.memberEmails = me; }
    public String getVerificationStatus()        { return verificationStatus; }
    public void setVerificationStatus(String vs) { this.verificationStatus = vs; }
    public Integer getTeamCapacity()             { return teamCapacity; }
    public void setTeamCapacity(Integer tc)      { this.teamCapacity = tc; }
    public Integer getReportCount()              { return reportCount; }
    public void setReportCount(Integer rc)       { this.reportCount = rc; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public LocalDateTime getUpdatedAt()          { return updatedAt; }
}
