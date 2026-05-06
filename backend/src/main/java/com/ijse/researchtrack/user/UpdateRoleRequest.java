package com.ijse.researchtrack.user;

import com.ijse.researchtrack.common.UserRole;

public class UpdateRoleRequest {
    private UserRole role;

    public UpdateRoleRequest() {
    }

    public UpdateRoleRequest(UserRole role) {
        this.role = role;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
