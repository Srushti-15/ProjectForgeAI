package com.jobreferral.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Persists the full developer profile for a candidate.
 * One row per student email (email is the natural key).
 * Skills and interests are stored as JSON strings because their
 * internal structure is owned by the frontend.
 */
@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String email;

    @Column(length = 255)
    private String name;

    /** Base-64 encoded image – stored in LONGTEXT to handle large images. */
    @Column(columnDefinition = "LONGTEXT")
    private String photo;

    @Column(length = 255)
    private String college;

    @Column(length = 255)
    private String degree;

    @Column(length = 10)
    private String graduationYear;

    /** JSON array – e.g. [{"name":"React","level":80}, ...] */
    @Column(columnDefinition = "TEXT")
    private String skills;

    /** JSON array – e.g. ["Machine Learning","Open Source"] */
    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(length = 50)
    private String experienceLevel;

    @Column(length = 500)
    private String github;

    @Column(length = 500)
    private String linkedin;

    @Column(length = 100)
    private String projectDomain;

    @Column(length = 50)
    private String availability;

    private LocalDateTime completedAt;
    private LocalDateTime updatedAt;

    // ── Getters & Setters ──────────────────────────────────────────────

    public Long getId()                     { return id; }
    public String getEmail()                { return email; }
    public void   setEmail(String e)        { this.email = e; }
    public String getName()                 { return name; }
    public void   setName(String n)         { this.name = n; }
    public String getPhoto()                { return photo; }
    public void   setPhoto(String p)        { this.photo = p; }
    public String getCollege()              { return college; }
    public void   setCollege(String c)      { this.college = c; }
    public String getDegree()               { return degree; }
    public void   setDegree(String d)       { this.degree = d; }
    public String getGraduationYear()       { return graduationYear; }
    public void   setGraduationYear(String g){ this.graduationYear = g; }
    public String getSkills()               { return skills; }
    public void   setSkills(String s)       { this.skills = s; }
    public String getInterests()            { return interests; }
    public void   setInterests(String i)    { this.interests = i; }
    public String getExperienceLevel()      { return experienceLevel; }
    public void   setExperienceLevel(String e){ this.experienceLevel = e; }
    public String getGithub()               { return github; }
    public void   setGithub(String g)       { this.github = g; }
    public String getLinkedin()             { return linkedin; }
    public void   setLinkedin(String l)     { this.linkedin = l; }
    public String getProjectDomain()        { return projectDomain; }
    public void   setProjectDomain(String p){ this.projectDomain = p; }
    public String getAvailability()         { return availability; }
    public void   setAvailability(String a) { this.availability = a; }
    public LocalDateTime getCompletedAt()   { return completedAt; }
    public void   setCompletedAt(LocalDateTime t){ this.completedAt = t; }
    public LocalDateTime getUpdatedAt()     { return updatedAt; }
    public void   setUpdatedAt(LocalDateTime t)  { this.updatedAt = t; }
}
