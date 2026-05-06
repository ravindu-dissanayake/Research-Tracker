package com.ijse.researchtrack.projectmember;

import com.ijse.researchtrack.common.UserRole;
import com.ijse.researchtrack.project.Project;
import com.ijse.researchtrack.project.ProjectRepository;
import com.ijse.researchtrack.user.User;
import com.ijse.researchtrack.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProjectMemberService(ProjectMemberRepository projectMemberRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {
        this.projectMemberRepository = projectMemberRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // Get all members of a project
    public List<ProjectMemberDTO> getProjectMembers(String projectId, String currentUserId, UserRole currentUserRole) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check authorization: ADMIN can see all, PI can see their own projects
        if (currentUserRole != UserRole.ADMIN && !project.getPi().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to view project members");
        }

        List<ProjectMember> members = projectMemberRepository.findByProjectId(projectId);
        return members.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Add member to project
    @Transactional
    public ProjectMemberDTO addMemberToProject(String projectId, String userId,
            String currentUserId, UserRole currentUserRole) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check authorization: ADMIN or PI of the project can add members
        if (currentUserRole != UserRole.ADMIN && !project.getPi().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to add members to this project");
        }

        // Check if member already exists
        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new RuntimeException("User is already a member of this project");
        }

        // Don't add PI as a member (they're already PI)
        if (project.getPi().getId().equals(userId)) {
            throw new RuntimeException("PI is already associated with the project");
        }

        ProjectMember projectMember = new ProjectMember(project, user, currentUserId);
        projectMember = projectMemberRepository.save(projectMember);

        return convertToDTO(projectMember);
    }

    // Remove member from project
    @Transactional
    public void removeMemberFromProject(String projectId, String userId,
            String currentUserId, UserRole currentUserRole) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check authorization: ADMIN or PI of the project can remove members
        if (currentUserRole != UserRole.ADMIN && !project.getPi().getId().equals(currentUserId)) {
            throw new RuntimeException("Unauthorized to remove members from this project");
        }

        // Don't allow removing PI
        if (project.getPi().getId().equals(userId)) {
            throw new RuntimeException("Cannot remove PI from project");
        }

        if (!projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
            throw new RuntimeException("User is not a member of this project");
        }

        projectMemberRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    // Get all projects for a member
    public List<ProjectMemberDTO> getMemberProjects(String userId) {
        List<ProjectMember> memberships = projectMemberRepository.findByUserId(userId);
        return memberships.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Convert entity to DTO
    private ProjectMemberDTO convertToDTO(ProjectMember projectMember) {
        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setId(projectMember.getId());
        dto.setProjectId(projectMember.getProject().getId());
        dto.setProjectTitle(projectMember.getProject().getTitle());
        dto.setUserId(projectMember.getUser().getId());
        dto.setUsername(projectMember.getUser().getUsername());
        dto.setUserRole(projectMember.getUser().getRole().name());
        dto.setAddedAt(projectMember.getAddedAt().toString());
        dto.setAddedBy(projectMember.getAddedBy());
        return dto;
    }
}
