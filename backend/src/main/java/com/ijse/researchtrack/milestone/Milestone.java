package com.ijse.researchtrack.milestone;

import com.ijse.researchtrack.project.Project;
import com.ijse.researchtrack.user.User;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "milestones")
public class Milestone {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate dueDate;

    @Column(nullable = false)
    private Boolean isCompleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @Column(nullable = false)
    private java.time.LocalDateTime updatedAt;

    // Default Constructor
    public Milestone() {
        this.isCompleted = false;
        this.createdAt = java.time.LocalDateTime.now();
        this.updatedAt = java.time.LocalDateTime.now();
    }

    // All-Args Constructor
    public Milestone(String id, Project project, String title, String description,
            LocalDate dueDate, Boolean isCompleted, User createdBy, 
            java.time.LocalDateTime createdAt, java.time.LocalDateTime updatedAt) {
        this.id = id;
        this.project = project;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = java.time.LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = java.time.LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Milestone{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", dueDate=" + dueDate +
                ", isCompleted=" + isCompleted +
                '}';
    }
}
