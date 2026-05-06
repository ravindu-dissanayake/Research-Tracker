package com.ijse.researchtrack.user;

import com.ijse.researchtrack.config.UserDetailsImpl;
import com.ijse.researchtrack.common.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> createUser(@RequestBody CreateUserRequest request) {
        UserDTO user = userService.createUser(request);
        return ResponseEntity.status(201).body(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        UserDetailsImpl currentUser = getAuthenticatedUser();
        UserRole role = getUserRole(currentUser);

        UserDTO user = userService.getUserById(id, currentUser.getId(), role);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable String id, @RequestBody UpdateRoleRequest request) {
        UserDTO updatedUser = userService.updateUserRole(id, request.getRole());
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        UserDetailsImpl userDetails = getAuthenticatedUser();
        UserDTO user = userService.getUserById(userDetails.getId(), userDetails.getId(), getUserRole(userDetails));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUserProfile(@RequestBody UpdateProfileRequest request) {
        UserDetailsImpl userDetails = getAuthenticatedUser();
        UserDTO updatedUser = userService.updateProfile(userDetails.getId(), request);
        return ResponseEntity.ok(updatedUser);
    }

    private UserDetailsImpl getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    private UserRole getUserRole(UserDetailsImpl userDetails) {
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        return UserRole.valueOf(role.replace("ROLE_", ""));
    }
}
