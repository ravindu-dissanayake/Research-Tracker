package com.ijse.researchtrack.document;

import com.ijse.researchtrack.user.UserDTO;
import java.time.LocalDateTime;

public class DocumentDTO {

    private String id;
    private String projectId;
    private String title;
    private String description;
    private String urlOrPath;
    private UserDTO uploadedBy;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;

    // Default Constructor
    public DocumentDTO() {
    }

    // All-Args Constructor
    public DocumentDTO(String id, String projectId, String title, String description,
            String urlOrPath, UserDTO uploadedBy, LocalDateTime uploadedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.urlOrPath = urlOrPath;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = uploadedAt;
        this.updatedAt = updatedAt;
    }

    // Constructor from Entity
    public DocumentDTO(Document document) {
        this.id = document.getId();
        this.projectId = document.getProject().getId();
        this.title = document.getTitle();
        this.description = document.getDescription();
        this.urlOrPath = document.getUrlOrPath();
        this.uploadedBy = new UserDTO(document.getUploadedBy());
        this.uploadedAt = document.getUploadedAt();
        this.updatedAt = document.getUpdatedAt();
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

    public String getUrlOrPath() {
        return urlOrPath;
    }

    public void setUrlOrPath(String urlOrPath) {
        this.urlOrPath = urlOrPath;
    }

    public UserDTO getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(UserDTO uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "DocumentDTO{" +
                "id='" + id + '\'' +
                ", projectId='" + projectId + '\'' +
                ", title='" + title + '\'' +
                ", urlOrPath='" + urlOrPath + '\'' +
                ", uploadedAt=" + uploadedAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
