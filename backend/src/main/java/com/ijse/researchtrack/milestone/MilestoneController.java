package com.ijse.researchtrack.milestone;

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

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MilestoneController {

    private final MilestoneService milestoneService;

    @Autowired
    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    @GetMapping("/projects/{projectId}/milestones")
    public ResponseEntity<List<MilestoneDTO>> getMilestonesByProjectId(@PathVariable String projectId) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        List<MilestoneDTO> milestones = milestoneService.getMilestonesByProjectId(projectId, currentUser.getId(), role);
        return ResponseEntity.ok(milestones);
    }

    @GetMapping("/milestones")
    public ResponseEntity<List<MilestoneDTO>> getAllMilestones() {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        List<MilestoneDTO> milestones = milestoneService.getAllMilestones(currentUser.getId(), role);
        return ResponseEntity.ok(milestones);
    }

    @GetMapping("/milestones/{id}")
    public ResponseEntity<MilestoneDTO> getMilestoneById(@PathVariable String id) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        MilestoneDTO milestone = milestoneService.getMilestoneById(id, currentUser.getId(), role);
        return ResponseEntity.ok(milestone);
    }

    @PostMapping("/projects/{projectId}/milestones")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI', 'MEMBER')")
    public ResponseEntity<MilestoneDTO> createMilestone(@PathVariable String projectId,
            @Valid @RequestBody MilestoneRequest request) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);
        MilestoneDTO milestone = milestoneService.createMilestone(projectId, request, currentUser.getId(), role);
        return ResponseEntity.status(HttpStatus.CREATED).body(milestone);
    }

    @PutMapping("/milestones/{id}")
    public ResponseEntity<MilestoneDTO> updateMilestone(@PathVariable String id,
            @Valid @RequestBody MilestoneRequest request) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        MilestoneDTO milestone = milestoneService.updateMilestone(id, request, currentUser.getId(), role);
        return ResponseEntity.ok(milestone);
    }

    @PatchMapping("/milestones/{id}/toggle-completion")
    public ResponseEntity<MilestoneDTO> toggleMilestoneCompletion(@PathVariable String id) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        MilestoneDTO milestone = milestoneService.toggleMilestoneCompletion(id, currentUser.getId(), role);
        return ResponseEntity.ok(milestone);
    }

    @DeleteMapping("/milestones/{id}")
    public ResponseEntity<Void> deleteMilestone(@PathVariable String id) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        milestoneService.deleteMilestone(id, currentUser.getId(), role);
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
