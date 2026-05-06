package com.ijse.researchtrack.document;

import jakarta.validation.constraints.NotBlank;

public class DocumentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "URL or path is required")
    private String urlOrPath;

    // Default Constructor
    public DocumentRequest() {
    }

    // All-Args Constructor
    public DocumentRequest(String title, String description, String urlOrPath) {
        this.title = title;
        this.description = description;
        this.urlOrPath = urlOrPath;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "DocumentRequest{" +
                "title='" + title + '\'' +
                ", urlOrPath='" + urlOrPath + '\'' +
                '}';
    }
}
