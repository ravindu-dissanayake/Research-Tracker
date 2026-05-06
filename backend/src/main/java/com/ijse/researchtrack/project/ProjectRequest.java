package com.ijse.researchtrack.project;

import com.ijse.researchtrack.common.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Summary is required")
    @Size(min = 10, message = "Summary must be at least 10 characters")
    private String summary;

    @NotNull(message = "Status is required")
    private ProjectStatus status;

    @NotBlank(message = "PI ID is required")
    private String piId;

    private String tags;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    // Default Constructor
    public ProjectRequest() {
    }

    // All-Args Constructor
    public ProjectRequest(String title, String summary, ProjectStatus status, String piId,
            String tags, LocalDate startDate, LocalDate endDate) {
        this.title = title;
        this.summary = summary;
        this.status = status;
        this.piId = piId;
        this.tags = tags;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
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

    public String getPiId() {
        return piId;
    }

    public void setPiId(String piId) {
        this.piId = piId;
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

    @Override
    public String toString() {
        return "ProjectRequest{" +
                "title='" + title + '\'' +
                ", status=" + status +
                ", piId='" + piId + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                '}';
    }
}
