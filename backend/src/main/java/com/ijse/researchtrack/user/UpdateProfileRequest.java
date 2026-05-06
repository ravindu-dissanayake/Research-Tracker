package com.ijse.researchtrack.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
    
    @NotBlank(message = "Full name is required")
    @Size(min = 3, message = "Full name must be at least 3 characters")
    private String fullName;

    // Password is optional
    private String password;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
