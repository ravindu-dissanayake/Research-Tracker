package com.ijse.researchtrack.project;

import com.ijse.researchtrack.common.ProjectStatus;
import com.ijse.researchtrack.common.UserRole;
import com.ijse.researchtrack.config.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        List<ProjectDTO> projects = projectService.getProjectsForUser(currentUser.getId(), currentUser.getUsername(),
                role);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable String id) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        ProjectDTO project = projectService.getProjectById(id, currentUser.getId(), role);
        return ResponseEntity.ok(project);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PI')")
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectRequest request) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        ProjectDTO project = projectService.createProject(request, currentUser.getId(), role);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable String id,
            @Valid @RequestBody ProjectRequest request) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        ProjectDTO project = projectService.updateProject(id, request, currentUser.getId(), role);
        return ResponseEntity.ok(project);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProjectDTO> updateProjectStatus(@PathVariable String id,
            @RequestBody Map<String, String> statusMap) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        ProjectStatus status = ProjectStatus.valueOf(statusMap.get("status"));
        ProjectDTO project = projectService.updateProjectStatus(id, status, currentUser.getId(), role);
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        projectService.deleteProject(id, role);
        return ResponseEntity.noContent().build();
    }

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    private UserRole getUserRole(UserDetailsImpl userDetails) {
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        return UserRole.valueOf(role.replace("ROLE_", ""));
    }
}
