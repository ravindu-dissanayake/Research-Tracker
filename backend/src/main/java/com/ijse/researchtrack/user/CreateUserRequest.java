package com.ijse.researchtrack.user;

import com.ijse.researchtrack.common.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String username;
    private String password;
    private String fullName;
    private UserRole role;
}
