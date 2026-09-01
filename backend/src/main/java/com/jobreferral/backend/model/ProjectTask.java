package com.jobreferral.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a task on a project's Kanban board.
 * Status: Backlog | In Progress | Review | Done
 */
@Entity
@Table(name = "project_tasks")
public class ProjectTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_tag", length = 100)
    private String categoryTag; // e.g. "backend", "auth", "frontend", "ui", "ml", "db", "devops"

    /** Backlog | In Progress | Review | Done */
    @Column(nullable = false, length = 50)
    private String status = "Backlog";

    /** high | medium | low */
    @Column(length = 20)
    private String priority = "medium";

    /** Story points e.g. 3, 5, 8, 13 */
    private Integer points = 5;

    @Column(name = "assigned_email", length = 255)
    private String assignedEmail;

    @Column(name = "assigned_name", length = 255)
    private String assignedName;

    @Column(name = "assigned_photo", columnDefinition = "LONGTEXT")
    private String assignedPhoto;

    @Column(name = "due_date", length = 100)
    private String dueDate; // e.g. "Nov 28"

    @Column(name = "milestone_id")
    private Long milestoneId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
        if (status == null || status.isBlank()) status = "Backlog";
        if (priority == null || priority.isBlank()) priority = "medium";
        if (points == null) points = 5;
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
    public String getCategoryTag()               { return categoryTag; }
    public void setCategoryTag(String tag)       { this.categoryTag = tag; }
    public String getStatus()                    { return status; }
    public void setStatus(String status)         { this.status = status; }
    public String getPriority()                  { return priority; }
    public void setPriority(String priority)     { this.priority = priority; }
    public Integer getPoints()                   { return points; }
    public void setPoints(Integer points)        { this.points = points; }
    public String getAssignedEmail()             { return assignedEmail; }
    public void setAssignedEmail(String ae)      { this.assignedEmail = ae; }
    public String getAssignedName()              { return assignedName; }
    public void setAssignedName(String an)       { this.assignedName = an; }
    public String getAssignedPhoto()             { return assignedPhoto; }
    public void setAssignedPhoto(String ap)      { this.assignedPhoto = ap; }
    public String getDueDate()                   { return dueDate; }
    public void setDueDate(String dueDate)       { this.dueDate = dueDate; }
    public Long getMilestoneId()                 { return milestoneId; }
    public void setMilestoneId(Long mId)         { this.milestoneId = mId; }
    public LocalDateTime getCreatedAt()          { return createdAt; }
    public LocalDateTime getUpdatedAt()          { return updatedAt; }
}
