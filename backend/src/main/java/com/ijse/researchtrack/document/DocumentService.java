package com.ijse.researchtrack.document;

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
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ProjectService projectService;
    private final UserService userService;

    @Autowired
    public DocumentService(DocumentRepository documentRepository, ProjectService projectService,
            UserService userService) {
        this.documentRepository = documentRepository;
        this.projectService = projectService;
        this.userService = userService;
    }

    public List<DocumentDTO> getDocumentsByProjectId(String projectId) {
        projectService.getProjectEntityById(projectId); // Verify project exists
        return documentRepository.findByProjectId(projectId).stream()
                .map(DocumentDTO::new)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> getAllDocuments(String currentUserId, UserRole currentUserRole) {
        if (currentUserRole == UserRole.ADMIN) {
            return documentRepository.findAll().stream()
                    .map(DocumentDTO::new)
                    .collect(Collectors.toList());
        }

        // Get all projects this user has access to
        List<com.ijse.researchtrack.project.ProjectDTO> projects = projectService.getProjectsForUser(currentUserId, null, currentUserRole);
        Set<String> projectIds = projects.stream()
                .map(com.ijse.researchtrack.project.ProjectDTO::getId)
                .collect(Collectors.toSet());

        return documentRepository.findAll().stream()
                .filter(doc -> projectIds.contains(doc.getProject().getId()))
                .map(DocumentDTO::new)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> getDocumentsByProjectId(String projectId, String currentUserId, UserRole currentUserRole) {
        Project project = projectService.getProjectEntityById(projectId);
        projectService.ensureProjectReadAccess(project, currentUserId, currentUserRole);

        return documentRepository.findByProjectId(projectId).stream()
                .map(DocumentDTO::new)
                .collect(Collectors.toList());
    }

    public DocumentDTO getDocumentById(String id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));
        return new DocumentDTO(document);
    }

    public DocumentDTO getDocumentById(String id, String currentUserId, UserRole currentUserRole) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        projectService.ensureProjectReadAccess(document.getProject(), currentUserId, currentUserRole);
        return new DocumentDTO(document);
    }

    public DocumentDTO createDocument(String projectId, DocumentRequest request, String currentUserId, UserRole currentUserRole) {
        Project project = projectService.getProjectEntityById(projectId);
        
        // Ensure user has access to this project
        projectService.ensureProjectReadAccess(project, currentUserId, currentUserRole);
        
        // VIEWER cannot upload documents
        if (currentUserRole == UserRole.VIEWER) {
            throw new UnauthorizedException("Viewers cannot upload documents");
        }

        User uploadedBy = userService.getUserEntityById(currentUserId);

        Document document = new Document();
        document.setId(UUID.randomUUID().toString());
        document.setProject(project);
        document.setTitle(request.getTitle());
        document.setDescription(request.getDescription());
        document.setUrlOrPath(request.getUrlOrPath());
        document.setUploadedBy(uploadedBy);

        Document savedDocument = documentRepository.save(document);
        return new DocumentDTO(savedDocument);
    }

    public void deleteDocument(String id, String currentUserId, UserRole currentUserRole) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + id));

        // Only ADMIN or Project PI can delete documents
        Project project = document.getProject();
        if (currentUserRole != UserRole.ADMIN && !project.getPi().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Only ADMIN or Project PI can delete documents");
        }

        documentRepository.delete(document);
    }
}
