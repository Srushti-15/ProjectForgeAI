package com.jobreferral.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a teammate invitation/connection between two candidates.
 * Status lifecycle: pending → accepted | rejected
 */
@Entity
@Table(name = "team_connections",
    uniqueConstraints = @UniqueConstraint(columnNames = {"from_email", "to_email"}))
public class TeamConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_email", nullable = false, length = 255)
    private String fromEmail;

    @Column(name = "to_email", nullable = false, length = 255)
    private String toEmail;

    /** Sender's display name at time of invite */
    @Column(name = "from_name", length = 255)
    private String fromName;

    /** Sender's base-64 photo at time of invite */
    @Column(name = "from_photo", columnDefinition = "LONGTEXT")
    private String fromPhoto;

    @Column(name = "from_college", length = 255)
    private String fromCollege;

    @Column(name = "from_degree", length = 255)
    private String fromDegree;

    @Column(name = "from_domain", length = 255)
    private String fromDomain;

    @Column(name = "from_availability", length = 100)
    private String fromAvailability;

    /** JSON array of skill objects [{name, level}] */
    @Column(name = "from_skills", columnDefinition = "TEXT")
    private String fromSkills;

    /** pending | accepted | rejected */
    @Column(nullable = false, length = 20)
    private String status = "pending";

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }

    @PreUpdate
    public void onUpdate() { updatedAt = LocalDateTime.now(); }

    // ── Getters & Setters ─────────────────────────────────────────────────

    public Long getId()                         { return id; }
    public String getFromEmail()                { return fromEmail; }
    public void   setFromEmail(String e)        { this.fromEmail = e; }
    public String getToEmail()                  { return toEmail; }
    public void   setToEmail(String e)          { this.toEmail = e; }
    public String getFromName()                 { return fromName; }
    public void   setFromName(String n)         { this.fromName = n; }
    public String getFromPhoto()                { return fromPhoto; }
    public void   setFromPhoto(String p)        { this.fromPhoto = p; }
    public String getFromCollege()              { return fromCollege; }
    public void   setFromCollege(String c)      { this.fromCollege = c; }
    public String getFromDegree()               { return fromDegree; }
    public void   setFromDegree(String d)       { this.fromDegree = d; }
    public String getFromDomain()               { return fromDomain; }
    public void   setFromDomain(String d)       { this.fromDomain = d; }
    public String getFromAvailability()         { return fromAvailability; }
    public void   setFromAvailability(String a) { this.fromAvailability = a; }
    public String getFromSkills()               { return fromSkills; }
    public void   setFromSkills(String s)       { this.fromSkills = s; }
    public String getStatus()                   { return status; }
    public void   setStatus(String s)           { this.status = s; }
    public LocalDateTime getCreatedAt()         { return createdAt; }
    public LocalDateTime getUpdatedAt()         { return updatedAt; }
}
