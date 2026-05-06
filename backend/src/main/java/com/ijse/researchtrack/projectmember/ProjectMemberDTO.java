package com.ijse.researchtrack.projectmember;

public class ProjectMemberDTO {
    private String id;
    private String projectId;
    private String projectTitle;
    private String userId;
    private String username;
    private String userRole;
    private String addedAt;
    private String addedBy;

    // Default Constructor
    public ProjectMemberDTO() {
    }

    // Constructor
    public ProjectMemberDTO(String id, String projectId, String projectTitle,
            String userId, String username, String userRole,
            String addedAt, String addedBy) {
        this.id = id;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.userId = userId;
        this.username = username;
        this.userRole = userRole;
        this.addedAt = addedAt;
        this.addedBy = addedBy;
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

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(String addedAt) {
        this.addedAt = addedAt;
    }

    public String getAddedBy() {
        return addedBy;
    }

    public void setAddedBy(String addedBy) {
        this.addedBy = addedBy;
    }
}
