package com.ijse.researchtrack.projectmember;

import com.ijse.researchtrack.common.UserRole;
import com.ijse.researchtrack.config.UserDetailsImpl;
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
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    @Autowired
    public ProjectMemberController(ProjectMemberService projectMemberService) {
        this.projectMemberService = projectMemberService;
    }

    // Get all members of a project
    @GetMapping("/{projectId}/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI')")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembers(@PathVariable String projectId) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        List<ProjectMemberDTO> members = projectMemberService.getProjectMembers(
                projectId, currentUser.getId(), role);
        return ResponseEntity.ok(members);
    }

    // Add member to project
    @PostMapping("/{projectId}/members")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI')")
    public ResponseEntity<ProjectMemberDTO> addMemberToProject(
            @PathVariable String projectId,
            @RequestBody Map<String, String> request) {

        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);
        String userId = request.get("userId");

        if (userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        ProjectMemberDTO member = projectMemberService.addMemberToProject(
                projectId, userId, currentUser.getId(), role);
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }

    // Remove member from project
    @DeleteMapping("/{projectId}/members/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI')")
    public ResponseEntity<Void> removeMemberFromProject(
            @PathVariable String projectId,
            @PathVariable String userId) {

        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        projectMemberService.removeMemberFromProject(
                projectId, userId, currentUser.getId(), role);
        return ResponseEntity.noContent().build();
    }

    // Get all projects for a member
    @GetMapping("/member/{userId}/projects")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI', 'MEMBER')")
    public ResponseEntity<List<ProjectMemberDTO>> getMemberProjects(@PathVariable String userId) {
        List<ProjectMemberDTO> projects = projectMemberService.getMemberProjects(userId);
        return ResponseEntity.ok(projects);
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
