package com.jobreferral.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a major milestone / deliverable within a project.
 * Status: Upcoming | In Progress | Completed
 */
@Entity
@Table(name = "project_milestones")
public class ProjectMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "target_date", length = 100)
    private String targetDate;

    /** Upcoming | In Progress | Completed */
    @Column(nullable = false, length = 50)
    private String status = "In Progress";

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
        if (status == null || status.isBlank()) status = "In Progress";
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ──────────────────────────────────────────────────

    public Long getId()                          { return id; }
    public Long getProjectId()                   { return projectId; }
    public void setProjectId(Long projectId)     { this.projectId = projectId; }
    public String getTitle()                     { return title; }
    public void setTitle(String title)           { this.title = title; }
    public String getDescription()               { return description; }
    public void setDescription(String d)         { this.description = d; }
    public String getTargetDate()                { return targetDate; }
    public void setTargetDate(String td)         { this.targetDate = td; }
    public String getStatus()                    { return status; }
    public void setStatus(String status)         { this.status = status; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public LocalDateTime getUpdatedAt()          { return updatedAt; }
}
