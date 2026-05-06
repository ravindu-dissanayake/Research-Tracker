package com.ijse.researchtrack.project;

import com.ijse.researchtrack.common.ProjectStatus;
import com.ijse.researchtrack.common.ResourceNotFoundException;
import com.ijse.researchtrack.common.UnauthorizedException;
import com.ijse.researchtrack.common.UserRole;
import com.ijse.researchtrack.config.UserDetailsImpl;
import com.ijse.researchtrack.projectmember.ProjectMember;
import com.ijse.researchtrack.projectmember.ProjectMemberRepository;
import com.ijse.researchtrack.user.User;
import com.ijse.researchtrack.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, ProjectMemberRepository projectMemberRepository,
            UserService userService) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userService = userService;
    }

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }

    public List<ProjectDTO> getProjectsForUser(String userId, String username, UserRole role) {
        List<Project> projects;

        switch (role) {
            case ADMIN:
                projects = projectRepository.findAll();
                break;
            case PI:
                projects = projectRepository.findByPiId(userId);
                break;
            case MEMBER:
                projects = projectMemberRepository.findByUserId(userId).stream()
                        .map(ProjectMember::getProject)
                        .distinct()
                        .collect(Collectors.toList());
                break;
            case VIEWER:
                projects = projectRepository.findAll().stream()
                        .filter(project -> project.getStatus() == ProjectStatus.ACTIVE
                                || project.getStatus() == ProjectStatus.COMPLETED)
                        .collect(Collectors.toList());
                break;
            default:
                projects = List.of();
        }

        return projects.stream()
                .map(ProjectDTO::new)
                .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(String id, String currentUserId, UserRole currentUserRole) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        ensureProjectReadAccess(project, currentUserId, currentUserRole);
        return new ProjectDTO(project);
    }

    public Project getProjectEntityById(String id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public void ensureProjectReadAccess(Project project, String currentUserId, UserRole currentUserRole) {
        if (currentUserRole == UserRole.ADMIN) {
            return;
        }

        if (currentUserRole == UserRole.PI) {
            if (project.getPi().getId().equals(currentUserId)) {
                return;
            }
            throw new UnauthorizedException("You don't have permission to view this project");
        }

        if (currentUserRole == UserRole.MEMBER) {
            boolean isMember = projectMemberRepository.existsByProjectIdAndUserId(project.getId(), currentUserId);
            if (isMember) {
                return;
            }
            throw new UnauthorizedException("You don't have permission to view this project");
        }

        if (currentUserRole == UserRole.VIEWER) {
            if (project.getStatus() == ProjectStatus.ACTIVE || project.getStatus() == ProjectStatus.COMPLETED) {
                return;
            }
            throw new UnauthorizedException("Viewers can only access public project data");
        }

        throw new UnauthorizedException("You don't have permission to view this project");
    }

    public boolean canReadProject(String projectId, String currentUserId, UserRole currentUserRole) {
        Project project = getProjectEntityById(projectId);
        try {
            ensureProjectReadAccess(project, currentUserId, currentUserRole);
            return true;
        } catch (UnauthorizedException ex) {
            return false;
        }
    }

    public ProjectDTO createProject(ProjectRequest request, String currentUserId, UserRole currentUserRole) {
        // Only ADMIN and PI can create projects
        if (currentUserRole != UserRole.ADMIN && currentUserRole != UserRole.PI) {
            throw new UnauthorizedException("Only ADMIN or PI can create projects");
        }

        User pi = userService.getUserEntityById(request.getPiId());

        Project project = new Project();
        project.setId(UUID.randomUUID().toString());
        project.setTitle(request.getTitle());
        project.setSummary(request.getSummary());
        project.setStatus(request.getStatus());
        project.setPi(pi);
        project.setTags(request.getTags());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());

        Project savedProject = projectRepository.save(project);
        return new ProjectDTO(savedProject);
    }

    public ProjectDTO updateProject(String id, ProjectRequest request, String currentUserId, UserRole currentUserRole) {
        Project project = getProjectEntityById(id);

        // Check authorization: ADMIN or project PI
        if (currentUserRole != UserRole.ADMIN && !project.getPi().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You don't have permission to update this project");
        }

        project.setTitle(request.getTitle());
        project.setSummary(request.getSummary());
        project.setStatus(request.getStatus());
        project.setTags(request.getTags());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());

        if (request.getPiId() != null && !request.getPiId().equals(project.getPi().getId())) {
            User newPi = userService.getUserEntityById(request.getPiId());
            project.setPi(newPi);
        }

        Project updatedProject = projectRepository.save(project);
        return new ProjectDTO(updatedProject);
    }

    public ProjectDTO updateProjectStatus(String id, ProjectStatus status, String currentUserId,
            UserRole currentUserRole) {
        Project project = getProjectEntityById(id);

        // Check authorization
        if (currentUserRole != UserRole.ADMIN && !project.getPi().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You don't have permission to update this project status");
        }

        project.setStatus(status);
        Project updatedProject = projectRepository.save(project);
        return new ProjectDTO(updatedProject);
    }

    public void deleteProject(String id, UserRole currentUserRole) {
        // Only ADMIN can delete projects
        if (currentUserRole != UserRole.ADMIN) {
            throw new UnauthorizedException("Only ADMIN can delete projects");
        }

        Project project = getProjectEntityById(id);
        projectRepository.delete(project);
    }

    public UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}
