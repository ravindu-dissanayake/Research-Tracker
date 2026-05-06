package com.ijse.researchtrack.projectmember;

import com.ijse.researchtrack.project.Project;
import com.ijse.researchtrack.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_members", uniqueConstraints = @UniqueConstraint(columnNames = { "project_id", "user_id" }))
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "added_at", nullable = false, updatable = false)
    private LocalDateTime addedAt;

    @Column(name = "added_by")
    private String addedBy;

    // Default Constructor
    public ProjectMember() {
        this.addedAt = LocalDateTime.now();
    }

    // Constructor
    public ProjectMember(Project project, User user, String addedBy) {
        this.project = project;
        this.user = user;
        this.addedBy = addedBy;
        this.addedAt = LocalDateTime.now();
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public String getAddedBy() {
        return addedBy;
    }

    public void setAddedBy(String addedBy) {
        this.addedBy = addedBy;
    }

    @PrePersist
    protected void onCreate() {
        if (addedAt == null) {
            addedAt = LocalDateTime.now();
        }
    }
}
