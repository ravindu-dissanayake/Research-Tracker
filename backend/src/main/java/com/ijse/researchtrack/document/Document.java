package com.ijse.researchtrack.document;

import com.ijse.researchtrack.project.Project;
import com.ijse.researchtrack.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String urlOrPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Default Constructor
    public Document() {
        this.uploadedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // All-Args Constructor
    public Document(String id, Project project, String title, String description,
            String urlOrPath, User uploadedBy, LocalDateTime uploadedAt, LocalDateTime updatedAt) {
        this.id = id;
        this.project = project;
        this.title = title;
        this.description = description;
        this.urlOrPath = urlOrPath;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = uploadedAt;
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

    public String getUrlOrPath() {
        return urlOrPath;
    }

    public void setUrlOrPath(String urlOrPath) {
        this.urlOrPath = urlOrPath;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
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

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Document{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", urlOrPath='" + urlOrPath + '\'' +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
