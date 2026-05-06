package com.ijse.researchtrack.milestone;

import com.ijse.researchtrack.user.UserDTO;
import java.time.LocalDate;

public class MilestoneDTO {

    private String id;
    private String projectId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Boolean isCompleted;
    private UserDTO createdBy;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    // Default Constructor
    public MilestoneDTO() {
    }

    // All-Args Constructor
    public MilestoneDTO(String id, String projectId, String title, String description,
            LocalDate dueDate, Boolean isCompleted, UserDTO createdBy, 
            java.time.LocalDateTime createdAt, java.time.LocalDateTime updatedAt) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Constructor from Entity
    public MilestoneDTO(Milestone milestone) {
        this.id = milestone.getId();
        this.projectId = milestone.getProject().getId();
        this.title = milestone.getTitle();
        this.description = milestone.getDescription();
        this.dueDate = milestone.getDueDate();
        this.isCompleted = milestone.getIsCompleted();
        this.createdBy = new UserDTO(milestone.getCreatedBy());
        this.createdAt = milestone.getCreatedAt();
        this.updatedAt = milestone.getUpdatedAt();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
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

    public UserDTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserDTO createdBy) {
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

    @Override
    public String toString() {
        return "MilestoneDTO{" +
                "id='" + id + '\'' +
                ", projectId='" + projectId + '\'' +
                ", title='" + title + '\'' +
                ", dueDate=" + dueDate +
                ", isCompleted=" + isCompleted +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
