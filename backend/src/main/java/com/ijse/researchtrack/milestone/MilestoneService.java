package com.ijse.researchtrack.milestone;

import com.ijse.researchtrack.common.ResourceNotFoundException;
import com.ijse.researchtrack.common.UnauthorizedException;
import com.ijse.researchtrack.common.UserRole;
import com.ijse.researchtrack.project.Project;
import com.ijse.researchtrack.project.ProjectService;
import com.ijse.researchtrack.user.User;
import com.ijse.researchtrack.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectService projectService;
    private final UserService userService;

    @Autowired
    public MilestoneService(MilestoneRepository milestoneRepository, ProjectService projectService,
            UserService userService) {
        this.milestoneRepository = milestoneRepository;
        this.projectService = projectService;
        this.userService = userService;
    }

    public List<MilestoneDTO> getMilestonesByProjectId(String projectId) {
        projectService.getProjectEntityById(projectId); // Verify project exists
        return milestoneRepository.findByProjectId(projectId).stream()
                .map(MilestoneDTO::new)
                .collect(Collectors.toList());
    }

    public List<MilestoneDTO> getAllMilestones(String currentUserId, UserRole currentUserRole) {
        if (currentUserRole == UserRole.ADMIN) {
            return milestoneRepository.findAll().stream()
                    .map(MilestoneDTO::new)
                    .collect(Collectors.toList());
        }

        // Get accessible project IDs
        List<com.ijse.researchtrack.project.ProjectDTO> projects = projectService.getProjectsForUser(currentUserId, null, currentUserRole);
        Set<String> projectIds = projects.stream()
                .map(com.ijse.researchtrack.project.ProjectDTO::getId)
                .collect(Collectors.toSet());

        return milestoneRepository.findAll().stream()
                .filter(m -> projectIds.contains(m.getProject().getId()))
                .map(MilestoneDTO::new)
                .collect(Collectors.toList());
    }

    public List<MilestoneDTO> getMilestonesByProjectId(String projectId, String currentUserId,
            UserRole currentUserRole) {
        Project project = projectService.getProjectEntityById(projectId);
        projectService.ensureProjectReadAccess(project, currentUserId, currentUserRole);

        return milestoneRepository.findByProjectId(projectId).stream()
                .map(MilestoneDTO::new)
                .collect(Collectors.toList());
    }

    public MilestoneDTO getMilestoneById(String id) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with id: " + id));
        return new MilestoneDTO(milestone);
    }

    public MilestoneDTO getMilestoneById(String id, String currentUserId, UserRole currentUserRole) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with id: " + id));

        projectService.ensureProjectReadAccess(milestone.getProject(), currentUserId, currentUserRole);
        return new MilestoneDTO(milestone);
    }

    public MilestoneDTO createMilestone(String projectId, MilestoneRequest request, String currentUserId, UserRole currentUserRole) {
        Project project = projectService.getProjectEntityById(projectId);
        
        // Ensure user has access to this project (ADMIN, PI of project, or MEMBER of project)
        projectService.ensureProjectReadAccess(project, currentUserId, currentUserRole);
        
        // VIEWER cannot create milestones
        if (currentUserRole == UserRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot create milestones");
        }

        User createdBy = userService.getUserEntityById(currentUserId);

        Milestone milestone = new Milestone();
        milestone.setId(UUID.randomUUID().toString());
        milestone.setProject(project);
        milestone.setTitle(request.getTitle());
        milestone.setDescription(request.getDescription());
        milestone.setDueDate(request.getDueDate());
        milestone.setIsCompleted(false);
        milestone.setCreatedBy(createdBy);

        Milestone savedMilestone = milestoneRepository.save(milestone);
        return new MilestoneDTO(savedMilestone);
    }

    public MilestoneDTO updateMilestone(String id, MilestoneRequest request, String currentUserId,
            UserRole currentUserRole) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with id: " + id));

        Project project = milestone.getProject();
        
        // Ensure user has access to this project
        projectService.ensureProjectReadAccess(project, currentUserId, currentUserRole);
        
        // Only ADMIN, PI of project, or MEMBER of project (excluding creator/viewer check for now as membership is enough)
        if (currentUserRole == UserRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot update milestones");
        }

        milestone.setTitle(request.getTitle());
        milestone.setDescription(request.getDescription());
        milestone.setDueDate(request.getDueDate());

        Milestone updatedMilestone = milestoneRepository.save(milestone);
        return new MilestoneDTO(updatedMilestone);
    }

    public MilestoneDTO toggleMilestoneCompletion(String id, String currentUserId, UserRole currentUserRole) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with id: " + id));

        Project project = milestone.getProject();
        
        // Ensure user has access to this project
        projectService.ensureProjectReadAccess(project, currentUserId, currentUserRole);
        
        if (currentUserRole == UserRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot toggle milestones");
        }

        milestone.setIsCompleted(!milestone.getIsCompleted());
        Milestone updatedMilestone = milestoneRepository.save(milestone);
        return new MilestoneDTO(updatedMilestone);
    }

    public void deleteMilestone(String id, String currentUserId, UserRole currentUserRole) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found with id: " + id));

        Project project = milestone.getProject();
        
        // Only ADMIN and Project PI can delete milestones
        if (currentUserRole != UserRole.ADMIN && !project.getPi().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Only ADMIN or Project PI can delete milestones");
        }

        milestoneRepository.delete(milestone);
    }
}
