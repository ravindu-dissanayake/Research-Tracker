package com.ijse.researchtrack.project;

import com.ijse.researchtrack.common.ProjectStatus;
import com.ijse.researchtrack.user.UserDTO;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProjectDTO {

    private String id;
    private String title;
    private String summary;
    private ProjectStatus status;
    private UserDTO pi;
    private String tags;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default Constructor
    public ProjectDTO() {
    }

    // All-Args Constructor
    public ProjectDTO(String id, String title, String summary, ProjectStatus status, UserDTO pi,
            String tags, LocalDate startDate, LocalDate endDate,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.status = status;
        this.pi = pi;
        this.tags = tags;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Constructor from Entity
    public ProjectDTO(Project project) {
        this.id = project.getId();
        this.title = project.getTitle();
        this.summary = project.getSummary();
        this.status = project.getStatus();
        this.pi = new UserDTO(project.getPi());
        this.tags = project.getTags();
        this.startDate = project.getStartDate();
        this.endDate = project.getEndDate();
        this.createdAt = project.getCreatedAt();
        this.updatedAt = project.getUpdatedAt();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public UserDTO getPi() {
        return pi;
    }

    public void setPi(UserDTO pi) {
        this.pi = pi;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "ProjectDTO{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", status=" + status +
                ", tags='" + tags + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                '}';
    }
}
